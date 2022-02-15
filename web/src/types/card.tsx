export default interface CardI {
  id: number
  title: string
  parentId: number | null
  sectionId: number
  subtasks: CardI[]
}

export type NormalizedCard = Omit<CardI, 'subtasks'> & { subtasks: number[] }
