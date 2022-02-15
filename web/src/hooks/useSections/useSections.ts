import { useState, useEffect } from 'react'
import axios from 'axios'

import CardI from '../../types/card'
import SectionI from '../../types/section'
import { normalize, NormalizedData, NormalizerResult } from './useSections.utils'
import { clone } from '../../utils'

type NormalizedCards = NormalizerResult['cards']
type NormalizedSections = NormalizerResult['sections']

const initial = { byId: {}, allIds: [] } as NormalizedData<any>

const useSections = () => {
  const [cards, setCards] = useState<NormalizedCards>(initial)
  const [sections, setSections] = useState<NormalizedSections>(initial)

  const removeCardFromSection = (sectionId: number, cardId: number) => {
    const { cards, ...section } = clone(sections.byId[sectionId])
    return { ...section, cards: cards.filter((id) => id !== cardId) }
  }

  const addCardToSection = (destinationSectionId: number, card: CardI) => {
    const { cards, ...section } = clone(sections.byId[destinationSectionId])
    return { ...section, cards: [...cards, card.id] }
  }

  const updateCardSection = (destinationSectionId: number, card: CardI) => {
    const subtasks = card.subtasks?.map((s) => ({ ...s, sectionId: destinationSectionId }))
    return { ...card, subtasks, sectionId: destinationSectionId }
  }

  const moveCardToSection = (destinationSectionId: number, originalCard: CardI) => {
    if (!originalCard) return

    const cardId = originalCard.id
    const sectionsById = clone(sections.byId)
    const updatedCard =  updateCardSection(destinationSectionId, originalCard)
    
    sectionsById[destinationSectionId] = addCardToSection(destinationSectionId, updatedCard)
    sectionsById[originalCard.sectionId] = removeCardFromSection(originalCard.sectionId, cardId)

    setCards({ ...cards, byId: { ...cards.byId, [cardId]: updatedCard } })
    setSections({ ...sections, byId: sectionsById })
    return axios.patch('http://localhost:3001/cards', updatedCard)
  }

  const addNewCardToSection = async (sectionId: number, title: string) => {
    const body = { sectionId, title }
    const { data } = await axios.post('http://localhost:3001/cards', body)

    const sectionsById = clone(sections.byId)
    sectionsById[sectionId] = addCardToSection(sectionId, data)

    setCards({ ...cards, byId: { ...cards.byId, [data.id]: data } })
    setSections({ ...sections, byId: sectionsById })
  }

  const addSubtaskToCard = async (parentCardId: number, originalCard: CardI) => {
    const { sectionId: destinationSectionId } = cards.byId[parentCardId]
    const subtask = { ...originalCard, parentId: parentCardId, sectionId: destinationSectionId }

    const cardsById = clone(cards.byId)
    const sectionsById = clone(sections.byId)
    cardsById[parentCardId].subtasks = [...cardsById[parentCardId].subtasks, subtask]
    sectionsById[originalCard.sectionId] = removeCardFromSection(
      originalCard.sectionId,
      originalCard.id
    )

    setCards({ ...cards, byId: cardsById })
    setSections({ ...sections, byId: sectionsById })
    return axios.patch('http://localhost:3001/cards', cardsById[parentCardId])
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

  return {
    moveCardToSection,
    addNewCardToSection,
    addSubtaskToCard,
    sections: sections.allIds.map((sectionId) => {
      const section = sections.byId[sectionId]
      return { ...section, cards: section.cards.map((cardId) => cards.byId[cardId]) }
    })
  }
}

export default useSections
