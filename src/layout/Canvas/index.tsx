import React, { useContext, useEffect, useRef } from 'react'
import { globalContext } from '../../context'
import { CanvasWrapper } from './CanvasWrapper'
import {} from './index.css'
// import {render} from '../../filter/t'
import { TCanvas } from '../../filter/t'
import { ImageCanvas } from '../../filter/ImageCanvas'
export function Canvas() {
  const { globalCanvas, cmpCount } = useContext(globalContext)
  const tCmp: Cmp = {
    id: 0,
    width: 200,
    height: 200,
    posX: 100,
    posY: 100,
    value: '../../../../public/test.jpg',
    image: undefined,
  }
  tCmp.image = new Image(tCmp.width, tCmp.height)
  tCmp.image.src = tCmp.value
  // tCmp.image.width = tCmp.width
  // tCmp.image.height = tCmp.height
  // tCmp.image.src = tCmp.value
  return (
    <div className="Canvas">
      <div>
        <img
          src={tCmp.image.src}
          width={tCmp.image.width}
          height={tCmp.image.height}
          alt=""
        />
      </div>
      <div>Canvas</div>
      <ImageCanvas />
      <TCanvas />
      <TCanvas />
      <div>cmpCount:{cmpCount}</div>
      <div style={{ position: 'relative' }}>
        {globalCanvas.cmps.map((cmp, index) => {
          return (
            <CanvasWrapper
              key={index.toString()}
              img={{
                id: cmp.id,
                style: { width: cmp.width, height: cmp.height },
                value: cmp.value,
                image: cmp.image,
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
