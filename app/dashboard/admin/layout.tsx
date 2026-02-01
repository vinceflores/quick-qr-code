import Navbar from "@/components/navbar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-svh">
            <Navbar variant="admin"  />
            {children}
        </div>
    )
}
