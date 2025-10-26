"use client"

import { useEffect, useState } from 'react'
import AdSlot from '@/components/AdSlot'

type ProviderMap = { [id: string]: any }

type Props = {
  positions?: string[] // e.g. ['header','main-top','main-bottom','footer']
}

export default function AdInjector({ positions }: Props) {
  const [providers, setProviders] = useState<ProviderMap>({})
  const [placements, setPlacements] = useState<any[]>([])

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const [pRes, plRes] = await Promise.all([
          fetch('/api/admin/providers'),
          fetch('/api/admin/placements')
        ])
        const pJson = await pRes.json()
        const plJson = await plRes.json()
        if (!mounted) return
  const providerMap: ProviderMap = {}
  ;(pJson.providers || []).forEach((p: any) => { providerMap[p.id || p._id || p.name] = p })
  setProviders(providerMap)
        setPlacements(plJson.placements || [])
      } catch (e) {
        // swallow errors; ad system must not break the site
        // console.error('AdInjector load error', e)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  // classify placements into header/main/footer by selector convention
  const header = placements.filter(p => (p.selector || '').toLowerCase() === 'header')
  const mainTop = placements.filter(p => (p.selector || '').toLowerCase() === 'main-top')
  const mainBottom = placements.filter(p => (p.selector || '').toLowerCase() === 'main-bottom')
  const footer = placements.filter(p => (p.selector || '').toLowerCase() === 'footer')

  const wantAll = !positions || positions.length === 0
  const show = (slot: string) => wantAll || (positions || []).includes(slot)

  if (!placements.length) return null

  return (
    <>
      {/* header slots (rendered near top of body) */}
      {header.map((pl) => (
        <div key={pl._id || pl.id} className="w-full ad-inject header-slot">
          <AdSlot provider={providers[pl.providerId]} placement={pl} />
        </div>
      ))}

      {/* main-top slots (rendered after header, before main content) */}
      {mainTop.map((pl) => (
        <div key={pl._id || pl.id} className="w-full ad-inject main-top-slot">
          <AdSlot provider={providers[pl.providerId]} placement={pl} />
        </div>
      ))}

      {/* main-bottom slots (rendered after main content, before footer) */}
      {mainBottom.map((pl) => (
        <div key={pl._id || pl.id} className="w-full ad-inject main-bottom-slot">
          <AdSlot provider={providers[pl.providerId]} placement={pl} />
        </div>
      ))}

      {/* footer slots (rendered inside/near footer) */}
      {footer.map((pl) => (
        <div key={pl._id || pl.id} className="w-full ad-inject footer-slot">
          <AdSlot provider={providers[pl.providerId]} placement={pl} />
        </div>
      ))}
    </>
  )
}
