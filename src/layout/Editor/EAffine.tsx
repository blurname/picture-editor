import { Input, Slider } from 'antd'
import React, { ChangeEvent, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import { globalContext } from '../../context'
import {BeamSpirit} from '../../utils/gl-uitls'
import { editorSchema } from './editorSchema'
type Props = {
  resetValue: (desc: string) => () => void
  commitToHistory: () => void
  storeOld: (desc: string) => () => void
  onChangeInput: (desc: string) => (e: ChangeEvent<HTMLInputElement>) => void
  setValue: Dispatch<SetStateAction<any>>
  setOld: Dispatch<SetStateAction<any>>
  setDesc: Dispatch<SetStateAction<string>>
}
export function EAffine(props: Props) {
  const {
    commitToHistory,
    storeOld,
    onChangeInput,
    setValue,
    setOld,
    setDesc,
  } = props
  const { spiritCanvas, selectNum } = useContext(globalContext)
  const shaping = editorSchema.children[0]
  const onLayerChange = (value: number) => {
    setOld(spiritCanvas.spirits[selectNum].getModel()['layer'])
    spiritCanvas.spirits[selectNum].updateModel({ layer: 1 - value })
    setValue(value)
    setDesc('layer')
  }
  const afterLayerChage = () => {
    commitToHistory()
  }
	const [curSpirit, setCurSpirit] = useState<BeamSpirit>(spiritCanvas.spirits[selectNum]);
	useEffect(() => {
		setCurSpirit(spiritCanvas.spirits[selectNum])
		}, [selectNum]);
  return (
    <div>
      {shaping.children.map((cur, index) => {
        if (cur.desc === 'layer') {
          return (
            <Slider
              key={index}
              min={cur.props.range.min}
              max={cur.props.range.max}
              step={cur.props.step}
              marks={cur.props.marks}
              value={1-curSpirit.getlayer()}
              onChange={onLayerChange}
              onAfterChange={afterLayerChage}
            ></Slider>
          )
        }
        return (
          <div className="w-12/12 h-5/12 mb-3" key={index}>
            <Input
              type="range"
              step={cur.props.step}
              min={cur.props.range.min}
              max={cur.props.range.max}
              value={curSpirit.getModel()[cur.desc]}
              onInput={onChangeInput(cur.desc)}
              id={cur.desc}
              onMouseUp={commitToHistory}
              onMouseDown={storeOld(cur.desc)}
            />
            <label htmlFor={cur.desc}>{cur.desc}</label>
          </div>
        )
      })}
    </div>
  )
}
