import {
  ChangeEventHandler,
  CompositionEventHandler,
  Fragment,
  KeyboardEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import './bubble-input.css'

interface BubbleInputProps {
  value: string
  history: string
  onChange: (value: string) => void
  onSubmit: () => void
  onClear: () => void
  onBackspaceMerge: () => void
  strokeColour: string
  cursorColour: string
}

const renderChars = (text: string, composing = false, keyPrefix = '') =>
  text.split('').map((char, index) => (
    <span
      key={`${keyPrefix}${index}`}
      className={`char${composing ? ' char-composing' : ''}`}
    >
      {char}
    </span>
  ))

const BubbleInput = ({
  value,
  history,
  onChange,
  onSubmit,
  onClear,
  onBackspaceMerge,
  strokeColour,
  cursorColour
}: BubbleInputProps) => {
  const refInput = useRef<HTMLTextAreaElement>(null)
  const [compositionLength, setCompositionLength] = useState(0)

  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = e => {
    onChange(e.target.value)
  }

  const handleCompositionUpdate: CompositionEventHandler<
    HTMLTextAreaElement
  > = e => {
    setCompositionLength(e.data.length)
  }

  const handleCompositionEnd = () => {
    setCompositionLength(0)
  }

  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = e => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      if (e.shiftKey) return
      e.preventDefault()
      onSubmit()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onClear()
    } else if (e.key === 'Backspace' && value.length === 0) {
      e.preventDefault()
      onBackspaceMerge()
    }
  }

  const handleBlur = useCallback(() => {
    refInput.current?.focus()
  }, [])

  useEffect(handleBlur, [handleBlur])

  const focusInput = () => refInput.current?.focus()

  const historyLines = history.length > 0 ? history.split('\n') : []
  const hasText = history.length > 0 || value.length > 0

  const committedValue =
    compositionLength > 0 ? value.slice(0, -compositionLength) : value
  const composingValue =
    compositionLength > 0 ? value.slice(-compositionLength) : ''
  const committedLines = committedValue.split('\n')

  return (
    <div className="bubble-container">
      <div
        className="manuscript"
        style={{ color: strokeColour, opacity: hasText ? 1 : 0 }}
        onClick={focusInput}
      >
        {historyLines.map((line, index) => (
          <Fragment key={index}>
            {index > 0 && <br />}
            {renderChars(line)}
          </Fragment>
        ))}
        {historyLines.length > 0 && <br />}
        <span className="rendered-text">
          {committedLines.map((line, index) => (
            <Fragment key={`c${index}`}>
              {index > 0 && <br />}
              {renderChars(line, false, `c${index}-`)}
            </Fragment>
          ))}
          {renderChars(composingValue, true, 'p')}
        </span>
        <span
          className="cursor"
          style={{ backgroundColor: cursorColour }}
        />
        <textarea
          ref={refInput}
          className="hidden-input"
          value={value}
          autoComplete="off"
          spellCheck={false}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onCompositionUpdate={handleCompositionUpdate}
          onCompositionEnd={handleCompositionEnd}
          onBlur={handleBlur}
        />
      </div>
    </div>
  )
}

export default BubbleInput
