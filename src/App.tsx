import { useCallback, useState } from 'react'
import './App.css'
import BubbleInput from './bubble-input'
import Chat from './chat'

function App() {
  const [history, setHistory] = useState('')
  const [current, setCurrent] = useState('')
  const strokeColour = '#d1d0c5'

  const handleSubmit = useCallback(() => {
    if (current.length === 0) return
    setHistory(h => (h ? `${h}\n${current}` : current))
    setCurrent('')
  }, [current])

  const handleClear = useCallback(() => {
    setHistory('')
    setCurrent('')
  }, [])

  const handleBackspaceMerge = useCallback(() => {
    if (!history) return
    const lines = history.split('\n')
    const last = lines.pop() as string
    setHistory(lines.join('\n'))
    setCurrent(last)
  }, [history])

  return (
    <div className="App">
      <Chat>
        <BubbleInput
          value={current}
          history={history}
          onChange={setCurrent}
          onSubmit={handleSubmit}
          onClear={handleClear}
          onBackspaceMerge={handleBackspaceMerge}
          strokeColour={strokeColour}
        />
      </Chat>
    </div>
  )
}

export default App
