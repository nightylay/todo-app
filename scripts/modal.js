import { selectors } from "./selectors.js";

export const initModal = () => {
  const modalWindow = document.querySelector(selectors.modalWindow)
  const infoButton = document.querySelector(selectors.infoButton)
  const closeButton = document.querySelector(selectors.closeModalButton)

  const showModalWindow = () => {
    modalWindow.showModal()
    document.body.classList.add('scroll-lock')
  }

  const onAnimationEnd = () => {
    modalWindow.classList.remove("hide");
    document.body.classList.remove('scroll-lock')
    modalWindow.close();
    modalWindow.removeEventListener("animationend", onAnimationEnd)
  }

  const closeModalWindow = () => {
    modalWindow.classList.add('hide')
    modalWindow.addEventListener("animationend", onAnimationEnd)
  }

  const handleKeydown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeModalWindow();
    }
  }

  const handleCancel = (e) => {
    e.preventDefault();
    closeModalWindow();
  }

  const handleModalClick = (event) => {
    const modalRect = modalWindow.getBoundingClientRect();

    if (
      event.clientX < modalRect.left ||
      event.clientX > modalRect.right ||
      event.clientY < modalRect.top ||
      event.clientY > modalRect.bottom
    ) {
      modalWindow.classList.add('hide')
      modalWindow.addEventListener("animationend", onAnimationEnd)
    }
  };

  infoButton.addEventListener('click', showModalWindow)
  closeButton.addEventListener('click', closeModalWindow)
  modalWindow.addEventListener('keydown', handleKeydown)
  modalWindow.addEventListener("click", handleModalClick);
  modalWindow.addEventListener('cancel', handleCancel)
}