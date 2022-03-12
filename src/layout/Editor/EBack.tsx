import { Input } from 'antd'
import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react'
import { globalContext } from '../../context'
import {
  backCellShader,
  backImageShader,
  backPureShader,
} from '../../filter/shader'
import { backCellUniform, backPureUniform } from '../../filter/uniform'
import {
  BackgroundSpirit,
  BackNonImageSpirit,
  BeamSpirit,
} from '../../utils/gl-uitls'
import { imgUrl } from '../Components/Img'
import { shaderSchema } from './editorSchema'
type Props = {
  commitToHistory: () => void
  storeOld: (desc: string) => () => void
  setValue: Dispatch<SetStateAction<any>>
  onChangeInput: (
    desc: string,
    func?: (a: any, b: any) => void,
  ) => (e: ChangeEvent<HTMLInputElement>) => void
}

export const backShader = {
  cell: backCellShader,
  pure: backPureShader,
}
export const backUniforms = {
  cell: backCellUniform,
  pure: backPureUniform,
}
export function EBack(props: Props) {
  const { spiritCanvas, selectNum } = useContext(globalContext)
  const { commitToHistory, storeOld, onChangeInput } = props
  enum RGB {
    R = 0,
    G,
    B,
  }
  const changeRGB = <T extends Partial<keyof typeof RGB>>(
    rgb: T,
    value: number,
  ) => {
    let mark = spiritCanvas.spirits[selectNum] as BackNonImageSpirit
    let color = mark.getUniqueProps()['uColor']
    const index = RGB[rgb] as number
    color[index] = value / 255.0
    mark.updateUniqueProps({ uColor: color })
    return
  }

  const [curSpirit, setCurSpirit] = useState<BackNonImageSpirit>(
    spiritCanvas.spirits[0] as BackNonImageSpirit,
  )
	//const shader = shaderSchema.children.filter((child) => {
		//if (child.desc === curSpirit.getShaderName()) {
			//console.log('backShader:', curSpirit.getShaderName())
			//console.log('backchild:', child)
			//return child
		//}
	//})
	const [shader, setShader] = useState(shaderSchema.children.filter((child) => {
		if (child.desc === curSpirit.getShaderName()) {
			console.log('backShader:', curSpirit.getShaderName())
			console.log('backchild:', child)
			return child
		}
	}));
  //useEffect(() => {
  //setCurSpirit(spiritCanvas.spirits[selectNum] as BackNonImageSpirit)
  //console.log('backchanged')
  //}, [selectNum]);
  //useEffect(() => {
  //setCurSpirit(spiritCanvas.spirits[selectNum] as BackNonImageSpirit)
  //console.log('backchanged')
  //}, [spiritCanvas.spirits[selectNum].getSpiritType]);
  useEffect(() => {
    if (spiritCanvas.spirits[selectNum].getSpiritType() === 'BackNonImage') {
      setCurSpirit(spiritCanvas.spirits[selectNum] as BackNonImageSpirit)
			setShader(
shaderSchema.children.filter((child) => {
		if (child.desc === (spiritCanvas.spirits[selectNum] as BackNonImageSpirit).getShaderName()) {
			console.log('backShader:', curSpirit.getShaderName())
			console.log('backchild:', child)
			return child
		}
	})
			)
    }else{
setShader([{children:[]} as any])
		}
    console.log('backchanged')
  }, [spiritCanvas.spirits[selectNum]])
  return (
    <>
      <h1>Background</h1>
      {shader[0].children.map((cur, index) => {
        if (cur.desc === 'R' || cur.desc === 'G' || cur.desc === 'B') {
          return (
            <div key={index}>
              <div className="w-7/12 h-5/12 mb-3">
                <Input
                  type="range"
                  step={cur.props.step}
                  min={cur.props.range.min}
                  max={cur.props.range.max}
                  value={
                    curSpirit.getUniqueProps()['uColor'][RGB[cur.desc]] * 255
                  }
                  onInput={onChangeInput(cur.desc, changeRGB)}
                  onMouseUp={commitToHistory}
                  onMouseDown={storeOld(cur.desc)}
                  id={cur.desc}
                />
                <label htmlFor={cur.desc}>{cur.desc}</label>
              </div>
            </div>
          )
        } else {
          return (
            <div key={index}>
              <div className="w-7/12 h-5/12 mb-3">
                <Input
                  type="range"
                  step={cur.props.step}
                  min={cur.props.range.min}
                  max={cur.props.range.max}
                  value={curSpirit.getUniqueProps()[cur.desc]}
                  onInput={onChangeInput(cur.desc)}
                  onMouseUp={commitToHistory}
                  onMouseDown={storeOld(cur.desc)}
                  id={cur.desc}
                />
                <label htmlFor={cur.desc}>{cur.desc}</label>
              </div>
            </div>
          )
        }
      })}
    </>
  )
}
