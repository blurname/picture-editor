import {SchemaTypes} from 'beam-gl'
const vs = `
attribute vec4 position
attribute vec2 texCoord
varying highp vec2 vTexCoord
void main(){
	gl_position = position
	vTexCoord = texCoord
}
`
const fs = `
uniform highp float scale
varing highp vec2 vTexCoord
uniform sampler2D img
void main(){
	gl_FragColor = texture2D(img,vTexCoord * scale)
}
`

const {vec4,vec2,tex2D,float} = SchemaTypes
export const Texture ={
	vs,
	fs,
	buffers:{
		position:{type:vec4,n:3},
		color:{type:vec2}

	},
	uniforms:{
		scale:{type:float,default:1}
	},
	textures:{
		img:{type:tex2D}
	}
}
