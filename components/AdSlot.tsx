"use client"

import { useEffect, useRef } from 'react'

type Props = {
  provider: any | null
  placement?: any | null
}

export default function AdSlot({ provider, placement }: Props) {
  const container = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!provider || !container.current) return
    const snippet = provider.config?.snippet || provider.config?.code || ''
    if (!snippet) return
    // insert raw HTML/snippet
    container.current.innerHTML = snippet
    // run any script tags inside the snippet
    const scripts = Array.from(container.current.querySelectorAll('script'))
    scripts.forEach((old) => {
      const script = document.createElement('script')
      if (old.src) {
        script.src = old.src
        script.async = old.async
      } else {
        script.textContent = old.textContent
      }
      document.head.appendChild(script)
    })
  }, [provider])

  return (
    <div className="ad-slot" ref={container} data-provider={provider?.name}>
      {/* provider snippet will be injected here */}
      {!provider && <div className="text-sm text-gray-500">No provider configured</div>}
    </div>
  )
}
