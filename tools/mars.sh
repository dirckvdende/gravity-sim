#!/bin/bash

cd $(dirname $0)
rm -rf out
mkdir out

python3 horizons-download.py 500@4 499 > out/mars.txt
for i in 401 402
do
    python3 horizons-download.py 500@4 $i > out/$i.txt
done