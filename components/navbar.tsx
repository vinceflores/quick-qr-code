"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { LogoutButton } from "@/components/logout-button"
import { createClient } from "@/lib/supabase/client"
import { ShoppingCart } from "lucide-react"

type UserState = {
    isAuthenticated: boolean
}

export type NavbarProps = {
    variant?: "admin" | "customer"
}

const adminLinks = [
    {
        href: "/dashboard/admin",
        label: "Dashboard"
    },
    {
        href: "/dashboard/admin/orders",
        label: "orders"
    }
]
const custoemrLinks = [
    {
        href: "/dashboard/customer",
        label: "restaurants"
    },
    {
        href: "/dashboard/customer/orders",
        label: "orders"
    },
    {
        href: "/dashboard/custoemr/account",
        label: "Acoount"
    }
]

export default function Navbar({
    variant = "admin"
}: NavbarProps) {
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
                    {
                        variant === "admin" ? adminLinks.map((i, j) => (
                            <Button key={j} asChild variant="ghost">
                                <Link href={i.href} className="capitalize">{i.label}</Link>
                            </Button>
                        )) : custoemrLinks.map((i, j) => (
                            <Button disabled={userState.isAuthenticated} key={j} asChild variant="ghost">
                                <Link  href={i.href} className="capitalize">{i.label}</Link>
                            </Button>
                        ))
                    }
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
                    {
                        variant === "customer" &&

                        <div>
                            <Button asChild size={"icon"}>
                                <Link href="/dashboard/customer/cart"> <ShoppingCart />  </Link>
                            </Button>
                        </div>
                    }
                </div>

            </div>
        </nav>
    )
}
