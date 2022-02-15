import { indexBy } from '../../utils'
import CardI, { NormalizedCard } from '../../types/card'
import SectionI, { NormalizedSection } from '../../types/section'

export type NormalizedData<T> = { byId: Record<number, T>; allIds: number[] }
export type CardsMap = Record<CardI['id'], NormalizedCard>
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
