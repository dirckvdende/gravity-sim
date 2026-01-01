precision mediump float;
uniform vec2 canvas_size;

void main() {
    vec4 coord = gl_FragCoord;
    gl_FragColor = vec4(coord.xy / canvas_size, 0, 1);
}