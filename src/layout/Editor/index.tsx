import { Button, Collapse, Input, Slider } from 'antd'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'
import React, { ChangeEvent, useContext, useState } from 'react'
import { globalContext } from '../../context'
import { ImageSpirit, MarkSpirit } from '../../utils/gl-uitls'
import { editorSchema } from './editorSchema'
export function Editor() {
  const {
    spiritCanvas,
    adjustNum,
    setAdjustNum,
    selectNum,
    zoomable,
    setZoomable,
    operationHistory,
  } = useContext(globalContext)

  const [value, setValue] = useState({} as any)
  const [desc, setDesc] = useState('')
  const [old, setOld] = useState({} as any)

  const onColorChange =
    (desc: string) => (e: ChangeEvent<HTMLInputElement>) => {
      const hex: string = e.target.value
      const r = parseInt('0x' + hex.slice(1, 3)) / 255.0
      const g = parseInt('0x' + hex.slice(3, 5)) / 255.0
      const b = parseInt('0x' + hex.slice(5)) / 255.0
      const color = [r, g, b, 1]
      let mark = spiritCanvas.spirits[selectNum] as MarkSpirit
      mark.updateUniform(desc, color)
      operationHistory.commit(
        mark.getUniqueProps() as MarkProps,
        { [desc]: old },
        { [desc]: color },
        'UniqueProps',
      )
      setAdjustNum(adjustNum + 1)
    }

  const onDeleteClik = () => {
    spiritCanvas.deleteElement(selectNum)
    setAdjustNum(adjustNum + 1)
  }

  const onLayoutChange = (value: number) => {
    spiritCanvas.spirits[selectNum].updateLayout(1 - value)
    setAdjustNum(adjustNum + 1)
  }

  const storeOld = (desc: string) => () => {
    const chosenImage = spiritCanvas.spirits[selectNum] as ImageSpirit
    if (desc === 'rotate' || desc === 'scale') {
      setOld(chosenImage.getModel()[desc])
    } else {
      setOld(chosenImage.getUniqueProps()[desc])
    }
  }
  const onChangeInput =
    (desc: string) => (e: ChangeEvent<HTMLInputElement>) => {
      const curValue = parseFloat(e.target.value)
      updateValue(desc, curValue)
    }

  const resetValue = (desc: string) => () => {
    console.log('desc:', desc)
    updateValue(desc, 0.00001)
  }
  const updateValue = (desc: string, curValue: number) => {
    let chosen = spiritCanvas.spirits[selectNum]
    if (desc === 'rotate') {
      chosen.updateRotateMat(curValue)
    } else if (desc === 'scale') {
      chosen.updateScaleMat(curValue)
    } else if (chosen.getSpiritType() === 'Image') {
      const image = chosen as ImageSpirit
      image.updateUniform(desc, curValue)
    }
    setAdjustNum(adjustNum + 1)
    setValue(curValue)
    setDesc(desc)
    return
  }
  const commitToHistory = () => {
    const chosen = spiritCanvas.spirits[selectNum]
    if (desc === 'rotate' || desc === 'scale') {
      if (chosen.getSpiritType() === 'Image') {
        const image = chosen as ImageSpirit
        image.updateRectModel({ [desc]: value })
        console.log('old:', old)
        operationHistory.commit(
          image.getModel(),
          { [desc]: old },
          { [desc]: value },
          'Model',
        )
      }
    } else {
      if (chosen.getSpiritType() === 'Image') {
        const image = chosen as ImageSpirit
        image.updateUniform(desc, value)
        operationHistory.commit(
          image.getUniqueProps() as ImageProps,
          { [desc]: old },
          { [desc]: value },
          'UniqueProps',
        )
      } else if (chosen.getSpiritType() === 'Mark') {
        const mark = chosen as MarkSpirit
        mark.updateUniform(desc, value)
        console.log('Markold:', old)
        console.log('markuniqueprops', mark.getUniqueProps())
        operationHistory.commit(
          mark.getUniqueProps() as ImageProps,
          { [desc]: old },
          { [desc]: value },
          'UniqueProps',
        )
      }
    }
    setAdjustNum(adjustNum + 1)
  }
  const shaping = editorSchema.children[0]
  const filters = editorSchema.children[1]
  const color = editorSchema.children[2]
  const onEnlargeable = () => {
    //appRef.current.style.cursor='zoom-in'
    setZoomable(!zoomable)
  }

  return (
    <div className="w-2/12 bg-blue-100 object-right">
      Editor
      <div style={{ height: 50 }}>curCmpId:{selectNum}</div>
      <div>
        {zoomable && (
          <Button
            onClick={onEnlargeable}
            className="bg-green-200 text-dark-500 text-lg mb-4"
          >
            zoom-out
          </Button>
        )}
        {!zoomable && (
          <Button
            onClick={onEnlargeable}
            className="bg-green-200 text-dark-500 text-lg mb-4"
          >
            zoom-in
          </Button>
        )}
      </div>
      <div>
        <Button
          onClick={onDeleteClik}
          className="bg-pink-200 text-red-500 text-lg mb-4"
        >
          delete element
        </Button>
      </div>
      <Collapse className="w-12/12" defaultActiveKey={[1, 2, 3]}>
        {selectNum !== -1 && (
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
          </CollapsePanel>
        )}
        {spiritCanvas?.chosenType === 'Image' && (
          <CollapsePanel header="filters" key="2">
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
                    <Button
                      className="w-5/12 h-5/12"
                      onClick={resetValue(cur.desc)}
                    >
                      reset
                    </Button>
                  </div>
                )
              })}
            </div>
          </CollapsePanel>
        )}
        {spiritCanvas?.chosenType === 'Mark' && (
          <CollapsePanel header="Mark" key="3">
            {color.children.map((cur, index) => {
              return (
                <div key={index}>
                  <div className="w-7/12 h-5/12 mb-3">
                    <Input
                      type="range"
                      step={cur.props.step}
                      min={cur.props.range.min}
                      max={cur.props.range.max}
                      defaultValue={cur.props.value}
                      //onInput={onChangeInput(cur.desc)}
                      //onMouseUp={commitToHistory}
                      //onMouseDown={storeOld(cur.desc)}
                      id={cur.desc}
                    />
                    <label htmlFor={cur.desc}>{cur.desc}</label>
                  </div>
                </div>
              )
            })}
          </CollapsePanel>
        )}
      </Collapse>
    </div>
  )
}
//<div>
//<label htmlFor="">color adjust</label>
//<input type="color" onChange={onColorChange('uColor')} onMouseDown={storeOld('uColor')} />

//</div>
