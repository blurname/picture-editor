import { Button, Collapse, Input, Slider } from 'antd'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'
import React, { ChangeEvent, useContext } from 'react'
import { globalContext } from '../../context'
import { ImageSpirit, MarkSpirit } from '../../utils/gl-uitls'
import { editorSchema } from './editorSchema'
export function Editor() {
  const { spiritCanvas, adjustNum, setAdjustNum, selectNum, } =
    useContext(globalContext)
  const shaping = editorSchema.children[0]
  const filters = editorSchema.children[1]
  const onColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
    const hex: string = e.target.value
    const r = parseInt('0x'+hex.slice(1, 3))/255.0
    const g = parseInt('0x'+hex.slice(3, 5))/255.0
    const b = parseInt('0x'+hex.slice(5))   /255.0
    const mark = spiritCanvas.spirits[selectNum] as MarkSpirit
		mark.updateColor([r,g,b,1.0])
    setAdjustNum(adjustNum + 1)
  }
	const onDeleteClik = () => {
		spiritCanvas.deleteElement(selectNum)
      setAdjustNum(adjustNum + 1)
	}

  const onChangeInput =
    (desc: string) => (e: ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value)
      //console.log(`desc:${desc},value:${e.target.value}`)
      //console.log(adjustNum)
      const chosenImage = spiritCanvas.spirits[selectNum]

      // can functional optimze
      if (desc === 'rotate') {
        chosenImage.updateRotateMat(value)
      } else if (desc === 'translateX') {
        chosenImage.updateTransMat(value, 0)
      } else if (desc === 'translateY') {
        chosenImage.updateTransMat(0, value)
      } else if (desc === 'scaleX') {
        chosenImage.updateScaleMat(value, 0)
      } else if (desc === 'scaleY') {
        chosenImage.updateScaleMat(0, value)
      } else if (desc === 'Hue') {
        chosenImage.updateHue(value)
      } else if (desc === 'Saturation') {
        chosenImage.updateSaturation(value)
      } else if (desc === 'Contrast') {
        chosenImage.updateContrast(value)
      } else if (desc === 'Brightness') {
        chosenImage.updateBrightness(value)
      } else if (desc === 'Vignette') {
        chosenImage.updateVignette(value)
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
				<Button onClick={onDeleteClik}>delete element</Button>
      <Collapse className="w-12/12" defaultActiveKey={[1, 2]}>
        <input type="color" onChange={onColorChange} />
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
