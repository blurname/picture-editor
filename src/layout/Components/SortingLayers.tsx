import React, { useState } from 'react'
export function SortingLayers() {

  return (
    <>
      <div>
        <h1>layers</h1>
        <div className='bg-pink-100 w-40 h-40' draggable="true">layer1</div>
        <div className='bg-pink-200 w-40 h-40' draggable="true">layer2</div>
        <div className='bg-pink-300 w-40 h-40' draggable="true">layer3</div>
        <div className='bg-pink-400 w-40 h-40' draggable="true">layer4</div>
      </div>
    </>
  )
}
