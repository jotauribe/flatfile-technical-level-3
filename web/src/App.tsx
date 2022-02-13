import React from 'react'
import styled from 'styled-components'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'

import Section from './components/section'
import SectionI from './types/section'

import './App.css'
import useSections from './hooks/useSections'

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
  const { sections, moveCardToSection, addNewCardToSection } = useSections()

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result
    if (!destination?.droppableId || destination?.droppableId === source.droppableId) return
    moveCardToSection(Number(destination?.droppableId), Number(draggableId))
  }

  return (
    <BoardContainer>
      <DragDropContext onDragEnd={onDragEnd}>
        {sections.map((section: SectionI) => {
          return (
            <Droppable key={section.id} droppableId={String(section.id)}>
              {(provided) => (
                <Section
                  section={section}
                  onCardSubmit={addNewCardToSection}
                  innerRef={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {provided.placeholder}
                </Section>
              )}
            </Droppable>
          )
        })}
      </DragDropContext>
    </BoardContainer>
  )
}

export default App
