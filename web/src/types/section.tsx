import CardI from './card'

export default interface SectionI {
  id: number
  title: string
  cards: CardI[]
}

export type NormalizedSection = Omit<SectionI, 'cards'> & { cards: number[] }
