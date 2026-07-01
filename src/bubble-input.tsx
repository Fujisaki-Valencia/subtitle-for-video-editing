import {
  ChangeEventHandler,
  KeyboardEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import './bubble-input.css'

const IDLE_DELAY = 500

interface BubbleInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  hasText: boolean
  fadingText: string | null
  isFadingOut: boolean
  fillColour: string
  strokeColour: string
}

const renderChars = (text: string, animate: boolean) =>
  text.split('').map((char, index) => (
    <span key={index} className={`char${animate ? '' : ' char-static'}`}>
      {char}
    </span>
  ))

const BubbleInput = ({
  value,
  onChange,
  onSubmit,
  hasText,
  fadingText,
  isFadingOut,
  fillColour,
  strokeColour
}: BubbleInputProps) => {
  const refInput = useRef<HTMLInputElement>(null)
  const [pulseKey, setPulseKey] = useState(0)
  const [isIdle, setIsIdle] = useState(true)
  const idleTimer = useRef<ReturnType<typeof setTimeout>>()

  const handleTypingActivity = useCallback(() => {
    setIsIdle(false)
    setPulseKey(key => key + 1)
    clearTimeout(idleTimer.current)
    idleTimer.current = setTimeout(() => setIsIdle(true), IDLE_DELAY)
  }, [])

  useEffect(() => () => clearTimeout(idleTimer.current), [])

  const handleChange: ChangeEventHandler<HTMLInputElement> = e => {
    onChange(e.target.value)
    handleTypingActivity()
  }

  const handleKeyDown: KeyboardEventHandler = e => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault()
      onSubmit()
    }
  }

  const handleBlur = useCallback(() => {
    refInput.current?.focus()
  }, [])

  useEffect(handleBlur, [handleBlur])

  const focusInput = () => refInput.current?.focus()

  return (
    <div className="bubble-container">
      <div className="input-line" style={{ opacity: hasText ? 1 : 0 }}>
        <div
          className="bubble-content"
          style={{ backgroundColor: fillColour, color: strokeColour }}
          onClick={focusInput}
        >
          <span className="prompt">&gt; </span>
          <span className="rendered-text">{renderChars(value, true)}</span>
          <span
            key={pulseKey}
            className={`cursor${isIdle ? ' cursor-idle' : ''}`}
          />
          <input
            ref={refInput}
            className="hidden-input"
            value={value}
            autoComplete="off"
            spellCheck={false}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
          />
        </div>
      </div>

      {fadingText !== null && (
        <div
          className="input-line fading-line"
          style={{ opacity: isFadingOut ? 0 : 1 }}
        >
          <div
            className="bubble-content"
            style={{ backgroundColor: fillColour, color: strokeColour }}
          >
            <span className="prompt">&gt; </span>
            <span className="rendered-text">
              {renderChars(fadingText, false)}
            </span>
            <span className="cursor cursor-idle" />
          </div>
        </div>
      )}
    </div>
  )
}

export default BubbleInput
