"use client"
import { useCart } from "../../../../components/cart-hooks"
import { Card, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"

export default function CartPage() {
    const { items, total, setQuantity, removeItem, clear } = useCart()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">Your Cart</h1>
                <p className="text-sm text-muted-foreground">Items persist in your browser via localStorage.</p>
            </div>
            <div className="space-y-3">
                {items.length === 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Cart is empty</CardTitle>
                            <CardDescription>Add items from a restaurant page.</CardDescription>
                        </CardHeader>
                    </Card>
                )}

                {items.map((it) => (
                    <Card key={it.id}>
                        <CardHeader className="flex-row items-center justify-between gap-4">
                            <div className="flex-1">
                                <CardTitle className="text-base">{it.name}</CardTitle>
                                <CardDescription>
                                    ${(it.price).toFixed(2)} each{it.restaurantId ? ` · R#${it.restaurantId}` : ""}
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    min={0}
                                    value={it.qty}
                                    onChange={(e) => setQuantity(it.id, Number(e.target.value))}
                                    className="w-20"
                                />
                                <Button variant="destructive" onClick={() => removeItem(it.id)}>Remove</Button>
                            </div>
                        </CardHeader>
                    </Card>
                ))}
            </div>

            <div className="flex items-center justify-between">
                <Button variant="secondary" onClick={clear} disabled={items.length === 0}>Clear Cart</Button>
                <div className="text-xl font-medium">Total: ${total.toFixed(2)}</div>
            </div>
        </div>
    )
}