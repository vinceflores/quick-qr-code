"use client"
import { useCart } from "../../../../components/cart-hooks"
import { Card, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { useState } from "react"
import { createOrder, getOrders, getOrderDetails } from "./order.actions"
import { GenerateQRCode } from "./qrcode.action"
import { createClient } from "../../../../lib/supabase/client"

export default function CartPage() {
    const { items, total, setQuantity, removeItem, clear } = useCart()
    const [open, setOpen] = useState<boolean>(false)
    const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)

    const handleSubmitOrder = async () => {
        const supabase = await createClient()
        const user = await supabase.auth.getUser()
        if (user.error) {
            const res = await createOrder({
                userId: "",
                orderItems: items.map(i => ({
                    menuItemId: i.id,
                    quantity: i.qty
                }))
            })
            if (res.error) {
                return
            } else {
                const { qr } = await GenerateQRCode({
                    url: `http://localhost:3000/dashboard/admin/order-request/${String(res.order_id)}`
                })
                setQrDataUrl(qr)
                setOpen(true)
            }
        } else {
            const userId = user.data.user.id
            const res = await createOrder({
                userId,
                orderItems: items.map(i => ({
                    menuItemId: i.id,
                    quantity: i.qty
                }))
            })
            if (res.error) {
                return
            } else {
                const { qr } = await GenerateQRCode({
                    url: `http://192.168.2.48:3000/dashboard/admin/order-request/${String(res.order_id)}`
                })
                setQrDataUrl(qr)
                setOpen(true)
            }
        }

    }
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

            <div>
                <Button type="button" variant={"secondary"} onClick={handleSubmitOrder}> Generate Order </Button>
                <Dialog onOpenChange={(val) => { setOpen(val); if (!val) setQrDataUrl(null) }} open={open}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>QR Code Generated</DialogTitle>
                            <DialogDescription>
                                Show this at the restaurant to confirm your order.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex items-center justify-center py-2">
                            {qrDataUrl ? (
                                <img src={qrDataUrl} alt="Order QR code" className="w-64 h-64" />
                            ) : (
                                <div className="text-sm text-muted-foreground">Generating QR…</div>
                            )}
                        </div>
                        <DialogFooter showCloseButton>
                            {/* Optional actions can go here */}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}