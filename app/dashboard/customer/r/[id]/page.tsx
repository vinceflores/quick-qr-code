'use client'
import { ShoppingCart } from 'lucide-react'
import { use, useState } from 'react'
import { Button } from '../../../../../components/ui/button'
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from '../../../../../components/ui/card'

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
    const handleAddtoCart = async () => {

    }
    return (
        <div>
            <div>
                <h1>{resDetails.name}</h1>
                <p>{resDetails.description}</p>
            </div>
            <div>
                {
                    menuItemsStub.map(i => (
                        <Card key={i.id}>
                            <CardHeader>
                                <CardTitle>{i.name}</CardTitle>
                                <CardDescription>{i.description} </CardDescription>
                                <CardAction onClick={handleAddtoCart}>
                                    <Button className='cursor-pointer'> <ShoppingCart /> Add To Cart</Button>
                                </CardAction>
                            </CardHeader>
                        </Card>
                    ))
                }

            </div>
        </div>
    )
}