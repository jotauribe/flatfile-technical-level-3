import styled from 'styled-components'

export const Wrapper = styled.div`
  display: inline-block;
  height: 100%;
  vertical-align: top;
  white-space: normal;
`

export const WrappedSection = styled.section`
  width: 280px;
  background-color: #e3e3e3;
  border-radius: 3px;
  margin: 5px 5px;
  padding: 8px;
  display: inline-flex;
  height: auto;
  max-height: 90%;
  flex-direction: column;
`

export const SectionHeader = styled.header`
  display: flex;
  padding: 2px 8px 10px 8px;
  flex-direction: row;
`

export const SectionTitle = styled.h1`
  margin: 0;
  font-weight: bold;
  font-size: 14px;
  line-height: 18px;
  cursor: grab;
  width: 70%;
`

export const CardsContainer = styled.ul`
  flex: 1;
  align-self: center; 
  max-height: 90vh;
  margin: 0;
  padding: 0;
  width: 100%;
  flex-direction: column;
  justify-content: space-between;

  & > * {
    margin-bottom: 8px;
    list-style-type: none;
  }
`

export const AddCardButtonButton = styled.button`
  display: flex;
  align-items: center;
  border: none;
  cursor: pointer;
  background-color: transparent;
  text-align: left;
  font-size: 14px;
  padding: 4px;
  :hover {
    background-color: rgba(9, 30, 66, 0.08);
    color: #172b4d;
  }
`

export const AddCardButtonSpan = styled.span`
  color: #5e6c84;
`

export const CardComposerDiv = styled.div``

export const ListCardComponent = styled.div`
  background-color: #fff;
  border-radius: 3px;
  box-shadow: 0 1px 0 rgba(9, 30, 66, 0.25);
  cursor: pointer;
  display: block;
  margin-bottom: 8px;
  max-width: 300px;
  min-height: 20px;
  position: relative;
  text-decoration: none;
  z-index: 0;
`

export const ListCardDetails = styled.div`
  overflow: hidden;
  padding: 6px 8px 2px;
  position: relative;
  z-index: 10;
`

export const ListCardTextArea = styled.textarea`
  overflow: hidden;
  overflow-wrap: break-word;
  resize: none;
  height: 54px;
  background: none;
  border: none;
  box-shadow: none;
  margin-bottom: 4px;
  max-height: 162px;
  min-height: 54px;
  padding: 0;
  width: 100%;
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  outline: none;
`

export const SubmitCardButtonDiv = styled.div`
  height: 32px;
`

export const SubmitCardButton = styled.input`
  background-color: #5aac44;
  box-shadow: none;
  border: none;
  color: #fff;
  height: 100%;
  cursor: pointer;
`
