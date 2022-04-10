import { Button, Input } from 'antd'
import React, {
  ChangeEvent,
  Dispatch,
  MouseEventHandler,
  SetStateAction,
  useContext,
	useEffect,
	useState,
} from 'react'
import { globalContext } from '../../context'
import { BeamSpirit, MarkSpirit } from '../../utils/gl-uitls'
import { editorSchema } from './editorSchema'
type Props = {
  commitToHistory: () => void
  storeOld: (desc: string) => () => void
  setValue: Dispatch<SetStateAction<any>>
  onChangeInput: (desc: string) => (e: ChangeEvent<HTMLInputElement>) => void
}
export function EMark(props: Props) {
  const { commitToHistory, storeOld, setValue } = props

  const { spiritCanvas, selectNum, setAdjustNum, adjustNum } =
    useContext(globalContext)
  enum RGB {
    R = 0,
    G,
    B,
  }

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
  const onChangeRGB =
    <T extends Partial<keyof typeof RGB>>(rgb: T, cdesc: string) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      let mark = spiritCanvas.spirits.find(s=>s.getId()===selectNum) as MarkSpirit
      let color = mark.getColor().map((c) => c)
      const index = RGB[rgb] as number
      color[index] = parseInt(e.target.value) / 255.0
      mark.updateUniqueProps({ [cdesc]: color })
      setAdjustNum(adjustNum + 1)
      setValue(color)
    }

    const [curSpirit, setCurSpirit] = useState<BeamSpirit>(spiritCanvas.spirits.find(spirit=>spirit.getId()===selectNum));
    useEffect(() => {
      setCurSpirit(spiritCanvas.spirits.find(spirit=>spirit.getId()===selectNum))
      }, [selectNum]);
  const color = editorSchema.children[2]
  return (
    <>
      {color.children.map((cur, index) => {
        return (
          <div key={index}>
            <div className="w-7/12 h-5/12 mb-3">
              <Input
                type="range"
                step={cur.props.step}
                min={cur.props.range.min}
                max={cur.props.range.max}
                value={curSpirit.getUniqueProps()['uColor'][RGB[cur.desc]]*255}
                onInput={onChangeRGB(cur.desc, 'uColor')}
                onMouseUp={commitToHistory}
                onMouseDown={storeOld('uColor')}
                id={cur.desc}
              />
              <label htmlFor={cur.desc}>{cur.desc}</label>
            </div>
          </div>
        )
      })}
    </>
  )
}
