import { STORAGE_KEYS, setItemLocalStorage, getItemLocalStorage } from "./utils.js";
import { selectors } from "./selectors.js";

export const initTodo = () => {
  const stateClasses = {
    isVisible: 'is-visible',
    isActive: 'is-active'
  }

  const createTaskFormElement = document.querySelector(selectors.newTaskForm)
  const createTaskInputElement = createTaskFormElement.querySelector(selectors.newTaskInput)
  const searchInputElement = document.querySelector(selectors.searchInput)
  const filterElement = document.querySelector(selectors.todoFilter)
  const todoListElement = document.querySelector(selectors.todoList)
  const emptyScreenElement = document.querySelector(selectors.emptyScreen)
  const errorMessageElement = document.querySelector(selectors.errorMessage)
  const countUncompletedTasksElement = document.querySelector(selectors.countUncompletedTasks)

  let tasksArr = getItemLocalStorage(STORAGE_KEYS.TODOS) || []

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
      setItemLocalStorage(STORAGE_KEYS.TODOS, tasksArr)
      applyFilteredTasks()
      createTaskInputElement.value = ''
    }
  })

  const getIdTask = (childElement) => {
    return childElement.closest(selectors.taskItem).dataset.jsTaskId
  }

  const addTask = (todoArr) => {
    todoListElement.innerHTML = ''
    for (let task of todoArr) {
      todoListElement.insertAdjacentHTML('beforeend', `  <li class="todo__item todo-item" data-js-todo-task-item data-js-task-id="${task.id}">
                      <input class="todo-item__checkbox" ${task.isCompleted ? 'checked' : ''} type="checkbox" data-js-todo-checkbox />
                      <label class="todo-item__label" data-js-todo-task-label>${task.text}</label>
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
      const currentTaskId = getIdTask(currentRemoveButtonElement)
      tasksArr = tasksArr.filter((task) => task.id !== currentTaskId)
      setItemLocalStorage(STORAGE_KEYS.TODOS, tasksArr)
      applyFilteredTasks()
    })
  }

  const editTask = () => {
    let currentlyEditingTaskId = null

    todoListElement.addEventListener('click', (e) => {
      const currentCheckboxElement = e.target.closest(selectors.taskCheckbox)
      const currentEditButtonElement = e.target.closest(selectors.editButton)
      if (currentCheckboxElement) {
        toggleCheckbox(currentCheckboxElement)
      } else if (currentEditButtonElement) {
        const anyEditingInput = todoListElement.querySelector(selectors.taskInput)
        const taskId = getIdTask(currentEditButtonElement)
        if (anyEditingInput) {
          const isSameTask = (currentlyEditingTaskId === taskId);
          finishEditingTask(anyEditingInput)
          if (!isSameTask) {
            setTimeout(() => {
              const newEditButton = document.querySelector(`[data-js-task-id="${taskId}"]`)?.querySelector(selectors.editButton)

              if (newEditButton) {
                startEditingTask(newEditButton);
              }
            }, 0);
          }
        } else {
          startEditingTask(currentEditButtonElement)
        }
      }
    })

    todoListElement.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.matches(selectors.taskInput)) {
        finishEditingTask(e.target)
      } else if (e.key === 'Escape' && e.target.matches(selectors.taskInput)) {
        cancelEditingTask()
      }
    })

    const cancelEditingTask = () => {
      currentlyEditingTaskId = null
      applyFilteredTasks()
    }

    const startEditingTask = (currentEditButtonElement) => {
      const currentTaskElement = currentEditButtonElement.closest(selectors.taskItem)
      currentlyEditingTaskId = getIdTask(currentTaskElement)
      const currentTaskLabelElement = currentTaskElement.querySelector(selectors.taskLabel)
      const inputTaskElement = `<input class="todo-item__input" type="text" data-js-todo-task-input value="${currentTaskLabelElement.textContent}" />`
      currentTaskLabelElement.innerHTML = inputTaskElement
      const currentInputTask = currentTaskElement.querySelector(selectors.taskInput)
      currentInputTask.focus()
      currentInputTask.setSelectionRange(currentInputTask.value.length, currentInputTask.value.length)
    }

    const finishEditingTask = (currentInputTaskElement) => {
      const currentTaskElement = currentInputTaskElement.closest(selectors.taskItem)
      const currentTaskId = getIdTask(currentTaskElement)

      const valueTaskInput = currentInputTaskElement.value.trim()

      if (valueTaskInput) {
        tasksArr = tasksArr.map((task) => {
          if (task.id === currentTaskId) {
            return { ...task, text: valueTaskInput }
          }
          return task
        })

        setItemLocalStorage(STORAGE_KEYS.TODOS, tasksArr)
      }
      applyFilteredTasks()
      currentlyEditingTaskId = null
    }
  }

  const toggleCheckbox = (currentCheckboxElement) => {
    const taskId = getIdTask(currentCheckboxElement)
    tasksArr = tasksArr.map((task) => {
      if (task.id === taskId) {
        task.isCompleted = currentCheckboxElement.checked
      }
      return task
    })
    setItemLocalStorage(STORAGE_KEYS.TODOS, tasksArr)
    applyFilteredTasks()
  }

  const searchTask = () => {
    searchInputElement.addEventListener('input', () => {
      applyFilteredTasks()
    })
  }

  const handleFilterTasks = () => {
    filterElement.addEventListener('click', (e) => {
      const filterButton = e.target.closest(selectors.filterButton)
      if (!filterButton) return

      const filterButtons = filterElement.querySelectorAll(selectors.filterButton)
      filterButtons.forEach((button) => {
        button.classList.remove(stateClasses.isActive)
      })

      filterButton.classList.add(stateClasses.isActive)
      applyFilteredTasks()
    })
  }

  const getTasksBySearch = () => {
    const searchInputValue = searchInputElement.value.trim().toLowerCase()
    return searchInputValue ? tasksArr.filter((task) => task.text.toLowerCase().includes(searchInputValue)) : tasksArr
  }

  const getTasksByFilter = (tasks, activeFilterType) => {
    switch (activeFilterType) {
      case 'active':
        return tasks.filter((task) => !task.isCompleted)
      case 'completed':
        return tasks.filter((task) => task.isCompleted)
      case 'all':
      default:
        return tasks
    }
  }

  const applyFilteredTasks = () => {
    const activeFilterType = filterElement.querySelector('.todo__filter-button.is-active').dataset.jsFilter || 'all'

    const searchTasksArr = getTasksBySearch()
    const filteredTasksArr = getTasksByFilter(searchTasksArr, activeFilterType)

    if (searchInputElement.value.trim() && filteredTasksArr.length === 0 && tasksArr.length !== 0) {
      errorMessageElement.classList.add(stateClasses.isVisible)
    } else {
      errorMessageElement.classList.remove(stateClasses.isVisible)
    }

    addTask(filteredTasksArr)
    updateTasksCounter()
    toggleStateClasses()
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

  const updateTasksCounter = () => {
    const uncompletedTasks = tasksArr.filter((task) => !task.isCompleted).length
    countUncompletedTasksElement.textContent = `${uncompletedTasks} tasks left`
  }

  updateTasksCounter()
  handleFilterTasks()
  editTask()
  removeTask()
  addTask(tasksArr)
  toggleStateClasses()
  searchTask()
}