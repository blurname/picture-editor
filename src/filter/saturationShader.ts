import {SchemaTypes} from 'beam-gl'
const {vec4,vec2,tex2D,float} = SchemaTypes
const vs = `
attribute vec4 position;
attribute vec4 color;

varying highp vec4 vColor;

void main(){
	gl_Position = position;
	vColor = color;
}
`
const fs = `
varying highp vec4 vColor;

void main(){
	gl_FragColor = vColor;
}
`

export const Texture ={
	vs,
	fs,
	buffers:{
		position:{type:vec4,n:3},
		color:{type:vec4,n:3}
	},
	// uniforms:{
	// 	scale:{type:float,default:1}
	// },
	// textures:{
	// 	img:{type:tex2D}
	// }
}

const tVs =`
attribute vec4 position;
attribute vec2 texCoord;

varying highp vec2 vTexCoord;
void main(){
	gl_Position = position;
	vTexCoord = texCoord;
}

` 
const tFs =`
varying highp vec2 vTexCoord;

uniform sampler2D img;

void main(){
	gl_FragColor = texture2D(img,vTexCoord);
}
`
export const renderImage={
	vs:tVs,
	fs:tFs,
	buffers:{
		position:{type:vec4,n:3},
		texCoord:{type:vec2},
	},
	textures:{
		img:{type:tex2D}
	}
}











