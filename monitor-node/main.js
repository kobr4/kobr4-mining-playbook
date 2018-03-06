

var net = require('net');
var request = require('request');

var list = ['192.168.0.11','192.168.0.14','192.168.0.17','192.168.0.19'];
var destination_url = "http://www.nicolasmy.com/messages/message.php"

var promise = require('promise');

function fetch(ip) {
    return new Promise(function (resolve, reject) {
        var client = new net.Socket();
        client.setTimeout(1000);

        client.setEncoding('ascii');
        client.connect(3333, ip, function() {
            console.log('Connected');
            client.write('{"id": 0,"jsonrpc":"2.0","method":"miner_getstat1"}');
        });


        client.on('data', function(data) {
            console.log('Received: ' + data);
            var result = [];
            result['ip'] = ip;
            result['result'] = JSON.parse(data)['result'][3];
            resolve(result);
            client.destroy(); // kill client after server's response
        });

        client.on('error', function(error) {
            console.log('Error: ' + error);
            var result = [];
            result['ip'] = ip;
            result['result'] = "error";
            resolve(result);
        });
    });
}

function post_message(message_json) {
    request.post(
        destination_url,
        { form: { json: JSON.stringify(message_json) } },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log('Data successfully sent to server')
            } else {
                console.log('An error occured during data transmission')
            }
        }
    );
}


console.log('Starting fetch');
var results = list.map(fetch);

Promise.all(results).then(function (data) {
    
    var message = data.map(function (result) {
        console.log(result);
        return { 'last': new Date().toISOString(), 'ip': result['ip'], 'result': result['result'] };
    })
    
    console.log('--------');
    console.log(JSON.stringify(message) );
    post_message(message);
});