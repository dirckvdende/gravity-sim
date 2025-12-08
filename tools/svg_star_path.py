
import math

POINTS = 12
R_INSIDE = 40 * 0.7
R_OUTSIDE = 50 * 0.7
CENTER = (0, 0)

path = ""
for i in range(POINTS * 2):
    angle = math.pi / POINTS * i
    bx, by = math.sin(angle) + CENTER[0], math.cos(angle) + CENTER[1]
    r = R_OUTSIDE if i % 2 == 0 else R_INSIDE
    path += ("M" if i == 0 else "L") + f" {bx * r} {by * r}"
path += " Z"
print(path)