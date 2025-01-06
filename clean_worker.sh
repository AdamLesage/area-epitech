#bin/bash
sudo docker rm -f $(sudo docker ps -a | grep areaWorker)
sudo docker rmi $(sudo docker images --filter "reference=*areaWorker*" -q) --force