
precision mediump float;

// Color is passed from the vertex shader
varying vec4 frag_color;

void main() {
    gl_FragColor = frag_color;
}