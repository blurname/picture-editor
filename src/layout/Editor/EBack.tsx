import { Button, Input } from 'antd'
import React, { ChangeEvent, Dispatch, SetStateAction, useContext,  useEffect, useState } from 'react'
import { globalContext } from '../../context'
import { backCellShader, backImageShader } from '../../filter/shader'
import { backCellUniform, backImageUniform } from '../../filter/uniform'
import {BeamSpirit} from '../../utils/gl-uitls'
import { imgUrl } from '../Components/Img'
import {shaderSchema} from './editorSchema'
type Props = {
	commitToHistory: () => void
	storeOld: (desc: string) => () => void
	setValue: Dispatch<SetStateAction<any>>
	onChangeInput: (desc: string) => (e: ChangeEvent<HTMLInputElement>) => void
}

export const backShader = {
  cell: backCellShader,
}
export const backUniforms = {
  cell: backCellUniform,
}
export function EBack(props: Props) {
  const { spiritCanvas, setAdjustNum,selectNum, adjustNum } = useContext(globalContext)
	const {commitToHistory,storeOld,onChangeInput} = props
	
	const shader = shaderSchema.children[0]

	const [curSpirit, setCurSpirit] = useState<BeamSpirit>(spiritCanvas.spirits[selectNum]);
	useEffect(() => {
		setCurSpirit(spiritCanvas.spirits[selectNum])
		}, [selectNum]);
  return (
    <>
      <h1>Background</h1>
      {shader.children.map((cur, index) => {
        return (
          <div key={index}>
            <div className="w-7/12 h-5/12 mb-3">
              <Input
                type="range"
                step={cur.props.step}
                min={cur.props.range.min}
                max={cur.props.range.max}
                value={curSpirit.getUniqueProps()[cur.desc]}
								onInput={onChangeInput(cur.desc)}
								onMouseUp={commitToHistory}
								onMouseDown={storeOld(cur.desc)}
                id={cur.desc}
              />
              <label htmlFor={cur.desc}>{cur.desc}</label>
            </div>
          </div>
        )
      })}
    </>
  )
}
