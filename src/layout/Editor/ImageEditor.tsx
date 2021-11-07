import { Input } from 'antd'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'
import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
} from 'react'
import { SpiritCanvas } from '../../store/globalCanvas'
import { ImageSpirit } from '../../utils/gl-uitls'
import { editorSchema } from './editorSchema'
type Props = {
  spiritCanvas: SpiritCanvas
  selectNum: number
  adjustNum: number
  setAdjustNum: Dispatch<SetStateAction<Number>>
}
export function ImageEditor(props: Props) {
  const { spiritCanvas, selectNum, adjustNum, setAdjustNum } = props
  const onChangeInput =
    (desc: string) => (e: ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value)
      const chosenImage = spiritCanvas.spirits[selectNum] as ImageSpirit

      // can functional optimze
      //if (desc === 'rotate') {
        //chosenImage.updateRotateMat(value)
      //} else if (desc === 'scale') {
        //chosenImage.updateScaleMat(value)
      //} else if (desc === 'Hue') {
        //chosenImage.updateHue(value)
      //} else if (desc === 'Saturation') {
        //chosenImage.updateSaturation(value)
      //} else if (desc === 'Contrast') {
        //chosenImage.updateContrast(value)
      //} else if (desc === 'Brightness') {
        //chosenImage.updateBrightness(value)
      //} else if (desc === 'Vignette') {
        //chosenImage.updateVignette(value)
      //}
      setAdjustNum(adjustNum + 1)
    }
  const filters = editorSchema.children[1]
	console.log(filters)
  return (
	<div>
		<h1>lkjsafdlj</h1>
    <CollapsePanel header="filters" key="2">
      <div>
        {filters.children.map((cur, index) => {
          return (
            <div className="w-5/12 h-5/12 mb-3" key={index}>
              <Input
                type="range"
                step={cur.props.step}
                min={cur.props.range.min}
                max={cur.props.range.max}
                defaultValue={cur.props.value}
                onInput={onChangeInput(cur.desc)}
                id={cur.desc}
              />
              <label htmlFor={cur.desc}>{cur.desc}</label>
            </div>
          )
        })}
      </div>
    </CollapsePanel>
	</div>
  )
}
