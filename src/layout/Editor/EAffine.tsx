import { Button, Input, Slider } from 'antd'
import React, { ChangeEvent, Dispatch, SetStateAction, useContext } from 'react'
import { globalContext } from '../../context'
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
    //console.log('layerold',spiritCanvas.spirits[selectNum].getModel()])
    setOld(spiritCanvas.spirits[selectNum].getModel()['layer'])
    spiritCanvas.spirits[selectNum].updateModel({ layer: 1 - value })
    setValue(value)
    setDesc('layer')
  }
  const afterLayerChage = () => {
    commitToHistory()
  }
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
              defaultValue={cur.props.value}
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
              defaultValue={cur.props.value}
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
