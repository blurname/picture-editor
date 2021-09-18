
export const handleOnMouseUp = (e: MouseEvent) => {
    e.preventDefault()
    if (preCursor !== undefined) {
      const distance = getCursorMovDistance(preCursor, e, canvas)
      //console.log(maxZOffset)
      //images[curImage].zOffset = maxZOffset
      images[curImage].updatePosition(distance)
			spiritCanvas.updateGuidRect(images[curImage].getGuidRect(), images[curImage].getId())

      setSelectNum(curImage)
      //setMaxZOffset(maxZOffset - 0.000001)
      for (let i = 0; i < images.length; i++) {
        images[i].render()
        if (curImage === i) {
          preCursor = e
          drawRectBorder(canvas2dRef.current, images[i].position)
          canvas3dRef.current.style.cursor = 'default'
        }
      }
      spiritCanvas.renderAllLine()
    }
  }
