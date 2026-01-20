"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { LogoutButton } from "@/components/logout-button"
import { createClient } from "@/lib/supabase/client"

type UserState = {
    isAuthenticated: boolean
}

export default function Navbar() {
    const [userState, setUserState] = useState<UserState>({ isAuthenticated: false })

    useEffect(() => {
        const supabase = createClient()
        supabase.auth.getUser().then(({ data }) => {
            setUserState({ isAuthenticated: !!data.user })
        })
    }, [])

    return (
        <nav className="border-b bg-background">
            <div className="container mx-auto flex h-14 items-center justify-between px-4">
                {/* Left: Logo */}
                <div className="flex items-center gap-2">
                    <Link href="/" className="text-lg font-semibold">
                        QuickQR Order
                    </Link>
                </div>

                {/* Middle: Navigation */}
                <div className="flex items-center gap-2">
                    <Button asChild variant="ghost">
                        <Link href="/">Home</Link>
                    </Button>
                    <Button asChild variant="ghost">
                        <Link href="/dashboard/customer">Customer</Link>
                    </Button>
                    <Button asChild variant="ghost">
                        <Link href="/dashboard/admin">Admin</Link>
                    </Button>
                </div>

                {/* Right: Auth */}
                <div className="flex items-center gap-2">
                    {userState.isAuthenticated ? (
                        <LogoutButton />
                    ) : (
                        <>
                            <Button asChild variant="outline">
                                <Link href="/auth/login">Login</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/auth/sign-up">Sign Up</Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}
