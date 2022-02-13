import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'

import SectionI from '../../types/section'
import { normalize, NormalizedData, NormalizerResult } from './useSections.utils'
import { clone } from '../../utils'

type NormalizedCards = NormalizerResult['cards']
type NormalizedSections = NormalizerResult['sections']

const initial = { byId: {}, allIds: [] } as NormalizedData<any>

const useSections = () => {
  const [cards, setCards] = useState<NormalizedCards>(initial)
  const [sections, setSections] = useState<NormalizedSections>(initial)

  const denormalizedSections: SectionI[] = useMemo(
    () =>
      sections.allIds.map((sectionId) => {
        const section = sections.byId[sectionId]
        return { ...section, cards: section.cards.map((cardId) => cards.byId[cardId]) }
      }),
    [cards, sections]
  )

  const moveCardToSection = (destinationSectionId: number, cardId: number) => {
    const originalCard = cards.byId[cardId]

    if (!originalCard) return

    const sectionsById = clone(sections.byId)
    const sourceSection = sectionsById[originalCard.sectionId]
    const destinationSection = sectionsById[destinationSectionId]
    const updatedCard = { ...originalCard, sectionId: destinationSectionId }

    destinationSection.cards = [...sections.byId[destinationSectionId].cards, cardId]
    sourceSection.cards = sections.byId[sourceSection.id].cards.filter((id) => id !== cardId)

    setCards({ ...cards, byId: { ...cards.byId, [cardId]: updatedCard } })
    setSections({ ...sections, byId: sectionsById })
    return axios.patch('http://localhost:3001/cards', updatedCard)
  }

  const addNewCardToSection = async (sectionId: number, title: string) => {
    const body = { sectionId, title }
    const { data } = await axios.post('http://localhost:3001/cards', body)

    const sectionsById = clone(sections.byId)
    const destinationSection = sectionsById[sectionId]
    destinationSection.cards = [...destinationSection.cards, data.id]

    setCards({ ...cards, byId: { ...cards.byId, [data.id]: data } })
    setSections({ ...sections, byId: sectionsById })
  }

  useEffect(() => {
    axios.get('http://localhost:3001/sections').then(({ data }) => {
      // Section order is determined by ID so sort by ID
      const byId = (a: SectionI, b: SectionI) => a.id - b.id
      const { cards, sections } = normalize(data.sort(byId))
      setCards(cards)
      setSections(sections)
    })
  }, [])

  return { sections: denormalizedSections, moveCardToSection, addNewCardToSection }
}

export default useSections
