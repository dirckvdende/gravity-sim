#!/bin/bash

cd $(dirname $0)
rm -rf out
mkdir out

python3 horizons-download.py 500@7 799 > out/uranus.txt
for i in $(seq 701 717)
do
    python3 horizons-download.py 500@7 $i > out/$i.txt
done