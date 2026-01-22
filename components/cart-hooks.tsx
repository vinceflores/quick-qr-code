"use client"
import { useEffect, useMemo, useState } from "react"

export type CartItem = {
    id: number
    name: string
    price: number
    qty: number
    restaurantId?: number
    notes?: string | null
}

const STORAGE_KEY = "quickqr:cart"

function safeRead(): CartItem[] {
    if (typeof window === "undefined") return []
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY)
        if (!raw) return []
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) return parsed as CartItem[]
        return []
    } catch {
        return []
    }
}

function safeWrite(data: CartItem[]) {
    if (typeof window === "undefined") return
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch {
        // ignore write errors
    }
}

export function useCart() {
    const [items, setItems] = useState<CartItem[]>([])
    const [initialized, setInitialized] = useState(false)

    // initial load
    useEffect(() => {
        setItems(safeRead())
        setInitialized(true)
    }, [])

    // persist on change (after initial load)
    useEffect(() => {
        if (!initialized) return
        safeWrite(items)
    }, [items, initialized])

    // cross-tab sync via storage events
    useEffect(() => {
        const onStorage = (e: StorageEvent) => {
            if (e.key !== STORAGE_KEY) return
            setItems(safeRead())
        }
        window.addEventListener("storage", onStorage)
        return () => window.removeEventListener("storage", onStorage)
    }, [])

    const total = useMemo(
        () => items.reduce((sum, it) => sum + it.price * it.qty, 0),
        [items]
    )

    const count = useMemo(
        () => items.reduce((sum, it) => sum + it.qty, 0),
        [items]
    )

    function addItem(newItem: Omit<CartItem, "qty"> & { qty?: number }) {
        setItems((prev) => {
            const qty = newItem.qty ?? 1
            const idx = prev.findIndex((p) => p.id === newItem.id)
            if (idx >= 0) {
                const next = [...prev]
                next[idx] = { ...next[idx], qty: next[idx].qty + qty }
                return next
            }
            return [...prev, { ...newItem, qty }]
        })
    }

    function removeItem(id: number) {
        setItems((prev) => prev.filter((p) => p.id !== id))
    }

    function setQuantity(id: number, qty: number) {
        setItems((prev) => {
            if (qty <= 0) return prev.filter((p) => p.id !== id)
            const idx = prev.findIndex((p) => p.id === id)
            if (idx < 0) return prev
            const next = [...prev]
            next[idx] = { ...next[idx], qty }
            return next
        })
    }

    function clear() {
        setItems([])
    }

    return { items, total, count, addItem, removeItem, setQuantity, clear }
}
