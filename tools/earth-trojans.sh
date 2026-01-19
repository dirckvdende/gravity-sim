#!/bin/bash

cd $(dirname $0)
rm -rf out
mkdir out

python3 horizons-download.py 500@0 10 > out/sun.txt
python3 horizons-download.py 500@0 399 > out/earth.txt
python3 horizons-download.py 500@0 'DES=20706765;' > out/2010-tk7.txt
python3 horizons-download.py 500@0 'DES=20614689;' > out/2020-xl5.txt