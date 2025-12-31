precision mediump float;
attribute vec2 position;
uniform mat3 transform;

void main() {
    gl_Position = vec4((transform * vec3(position, 1)).xy, 0, 1);
}