import styled from 'styled-components'

export const CardContainer = styled.div`
  border-radius: 3px;
  border-bottom: 1px solid #ccc;
  background-color: #fff;
  cursor: pointer;
  min-width: 230px;
  :hover {
    background-color: rgb(244, 245, 255);
    color: #172b4d;
  }
`

export const Badge = styled.span`
  display: flex;
  padding: 4px 0;
  font-size: 12px;
  gap: 4px;
`

export const ModalSubTitle = styled.h1`
  display: flex;
  font-size: 16px;
  & > * {
      margin-right: 8px;
  }
`

export const CardDropZone = styled.div`
  padding: 8px;
`
