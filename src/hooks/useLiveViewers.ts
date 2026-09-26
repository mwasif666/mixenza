'use client'

import { useEffect, useState } from 'react'

/** Gradually drifts a viewer count between 1–99 every 3–5 seconds. */
export function useLiveViewers(active = true, seed = 38) {
    const [viewers, setViewers] = useState(() => Math.min(99, Math.max(1, seed)))

    useEffect(() => {
        if (!active) return

        let current = Math.min(99, Math.max(1, Math.round(20 + Math.random() * 40)))
        setViewers(current)

        let timeoutId = 0

        const schedule = () => {
            const delay = 3000 + Math.floor(Math.random() * 2001)
            timeoutId = window.setTimeout(() => {
                const step = 1 + Math.floor(Math.random() * 5)
                const direction = Math.random() > 0.5 ? 1 : -1
                let next = current + direction * step
                if (next > 99) next = current - step
                if (next < 1) next = current + step
                next = Math.min(99, Math.max(1, next))
                current = next
                setViewers(next)
                schedule()
            }, delay)
        }

        schedule()
        return () => window.clearTimeout(timeoutId)
    }, [active, seed])

    return viewers
}

export function formatDeliveryWindow(fromDays = 3, toDays = 5) {
    const format = (date: Date) =>
        date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })

    const start = new Date()
    start.setDate(start.getDate() + fromDays)
    const end = new Date()
    end.setDate(end.getDate() + toDays)
    return `${format(start)} - ${format(end)}`
}
