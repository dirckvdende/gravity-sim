
precision highp float;

// Previous point in the path
attribute vec4 prev_position;
// Current point in the path
attribute vec4 cur_position;
// Next point in the path
attribute vec4 next_position;

// Inverse focal length in world coordinates
uniform float inverse_focal_length;
// World coordinates of the center of the screen
uniform vec2 canvas_center;
// Global-to-clip coord transform
uniform mat3 transform;
// Output canvas size in pixels
uniform vec2 canvas_size;
// Width of the path to draw, in pixels
uniform float width;

// Index of the point along the path
attribute float index;
// Index of the start of the path
uniform float index_start;
// Number of points in the path
uniform float index_size;
// Maximum number of points in the path
uniform float index_max_size;

// Color of the path
uniform vec4 color;
// Output frag color, which is a faded version of the path color
varying vec4 frag_color;

#define PI 3.1415926538
// Proportion of maximum path length from which fading start. When this value is
// 0.2, this means the last 20% of the path will fade from the path color to
// transparent, when the path has its maximum length
#define FADE_RANGE 0.2

/**
 * Angle between two vectors
 * @param a The first vector
 * @param b The second vector
 * @returns The angle between the vectors in radians
 */
float angle_between(vec2 a, vec2 b) {
    return acos(dot(a, b) / length(a) / length(b)) ;
}
/**
 * Unit vector in between the angle of two other vectors, i.e. if the angle
 * between the two vectors in theta, the output vector will have an angle of
 * theta/2 with both of the input vectors
 * @param a First vector
 * @param b Second vector
 * @returns The normal vector
 */
vec2 normal_vector(vec2 a, vec2 b) {
    if (angle_between(a, b) > PI - 0.01)
        return normalize(vec2(-a.y, a.x));
    return normalize(normalize(a) + normalize(b));
}

/**
 * Convert 3D coords to clip coords. This happens in two steps:
 *   1) Convert 3D to 2D
 *   2) Apply transformation matrix to coordinates
 * @param coords The coordinates to convert
 * @returns The transformed coordinates in x and y, and the output z coord
 * (which will allow hiding vertices that are behind the camera)
 */
vec3 clip_coords(vec3 coords) {
    float scale = 1.0 + inverse_focal_length * -coords.z;
    // if (scale <= 0.0)
    //     return vec3(0, 0, -2);
    vec2 depth_coords = (coords.xy - canvas_center) / scale + canvas_center;
    return vec3((transform * vec3(depth_coords, 1)).xy, 0);
}

/**
 * Convert canvas coordinates to clip coordinates (i.e. between -1 and 1)
 * @param canvas_coords The coordinates to convert
 * @returns The converted coordinates
 */
vec2 canvas_to_clip(vec2 canvas_coords) {
    return canvas_coords / canvas_size * 2.0 - vec2(1, 1);
}

/**
 * Convert clip coordinates (i.e. between -1 and 1) to canvas coordinates 
 * @param canvas_coords The coordinates to convert
 * @returns The converted coordinates
 */
vec2 clip_to_canvas(vec2 clip_coords) {
    return (clip_coords + vec2(1, 1)) * canvas_size / 2.0;
}

/**
 * Get an approximation of how far from the end of the path this point is,
 * relative to maximum path length, and adding extra when path hasn't reached
 * maximum size yet
 * @returns The relative index between 0 and 1
 */
float relative_index() {
    float extra = index_max_size - index_size;
    if (index > index_start)
        return (index - index_start + extra) / (index_max_size + 1.0);
    return (index_max_size - index_start + index + extra) /
        (index_max_size + 1.0);
}

/**
 * Get the opacity to give the current point
 * @returns The opacity
 */
float opacity() {
    float index = relative_index();
    if (index > FADE_RANGE)
        return 1.0;
    return index / FADE_RANGE;
}

void main() {
    vec2 prev = clip_to_canvas(clip_coords(prev_position.xyz).xy);
    vec3 cur_clip = clip_coords(cur_position.xyz);
    vec2 next = clip_to_canvas(clip_coords(next_position.xyz).xy);

    if (cur_clip.z < -1.0) {
        gl_Position = vec4(0.0, 0.0, -2.0, 1.0);
        return;
    }

    vec2 cur = clip_to_canvas(cur_clip.xy);

    // Vectors to previous and next points
    vec2 back = vec2(0, 0);
    vec2 forward = vec2(0, 0);
    if (prev_position.w != -1.0)
        back = prev - cur;
    if (next_position.w != -1.0)
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

    vec2 extra = cur_position.w < 0.5
        ? normal * width / 2.0
        : -normal * width / 2.0;

    gl_Position = vec4(canvas_to_clip(cur + extra), 0, 1);
    frag_color = color * opacity();
}