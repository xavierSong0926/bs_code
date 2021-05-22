
cd /var/www/html/wdaws/ham12/utility/ndjs/weindjs_restapi/
pm2 list
pm2 delete 0
pm2 start a.node.js --watch 
pm2 log


#check ubutu version.
lsb_release -a
##########################
#pm2 start app.js --watch 
#automatically restart your application when a file is modified

