import { redirect } from 'next/navigation'

import { LogoutButton } from '@/components/logout-button'
import { createClient } from '@/lib/supabase/server'
import CreateMenuItemForm from './create-menu-item-form'
import RestoDetailsForm from './resto-details-form'
import MenuItemList from './menu-item-list'

export default async function RestaurantAdminDashboard() {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.getClaims()
    if (error || !data?.claims) {
        redirect('/auth/login')
    }

    return (
        <div className="container mx-auto p-6">
            {/* <div className="mb-6 flex items-center justify-between">
                <p>
                    Hello <span>{data.claims.email}</span>
                </p>
                <LogoutButton />
            </div> */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CreateMenuItemForm />
                <RestoDetailsForm />
            </div>
            <MenuItemList />
        </div>
    )
}
