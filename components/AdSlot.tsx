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
      try {
        const script = document.createElement('script')
        if (old.src) {
          script.src = old.src
          script.async = old.async
          // propagate other attributes safely
          Array.from(old.attributes || []).forEach(attr => {
            if (attr.name !== 'src' && attr.name !== 'async') script.setAttribute(attr.name, attr.value)
          })
        } else {
          // inline script: copy text
          script.textContent = old.textContent
        }
        // safe append with error handler so a provider script can't break the app
        script.addEventListener('error', (err) => {
          // remove faulty script
          try { script.remove() } catch (e) {}
          // log minimal info for debugging
          // eslint-disable-next-line no-console
          console.warn('AdSlot: provider script failed to load or execute', err)
        })
        document.head.appendChild(script)
      } catch (e) {
        // swallow to avoid breaking the host app
        // eslint-disable-next-line no-console
        console.warn('AdSlot: error injecting provider script', e)
      }
    })
  }, [provider])

  return (
    <div className="ad-slot" ref={container} data-provider={provider?.name}>
      {/* provider snippet will be injected here */}
      {!provider && <div className="text-sm text-gray-500">No provider configured</div>}
    </div>
  )
}
