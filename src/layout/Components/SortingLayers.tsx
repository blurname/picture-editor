import React, { DragEvent, useState } from 'react'
export function SortingLayers() {
	const onDragEnterHandler =(index:number)=> (e:DragEvent) => {
		//e.preventDefault()
		console.log('element is placed on div',index)
	}
	const onDragStartHandler = (index:number)=>(e:DragEvent) => {
		//e.preventDefault()
		console.log(`div${index} beeing place`)
	}
  return (
    <>
      <div>
        <h1>layers</h1>
        <div className="bg-pink-100 w-30 h-30 mt-10" onDragOver={onDragEnterHandler(1)} >
          <div className='bg-orange-200 w-20 h-20' onDragStart={onDragEnterHandler(1)} draggable="true">layer1</div>
        </div>
        <div className="bg-pink-200 w-30 h-30 mt-10" onDragOver={onDragEnterHandler(2)} >
          <div className='bg-orange-200 w-20 h-20' onDragStart={onDragEnterHandler(2)} draggable="true">layer2</div>
        </div>
        <div className="bg-pink-300 w-30 h-30 mt-10" onDragOver={onDragEnterHandler(3)} >
          <div className='bg-orange-200 w-20 h-20' onDragStart={onDragEnterHandler(3)} draggable="true">layer3</div>
        </div>
        <div className="bg-pink-400 w-30 h-30 mt-10" onDragOver={onDragEnterHandler(4)} >
          <div className='bg-orange-200 w-20 h-20' onDragStart={onDragStartHandler(4)} draggable="true">layer4</div>
        </div>
      </div>
    </>
  )
}
