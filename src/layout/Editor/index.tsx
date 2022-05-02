import { Button, Collapse } from 'antd'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'
import React, { ChangeEvent, useContext, useEffect, useState } from 'react'
import { globalContext } from '../../context'
import { useRemoteOperation } from '../../hooks/useRemoteOperation'
import { BeamSpirit } from '../../utils/gl-uitls'
import { EAffine } from './EAffine'
import { EBack } from './EBack'
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
    socket,
  } = useContext(globalContext)

  const [value, setValue] = useState({} as any)
  const [desc, setDesc] = useState('')
  const [old, setOld] = useState({} as any)
  const onDeleteClick = () => {
    spiritCanvas.deleteElement(selectNum)
    socket.emit('server-del',spiritCanvas.id, selectNum)
    setAdjustNum(adjustNum + 1)
  }
  const storeOld = (cdesc: string) => () => {
    const chosen = spiritCanvas.spirits.find(s=>s.getId()===selectNum)
    setDesc(cdesc)
    if (desc === 'rotate' || desc === 'scale') {
      setOld(chosen.getModel()[cdesc])
    } else {
      setOld(chosen.getUniqueProps()[cdesc])
    }
    console.log('descStoreOld:', chosen.getUniqueProps())
  }
  useEffect(() => {
    socket.on('client-del', async ( id: number) => {
      // if (type === 'Image') {
      //   spiritCanvas.addImage(element, id,true)
      // } else if (type === 'Mark') {
      //   spiritCanvas.addMark(element, id,true)
      // } else if (type === 'Mosaic') {
      //   spiritCanvas.addMosaic(element, id,true)
      // } else if (type === 'PointContainer') {
      //   const points = await getPoints(id)
      //     const pointSpirits = points.map((point) => (new PointSpirit(spiritCanvas.canvas3d, point)))
      //     console.log({ points })
      //     spiritCanvas.updateFromRemote(
      //       model.spiritType,
      //       model.model,
      //       pointSpirits as any,
      //       model.uniqueProps,
      //     )
      // }
      spiritCanvas.spirits = spiritCanvas.spirits.filter(s=>s.getId()!==id)
      spiritCanvas.guidLines = spiritCanvas.guidLines.filter((guidLine)=>guidLine.getId() !== id)
      // setCmpCount(id + 1)
      setAdjustNum(adjustNum + 1)
    })
  }, [])
  const onChangeInput =
    (desc: string, func?: (a: any, b: any) => void) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const curValue = parseFloat(e.target.value)
      if (func) {
        updateValue(desc, curValue, func)
      } else {
        updateValue(desc, curValue)
      }
    }

  const resetValue = (desc: string) => () => {
    updateValue(desc, 0.00001)
  }
  const updateValue = (
    desc: string,
    curValue: number,
    func?: (a: any, b: any) => void,
  ) => {
    let chosen = spiritCanvas.spirits.find(s=>s.getId()===selectNum)
    if (func) {
      func(desc, curValue)
    } else if (desc === 'rotate' || desc === 'scale') {
      chosen.updateModel({ [desc]: curValue })
    } else {
      chosen.updateUniqueProps({ [desc]: curValue })
    }
    setAdjustNum(adjustNum + 1)
    setValue(curValue)
  }
  const commitToHistory = () => {
    const chosen = spiritCanvas.spirits.find(s=>s.getId()===selectNum)
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
    if (desc === 'layer') {
      socket.emit(
        'server-editor',
        spiritCanvas.id,
        chosen.getId(),
        { [desc]: 1 - old },
        { [desc]: 1 - value },
      )
    } else {
      socket.emit(
        'server-editor',
        spiritCanvas.id,
        chosen.getId(),
        { [desc]: old },
        { [desc]: value },
      )
    }
    const emitToServer = () => {
      setTimeout(() => {
        // debugger
        const canvasId = spiritCanvas.id
        socket.emit("server-back",canvasId)
      }, 100)
    }
    if(chosen.getId()===0){
      emitToServer()
    }
    setAdjustNum(adjustNum + 1)
  }
  const onZoomable = () => {
    //appRef.current.style.cursor='zoom-in'
    setZoomable(!zoomable)
  }
  //const commitFromRemote = (modelOrUniq:any,o:any,n:any) => {

  //return
  //}
  useRemoteOperation(socket, operationHistory, adjustNum, setAdjustNum)

  return (
    <div className="flex-grow-0 w-50 bg-teal-50 object-right">
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
        {selectNum > 0 && spiritCanvas?.chosenType !== 'PointContainer' && (
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
        {spiritCanvas?.chosenType === 'BackNonImage' && (
          <CollapsePanel header="Background" key="4">
            <EBack
              setValue={setValue}
              commitToHistory={commitToHistory}
              storeOld={storeOld}
              onChangeInput={onChangeInput}
              socket={socket}
            />
          </CollapsePanel>
        )}
      </Collapse>
    </div>
  )
}
