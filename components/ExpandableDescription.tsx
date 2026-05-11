'use client'

import { useRef, useEffect, useState } from 'react'

export default function ExpandableDescription({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const [overflows, setOverflows] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (el) setOverflows(el.scrollHeight > el.clientHeight + 2)
  }, [text])

  return (
    <div>
      <p
        ref={ref}
        className={`text-gray-400 text-sm ${expanded ? '' : 'line-clamp-3 sm:line-clamp-3'}`}
      >
        {text}
      </p>
      {(overflows || expanded) && (
        <button
          onClick={() => setExpanded(e => !e)}
          className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors mt-1"
        >
          {expanded ? 'See less' : 'See more'}
        </button>
      )}
    </div>
  )
}
