export interface ItemPosition {
  x: number
  y: number
  size: number
}

export interface Item {
  id: number
  type: string
  groupId: number
  x: number
  y: number
  size: number
}

export interface Group {
  id: number
  x: number
  y: number
  width: number
  height: number
  items: number[]
  itemPositions: ItemPosition[]
  isSingle: boolean
}

export interface MergeAnimation {
  targetGroup: Group
  sourceGroups: Group[]
  startTime: number
  duration: number
}
