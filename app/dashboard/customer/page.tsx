import { redirect } from 'next/navigation'
import { LogoutButton } from '@/components/logout-button'
import { createClient } from '@/lib/supabase/server'
import RestaurantList from './RestaurantList'

export default async function CustomerDashboard() {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.getClaims()
    if (error || !data?.claims) {
        redirect('/auth/login')
    }

    return (
        <div className="mx-auto w-full">
            <RestaurantList />
        </div>
    )
}
