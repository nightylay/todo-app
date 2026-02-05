const LOCAL_STORAGE_KEY = 'todos'

export const setItemLocalStorage = (todosArr) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todosArr))
}

export const getItemLocalStorage = () => {
  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
}