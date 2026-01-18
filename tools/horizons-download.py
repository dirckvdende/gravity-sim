
import sys
import urllib
import urllib3

BASE_URL = "https://ssd.jpl.nasa.gov/api/horizons.api"

if len(sys.argv) != 3:
    print("Usage:", sys.argv[0], "<coordinate center> <body id>")
    print()
    print("Example:", sys.argv[0], "500@5 502")
    print("         This downloads the data of Jupiter's moon Europa (502)")
    print("         relative to Jupiter's barycenter (500@5)")
    exit(1)

options = {
    "MAKE_EPHEM": "YES",
    "COMMAND": sys.argv[2],
    "EPHEM_TYPE": "VECTORS",
    "CENTER": sys.argv[1],
    "START_TIME": "2026-01-18",
    "STOP_TIME": "2026-02-17",
    "STEP_SIZE": "1 DAYS",
    "VEC_TABLE": "3",
    "REF_SYSTEM": "ICRF",
    "REF_PLANE": "ECLIPTIC",
    "VEC_CORR": "NONE",
    "CAL_TYPE": "M",
    "OUT_UNITS": "KM-S",
    "VEC_LABELS": "YES",
    "VEC_DELTA_T": "NO",
    "CSV_FORMAT": "NO",
    "OBJ_DATA": "YES",
}

for key in options:
    options[key] = urllib.parse.quote(options[key], safe="")
url = BASE_URL + "?format=text&" + "&".join(f"{key}='{value}'" for key, value in
    options.items())

response: urllib3.response.HTTPResponse = urllib3.request("GET", url)
print(response.data.decode("utf-8"))
