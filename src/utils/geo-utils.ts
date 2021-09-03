export const createRectangle = () => {
  const basePosition = [-1, -1, 0, -1, 1, 0, 1, 1, 0, 1, -1, 0]
  const position = basePosition.map((pos) => pos * 0.1)
  const texCoord = [0, 0, 0, 1, 1, 1, 1, 0]
  const index = {
    array: [0, 1, 2, 0, 2, 3],
  }
  return {
    vertex: {
      position:basePosition,
      texCoord,
    },
    index,
  }
}
