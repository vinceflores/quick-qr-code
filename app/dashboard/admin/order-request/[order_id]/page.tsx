"use client"
import { use, useEffect, useState } from 'react'
import { createClient } from '../../../../../lib/supabase/client'
import { Button } from '../../../../../components/ui/button'

type MenuItem = {
    name: string,
    description: string,
    price: number
}

type OrderItem = {
    id: number;
    "order-id": number;
    quantity: number;
    "menu-item": MenuItem
}

export default function OrderRequest({ params, }: { params: Promise<{ order_id: string }> }) {
    const { order_id } = use(params)
    const [order, setOrder] = useState<OrderItem[]>([])
    useEffect(() => {
        const get = async () => {
            const supabase = createClient()
            const res = await supabase.from("order-item")
                .select(`
                    id,
                    "order-id",
                    quantity,
                    "menu-item"(
                        name,
                        description,
                        price
                    )
                `)
                .eq("order-id", Number(order_id))
            if (res.error) console.error(res.error)
            console.log(res.data)
            if (res.data) {
                setOrder(prev => res.data?.map(i => ({
                    id: i.id,
                    "menu-item": {
                        description: i['menu-item']?.description || "",
                        name: i['menu-item']?.name || "",
                        price: i['menu-item']?.price || 0
                    },
                    "order-id": i['order-id'],
                    quantity: i.quantity,
                })))
            }
        }
        get()
    }, [])
    return (
        <div>
            <h1>Order Summary</h1>
            <div >
                {
                    order.length > 0 && order.map(i => (
                        <div key={i.id} className='flex justify-between'>
                            <div className=''>
                                <h1>{i['menu-item'].name}</h1>
                                <p>{i['menu-item'].description}</p>
                            </div>
                            <h2> {i.quantity} x ${i['menu-item'].price}</h2>
                        </div>
                    ))
                }
            </div>
            <div className='flex justify-between border-t mt-2' >
                <h1>Total</h1>
                <p>
                    {
                        order.length > 0 && order.map(i => (
                            <div key={i.id} className='flex justify-between'>
                                <h2> ${i.quantity * i['menu-item'].price} </h2>
                            </div>
                        ))
                    }
                </p>
            </div>
            <div className='flex gap-2 justify-end'>
                <Button variant={'outline'} className='cusror-pointer'> Confirm</Button>
                <Button variant={"destructive"} > Cancel</Button>
            </div>
        </div>
    )
}   
