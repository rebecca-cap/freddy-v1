import { Tooltip } from 'antd'
import React, { useEffect, useRef, useState } from 'react'

interface TruncatedTextProps {
  text: string
  className?: string
}

export function TruncatedText({ text, className }: TruncatedTextProps) {
  const textRef = useRef<HTMLSpanElement>(null)
  const [isTruncated, setIsTruncated] = useState(false)

  useEffect(() => {
    const checkTruncation = () => {
      if (textRef.current) {
        setIsTruncated(textRef.current.scrollWidth > textRef.current.clientWidth)
      }
    }
    checkTruncation()
    window.addEventListener('resize', checkTruncation)
    return () => window.removeEventListener('resize', checkTruncation)
  }, [text])

  return (
    <Tooltip title={isTruncated ? text : ''}>
      <span
        ref={textRef}
        className={className}
        style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}
      >
        {text}
      </span>
    </Tooltip>
  )
}
