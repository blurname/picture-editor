import { Button, Input } from 'antd'
import React, {
  ChangeEvent,
  Dispatch,
  MouseEventHandler,
  SetStateAction,
  useContext,
} from 'react'
import { globalContext } from '../../context'
import { backCellShader, backImageShader } from '../../filter/shader'
import { backCellUniform, backImageUniform } from '../../filter/uniform'
import { loadImage } from '../../store/globalCanvas'
import {
  backImageSpirit,
  backNonImageSpirit,
  MarkSpirit,
} from '../../utils/gl-uitls'
import { imgUrl } from '../Components/Img'
import { editorSchema } from './editorSchema'
type Props = {
  commitToHistory: () => void
  storeOld: (desc: string) => () => void
  setValue: Dispatch<SetStateAction<any>>
  onChangeInput: (desc: string) => (e: ChangeEvent<HTMLInputElement>) => void
}

export function EMark(props: Props) {
  const { commitToHistory, storeOld, setValue } = props

  const backShader = {
    cell: backCellShader,
    image: backImageShader,
  }
  const backUniforms = {
    cell: backCellUniform,
    image: backImageUniform,
  }
  const { spiritCanvas, setAdjustNum, adjustNum } = useContext(globalContext)

  const onChangeBackNonImage = (shaderName: string) => () => {
    const shader = backShader[shaderName]
    const uniform = backUniforms[shaderName]
    const back = new backNonImageSpirit(spiritCanvas.canvas3d, 0)
    back.setBackground(shader, uniform)
    spiritCanvas.spirits[0] = back
    setAdjustNum(adjustNum + 1)
  }
  const onChangeBackImage = (imgUrl: string) => async () => {
    //const shader = backShader['image']
    //const uniform = backUniforms['image']
    const image = (await loadImage(imgUrl)) as HTMLImageElement
    const back = new backImageSpirit(spiritCanvas.canvas3d, 0, image)
    //back.setBackground(shader, uniform as any)
    //back.setImage(imgUrl)
    spiritCanvas.spirits[0] = back
    setAdjustNum(adjustNum + 1)
  }
  return (
    <>
      <h1>Background</h1>
      <Button onClick={onChangeBackNonImage('cell')}>cell_back</Button>
      <Button onClick={onChangeBackImage(imgUrl + 'back1.jpg')}>
        image_back
      </Button>
    </>
  )
}
