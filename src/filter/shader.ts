import { GLTypes, SchemaTypes } from 'beam-gl'
const { vec4, vec2, tex2D, float, mat4 } = SchemaTypes

const imageVS = `
attribute vec4 position;
attribute vec2 texCoord;
uniform mat4 transMat;
uniform mat4 rotateMat;
uniform mat4 scaleMat;

varying highp vec2 vTexCoord;
void main(){
	gl_Position = scaleMat*rotateMat*position;
	vTexCoord = texCoord;
}

`
const imageFS = `
varying highp vec2 vTexCoord;

uniform sampler2D img;

void main(){
	gl_FragColor = texture2D(img,vTexCoord);
}
`
const shapeVS = `
attribute vec4 position;
attribute vec4 color;
varying highp vec4 vColor;

void main(){
	gl_Position = position;
	vColor = color;
}
`
const shapeFS = `

varying highp vec4 vColor;
void main(){
	gl_FragColor = vColor;
}
`
const lineVS =`

attribute vec4 position;
attribute vec4 color;
varying highp vec4 vColor;

void main(){
	gl_Position = position;
	vColor = color;
}
`
export const shapeShader = {
  vs: shapeVS,
  fs: shapeFS,
  buffers: {
    position: { type: vec4, n: 3 },
    color: { type: vec4, n: 3 },
  },
}

export const lineShader = {
  ...shapeShader,
	vs:lineVS,
	buffers:{
		position:{type:vec4,n:1},
		color:{type:vec4}
	},
  mode: GLTypes.Lines,
}
export const lineRectShader = {
  ...shapeShader,
  uniforms: {
    rotateMat: { type: mat4 },
  },
  //mode:GLTypes.Linear
}
export const hollowRectShader = {
  ...shapeShader,
  uniforms: {
    rotateMat: { type: mat4 },
  },
}
	//gl_Position = vec4(cos(angle*pi/180.0)*radius,sin(angle*pi/180.0)*radius,0,1.0);
const circleVS = `

#define pi 3.1415926
attribute highp float angle;
attribute vec4 color;

uniform highp float radius;

varying vec4 vColor;
void main(){
	gl_Position = vec4(cos(angle*pi/180.0)*1.0,sin(angle*pi/180.0)*1.0,0.0,1.0);
	vColor = color;
}
`
const circleFS = `
varying highp vec4 vColor;
void main(){
	gl_FragColor = vColor;
}

`
export const circleShader = {
  vs: circleVS,
  fs: circleFS,
  buffers: {
		angle: { type: float },
		//position:{type:vec4,n:3},
    color: { type: vec4 },
  },
  uniforms: {
    radius: {
      type: float,
    },
  },
	mode: GLTypes.Triangles,
}

export const basicImageShader = {
  vs: imageVS,
  fs: imageFS,
  buffers: {
    position: { type: vec4, n: 3 },
    texCoord: { type: vec2 },
  },
  textures: {
    img: { type: tex2D },
  },
  uniforms: {
    scaleMat: { type: mat4 },
    transMat: { type: mat4 },
    rotateMat: { type: mat4 },
  },
}
const defaultVS = `
attribute vec4 position;
attribute vec2 texCoord;

varying highp vec2 vTexCoord;

void main() {
  gl_Position = position;
  vTexCoord = texCoord;
}
`

const defaultFS = `
precision highp float;
uniform sampler2D img;

varying highp vec2 vTexCoord;

void main() {
  vec4 texColor = texture2D(img, vTexCoord);
  gl_FragColor = texColor;
}
`

export const BasicImage = {
  vs: defaultVS,
  fs: defaultFS,
  buffers: {
    position: { type: vec4, n: 3 },
    texCoord: { type: vec2 },
  },
  textures: {
    img: { type: tex2D },
  },
}

const saturationVS = `
	attribute vec4 position;
	attrivute vec4 texCoord;
	varying vec4 vTexCoord;
	void main(){
		gl_Position = position;
		vTexCoord = texCoord;
	}
`
const saturationFS = `
  precision highp float
	
	varying vec4 vTexCoord;

	uniform sampler2D img;
	uniform float scale
	void main(){
		vec4 color = texture2D(img, vTexCoord);
		float average = (color.r + color.g + color.b) / 3.0;
		if (saturation > 0.0) {
			color.rgb += (average - color.rgb) * (1.0 - 1.0 / (1.001 - saturation));
		} else {
			color.rgb += (average - color.rgb) * (-saturation);
		}
		gl_FragColor = color;
	}
`
export const saturationShader = {
  vs: saturationVS,
  fs: saturationFS,
  buffers: {
    position: { type: vec4 },
    texCoord: { type: vec4 },
  },
  uniforms: {
    scale: { type: float },
  },
  textures: {
    img: { type: tex2D },
  },
}

const brighnessContrastFS = `
precision highp float;
uniform sampler2D img;
uniform float brightness;
uniform float contrast;

varying highp vec2 vTexCoord;

void main() {
  vec4 color = texture2D(img, vTexCoord);
  color.rgb += brightness;
  if (contrast > 0.0) {
    color.rgb = (color.rgb - 0.5) / (1.0 - contrast) + 0.5;
  } else {
    color.rgb = (color.rgb - 0.5) * (1.0 + contrast) + 0.5;
  }
  gl_FragColor = color;
}
`

export const BrightnessContrast = {
  ...BasicImage,
  fs: brighnessContrastFS,
  uniforms: {
    brightness: { type: float, default: 0 },
    contrast: { type: float, default: 0 },
  },
}

export const hueSaturationFS = `
precision highp float;
uniform sampler2D img;
uniform float hue;
uniform float saturation;

varying vec2 vTexCoord;

void main() {
  vec4 color = texture2D(img, vTexCoord);

  /* hue adjustment, wolfram alpha: RotationTransform[angle, {1, 1, 1}][{x, y, z}] */
  float angle = hue * 3.14159265;
  float s = sin(angle), c = cos(angle);
  vec3 weights = (vec3(2.0 * c, -sqrt(3.0) * s - c, sqrt(3.0) * s - c) + 1.0) / 3.0;
  float len = length(color.rgb);
  color.rgb = vec3(
    dot(color.rgb, weights.xyz),
    dot(color.rgb, weights.zxy),
    dot(color.rgb, weights.yzx)
  );

  /* saturation adjustment */
  float average = (color.r + color.g + color.b) / 3.0;
  if (saturation > 0.0) {
    color.rgb += (average - color.rgb) * (1.0 - 1.0 / (1.001 - saturation));
  } else {
    color.rgb += (average - color.rgb) * (-saturation);
  }
  gl_FragColor = color;
}
`

export const HueSaturation = {
  ...BasicImage,
  fs: hueSaturationFS,
  uniforms: {
    hue: { type: float, default: 0 },
    saturation: { type: float, default: 0 },
  },
}

const vignetteFS = `
precision highp float;
uniform sampler2D img;
uniform float vignette;

varying vec2 vTexCoord;

void main() {
  float innerVig = 1.0 - vignette;
  float outerVig = 1.0001; // Position for the outer vignette
  // float innerVig = 0.4; // Position for the inner vignette ring

  vec3 color = texture2D(img, vTexCoord).rgb;
  vec2 center = vec2(0.5, 0.5); // center of screen
  // Distance between center and the current uv. Multiplyed by 1.414213 to fit in the range of 0.0 to 1.0.
  float dist = distance(center, vTexCoord) * 1.414213;
  // Generate the vignette with clamp which go from outer ring to inner ring with smooth steps.
  float vig = clamp((outerVig - dist) / (outerVig - innerVig), 0.0, 1.0);
  color *= vig; // Multiply the vignette with the texture color
  gl_FragColor = vec4(color, 1.0);
}
`

export const Vignette = {
  ...BasicImage,
  fs: vignetteFS,
  uniforms: {
    vignette: { type: float, default: 0 },
  },
}
