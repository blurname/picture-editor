import React, { ChangeEvent, FormEvent, FormEventHandler, useContext } from 'react'
import { globalContext } from '../../context'
import {} from './index.css'
import { editorSchema } from './editorSchema'
export function Editor() {
  const { globalCanvas,adjustNum,setAdjustNum } = useContext(globalContext)
  const curCmpId = globalCanvas.selectedCmp?.id
  const rangeInput = editorSchema.children[0]
  const onChangeInput = (desc:string)=>(e:ChangeEvent<HTMLInputElement>) => {
	const value = parseFloat(e.target.value) 
     console.log(`desc:${desc},value:${e.target.value},curId:${curCmpId}`)
		 globalCanvas.updateSelectedCmp(desc,value)
		 globalCanvas.updateCmps()
		 setAdjustNum(adjustNum+1)
  }
  return (
    <div className="Editor">
      Editor
      <div style={{ height: 50 }}>curCmpId:{curCmpId}</div>
      <div>
        {rangeInput.children.map((cur, index) => {
          return (
            <div style={{ marginBottom: 30 }} key={index}>
              {cur.desc}
              <input
                type="range"
                min={cur.props.range.min}
                max={cur.props.range.max}
                defaultValue={cur.props.value}
                onInput={onChangeInput(cur.desc)}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
