#!/bin/bash

cd $(dirname $0)
rm -rf out
mkdir out

python3 horizons-download.py 500@5 599 > out/jupiter.txt
for i in $(seq 501 516)
do
    python3 horizons-download.py 500@5 $i > out/$i.txt
done