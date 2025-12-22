
import math
import numpy as np

type Vector = tuple[float, float, float]

plane_vectors = [
    (-157.8121679944, -456.7988459683, -2071.4067337364),
    (-0.0177032091, -0.0158015359, 0.0048362971),
]

# Position + velocity of bodies
# Source: https://arxiv.org/pdf/2502.17580
vectors = [
    # Pluto
    (-157.8121679944, -456.7988459683, -2071.4067337364),
    (-0.0177032091, -0.0158015359, 0.0048362971),
    # Charon
    (1297.1743847853, 3752.6022617472, 17011.9058384535),
    (0.1453959509, 0.1297771902, -0.0397230040),
    # Styx
    (-30572.8427772584, -26535.8134344897, 12311.2908958766),
    (0.0232883189, 0.0427977975, 0.1464990284),
    # Nix
    (9024.3487802378, 15210.7370165008, 45591.7573572213),
    (0.1004334400, 0.0865524814, -0.0479498746),
    # Kerberos
    (23564.2070250521, 28380.0399507624, 44578.0258218278),
    (0.0792537026, 0.0630220100, -0.0817084451),
    # Hydra
    (-43331.3261132443, -43628.4575945387, -20506.5419357332),
    (-0.0374001038, -0.0184905611, 0.1157937283),
]
# Convert km to m
vectors: list[Vector] = [tuple(x * 1000 for x in v) for v in vectors]

def length(vector: Vector) -> float:
    return math.sqrt(sum(x ** 2 for x in vector))

def normalize(vector: Vector) -> Vector:
    return scale(vector, 1 / length(vector))

def dot(u: Vector, v: Vector) -> float:
    return sum(uu * vv for uu, vv in zip(u, v))

def scale(vector: Vector, factor: float) -> Vector:
    return tuple(map(lambda x: x * factor, vector))

def proj(u: Vector, v: Vector) -> Vector:
    return scale(u, dot(v, u) / dot(u, u))

def subtract(u: Vector, v: Vector) -> Vector:
    return tuple(uu - vv for uu, vv in zip(u, v))

def orthonormal_basis(vectors: list[Vector]) -> list[Vector]:
    # Gram-Schmidt
    out: list[Vector] = []
    for v in vectors:
        cur = v
        for u in out:
            cur = subtract(cur, proj(u, v))
        out.append(cur)
    # Normalize vectors
    return [normalize(u) for u in out]

P = np.linalg.matrix_transpose(orthonormal_basis([*plane_vectors, (0, 0, 1)]))
Pinv = np.linalg.inv(P)

for v in vectors:
    print(np.linalg.matmul(Pinv, v))