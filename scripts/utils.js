export const setItemLocalStorage = (todosArr) => {
  localStorage.setItem('todos', JSON.stringify(todosArr))
}

export const getItemLocalStorage = () => {
  return JSON.parse(localStorage.getItem('todos'))
}