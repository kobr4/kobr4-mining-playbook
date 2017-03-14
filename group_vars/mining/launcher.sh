#!/bin/bash
# /usr/local/bin/deluge.sh
#
 
function d_start()
{
	echo "Claymore : starting service"
	/home/kobr4/claymore/ethdcrminer64 -epool eth-eu1.nanopool.org:9999 -ewal 0x615dd04F4F9e6789fb4FdB2A1123935A5421ef0B  & 
#        /home/kobr4/claymore/ethdcrminer64 -epool pool.alpereum.ch:3001 -ewal 0x615dd04F4F9e6789fb4FdB2A1123935A5421ef0B.MINING1 &
        export APP_PID=$!
	echo $APP_PID > /tmp/claymore.pid
        sleep 5
	echo "PID is $(cat /tmp/claymore.pid)"
}
 
function d_stop()
{
	echo "Claymore : stopping service (PID=$(cat /tmp/claymore.pid))"
	kill $(cat /tmp/claymore.pid)
	rm /tmp/claymore.pid
}
 
function d_status()
{
	ps -ef | grep ethdrcminer64 | grep -v grep
	echo "PID file indicate $(cat /tmp/claymore.pid 2>/dev/null)"
}
 
# Some things that run always
touch /var/lock/claymore
 
# Gestion des instructions du service
case "$1" in
	start)
		d_start
		;;
	stop)
		d_stop
		;;
	reload)
		d_stop
		sleep 1
		d_start
		;;
	status)
		d_status
		;;
	*)
	echo "Usage: $0 {start|stop|reload|status}"
	exit 1
	;;
esac
 
exit 0
