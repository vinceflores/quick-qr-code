import Navbar from "@/components/navbar"

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-svh">
            <Navbar  variant="customer"/>
            {children}
        </div>
    )
}
