import { GLTypes, SchemaTypes } from 'beam-gl'
const { vec4, vec3, vec2, tex2D, float, mat4 } = SchemaTypes

const imageVS = `
precision highp float;
attribute vec4 position;
attribute vec2 texCoord;
uniform mat4 transMat;
uniform mat4 rotateMat;
uniform mat4 scaleMat;
uniform mat4 projectionMat;
uniform float layer;
uniform vec2 offset;

varying highp vec2 vTexCoord;
void main(){
	//vec4 nPosition = vec4(position.x+offset.x,position.y+offset.y,0.0,1.0);
	gl_Position = projectionMat*transMat*rotateMat*scaleMat*position;
	gl_Position.z = layer;
	vTexCoord = texCoord;
}

`
const imageFS = `
precision highp float;
varying highp vec2 vTexCoord;
uniform vec3 zoomSection;

uniform sampler2D img;
void main(){
	vec2 uv = vTexCoord/zoomSection.z;
	uv.x+=zoomSection.x;
	uv.y+=zoomSection.y;
	gl_FragColor = texture2D(img,uv);
}
`

export const basicImageShader = {
  vs: imageVS,
  fs: imageFS,
  buffers: {
    position: { type: vec4, n: 2 },
    texCoord: { type: vec2 },
  },
  textures: {
    img: { type: tex2D },
  },
  uniforms: {
    transMat: { type: mat4 },
    scaleMat: { type: mat4 },
    rotateMat: { type: mat4 },
    projectionMat: { type: mat4 },
    layer: { type: float },
    zoomSection: { type: vec3 },
    offset: { type: vec2 },
  },
}

const shapeVS = `
precision highp float;
attribute vec4 position;
attribute vec4 color;

varying highp vec4 vColor;

uniform mat4 transMat;
uniform mat4 rotateMat;
uniform mat4 scaleMat;
uniform mat4 projectionMat;
uniform float layer;

void main(){
	gl_Position = projectionMat*transMat*rotateMat*scaleMat*position;
	gl_Position.z = layer;
	vColor = color;
}
`
const shapeFS = `

varying highp vec4 vColor;
uniform highp vec4 uColor;
void main(){
	if(uColor.r==1.0 && uColor.g ==1.0 && uColor.g==1.0){
		gl_FragColor = vColor;
	}else{
		gl_FragColor = vec4(uColor.r,uColor.g,uColor.b,1.0);
	}

}
`
export const shapeShader = {
  vs: shapeVS,
  fs: shapeFS,
  buffers: {
    position: { type: vec4, n: 2 },
    color: { type: vec4, n: 3 },
  },
}

export const lineRectShader = {
  ...shapeShader,
  uniforms: {
    transMat: { type: mat4 },
    rotateMat: { type: mat4 },
    scaleMat: { type: mat4 },
    projectionMat: { type: mat4 },
    uColor: { type: vec4, n: 3 },
    layer: { type: float },
  },
}
export const hollowRectShader = {
  ...shapeShader,
  uniforms: {
    transMat: { type: mat4 },
    rotateMat: { type: mat4 },
    scaleMat: { type: mat4 },
    projectionMat: { type: mat4 },
    uColor: { type: vec4 },
    layer: { type: float },
  },
}
export const theWShader = {
  ...shapeShader,
  buffers: {
    position: { type: vec4, n: 2 },
    color: { type: vec4, n: 3 },
  },
  uniforms: {
    rotateMat: { type: mat4 },
    scaleMat: { type: mat4 },
    projectionMat: { type: mat4 },
    uColor: { type: vec4, n: 3 },
  },
  mode: GLTypes.Lines,
}

const lineVS = `

attribute vec4 position;
attribute vec4 color;
varying highp vec4 vColor;
uniform mat4 projectionMat;

void main(){
	gl_Position = projectionMat*position;
	vColor = color;
}
`
const lineFS = `
varying highp vec4 vColor;
void main(){
	gl_FragColor = vColor;
}
`

export const lineShader = {
  vs: lineVS,
  fs: lineFS,
  buffers: {
    position: { type: vec3 },
    color: { type: vec3 },
  },
  uniforms: {
    projectionMat: { type: mat4 },
  },
  mode: GLTypes.Lines,
}
const circleVS = `
#define pi 3.1415926
attribute highp vec4 position;
attribute highp vec4 color;

uniform highp float radius;
uniform highp float centerX;
uniform highp float centerY;
uniform highp float projectionX;
uniform highp float projectionY;
uniform highp float scale;

varying vec4 vColor;
void main(){

		//float glRad = radius*projectionX*scale;
		float x = cos(position.x*3.1415926/180.0)*radius*projectionX*scale;
		float y = sin(position.x*3.1415926/180.0)*radius*projectionY*scale;
		gl_Position = vec4(x+centerX*projectionX,y+centerY*projectionY,0.0,1.0);
		vColor = color;
}
`

const circleFS = `
varying highp vec4 vColor;
uniform highp vec4 uColor;
void main(){
	if(uColor.r==1.0 && uColor.g ==1.0 && uColor.g==1.0){
		gl_FragColor = vColor;
	}else{
		gl_FragColor = vec4(uColor.r,uColor.g,uColor.b,1.0);
	}
}
`

export const circleShader = {
  vs: circleVS,
  fs: circleFS,
  buffers: {
    position: { type: float },
    color: { type: vec4, n: 3 },
  },
  uniforms: {
    radius: { type: float },
    scale: { type: float },
    centerX: { type: float },
    centerY: { type: float },
    projectionX: { type: float },
    projectionY: { type: float },
    uColor: { type: vec4, n: 3 },
  },
  mode: GLTypes.Lines,
}
const backgroundVS = `
	attribute vec4 position;
	attribute vec2 texCoord;
	varying vec2 vTexCoord;
	void main(){
		gl_Position = position;
		gl_Position.z = 0.8;
		vTexCoord = texCoord;
	}
`
const backPureFS = `
	precision highp float;
	varying vec2 vTexCoord;
	uniform vec4 uColor;
	void main(){
		gl_FragColor.rgba = uColor;
	}
`
const backCellFS = `
	precision highp float;
	varying vec2 vTexCoord;
	uniform float rows;
	uniform vec4 uColor;
	void main(){
		vec2 st = fract(vTexCoord*rows);
		float d1 = step(st.x,0.9);
		float d2 = step(0.1,st.y);

		gl_FragColor.rgb = mix(vec3(uColor.r,uColor.g,uColor.b),vec3(1.0),d1*d2);
		gl_FragColor.a = uColor.a;
	}
`

const backImageFS = `
precision highp float;
varying highp vec2 vTexCoord;

uniform sampler2D img;
void main(){
	gl_FragColor = texture2D(img,vTexCoord);
}
`
export const backPureShader = {
  vs: backgroundVS,
  fs: backPureFS,
  buffers: {
    position: { type: vec4, n: 2 },
		texCoord: { type: vec2 },
  },
  uniforms: {
    uColor: { type: vec4 },
  },
}
export const backCellShader = {
  vs: backgroundVS,
  fs: backCellFS,
  buffers: {
    position: { type: vec4, n: 2 },
    texCoord: { type: vec2 },
  },
  uniforms: {
    rows: { type: float },
    uColor: { type: vec4 },
  },
}
export const backImageShader = {
  vs: backgroundVS,
  fs: backImageFS,
  buffers: {
    position: { type: vec4, n: 2 },
    texCoord: { type: vec2 },
  },
  textures: {
    img: { type: tex2D },
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

uniform vec3 zoomSection;
varying highp vec2 vTexCoord;

void main() {
	vec2 uv = vTexCoord/zoomSection.z;
	uv.x+=zoomSection.x;
	uv.y+=zoomSection.y;
  vec4 color = texture2D(img, uv);
  color.rgb += brightness;
  if (contrast > 0.0) {
    color.rgb = (color.rgb - 0.5) / (1.0 - contrast) + 0.5;
  } else {
    color.rgb = (color.rgb - 0.5) * (1.0 + contrast) + 0.5;
  }
	gl_FragColor = texture2D(img,uv);
  gl_FragColor = color;
}
`

export const BrightnessContrast = {
  ...basicImageShader,
  fs: brighnessContrastFS,
  uniforms: {
    ...basicImageShader.uniforms,
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
  ...basicImageShader,
  fs: hueSaturationFS,
  uniforms: {
    ...basicImageShader.uniforms,
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
  ...basicImageShader,
  fs: vignetteFS,
  uniforms: {
    ...basicImageShader.uniforms,
    vignette: { type: float, default: 0 },
  },
}
const PartHueSaturation = `
	if(hue !=0.0 || saturation !=0.0 ){
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
	}
`
const PartBrightnessContrast = `
	if(brightness!=0.0 || contrast!=0.0){
		color.rgb += brightness;
		if (contrast > 0.0) {
			color.rgb = (color.rgb - 0.5) / (1.0 - contrast) + 0.5;
		} else {
			color.rgb = (color.rgb - 0.5) * (1.0 + contrast) + 0.5;
		}
	}
`
const PartVignetee = `
if(vignette!=0.0){
  float innerVig = 1.0 - vignette;
  float outerVig = 1.0001; // Position for the outer vignette
  // float innerVig = 0.4; // Position for the inner vignette ring

  vec2 center = vec2(0.5, 0.5); // center of screen
  // Distance between center and the current uv. Multiplyed by 1.414213 to fit in the range of 0.0 to 1.0.
  float dist = distance(center, vTexCoord) * 1.414213;
  // Generate the vignette with clamp which go from outer ring to inner ring with smooth steps.
  float vig = clamp((outerVig - dist) / (outerVig - innerVig), 0.0, 1.0);
  color *= vig; // Multiply the vignette with the texture color
}
`
//const ExShaderUniforms = ['float hue', 'float saturation', 'float brightness', 'float contrast']

//const UniformsInShader = (ex:string[])=>{
//return ex.map((uniform) => "uniform "+uniform+";")
//}
const MonolithicFS = `


precision highp float;
uniform sampler2D img;

uniform float hue;
uniform float saturation;
uniform float brightness;
uniform float contrast;
uniform float vignette;

uniform vec3 zoomSection;
varying vec2 vTexCoord;

void main(){
	vec2 uv = vTexCoord/zoomSection.z;
	uv.x+=zoomSection.x;
	uv.y+=zoomSection.y;
  vec4 color = texture2D(img, uv);
	
	${PartHueSaturation}
	${PartBrightnessContrast}
	${PartVignetee}

  gl_FragColor = color;
}
`
export const MonolithicShader = {
  ...basicImageShader,
  fs: MonolithicFS,
  uniforms: {
    ...basicImageShader.uniforms,
    hue: { type: float, default: 0 },
    saturation: { type: float, default: 0 },
    brightness: { type: float, default: 0 },
    contrast: { type: float, default: 0 },
    vignette: { type: float, default: 0 },
  },
}

const basicMosaicVS = `
precision highp float;
attribute vec4 position;
attribute vec4 texCoord;

uniform mat4 transMat;
uniform mat4 rotateMat;
uniform mat4 scaleMat;
uniform mat4 projectionMat;
uniform float layer;

varying vec4 vTexCoord;
void main(){
	gl_Position = projectionMat*transMat*rotateMat*scaleMat*position;
	gl_Position.z = layer;
	vTexCoord = texCoord;
}
`

const mosaicMultiVS = `
precision highp float;
varying vec4 vTexCoord;

float random (vec2 st) {
	return fract(sin(dot(st.xy,
											 vec2(12.9898,78.233)))*
												 43758.5453123);
}

void main(){
	vec2 st = vec2(vTexCoord.x,vTexCoord.y)*10.0;
	gl_FragColor.rgb = vec3(random(floor(st)),0.5,0.6);
	//gl_FragColor.rgb = vec3(fract(st.x),0.5,0.6);
	gl_FragColor.a = 1.0;
}
`

export const MosaicMultiShader = {
  vs: basicMosaicVS,
  fs: mosaicMultiVS,
  buffers: {
    position: { type: vec4, n: 2 },
    texCoord: { type: vec4, n: 2 },
  },
  uniforms: {
    transMat: { type: mat4 },
    rotateMat: { type: mat4 },
    scaleMat: { type: mat4 },
    projectionMat: { type: mat4 },
    layer: { type: float },
  },
}

const mosaicFracVS = `
precision highp float;
varying vec4 vTexCoord;

float random (vec2 st) {
	return fract(sin(dot(st.xy,
											 vec2(12.9898,78.233)))*
												 43758.5453123);
}

void main(){
	vec2 st = vec2(vTexCoord.x,vTexCoord.y)*10.0;
	gl_FragColor.rgb = vec3(fract(st.x),0.5,0.6);
	gl_FragColor.a = 1.0;
}
`
export const MosaicFracShader = {
  vs: basicMosaicVS,
  fs: mosaicFracVS,
  buffers: {
    position: { type: vec4, n: 2 },
    texCoord: { type: vec4, n: 2 },
  },
  uniforms: {
    transMat: { type: mat4 },
    rotateMat: { type: mat4 },
    scaleMat: { type: mat4 },
    projectionMat: { type: mat4 },
    layer: { type: float },
  },
}
