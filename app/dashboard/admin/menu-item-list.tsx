

"use client"
import { useState, useEffect } from "react"
import { createClient } from '@/lib/supabase/client'
import { Button } from "../../../components/ui/button"
import { Trash2 } from 'lucide-react';

export default function MenuItemList() {
    const [items, setItems] = useState<any[]>([])
    const getItms = async () => {
        const supabase = createClient()
        try {
            const { data, error } = await supabase.auth.getUser()
            if (error) throw error
            const user_id = data.user.id
            const res_id = await supabase
                .from("restaurant")
                .select("id").eq("owner_id", user_id)
            const menuItems = await supabase
                .from("menu-item")
                .select("*")
                .eq("restaurant-id", res_id.data![0].id as number)
            if (!menuItems.error) {

                setItems(menuItems.data)
            }

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getItms()
    }, [])

    const handleDelete = async (id: number) => {
        const supabase = createClient()
        const { error } = await supabase
            .from("menu-item").delete()
            .eq("id", id)
        if (error) {
            console.error(error)
        }
        setItems(prev => prev.filter(x => x.id !== id))
    }

    return (
        <div>
            <ul>
                {
                    items.length > 0 &&
                    items.map(i => (
                        <li key={i.id}>
                            <div>
                                <p>Name</p>
                                <p>i.name</p>
                                <p>description</p>
                                <p>{i.description}</p>
                            </div>
                            <div>
                                <button type="button" onClick={() => handleDelete(i.id)}> <Trash2 />  </button>
                            </div>
                        </li>
                    ))

                }
            </ul>
        </div>
    )
}