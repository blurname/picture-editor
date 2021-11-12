import { Button, Collapse, Input } from 'antd'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'
import React, { ChangeEvent, useContext, useEffect, useState } from 'react'
import { globalContext } from '../../context'
import { EAffine } from './EAffine'
import { EImage } from './EImage'
import { EMark } from './EMark'

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
  const onDeleteClick = () => {
    spiritCanvas.deleteElement(selectNum)
    setAdjustNum(adjustNum + 1)
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
    if (desc === 'rotate' || desc === 'scale' || desc === 'layer') {
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
      <Collapse className="w-12/12" defaultActiveKey={[1, 2, 3, 4]}>
        {selectNum > 0 && (
          <CollapsePanel header="shaping" key="1">
            <EAffine
              setValue={setValue}
              setOld={setOld}
              setDesc={setDesc}
              resetValue={resetValue}
              commitToHistory={commitToHistory}
              storeOld={storeOld}
              onChangeInput={onChangeInput}
            />
          </CollapsePanel>
        )}
        {spiritCanvas?.chosenType === 'Image' && (
          <CollapsePanel header="filters" key="2">
            <EImage
              resetValue={resetValue}
              commitToHistory={commitToHistory}
              storeOld={storeOld}
              onChangeInput={onChangeInput}
            />
          </CollapsePanel>
        )}
        {spiritCanvas?.chosenType === 'Mark' && (
          <CollapsePanel header="Mark" key="3">
            <EMark
              setValue={setValue}
              commitToHistory={commitToHistory}
              storeOld={storeOld}
              onChangeInput={onChangeInput}
            />
          </CollapsePanel>
        )}
        {spiritCanvas?.chosenType === 'Background' && (
          <CollapsePanel header="Background" key="4"></CollapsePanel>
        )}
      </Collapse>
    </div>
  )
}
