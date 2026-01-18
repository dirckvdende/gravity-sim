#!/bin/bash

cd $(dirname $0)
mkdir out

python3 horizons-download.py 500@8 899 > out/neptune.txt
for i in $(seq 801 808)
do
    python3 horizons-download.py 500@8 $i > out/$i.txt
done