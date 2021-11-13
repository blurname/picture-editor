import { Button } from 'antd'
import React, { ChangeEvent, Dispatch, SetStateAction, useContext } from 'react'
import { globalContext } from '../../context'
import { backCellShader, backImageShader } from '../../filter/shader'
import { backCellUniform, backImageUniform } from '../../filter/uniform'
import { imgUrl } from '../Components/Img'
//type Props = {
	//commitToHistory: () => void
	//storeOld: (desc: string) => () => void
	//setValue: Dispatch<SetStateAction<any>>
	//onChangeInput: (desc: string) => (e: ChangeEvent<HTMLInputElement>) => void
//}

export const backShader = {
  cell: backCellShader,
}
export const backUniforms = {
  cell: backCellUniform,
}
export function EBack() {
  const { spiritCanvas, setAdjustNum, adjustNum } = useContext(globalContext)

  return (
    <>
      <h1>Background</h1>
    </>
  )
}
