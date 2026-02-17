import { selectors } from "./selectors.js";
import { STORAGE_KEYS, setItemLocalStorage, getItemLocalStorage } from "./utils.js";

export const initSwitchTheme = () => {
  const themeButton = document.querySelector(selectors.themeButton)

  const iconSun = `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M24 32C28.4183 32 32 28.4183 32 24C32 19.5817 28.4183 16 24 16C19.5817 16 16 19.5817 16 24C16 28.4183 19.5817 32 24 32Z" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M24 4V8" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M24 40V44" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9.85986 9.85999L12.6799 12.68" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M35.3198 35.3201L38.1398 38.1401" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M4 24H8" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M40 24H44" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12.6799 35.3201L9.85986 38.1401" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M38.1398 9.85999L35.3198 12.68" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`
  const iconMoon = `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M41.9699 24.972C41.7825 28.4443 40.5933 31.788 38.5461 34.5988C36.4989 37.4097 33.6813 39.5674 30.434 40.8111C27.1866 42.0548 23.6486 42.3312 20.2475 41.6071C16.8464 40.8829 13.7278 39.1891 11.2688 36.7303C8.80986 34.2716 7.1157 31.1532 6.39116 27.7522C5.66662 24.3512 5.94272 20.8131 7.18608 17.5656C8.42945 14.3182 10.5868 11.5004 13.3975 9.45288C16.2081 7.40537 19.5517 6.21581 23.0239 6.028C23.8339 5.984 24.2579 6.948 23.8279 7.634C22.3897 9.93511 21.7739 12.6557 22.0809 15.3519C22.388 18.0481 23.5998 20.5606 25.5186 22.4794C27.4374 24.3982 29.9499 25.61 32.646 25.917C35.3422 26.2241 38.0628 25.6082 40.3639 24.17C41.0519 23.74 42.0139 24.162 41.9699 24.972Z" stroke="black" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`

  const currentTheme = getItemLocalStorage(STORAGE_KEYS.THEME)

  if (currentTheme === "dark") {
    document.body.classList.add('dark-theme')
    themeButton.innerHTML = iconSun
  } else {
    document.body.classList.remove('dark-theme')
    themeButton.innerHTML = iconMoon
  }

  themeButton.addEventListener('click', () => {
    const isDark = document.body.classList.contains('dark-theme')
    if (isDark) {
      document.body.classList.remove('dark-theme')
      setItemLocalStorage(STORAGE_KEYS.THEME, 'light')
      themeButton.innerHTML = iconMoon
    } else {
      document.body.classList.add('dark-theme')
      setItemLocalStorage(STORAGE_KEYS.THEME, 'dark')
      themeButton.innerHTML = iconSun
    }
  })

}