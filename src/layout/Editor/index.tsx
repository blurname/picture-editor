import { Button, Collapse, Input, Slider } from 'antd'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'
import React, { ChangeEvent, useContext, useEffect, useState } from 'react'
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

  //const onColorChange =
    //(desc: string) => (e: ChangeEvent<HTMLInputElement>) => {
      //const hex: string = e.target.value
      //const r = parseInt('0x' + hex.slice(1, 3)) / 255.0
      //const g = parseInt('0x' + hex.slice(3, 5)) / 255.0
      //const b = parseInt('0x' + hex.slice(5)) / 255.0
      //const color = [r, g, b, 1]
      //let mark = spiritCanvas.spirits[selectNum] as MarkSpirit
      //mark.updateUniform(desc, color)
      //operationHistory.commit(
        //mark.getUniqueProps() as MarkProps,
        //{ [desc]: old },
        //{ [desc]: color },
        //'UniqueProps',
      //)
      //setAdjustNum(adjustNum + 1)
    //}
  //type RGB = 'R'|'G'|'B'
  enum RGB {
    R =0,
    G,
    B,
  }
  const onChangeRGB = <T extends Partial<keyof typeof RGB>>(rgb: T,cdesc:string)=>(e: ChangeEvent<HTMLInputElement>) => {
    let mark = spiritCanvas.spirits[selectNum] as MarkSpirit
		let color = mark.getColor().map((c) => c)
		const index = RGB[rgb] as number
		color[index]=parseInt(e.target.value)/255.0
    mark.updateUniqueProps({ [cdesc]: color })
		setAdjustNum(adjustNum + 1)
    setValue(color)
  }

  const onDeleteClick = () => {
    spiritCanvas.deleteElement(selectNum)
    setAdjustNum(adjustNum + 1)
  }

  const onLayerChange = (value: number) => {
	//console.log('layerold',spiritCanvas.spirits[selectNum].getModel()])
		setOld(spiritCanvas.spirits[selectNum].getModel()['layer'])
    spiritCanvas.spirits[selectNum].updateModel({'layer':1-value})
		setValue(value)
		setDesc('layer')
  }
	const afterLayerChage = () => {
		commitToHistory()
	}

  const storeOld = (cdesc: string) => () => {
    const chosen = spiritCanvas.spirits[selectNum] 
		setDesc(cdesc)
    if (desc === 'rotate' || desc === 'scale') {
      setOld(chosen.getModel()[cdesc])
    } else {
      setOld(chosen.getUniqueProps()[cdesc])
    }
		console.log('descStoreOld:', chosen.getUniqueProps())
  }
	//useEffect(() => {
		//console.log('ddesc',desc)
	//}, [desc]);
  const onChangeInput =
    (desc: string) => (e: ChangeEvent<HTMLInputElement>) => {
      const curValue = parseFloat(e.target.value)
      updateValue(desc, curValue)
    }

  const resetValue = (desc: string) => () => {
    updateValue(desc, 0.00001)
  }
  const updateValue = (desc: string, curValue: number) => {
    let chosen = spiritCanvas.spirits[selectNum]
    if (desc === 'rotate' || desc === 'scale') {
      chosen.updateModel({ [desc]: curValue })
    } else {
      chosen.updateUniqueProps({ [desc]: curValue })
    }
    setAdjustNum(adjustNum + 1)
    setValue(curValue)
    return
  }
  const commitToHistory = () => {
    const chosen = spiritCanvas.spirits[selectNum]
    if (desc === 'rotate' || desc === 'scale'||desc==='layer') {
      operationHistory.commit(
        chosen.getModel(),
        { [desc]: old },
        { [desc]: value },
        'Model',
      )
    } else {
      operationHistory.commit(
        chosen.getUniqueProps(),
        { [desc]: old },
        { [desc]: value },
        'UniqueProps',
      )
    }
    setAdjustNum(adjustNum + 1)
  }
  const shaping = editorSchema.children[0]
  const filters = editorSchema.children[1]
  const color = editorSchema.children[2]
  const onZoomable = () => {
    //appRef.current.style.cursor='zoom-in'
    setZoomable(!zoomable)
  }

  return (
    <div className="flex-grow-0 w-50 bg-blue-100 object-right">
      Editor
			<h1>desc:{desc}</h1>
			<h1>adj:{adjustNum}</h1>
      <div style={{ height: 50 }}>curCmpId:{selectNum}</div>
      <div>
        {zoomable && (
          <Button
            onClick={onZoomable}
            className="bg-green-200 text-dark-500 text-lg mb-4"
          >
            zoom-out
          </Button>
        )}
        {!zoomable && (
          <Button
            onClick={onZoomable}
            className="bg-green-200 text-dark-500 text-lg mb-4"
          >
            zoom-in
          </Button>
        )}
      </div>
      <div>
        <Button
          onClick={onDeleteClick}
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
											onInput={onChangeRGB(cur.desc,'uColor')}
											onMouseUp={commitToHistory}
											onMouseDown={storeOld('uColor')}
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
