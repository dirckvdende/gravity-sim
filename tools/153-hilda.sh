#!/bin/bash

cd $(dirname $0)
rm -rf out
mkdir out

python3 horizons-download.py 500@0 10 > out/sun.txt
python3 horizons-download.py 500@0 599 > out/jupiter.txt
python3 horizons-download.py 500@0 'DES=20000153;' > out/153-hilda.txt