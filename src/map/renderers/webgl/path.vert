
precision mediump float;

attribute vec3 prev_position;
attribute vec3 cur_position;
attribute vec3 next_position;
uniform mat3 transform;
uniform vec2 canvas_size;
uniform float width;

attribute float index;
uniform float index_start;
uniform float index_size;
uniform float index_max_size;

uniform vec4 color;
varying vec4 frag_color;

#define PI 3.1415926538
#define FADE_RANGE 0.2

float angle_between(vec2 a, vec2 b) {
    return acos(dot(a, b) / length(a) / length(b)) ;
}

vec2 normal_vector(vec2 a, vec2 b) {
    if (angle_between(a, b) > PI - 0.01)
        return normalize(vec2(-a.y, a.x));
    return normalize(normalize(a) + normalize(b));
}

vec2 clip_coords(vec2 coords) {
    return (transform * vec3(coords, 1)).xy;
}

vec2 canvas_to_clip(vec2 canvas_coords) {
    return canvas_coords / canvas_size * 2.0 - vec2(1, 1);
}

vec2 clip_to_canvas(vec2 clip_coords) {
    return (clip_coords + vec2(1, 1)) * canvas_size / 2.0;
}

float relative_index() {
    float extra = index_max_size - index_size;
    if (index > index_start)
        return (index - index_start + extra) / (index_max_size + 1.0);
    return (index_max_size - index_start + index + extra) /
        (index_max_size + 1.0);
}

float opacity() {
    float index = relative_index();
    if (index > FADE_RANGE)
        return 1.0;
    return index / FADE_RANGE;
}

void main() {
    vec2 prev = clip_to_canvas(clip_coords(prev_position.xy));
    vec2 cur = clip_to_canvas(clip_coords(cur_position.xy));
    vec2 next = clip_to_canvas(clip_coords(next_position.xy));

    // Vectors to previous and next points
    vec2 back = vec2(0, 0);
    vec2 forward = vec2(0, 0);
    if (prev_position.z != -1.0)
        back = prev - cur;
    if (next_position.z != -1.0)
        forward = next - cur;

    // Fix zero-length back/forward
    if (length(back) == 0.0 && length(forward) == 0.0) {
        back = vec2(0, -1);
        forward = vec2(0, 1);
    } else if (length(back) == 0.0) {
        back = -forward;
    } else if (length(forward) == 0.0) {
        forward = -back;
    }

    float angle = angle_between(back, forward);
    // Normal vector points to the inside of the corner
    vec2 normal = normal_vector(back, forward);

    vec2 extra = cur_position.z < 0.5
        ? normal * width / 2.0
        : -normal * width / 2.0;

    gl_Position = vec4(canvas_to_clip(cur + extra), 0, 1);
    frag_color = color * opacity();
}