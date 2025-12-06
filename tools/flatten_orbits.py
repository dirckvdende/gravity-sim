
from __future__ import annotations
import os
from dataclasses import dataclass
import numpy as np

SCALE = 1000

def string_to_objects(text: str) -> list[GravityObject]:
    # Filter out comments
    text = "\n".join(line.split("#")[0] for line in text.split("\n"))
    objects: list[GravityObject] = []
    for obj in text.split("&"):
        d = [e.split() for e in obj.split("=")]
        for x, y in zip(d, d[1:]):
            y.insert(0, x[-1])
            x.pop()
        d.pop(0)
        a = {k: float(v) for k, v, *_ in d}
        objects.append(GravityObject(
            Vector(a["X"], a["Y"], a["Z"]) * SCALE,
            Vector(a["VX"], a["VY"], a["VZ"]) * SCALE,
            a["MASS"],
        ))
    return objects

def print_objects(objects: list[GravityObject]):
    for i, obj in enumerate(objects):
        print("{")
        print(f"    id: {i},")
        print(f"    mass: {obj.mass},")
        print(f"    position: new Vector2({obj.position.x}, {obj.position.y}),")
        print(f"    velocity: new Vector2({obj.velocity.x}, {obj.velocity.y}),")
        print("}")

@dataclass
class GravityObject:
    position: Vector
    velocity: Vector
    mass: float

class Vector:

    def __init__(self, x: float, y: float, z: float):
        self.x = x
        self.y = y
        self.z = z

    def __repr__(self) -> str:
        return f"{self.__class__.__name__}({self.x!r}, {self.y!r}, {self.z!r})"

    def __add__(self, other: Vector) -> Vector:
        return Vector(self.x + other.x, self.y + other.y, self.z + other.z)
    
    def __neg__(self) -> Vector:
        return Vector(-self.x, -self.y, -self.z)
    
    def __sub__(self, other: Vector) -> Vector:
        return self.__add__(other.__neg__())
    
    def __mul__(self, scale: float) -> Vector:
        return Vector(scale * self.x, scale * self.y, scale * self.z)
    
    def __rmul__(self, scale: float) -> Vector:
        return self.__mul__(scale)
    
    def __div__(self, scale: float) -> Vector:
        return self.__mul__(1 / scale)

    def __abs__(self) -> float:
        return self.length
    
    def dot(self, other: Vector) -> float:
        return self.x * other.x + self.y * other.y + self.z * other.z

    @property
    def length(self) -> float:
        return (self.x ** 2 + self.y ** 2 + self.z ** 2) ** .5
    
    def normalize(self) -> Vector:
        if self.length == 0:
            return self
        return self.__mul__(1 / self.length)
    
    def project(self, target: Vector) -> Vector:
        return target.__mul__(self.dot(target) / target.dot(target))
    
    @classmethod
    def orthonormal_basis(cls, *vectors: Vector) -> list[Vector]:
        # Gram-Schmidt
        out: list[Vector] = []
        for v in vectors:
            cur = v
            for u in out:
                cur -= v.project(u)
            out.append(cur)
        # Normalize vectors
        return [u.normalize() for u in out]
    
    def to_list(self) -> list[float]:
        return [self.x, self.y, self.z]
    
# Data copied from https://ssd.jpl.nasa.gov/horizons/app.html#/ by selecting
# "Vector table" with added mass (also present in table, closer to the top)
# Anything after a "#" on a single line is ignored. Separate objects with "&"
# Plane mapping happens based on position and velocity of first object
data = open(
    os.path.join(os.path.dirname(__file__), "data", "solar_system.txt")
).read()

objects = string_to_objects(data)
plane_vectors = objects[0].position, objects[1].velocity

P = np.linalg.matrix_transpose(
    [v.to_list() for v in Vector.orthonormal_basis(
        *plane_vectors,
        Vector(0, 0, 1),
    )]
)
Pinv = np.linalg.inv(P)

for obj in objects:
    obj.position = Vector(*np.linalg.matmul(Pinv, obj.position.to_list()))
    obj.velocity = Vector(*np.linalg.matmul(Pinv, obj.velocity.to_list()))

print_objects(objects)