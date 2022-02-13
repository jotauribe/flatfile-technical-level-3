import { indexBy } from '../../utils'
import CardI from '../../types/card'
import SectionI from '../../types/section'

type NormalizedSection = Omit<SectionI, 'cards'> & { cards: number[] }
export type NormalizedData<T> = { byId: Record<number, T>; allIds: number[] }
export type NormalizerResult = {
  cards: NormalizedData<CardI>
  sections: NormalizedData<NormalizedSection>
}
export type Normalizer = (sections: SectionI[]) => NormalizerResult

export const mapToCardIds = (cards: CardI[]) => cards.map((c) => c.id)

export const createNormalizedCardsData = (sections: SectionI[]) => {
  const cardIds = sections.map((section) => mapToCardIds(section.cards)).flat()
  const indexedByIdCards = sections.reduce(
    (cards, section) => ({ ...cards, ...indexBy('id', section.cards) }),
    {} as Record<CardI['id'], CardI>
  )

  return { byId: indexedByIdCards, allIds: cardIds }
}

export const normalize: Normalizer = (sections) => {
  const sectionIds = sections.map((section) => section.id)
  const sectionsWithCardIds = sections.map((s) => ({ ...s, cards: mapToCardIds(s.cards) }))
  const indexedByIdSections = indexBy('id', sectionsWithCardIds)
  const cards = createNormalizedCardsData(sections)

  return {
    cards,
    sections: { byId: indexedByIdSections, allIds: sectionIds }
  }
}
