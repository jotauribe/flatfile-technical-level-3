import styled from 'styled-components'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import Section from './components/section'
import SectionI from './types/section'
import CardI from './types/card'
import useSections from './hooks/useSections'

import './App.css'

export const BoardContainer = styled.div`
  background-color: rgb(49, 121, 186);
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  color: #393939;
  overflow-y: hidden;
  overflow-x: auto;
  position: absolute;
  padding: 5px;
  align-items: flex-start;
`

function App() {
  const { sections, moveCardToSection, addNewCardToSection, addSubtaskToCard } = useSections()

  const moveToSection = (card: CardI, destination: SectionI) => {
    if (destination?.id === card.sectionId) return
    moveCardToSection(destination.id, card)
  }

  const moveToCard = (parentCardId: number, card: CardI) => {
    if (parentCardId === card.parentId || parentCardId === card.id) return
    addSubtaskToCard(parentCardId, card)
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <BoardContainer>
        {sections.map((section: SectionI) => {
          return (
            <Section
              key={section.id}
              section={section}
              onDropInCard={moveToCard}
              onDropInSection={moveToSection}
              onCardSubmit={addNewCardToSection}
            ></Section>
          )
        })}
      </BoardContainer>
    </DndProvider>
  )
}

export default App
