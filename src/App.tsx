import { useState } from 'react'
import './App.css'

function App() {
  let [value] = useState('!')
  return (
    <>
      <h1>Hello World{value}</h1>
    </>
  )
}

export default App
