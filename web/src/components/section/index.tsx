import React, { useState } from 'react'
import { Draggable } from 'react-beautiful-dnd'

import Card from '../card'
import SectionI from '../../types/section'

import {
  AddCardButtonDiv,
  AddCardButtonSpan,
  CardComposerDiv,
  CardsContainer,
  ListCardComponent,
  ListCardDetails,
  ListCardTextArea,
  SectionHeader,
  SectionTitle,
  SubmitCardButton,
  SubmitCardButtonDiv,
  WrappedSection,
  Wrapper
} from './styled-components'
import CardI from '../../types/card'

type SectionProps = {
  section: SectionI
  onCardSubmit: Function
  innerRef: (element: HTMLElement | null) => any
}

const Section: React.FC<SectionProps> = ({
  children, 
  innerRef,
  section: { id, title, cards },
  onCardSubmit,
  ...droppableProps
}) => {
  const [isTempCardActive, setIsTempCardActive] = useState(false)
  const [cardText, setCardText] = useState('')

  return (
    <Wrapper className='section-root-wrapper'>
      <WrappedSection className='section-wrapper'>
        <SectionHeader className='section-header'>
          <SectionTitle>{title}</SectionTitle>
        </SectionHeader>
        <CardsContainer ref={innerRef} {...droppableProps} className='section-card-container'>
          {cards?.length &&
            cards.map((card: CardI, index: number) => {
              return (
                <Draggable key={card.id} index={index} draggableId={String(card.id)}>
                  {(provided) => (
                    <Card
                      key={card.id}
                      card={card}
                      innerRef={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    ></Card>
                  )}
                </Draggable>
              )
            })}
            {children}
        </CardsContainer>
        {isTempCardActive ? (
          <CardComposerDiv>
            <ListCardComponent>
              <ListCardDetails>
                <ListCardTextArea
                  placeholder='Enter a title for the new card'
                  onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                    setCardText(e.target.value)
                  }
                />
              </ListCardDetails>
            </ListCardComponent>
            <SubmitCardButtonDiv>
              <SubmitCardButton
                type='button'
                value='Add card'
                onClick={(e: React.MouseEvent<HTMLElement>) => {
                  e.preventDefault()

                  if (cardText) {
                    onCardSubmit(id, cardText)
                  }

                  setIsTempCardActive(false)
                }}
              />
            </SubmitCardButtonDiv>
          </CardComposerDiv>
        ) : (
          <AddCardButtonDiv onClick={() => setIsTempCardActive(true)}>
            <AddCardButtonSpan>Add another card</AddCardButtonSpan>
          </AddCardButtonDiv>
        )}
      </WrappedSection>
    </Wrapper>
  )
}

export default Section
