



#ssh -i /path/my-key-pair.pem my-instance-user-name@my-instance-public-dns-name



#dig +short myip.opendns.com @resolver1.opendns.com 


sudo apt-get update
sudo apt-get install git
sudo apt-get install npm
sudo apt-get install nodejs
sudo apt-get install apache2
sudo npm install pm2 -g

##############################
# on AWS only.
sudo ufw app list
#  Output
#  Available applications:
#    Apache
#    Apache Full
#    Apache Secure
#    OpenSSH
sudo ufw status
sudo ufw allow 'Apache'
sudo systemctl status apache2
##  ● apache2.service - The Apache HTTP Server
##       Loaded: loaded (/lib/systemd/system/apache2.service; enabled; vendor preset: enabled)
##       Active: active (running) since Thu 2020-12-03 19:13:22 UTC; 3min 46s ago
##         Docs: https://httpd.apache.org/docs/2.4/
##     Main PID: 1671 (apache2)
##        Tasks: 55 (limit: 1164)
##       Memory: 5.2M
##       CGroup: /system.slice/apache2.service
##               ├─1671 /usr/sbin/apache2 -k start
##               ├─1673 /usr/sbin/apache2 -k start
##               └─1674 /usr/sbin/apache2 -k start
##  
##  Dec 03 19:13:22 ip-172-31-59-85 systemd[1]: Starting The Apache HTTP Server...
##  Dec 03 19:13:22 ip-172-31-59-85 systemd[1]: Started The Apache HTTP Server.



cd /var/www/html
mkdir -p wdaws
cd wdaws
git clone https://github.com/wdingbox/ham12.git
git clone https://github.com/wdingbox/bible_concordance.git
git clone https://github.com/wdingbox/bible_obj_lib.git
#git clone https://github.com/wdingbox/bible_obj_usr.git
#git clone https://github.com/wdingbox/hebrew_ciu.git

cd /var/www/html
cp ./wdaws/ham12/utility/wdaws/*.htm ./index.htm

cd ./ham12/utility/ndjs/weindjs_restapi/
pm2 start a.node.js --watch 



