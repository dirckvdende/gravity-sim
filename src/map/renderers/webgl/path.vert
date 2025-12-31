
precision mediump float;

attribute vec3 prev_position;
attribute vec3 cur_position;
attribute vec3 next_position;
uniform mat3 transform;
uniform vec2 canvas_size;
uniform float width;

void main() {
    gl_Position = vec4(prev_position + next_position, 1);
    vec2 extra = cur_position.z < 0.5
        ? vec2(0, width) * 2.0 / canvas_size
        : vec2(0, 0);
    gl_Position = vec4((transform * vec3(cur_position.xy, 1)).xy + extra, 0, 1);
}