type ModalActions = {
  type: 'trans' | 'scale' | 'rotate'
  id: number
}
type ColorActions = {}
type DeleteActions = {
  type: 'isDelected'
  id: number
}

type LinearActions = {
  type: SpiritActionType
  id: number
  from: Partial<SpiritActionType>
  to: Partial<SpiritActionType>
}
type SpiritActionType = ImageProps | MarkProps | Model
class Histories {
  histories: LinearActions[]
  tail: number
  constructor() {}
  commit<
    T extends SpiritActionType,
    U extends Partial<T>,
    V extends U,
  >(spirit: T, from: U, to: V) {
    const operation: LinearActions = {
      type: spirit,
      id: 1,
      from: from,
      to: to,
    }
		this.histories.push(operation)
  }
  revert() {}
}

