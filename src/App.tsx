import { useCallback, useState } from 'react'
import './App.css'
import BubbleInput from './bubble-input'
import Chat from './chat'

const PALETTE = {
  normal: {
    background: '#000000',
    text: '#d1d0c5',
    cursor: 'rgba(255, 255, 255, 0.5)'
  },
  inverted: {
    background: '#ffffff',
    text: '#000000',
    cursor: 'rgba(0, 0, 0, 0.5)'
  }
}

function App() {
  const [history, setHistory] = useState('')
  const [current, setCurrent] = useState('')
  const [inverted, setInverted] = useState(false)
  const colours = inverted ? PALETTE.inverted : PALETTE.normal

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

  const toggleInverted = useCallback(() => setInverted(v => !v), [])

  return (
    <div className="App" style={{ backgroundColor: colours.background }}>
      <Chat>
        <BubbleInput
          value={current}
          history={history}
          onChange={setCurrent}
          onSubmit={handleSubmit}
          onClear={handleClear}
          onBackspaceMerge={handleBackspaceMerge}
          strokeColour={colours.text}
          cursorColour={colours.cursor}
        />
      </Chat>
      <button
        type="button"
        className="invert-toggle"
        onClick={toggleInverted}
        aria-label="配色を反転"
        title="配色を反転"
      />
    </div>
  )
}

export default App
