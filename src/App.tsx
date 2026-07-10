import { useCallback, useEffect, useRef, useState } from 'react'
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

const DEFAULT_FONT_SIZE = 35
const MIN_FONT_SIZE = 12
const MAX_FONT_SIZE = 120

function App() {
  const [history, setHistory] = useState('')
  const [current, setCurrent] = useState('')
  const [inverted, setInverted] = useState(false)
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE)
  const [showFontControl, setShowFontControl] = useState(false)
  const fontControlRef = useRef<HTMLDivElement>(null)
  const fontToggleRef = useRef<HTMLButtonElement>(null)
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

  const toggleFontControl = useCallback(() => setShowFontControl(v => !v), [])

  useEffect(() => {
    if (!showFontControl) return
    const handlePointerDown = (e: MouseEvent) => {
      const target = e.target as Node
      if (fontControlRef.current?.contains(target)) return
      if (fontToggleRef.current?.contains(target)) return
      setShowFontControl(false)
    }
    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [showFontControl])

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
          fontSize={fontSize}
        />
      </Chat>
      <button
        type="button"
        className="hidden-control invert-toggle"
        style={{ backgroundColor: colours.background }}
        onClick={toggleInverted}
        aria-label="配色を反転"
        title="配色を反転"
      />
      <button
        ref={fontToggleRef}
        type="button"
        className="hidden-control font-toggle"
        style={{ backgroundColor: colours.background }}
        onClick={toggleFontControl}
        aria-label="文字サイズを変更"
        title="文字サイズを変更"
      />
      {showFontControl && (
        <div
          ref={fontControlRef}
          className="font-control"
          style={{
            backgroundColor: colours.background,
            color: colours.text,
            borderColor: colours.text
          }}
        >
          <input
            type="range"
            min={MIN_FONT_SIZE}
            max={MAX_FONT_SIZE}
            value={fontSize}
            onChange={e => setFontSize(Number(e.target.value))}
            aria-label="文字サイズ"
          />
          <input
            type="number"
            className="font-size-value"
            min={MIN_FONT_SIZE}
            max={MAX_FONT_SIZE}
            value={fontSize}
            onChange={e => {
              const next = Number(e.target.value)
              if (Number.isNaN(next)) return
              setFontSize(
                Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, next))
              )
            }}
            style={{ color: colours.text }}
            aria-label="文字サイズ（数値）"
          />
          <span className="font-size-unit">px</span>
        </div>
      )}
    </div>
  )
}

export default App
