import styled from "styled-components"

export const WindowOverlay = styled.div`
  background-color: #000000a3;
  height: 100vh;
  width: 100vw;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  display: flex;
  justify-content: center;
  padding: 48px;
`

export const ModalContainer = styled.div`
  background-color: white;
  height: 20%;
  width: 400px;
  padding: 12px;
`

export const ModalHeader = styled.header`
  display: flex;
  align-items: center;
`

export const ModalTitle = styled.h1`
  margin: 0;
  font-size: 20px;
  display: flex;
  align-items: center;
  & > * {
    margin-right: 8px;
  }
`

export const ModalSubTitle = styled.div`
  margin: 0;
  font-size: 14px;
  display: block;
  display: flex;
  padding-left: 32px;
  align-items: center;
  & > * {
    margin-right: 8px;
  }
`

export const CloseButton = styled.button`
  border: 0;
  padding: 0;
  max-height: 32px;
  border-radius: 50%;
  background-color: white;
  margin-left: auto;
  :hover {
    background-color: rgb(244, 245, 255);
  }
`