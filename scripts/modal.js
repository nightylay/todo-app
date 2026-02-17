import { selectors } from "./selectors.js";

export const initModal = () => {
  const infoButton = document.querySelector(selectors.infoButton)
  const modalWindow = document.querySelector(selectors.modalWindow)

  infoButton.addEventListener('click', () => {
    modalWindow.showModal()
  })
}