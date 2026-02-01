'use client'
import { ShoppingCart } from 'lucide-react'
import { use, useEffect, useState } from 'react'
import { Button } from '../../../../../components/ui/button'
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from '../../../../../components/ui/card'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '../../../../../components/ui/dialog'
import { createClient } from '../../../../../lib/supabase/client'
import { useCart } from '../../../../../components/cart-hooks'

type MenuItem = {
    created_at: string
    description: string | null
    id: number
    name: string
    price: number
    "restaurant-id": number
}

const menuItemsStub: MenuItem[] = [{
    id: 1,
    name: "burger",
    description: "beef, tomato, lettuce, bread",
    "restaurant-id": 1,
    created_at: new Date().toString(),
    price: 7.99
}]

type Restaurant = {
    created_at: string
    description: string | null
    id: number
    name: string
    owner_id: string
}

const resDetailsStub: Restaurant = {
    id: 1,
    owner_id: "id",
    description: "A burger joint",
    name: "Burger ala King",
    created_at: new Date().toDateString(),
}

export default function BlogPostPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = use(params)
    const [menuItems, setMenuItems] = useState(menuItemsStub)
    const [resDetails, setResDetails] = useState(resDetailsStub)
    const { items, currentRestaurantId, addItem, replaceWithItem } = useCart()
    const [openResetDialog, setOpenResetDialog] = useState(false)
    const [pendingItem, setPendingItem] = useState<MenuItem | null>(null)

    useEffect(() => {

        const getMnuList = async () => {
            const supabase = createClient()
            const res = await supabase
                .from("menu-item")
                .select("*").eq("restaurant-id", Number(id))
            if (!res.error) {
                setMenuItems(res.data)
                console.log({
                    menuList: res.data
                })
            } else {
                console.log(res.error)
            }
        }
        const getResDetails = async () => {
            const supabase = createClient()
            const res = await supabase.from("restaurant").select("*").eq("id", Number(id))
            if (!res.error) {
                setResDetails(res.data[0])
            } else {
                console.log(res.error)
            }
        }
        getMnuList()
        getResDetails()
    }, [])

    const handleAddtoCart = (item: MenuItem) => {
        const incomingRestaurantId = item["restaurant-id"]
        const requiresReset = items.length > 0 && currentRestaurantId !== undefined && incomingRestaurantId !== currentRestaurantId
        if (requiresReset) {
            setPendingItem(item)
            setOpenResetDialog(true)
            return
        }
        addItem({
            id: item.id,
            name: item.name,
            price: item.price,
            restaurantId: incomingRestaurantId,
        })
    }

    const proceedResetAndAdd = () => {
        if (!pendingItem) return
        const item = pendingItem
        replaceWithItem({
            id: item.id,
            name: item.name,
            price: item.price,
            restaurantId: item["restaurant-id"],
        })
        setPendingItem(null)
        setOpenResetDialog(false)
    }

    const cancelReset = () => {
        setPendingItem(null)
        setOpenResetDialog(false)
    }
    return (
        <div>
            <div>
                <h1>{resDetails.name}</h1>
                <p>{resDetails.description}</p>
            </div>
            <div>
                {
                    menuItems.map(i => (
                        <Card key={i.id}>
                            <CardHeader>
                                <CardTitle>{i.name} $ {i.price}</CardTitle>
                                <CardDescription>{i.description} </CardDescription>

                                <CardAction onClick={() => handleAddtoCart(i)}>
                                    <Button className='cursor-pointer'> <ShoppingCart /> Add To Cart</Button>
                                </CardAction>
                            </CardHeader>
                        </Card>
                    ))
                }
            </div>
            <Dialog open={openResetDialog} onOpenChange={(v) => setOpenResetDialog(v)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reset Cart?</DialogTitle>
                        <DialogDescription>
                            Your cart currently has items from restaurant #{currentRestaurantId}. Adding an item from restaurant #{pendingItem?.["restaurant-id"]} will reset your cart. If you proceed, we will clear your cart and add this new item.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="secondary" onClick={cancelReset}>Cancel</Button>
                        <Button variant="destructive" onClick={proceedResetAndAdd}>Proceed</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}