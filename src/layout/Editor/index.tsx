import React, {
  ChangeEvent,
  FormEvent,
  FormEventHandler,
  useContext,
} from 'react'
import { globalContext } from '../../context'
import {} from './index.css'
import { editorSchema } from './editorSchema'
export function Editor() {
  const { spiritCanvas, adjustNum, setAdjustNum, selectNum } =
    useContext(globalContext)
  const rangeInput = editorSchema.children[0]
  const onChangeInput =
    (desc: string) => (e: ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value)
      console.log(`desc:${desc},value:${e.target.value}`)
      console.log(adjustNum)

      // can functional optimze
      if (desc === 'rotate') {
        spiritCanvas.spirits[selectNum].updateRotateMat(value)
      } else if (desc === 'translateX') {
        spiritCanvas.spirits[selectNum].updateTransMat(value, value)
      } else if (desc === 'translateY') {
        spiritCanvas.spirits[selectNum].updateTransMat(0, value)
      } else if (desc === 'scaleX') {
        spiritCanvas.spirits[selectNum].updateScaleMat(value, 0)
      } else if (desc === 'scaleY') {
        spiritCanvas.spirits[selectNum].updateScaleMat(0, value)
      } else if (desc === 'Hue') {
        spiritCanvas.spirits[selectNum].updateHue(value)
      } else if (desc === 'Saturation') {
        spiritCanvas.spirits[selectNum].updateSaturation(value)
      } else if (desc === 'Contrast') {
        spiritCanvas.spirits[selectNum].updateContrast(value)
      } else if (desc === 'Brightness') {
        spiritCanvas.spirits[selectNum].updateBrightness(value)
      }
			else if (desc ==='Vignette') {
        spiritCanvas.spirits[selectNum].updateVignette(value)
			}
      setAdjustNum(adjustNum + 1)
    }
  return (
    <div className="bg-blue-100">
      Editor
      <div style={{ height: 50 }}>curCmpId:{selectNum}</div>
      <div>
        {rangeInput.children.map((cur, index) => {
          return (
            <div style={{ marginBottom: 30 }} key={index}>
              <input
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
    </div>
  )
}
