"use client"

import React from 'react'
import { ThemeProvider } from './ThemeProvider'

export default function ThemeProviderClient({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>
}
