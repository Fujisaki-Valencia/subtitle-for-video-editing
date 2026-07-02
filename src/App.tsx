import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css'
import BubbleInput from './bubble-input'
import Chat from './chat'

const FADE_DURATION = 400
const BUBBLE_TIMEOUT = 200

function App() {
  const [newMessage, setNewMessage] = useState('')
  const fillColour = '#000000'
  const strokeColour = '#d1d0c5'
  const [fadingMessage, setFadingMessage] = useState<string | null>(null)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const holdTimer = useRef<ReturnType<typeof setTimeout>>()
  const clearTimer = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (newMessage.length > 0) {
      clearTimeout(holdTimer.current)
      clearTimeout(clearTimer.current)
      setFadingMessage(null)
      setIsFadingOut(false)
    }
  }, [newMessage])

  useEffect(
    () => () => {
      clearTimeout(holdTimer.current)
      clearTimeout(clearTimer.current)
    },
    []
  )

  const handleSubmit = useCallback(() => {
    if (newMessage.length === 0) return

    const text = newMessage
    setNewMessage('')
    setFadingMessage(text)
    setIsFadingOut(false)

    clearTimeout(holdTimer.current)
    clearTimeout(clearTimer.current)
    holdTimer.current = setTimeout(() => {
      setIsFadingOut(true)
      clearTimer.current = setTimeout(() => {
        setFadingMessage(null)
        setIsFadingOut(false)
      }, FADE_DURATION)
    }, BUBBLE_TIMEOUT)
  }, [newMessage])

  return (
    <div className="App">
      <Chat>
        <BubbleInput
          value={newMessage}
          onChange={setNewMessage}
          onSubmit={handleSubmit}
          hasText={newMessage.length > 0}
          fadingText={fadingMessage}
          isFadingOut={isFadingOut}
          fillColour={fillColour}
          strokeColour={strokeColour}
        />
      </Chat>
    </div>
  )
}

export default App
