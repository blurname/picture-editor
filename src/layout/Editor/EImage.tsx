import { Button, Input } from 'antd'
import React, {
  ChangeEvent,
  Dispatch,
  MouseEventHandler,
  SetStateAction,
} from 'react'
import { editorSchema } from './editorSchema'
type Props = {
  //spiritCanvas: SpiritCanvas
  //selectNum: number
  //adjustNum: number
  //setAdjustNum: Dispatch<SetStateAction<Number>>
  resetValue: (desc: string) => () => void
  commitToHistory: () => void
  storeOld: (desc: string) => () => void
  onChangeInput: (desc: string) => (e: ChangeEvent<HTMLInputElement>) => void
}
export function EImage(props: Props) {
  const { resetValue, commitToHistory, storeOld, onChangeInput } = props

  const filters = editorSchema.children[1]
  return (
    <div>
      {filters.children.map((cur, index) => {
        return (
          <div key={index}>
            <div className="w-7/12 h-5/12 mb-3">
              <Input
                type="range"
                step={cur.props.step}
                min={cur.props.range.min}
                max={cur.props.range.max}
                defaultValue={cur.props.value}
                onInput={onChangeInput(cur.desc)}
                onMouseUp={commitToHistory}
                onMouseDown={storeOld(cur.desc)}
                id={cur.desc}
              />
              <label htmlFor={cur.desc}>{cur.desc}</label>
            </div>
            <Button className="w-5/12 h-5/12" onClick={resetValue(cur.desc)}>
              reset
            </Button>
          </div>
        )
      })}
    </div>
  )
}
