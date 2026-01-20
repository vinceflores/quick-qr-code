
"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createClient } from "../../../lib/supabase/client";

type MenuItem = {
    id?: string;
    name: string;
    description: string;
    price: number;
};

type Props = {
    onSuccess?: (item: MenuItem) => void;
};

export default function CreateMenuItemForm({ onSuccess }: Props) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<{ name?: string; price?: string }>({});
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);

    const validateFields = () => {
        const next: { name?: string; price?: string } = {};
        if (!name.trim()) next.name = "Name is required.";
        const p = Number(price);
        if (price.trim().length === 0) next.price = "Price is required.";
        else if (Number.isNaN(p)) next.price = "Price must be a number.";
        else if (p <= 0) next.price = "Price must be greater than 0.";
        return next;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        const nextErrors = validateFields();
        setFieldErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) return;
        const supabase = createClient()
        try {
            setSubmitting(true);
            const payload: MenuItem = {
                name: name.trim(),
                description: description.trim(),
                price: Number(price),
            };

            const user = await supabase.auth.getUser()
            const restaurant = await supabase.from('restaurant')
                .select('id')
                .eq('owner_id', user?.data?.user!.id)

            if (restaurant.data) {
                const { data, error } = await supabase
                    .from('menu-item')
                    .insert([
                        {
                            name: payload.name,
                            price: payload.price,
                            description: payload.description,
                            "restaurant-id": restaurant?.data[0].id
                        },
                    ])
                    .select()
                if (error) {
                    throw error
                }
                const created = { ...data[0] }
                setSuccess("Menu item created.");
                setName("");
                setDescription("");
                setPrice("");
                setFieldErrors({});
                onSuccess?.({
                    name: created.name,
                    description: created.description as string,
                    price: created.price,
                });
            }
        } catch (err: any) {
            setError(err?.message || "Something went wrong.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Card className="w-full">
            <CardHeader className="border-b">
                <CardTitle>Create Menu Item</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} aria-busy={submitting} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={submitting}
                            aria-invalid={!!fieldErrors.name}
                            aria-describedby={fieldErrors.name ? "name-error" : undefined}
                            placeholder="e.g., Margherita Pizza"
                        />
                        {fieldErrors.name && (
                            <p id="name-error" role="alert" className="text-destructive text-sm">
                                {fieldErrors.name}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={submitting}
                            placeholder="Short description (optional)"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="price">Price</Label>
                        <Input
                            id="price"
                            name="price"
                            type="number"
                            step="0.01"
                            inputMode="decimal"
                            required
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            disabled={submitting}
                            aria-invalid={!!fieldErrors.price}
                            aria-describedby={fieldErrors.price ? "price-error" : undefined}
                            placeholder="e.g., 12.99"
                        />
                        {fieldErrors.price && (
                            <p id="price-error" role="alert" className="text-destructive text-sm">
                                {fieldErrors.price}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <Button type="submit" disabled={submitting}>
                            {submitting ? "Creating..." : "Create Menu Item"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            disabled={submitting}
                            onClick={() => {
                                setName("");
                                setDescription("");
                                setPrice("");
                                setFieldErrors({});
                                setError(null);
                                setSuccess(null);
                            }}
                        >
                            Reset
                        </Button>
                    </div>

                    {error && (
                        <p role="alert" className="text-destructive text-sm">
                            {error}
                        </p>
                    )}
                    {success && (
                        <p role="status" className="text-green-600 text-sm">
                            {success}
                        </p>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}