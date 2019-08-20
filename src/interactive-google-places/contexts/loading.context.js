import { createContext } from 'react'

const LoadingContext = createContext({
  loadingCount: 0,
  showLoading: () => {},
  hideLoading: () => {}
})

export default LoadingContext