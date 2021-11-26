import { MouseEvent, MutableRefObject } from 'react'
import { mat4, vec2 } from 'gl-matrix'
import {User} from '../hooks/useUsers'

export const createRectangleByProjection = (width: number,height:number) => {
  const basePosition = [
		-width/2,-height/2,
		-width/2,height/2,
		width/2,height/2,
		width/2,-height/2,
	]

	//const position = basePosition.map((pos,index) => {if(index % 4===3){return pos}else{return pos*0.4}} )
	const position = basePosition.map((pos) =>pos*0.4)
  const texCoord = [0, 0, 0, 1, 1, 1, 1, 0]
  const index = {
    array: [0, 1, 2, 0, 2, 3],
  }
  return {
    vertex: {
      position:new Float32Array(position),
      texCoord,
    },
    index,
  }
}
export const createLine = (guidRect: Rect) => {
  const { x, y, width, height } = guidRect
  const position = [
    x,
    y,
    0.0, //0
    x,
    y + height + 200,
    0.0, //1

    x,
    y + height,
    0.0, //2
    x + width + 200,
    y + height,
    0.0, //3

    x + width,
    y,
    0.0, //4
    x + width,
    y + height + 200,
    0.0, //5

    x + width + 200,
    y,
    0.0, //6
    //x,y,
    //x,y+height,
    //x+width,y+height,
    //x+width,y,
  ]

  const index = {
    array: [0, 1, 2, 3, 4, 5, 0, 6],
  }
  return {
    vertex: {
      position,
      color: [
        0.9, 0.1, 0.9, 0.9, 0.1, 0.9, 0.9, 0.1, 0.9, 0.9, 0.1, 0.9, 0.9, 0.1,
        0.9, 0.9, 0.1, 0.9, 0.9, 0.1, 0.9,
      ],
    },
    index,
  }
}
export const createLineRect = (width: number,height:number) => {
  const basePosition = [
		-width/2,-height/2,
		-width/2,height/2,
		width/2,height/2,
		width/2,-height/2,
	]
	const position = basePosition.map((pos,index) => {
		if(index%2===1)return pos * 0.05
		else return pos*0.5})
  const index = {
    array: [0, 1, 2, 0, 2, 3],
  }
  return {
    vertex: {
      position:new Float32Array(position),
      color: [0, 1, 1, 0.5, 1, 0.5, 0.4, 1, 0.6, 0.7, 0, 1],
    },
    index,
  }
}
export const createHollowRectangle = (width: number,height:number) => {
  const basePosition = [
    -1*width/2, -1*height/2,   
		-1*width/2, 1*height/2,   
		1*width/2, 1*height/2,   
		1*width/2, -1*height/2,   
		-0.5*width/2, -0.5*height/2,  
		-0.5*width/2, 0.5*height/2,  
		0.5*width/2,0.5*height/2,  
		0.5*width/2, -0.5*height/2,  
  ]
	const position = basePosition.map((pos,index) => pos*0.3 )
  const index = {
    array: [
      0, 1, 4, 1, 4, 5, 1, 2, 5, 2, 5, 6, 2, 3, 6, 3, 6, 7, 3, 0, 7, 0, 7, 4,
    ],
  }
  return {
    vertex: {
      position:new Float32Array(position),
      color: [
        1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0,
      ],
    },
    index,
  }
}
export const createCircle = (angleNum: number = 100) => {
  let position = [] as number[]
  let indexArray = [] as number[]
  let color = [] as number[]
  //position.push(-1.0)
  const angle = 360 / angleNum
  for (let index = 0; index < angleNum; index++) {
    position.push(index * angle)
  }
  for (let index = 0; index < angleNum; index += 1) {
    if (index === angleNum - 1) {
      indexArray.push(index)
      indexArray.push(0)
    } else {
      indexArray.push(index)
      indexArray.push(index + 1)
    }
    color.push(0.5)
    color.push(0.2)
    color.push(0.7)
  }
    color.push(0.5)
    color.push(0.2)
    color.push(0.7)

    color.push(0.5)
    color.push(0.2)
    color.push(0.7)
  return {
    vertex: {
      position,
			color
    },
    index: {
      //array:[0,1,2,0,2,3],
      array: indexArray,
      //array:[0,1,2,0,2,3,0,3,4],
    },
  }
}

export const createW = (line:number) =>{
	const width = 500
	const height = 400
	const halfLine = line*0.5
	const basePosition = [
		width,height,
		width*3/2,0,
		width*2,height,
		width*5/2,0,
		width*3,height,
	]
	//const basePosition = [
		//width,height,
		//width,0,
		//width*2,height,
		//width*3,0,
		//width*3,height,
	//]
	const position = basePosition.map((pos) => pos )
	const points:Vec2[] =[]
	for (let index = 0; index < position.length; index+=2) {
		const element = position[index];
		const element1 = position[index+1];
		points.push({d1:element,d2:element1})
	}
	const outsides = []
	const insides = []
	for (let i = 0; i < points.length; i++) {
		if(i===0){
			const a = getVec2(points[i])

			const normal = getVec2({d1:-a[1],d2:a[0]})
			const nnormal = new Float32Array(2)
			vec2.normalize(nnormal, normal)
			const snnormal = new Float32Array(2)
			vec2.scale(snnormal, nnormal,halfLine )

			const vOut = new Float32Array(2)
			const vIn = new Float32Array(2)
			vec2.sub(vOut, a, snnormal)
			vec2.add(vIn, a, snnormal)

			outsides.push(...vOut)
			insides.push(...vIn)
		}
		else if(i===points.length-1){
			const a = getVec2(points[i])

			const normal = getVec2({d1:a[1],d2:-a[0]})
			const nnormal = new Float32Array(2)
			vec2.normalize(nnormal, normal)
			const snnormal = new Float32Array(2)
			vec2.scale(snnormal, nnormal,halfLine )
			const vOut = new Float32Array(2)
			const vIn = new Float32Array(2)
			vec2.sub(vOut, a, snnormal)
			vec2.add(vIn, a, snnormal)

			outsides.push(...vOut)
			insides.push(...vIn)
		}else{
			const a = getVec2(points[i])
			const b = getVec2(points[i-1])
			const c = getVec2(points[i+1])

			const v1 = new Float32Array(2)
			const v2 = new Float32Array(2)
			const v = new Float32Array(2)

			vec2.sub(v1,a, b)
			vec2.sub(v2,a, c)
			vec2.add(v, v1, v2)

			const aNormal = new Float32Array([-a[1],a[0]])		
			const cos = vec2.dot(aNormal, v)/vec2.length(aNormal)/vec2.length(v)
			const normalizedAnormal = new Float32Array(2) 
			vec2.normalize(normalizedAnormal, v)

			const realV = new Float32Array(2)
			const vLine = halfLine/cos 
			vec2.scale(realV, normalizedAnormal,vLine )

			const vOut = new Float32Array(2)
			const vIn = new Float32Array(2)
			vec2.add(vOut, a, realV)
			vec2.sub(vIn, a, realV)
			outsides.push(...vOut)
			insides.push(...vIn)
		}
	}
	//console.log(...outsides)
	const final = position.concat(insides,outsides)
	//const final = position
	//console.log('final:', final)
	//const indexArray = [
		//0,1,1,2,2,3,3,4,
		//5,6,6,7,7,8,8,9,
		//10,11,11,12,12,13,13,14,
	//]
	const indexArray = [
		//0,1,1,2,2,3,3,4,
		0,6,6,7,7,8,8,4,
		0,11,11,12,12,13,13,4,
	]
	const color = []
	for (let index = 0; index < 5; index++) {
		color.push(1,0,0)
		
	}
	return {
		vertex:{
			position:final.map((pos) => {
				return pos*0.3
			}),
			color
		},
		index:{
			array:indexArray  
		}
	}

}

const getVec2 = (point:Vec2) => {
	return new Float32Array([point.d1,point.d2])
}

export const createBackGrid = () => {
	const position = [
		-1,-1,
		-1,1,
		1,1,
		1,-1
	]
	const texCoord = [
		0,0,
		0,1,
		1,1,
		1,0
	]
	const indexArray = [
		0,1,2,
		0,2,3
	]
	
	return{
		vertex:{
			position,
			texCoord
		},
		index:{
			array:indexArray
		}
	}
}

export const createMosaic = (width:number,height:number) => {
	const position = [
		//-width/2,-height/2,
		//-width/2,height/2,
		//width/2,height/2,
		//width/2,-height/2,
		-width/2,-height/2,
		-width/2,height/2,
		width/2,height/2,
		width/2,-height/2	
	]
	const texCoord = [
		0,0,
		0,1,
		1,1,
		1,0
	]
	const indexArray = [
		0,1,2,
		0,2,3
	]
	return{
		vertex:{
			position,
			texCoord
		},
		index:{
			array:indexArray
		}
	}
}


const getRelativeCursorPos = (e: MouseEvent, canvasPos: CanvasPos): Pos => {
  return {
    left: e.pageX - canvasPos.left,
    top: e.pageY - canvasPos.top,
  }
}
type Forward = 'left' | 'down'
export const getCursorPosInCanvas = (
  e: MouseEvent,
  canvasPos: CanvasPos,
): Pos | 'outOfCanvas' => {
  const cursorPos = getRelativeCursorPos(e, canvasPos)
  const isOutsideHorizontal: boolean =
    cursorPos.left < 0 ? true : cursorPos.left > canvasPos.width ? true : false
  const isOutsideVeritcle: boolean =
    cursorPos.top < 0 ? true : cursorPos.top > canvasPos.height ? true : false
  if (isOutsideVeritcle || isOutsideHorizontal) return 'outOfCanvas'

  return {
    left: normalize2(cursorPos.left, canvasPos.width, 'left'),
    top: normalize2(cursorPos.top, canvasPos.height, 'down'),
  }
}
const normalize2 = (
  oneDimPos: number,
  edge: number,
  forward: Forward,
): number => {
  if (oneDimPos < edge / 2) {
    // console.log(edge)
    if (forward === 'left') return oneDimPos - (edge / 2) 
    else return -(oneDimPos - (edge / 2) )
  } else {
    // console.log(edge)
    // console.log(oneDimPos - edge / 2)
    if (forward === 'left') {
      return (oneDimPos - edge / 2)
    } else {
      return -(oneDimPos - edge / 2)
    }
  }
}

export const getCursorMovDistance = (
  cur: MouseEvent,
  canvas: CanvasPos,
): Pos => {
  const curPos = getCursorPosInCanvas(cur, canvas) as Pos
  return { left: curPos.left, top: curPos.top }
}

type Point = { x: number; y: number }
export const getCursorIsInQuad = (
  cursorPos: Point,
guidRect:Rect): 'fir' | 'sec' | 'out' => {
  // leftdown->leftup->rightup->rightdown
  // a->b->c->d
  const a: Point = { x: guidRect.x, y: guidRect.y }
  const b: Point = { x: guidRect.x, y: guidRect.y+guidRect.height }
  const c: Point = { x: guidRect.x+guidRect.width, y: guidRect.y+guidRect.height}
  const d: Point = { x: guidRect.x+guidRect.width, y: guidRect.y }

  const firstTriangle = getIsInTriangle(cursorPos, a, b, c)
  if (firstTriangle) {
    return 'fir'
  } else {
    const secondTriangle = getIsInTriangle(cursorPos, c, d, a)
    if (secondTriangle) return 'sec'
    else return 'out'
  }
}


type Vec2 = {
  d1: number
  d2: number
}
const getCross = (v1: Vec2, v2: Vec2): number => {
  // pa * pb
  // crossProduct: x1y2-y1x2
  return v1.d1 * v2.d2 - v2.d1 * v1.d2
}
const getIsInTriangle = (p: Point, a: Point, b: Point, c: Point) => {
  const pa: Vec2 = { d1: p.x - a.x, d2: p.y - a.y }
  const pb: Vec2 = { d1: p.x - b.x, d2: p.y - b.y }
  const pc: Vec2 = { d1: p.x - c.x, d2: p.y - c.y }
  const pabNormalDir = getCross(pa, pb)
  const pbcNormalDir = getCross(pb, pc)
  const pcaNormalDir = getCross(pc, pa)

  return pabNormalDir <= 0 && pbcNormalDir <= 0 && pcaNormalDir <= 0
}

export const drawRectBorder = (
  canvas2dRef: HTMLCanvasElement,
	guidRect:Rect
) => {

  const ctx = canvas2dRef.getContext('2d')
  //ctx.clearRect(
    //-canvas2dRef.width / 2,
    //-canvas2dRef.height / 2,
    //canvas2dRef.width,
    //canvas2dRef.height,
  //)
  ctx.strokeStyle = 'purple'
  ctx.lineWidth = 8
  ctx.strokeRect(
		guidRect.x,
		-(guidRect.y+guidRect.height),
		guidRect.width,
		guidRect.height
  )
}
export const clearRectBorder = (canvas2dRef:HTMLCanvasElement)=>{
  const ctx = canvas2dRef.getContext('2d')
  ctx.clearRect(
    -canvas2dRef.width / 2,
    -canvas2dRef.height / 2,
    canvas2dRef.width,
    canvas2dRef.height,
  )

}
export const drawNames = (canvas2dRef:HTMLCanvasElement,guidRect:Rect,user:User) => {
	const ctx = canvas2dRef.getContext('2d')
	ctx.font='40px serif'
	ctx.fillStyle='orange'
	const editing  = user.id+" is editing"
	ctx.fillText(editing, guidRect.x, -(guidRect.y+guidRect.height*1.3))
	//ctx.fillRect(
		//guidRect.x,
		//-(guidRect.y+guidRect.height*1.3),
		//guidRect.width/4,
		//guidRect.height/4
	//)
}

export const createTranslateMat = (offset:Pos) => {
  return [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		offset.left, offset.top, 0, 1]
}

//export const createRotateMat = (rotate: number,origin:Pos={left:0,top:0}) => {
	//rotate = (rotate * Math.PI) / 180
	//const cos = Math.cos(rotate)
	//const sin = Math.sin(rotate)
	//const x0 = origin.left
	//const y0 = origin.top
	//return [
		//cos, sin, 0, 0, 
		//-sin, cos, 0, 0,
		//0, 0, 1, 0,
		//(-x0*(cos-1)+y0*sin), (-x0*sin+y0*(1-cos)), 0, 1]
//}
export const createRotateMat = (rotate: number,) => {
	rotate = (rotate * Math.PI) / 180
	const cos = Math.cos(rotate)
	const sin = Math.sin(rotate)
	return [
		cos, sin, 0, 0, 
		-sin, cos, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1]
}

export const createScaleMat = (scale:number) => {
  return [
		scale, 0, 0, 0, 
		0, scale, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1]
}
type Edge ={
	l:number
	r:number
	t:number
	b:number
}
export function createProjectionMatInShader(edge:Edge) {
	const l = edge.l
	const r = edge.r
	const t = edge.t
	const b = edge.b
    return [
			2 / (r - l), 0, 0, 0,
			0, 2 / (t - b), 0, 0,
			0, 0, 1, 0,
			-(r + l) / (r - l), -(t + b) / (t - b), 0, 1
    ]
}
export function createProjectionMatInJS(l:number, r:number, t:number, b:number){
	return new Float32Array([
		2/(r-l),0,0,-(r+l)/(r-l),
		0,2/(t-b),0,-(t+b)/(t-b),
		0,0,1,0,
		0,0,0,1
	])
}
export function createProjection(edge:Edge){
	const l = edge.l
	const r = edge.r
	return new Float32Array([
		2/(r-l),0,0,-(r+l)/(r-l),
])}
export function createProjectionVec44CenterY(edge:Edge){
	const t = edge.t
	const b = edge.b
	return new Float32Array([
		0,2/(t-b),0,-(t+b)/(t-b),
])}
export function createProjectionXY(edge:Edge){
	const l = edge.l
	const r = edge.r
	const t = edge.t
	const b = edge.b
	return {
		x:2/(r-l),
		y:2/(t-b)
	}
}
