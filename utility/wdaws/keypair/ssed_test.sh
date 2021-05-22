#!/bin/bash









SvrIP="152.87.154.78"
WDKEY="wdkeypair"
TARGF="ssed_test.txt" 



#sed -i "s/\(html\)/HTML/g"   ${TARGF}

sed 's|'1.1.1.1'|'"$SvrIP"'|g'  ${TARGF} > ${TARGF}.out

cat ${TARGF}.out
echo "-------"
sed -E 's|'[0-9]+.[0-9]+.[0-9]+.[0-9]+'|'"$SvrIP"'|g'  ${TARGF} > ../../../index.htm

ls ../../../