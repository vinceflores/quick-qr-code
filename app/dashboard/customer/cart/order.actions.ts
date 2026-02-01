'use server'

import { createClient } from "../../../../lib/supabase/server"

export type OrderItem =  {
    menuItemId: number,
    quantity: number,
    
}

export type CreateOrderParam ={
    userId?: string | null
    orderItems: OrderItem[]
}

export async function createOrder(order: CreateOrderParam){
    const supabase = await createClient()
    supabase.from("orders")
    // create orer
    const { data: createdOrder, error: orderError } = await supabase
        .from("orders").insert( order.userId? { user_id: order.userId, }: { })
        .select("id")
        .single()
    if (orderError || !createdOrder) return {
        error: orderError ?? null,
        order_id: ""
    }

    // create order-items
    const res = await supabase
        .from("order-item")
        .insert(order.orderItems.map(i => ({
            "menu-item-id": i.menuItemId,
            "order-id": createdOrder.id,
            "quantity": i.quantity
        }))).select('id')
    
    if(res.error) return { 
        error: res.error,
        order_id: "" 
    }
    return {
        error: null,
        order_id : createdOrder.id
    }
}

export async function getOrderForAuthenticatedUser(id: number){
    const supabase = await createClient()
    const {data, error} = await supabase
        .from("orders").select("*").eq("id", id)
    if(error) return error
    return data
}

export async function getOrderDetails(orderId: string) { }
export async function getOrders(){}
