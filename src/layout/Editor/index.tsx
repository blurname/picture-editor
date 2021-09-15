import { Collapse, Input, Slider } from 'antd'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'
import React, {
  ChangeEvent,
  FormEvent,
  FormEventHandler,
  useContext,
} from 'react'
import { globalContext } from '../../context'
import { editorSchema } from './editorSchema'
export function Editor() {
  const { spiritCanvas, adjustNum, setAdjustNum, selectNum } =
    useContext(globalContext)
  const shaping = editorSchema.children[0]
  const filters = editorSchema.children[1]

  const onChangeInput =
    (desc: string) => (e: ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value)
      console.log(`desc:${desc},value:${e.target.value}`)
      console.log(adjustNum)

      // can functional optimze
      if (desc === 'rotate') {
        spiritCanvas.spirits[selectNum].updateRotateMat(value)
      } else if (desc === 'translateX') {
        spiritCanvas.spirits[selectNum].updateTransMat(value, 0)
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
      } else if (desc === 'Vignette') {
        spiritCanvas.spirits[selectNum].updateVignette(value)
      }
      setAdjustNum(adjustNum + 1)
    }
  const onLayoutChange = (value: number) => {
    spiritCanvas.spirits[selectNum].updateLayout(1 - value)
    setAdjustNum(adjustNum + 1)
  }

  return (
    <div className="w-2/12 bg-blue-100 object-right">
      Editor
      <div style={{ height: 50 }}>curCmpId:{selectNum}</div>
      <Collapse className="w-12/12" defaultActiveKey={[1,2]}>
        <CollapsePanel header="shaping" key="1">
          <div>
            {shaping.children.map((cur, index) => {
              if (cur.desc === 'layout') {
                return (
                  <Slider
                    key={index}
                    min={cur.props.range.min}
                    max={cur.props.range.max}
                    step={cur.props.step}
                    marks={cur.props.marks}
                    defaultValue={cur.props.value}
                    onChange={onLayoutChange}
                  ></Slider>
                )
              }
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
      </Collapse>
    </div>
  )
}
