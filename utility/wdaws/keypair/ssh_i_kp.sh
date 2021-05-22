#!/bin/bash






SvrIP="34.227.20.213"

#ssh -i /path/my-key-pair.pem my-instance-user-name@my-instance-public-dns-name
WDKEY="wdkeypair"
ssh -i ${WDKEY}.tem ubuntu@${SvrIP}






