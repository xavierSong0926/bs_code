#!/bin/bash




pm2 startup
#
#  [PM2] Init System found: systemd
#  [PM2] To setup the Startup Script, copy/paste the following command:
#  sudo env PATH=$PATH:/usr/bin /usr/local/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu


sudo env PATH=$PATH:/usr/bin /usr/local/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu

pm2 startup upstart

pm2 start ../../ndjs/weindjs_restapi/a.node.js

pm2 save


pm2 list