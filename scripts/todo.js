import { setItemLocalStorage, getItemLocalStorage } from "./utils.js";

export const initTodo = () => {
  const selectors = {
    newTaskForm: '[data-js-todo-new-task-form]',
    newTaskInput: '[data-js-todo-new-task-input]',
    searchTaskForm: '[data-js-todo-search-task-form]',
    searchInput: '[data-js-todo-search-input]',
    todoFilter: '[data-js-todo-filter]',
    todoList: '[data-js-todo-list]',
    emptyScreen: '[data-js-todo-empty]',
    taskCheckbox: '[data-js-todo-checkbox]',
    taskLabel: '[data-js-todo-task-label]',
    taskInput: '[data-js-todo-task-input]',
    taskItem: '[data-js-todo-task-item]',
    editButton: '[data-js-todo-edit-button]',
    removeButton: '[data-js-todo-remove-button]',
  }

  const stateClasses = {
    isVisible: 'is-visible',
    isActive: 'is-active'
  }

  const createTaskFormElement = document.querySelector(selectors.newTaskForm)
  const createTaskInputElement = createTaskFormElement.querySelector(selectors.newTaskInput)
  const searchTaskFormElement = document.querySelector(selectors.searchTaskForm)
  const searchInputElement = searchTaskFormElement.querySelector(selectors.searchTaskForm)
  const filterElement = document.querySelector(selectors.todoFilter)
  const todoListElement = document.querySelector(selectors.todoList)
  const emptyScreenElement = document.querySelector(selectors.emptyScreen)

  let tasksArr = getItemLocalStorage() || []

  createTaskFormElement.addEventListener('submit', (e) => {
    e.preventDefault()
    const createTaskInputValue = createTaskInputElement.value.trim()
    if (createTaskInputValue) {
      const taskItem = {
        id: crypto.randomUUID(),
        text: createTaskInputValue,
        isCompleted: false,
      }
      tasksArr.push(taskItem)
      setItemLocalStorage(tasksArr)
      addTask()
      createTaskInputElement.value = ''
    }
  })

  const addTask = () => {
    todoListElement.innerHTML = ''
    toggleStateClasses()
    for (let task of tasksArr) {
      todoListElement.insertAdjacentHTML('beforeend', `  <li class="todo__item todo-item" data-js-todo-task-item>
                      <input class="todo-item__checkbox" ${task.isCompleted ? 'checked' : ''} id="${task.id}" type="checkbox" data-js-todo-checkbox />
                      <label class="todo-item__label" for="${task.id}" data-js-todo-task-label>${task.text}</label>
                      <button class="todo-item__button todo-item__button--edit" data-js-todo-edit-button>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M21.1739 6.812C21.7026 6.28342 21.9997 5.56647 21.9998 4.81885C21.9999 4.07124 21.703 3.35421 21.1744 2.8255C20.6459 2.29679 19.9289 1.99971 19.1813 1.99962C18.4337 1.99952 17.7166 2.29642 17.1879 2.825L3.84193 16.174C3.60975 16.4055 3.43805 16.6905 3.34193 17.004L2.02093 21.356C1.99509 21.4425 1.99314 21.5343 2.01529 21.6219C2.03743 21.7094 2.08285 21.7892 2.14673 21.853C2.21061 21.9168 2.29055 21.9621 2.37809 21.9841C2.46563 22.0061 2.55749 22.004 2.64393 21.978L6.99693 20.658C7.3101 20.5628 7.59511 20.3921 7.82693 20.161L21.1739 6.812Z"
                            stroke="black"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M15 5L19 9"
                            stroke="black"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </button>
                      <button class="todo-item__button todo-item__button--delete" data-js-todo-remove-button>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6"
                            stroke="black"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M3 6H21"
                            stroke="black"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6"
                            stroke="black"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </button>
                    </li>`)
    }
  }

  const removeTask = () => {
    todoListElement.addEventListener('click', (e) => {
      const currentRemoveButtonElement = e.target.closest(selectors.removeButton)
      if (!currentRemoveButtonElement) return
      const currentTaskElement = currentRemoveButtonElement.closest(selectors.taskItem)
      const currentCheckBoxElement = currentTaskElement.querySelector(selectors.taskCheckbox)

      tasksArr = tasksArr.filter((task) => task.id !== currentCheckBoxElement.id)
      setItemLocalStorage(tasksArr)
      addTask()
    })
  }

  const editTask = () => {
    todoListElement.addEventListener('click', (e) => {
      const currentCheckboxElement = e.target.closest(selectors.taskCheckbox)
      const currentEditButtonElement = e.target.closest(selectors.editButton)
      if (currentCheckboxElement) {
        toggleCheckbox(currentCheckboxElement)
      } else if (currentEditButtonElement) {
        editTaskLabel(currentEditButtonElement)
      } else {
        return
      }

    })
  }

  const toggleCheckbox = (currentCheckboxElement) => {
    tasksArr = tasksArr.map((task) => {
      if (task.id === currentCheckboxElement.id) {
        task.isCompleted = currentCheckboxElement.checked
      }
      return task
    })
    setItemLocalStorage(tasksArr)
    addTask()
  }

  let labelText = null

  const editTaskLabel = (currentEditButtonElement) => {
    const currentTaskElement = currentEditButtonElement.closest(selectors.taskItem)
    const currentTaskLabelElement = currentTaskElement.querySelector(selectors.taskLabel)
    const currentCheckboxElement = currentTaskElement.querySelector(selectors.taskCheckbox)
    const currentInputTaskElement = currentTaskElement.querySelector(selectors.taskInput)

    const setValueLabelTask = (inputElement) => {
      const inputValueTask = inputElement.value
      tasksArr = tasksArr.map((task) => {
        if (task.id === currentCheckboxElement.id) {
          task.text = inputValueTask
        }
        return task
      })
      currentTaskLabelElement.innerHTML = inputValueTask
      setItemLocalStorage(tasksArr)
      addTask()
    }

    if (currentInputTaskElement) {
      setValueLabelTask(currentInputTaskElement)
    } else {
      const activeInputTask = todoListElement.querySelector(selectors.taskInput)

      if (!labelText) {
        labelText = currentTaskLabelElement.textContent
      }


      if (activeInputTask) {
        const labelTask = activeInputTask.closest(selectors.taskLabel)
        labelTask.innerHTML = labelText
        labelText = null
      }

      const inputTaskElement = `<input class="todo-item__input" type="text" data-js-todo-task-input value="${currentTaskLabelElement.textContent}" />`
      currentTaskLabelElement.innerHTML = inputTaskElement
      const currentInputTask = currentTaskElement.querySelector(selectors.taskInput)
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          setValueLabelTask(currentInputTask)
        }
      })
      currentInputTask.focus()
      currentInputTask.setSelectionRange(currentInputTask.value.length, currentInputTask.value.length)
    }
  }

  const toggleStateClasses = () => {
    if (tasksArr.length !== 0) {
      emptyScreenElement.classList.remove(stateClasses.isVisible)
      filterElement.classList.add(stateClasses.isVisible)
    } else {
      emptyScreenElement.classList.add(stateClasses.isVisible)
      filterElement.classList.remove(stateClasses.isVisible)
    }
  }

  editTask()
  removeTask()
  addTask()
  toggleStateClasses()
}
