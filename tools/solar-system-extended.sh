#!/bin/bash

cd $(dirname $0)
rm -rf out
mkdir out

python3 horizons-download.py 500@0 10 > out/sun.txt
python3 horizons-download.py 500@0 199 > out/mercury.txt
python3 horizons-download.py 500@0 299 > out/venus.txt
python3 horizons-download.py 500@0 399 > out/earth.txt
python3 horizons-download.py 500@0 499 > out/mars.txt
python3 horizons-download.py 500@0 599 > out/jupiter.txt
python3 horizons-download.py 500@0 699 > out/saturn.txt
python3 horizons-download.py 500@0 799 > out/uranus.txt
python3 horizons-download.py 500@0 899 > out/neptune.txt

# Objects sorted by mass (descending). See this list:
# https://en.wikipedia.org/wiki/List_of_Solar_System_objects_by_size
# Moons are excluded because they're too close to their planets
for i in 999 920136199 920136108 'DES=20136472;' 'DES=20225088;' 920050000 \
'DES=20000001;' 920090482 'DES=20090377;' 920120347
do
    python3 horizons-download.py 500@0 $i > out/$i.txt
done