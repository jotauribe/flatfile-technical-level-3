import React, { useState } from 'react'
import { useDrop } from 'react-dnd'
import { IoIosAdd } from 'react-icons/io'

import Card from '../card'
import SectionI from '../../types/section'

import {
  AddCardButtonButton,
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

export type SectionProps = React.HTMLAttributes<HTMLDivElement> & {
  section: SectionI
  onDropInCard: Function
  onDropInSection: Function
  onCardSubmit: Function
}

const Section: React.FC<SectionProps> = ({
  section,
  onDropInCard,
  onDropInSection,
  onCardSubmit
}) => {
  const [isTempCardActive, setIsTempCardActive] = useState(false)
  const [cardText, setCardText] = useState('')
  const { id, title, cards = [] } = section
  const [, drop] = useDrop(
    () => ({
      accept: 'CARD',
      drop: (card, monitor) => (!monitor.didDrop() ? onDropInSection(card, section) : undefined)
    }),
    [section, onDropInSection]
  )

  return (
    <Wrapper ref={drop} className='section-root-wrapper' data-testid='section'>
      <WrappedSection className='section-wrapper'>
        <SectionHeader id={`section-header-${section.id}`} className='section-header'>
          <SectionTitle>{title}</SectionTitle>
        </SectionHeader>
        <CardsContainer
          className='section-card-container'
          aria-labelledby={`section-header-${section.id}`}
        >
          {!!cards?.length &&
            cards.map((card: CardI) => {
              return (
                <Card
                  draggable
                  key={card.id}
                  role='listitem'
                  card={card}
                  section={section}
                  onDrop={onDropInCard}
                />
              )
            })}
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
          <AddCardButtonButton onClick={() => setIsTempCardActive(true)}>
            <IoIosAdd size={20} color='rgb(107, 119, 140)' />
            Add another card
          </AddCardButtonButton>
        )}
      </WrappedSection>
    </Wrapper>
  )
}

export default Section
