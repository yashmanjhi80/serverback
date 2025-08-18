"use client"

import { useEffect } from "react"

export default function ViewportSetter() {
  useEffect(() => {
    const meta = document.createElement("meta")
    meta.name = "viewport"
    meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
    document.getElementsByTagName("head")[0].appendChild(meta)
  }, [])

  return null // This component doesn't render any visible UI
}
