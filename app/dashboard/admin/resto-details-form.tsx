
"use client";
import React, { useState, FormEvent, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createClient } from "../../../lib/supabase/client";


type RestoDetails = {
    name: string;
    description: string;
};

type RestoDetailsFormProps = {
    initial?: Partial<RestoDetails>;
    onSubmit?: (data: RestoDetails) => Promise<void> | void;
    isSubmitting?: boolean;
};

export default function RestoDetailsForm({
    initial,
    onSubmit,
    isSubmitting = false,
}: RestoDetailsFormProps) {
    const [name, setName] = useState(initial?.name ?? "");
    const [description, setDescription] = useState(initial?.description ?? "");
    const [errors, setErrors] = useState<{ name?: string; description?: string }>({});

    const validate = (data: RestoDetails) => {
        const nextErrors: typeof errors = {};
        if (!data.name.trim()) nextErrors.name = "Name is required.";
        if (!data.description.trim()) nextErrors.description = "Description is required.";
        return nextErrors;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const payload = { name: name.trim(), description: description.trim() };
        const nextErrors = validate(payload);
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) return;
        try {
            await onSubmit?.(payload);
            const supabase = createClient()
            const user = await supabase.auth.getUser()
            if(user.error) throw user.error
            await supabase.from("restaurant")
                .update({ ...payload, "owner_id": user.data.user.id })
                .eq("owner_id", user.data.user.id )
                

        } catch (err) {
            console.error("Submit failed", err);
        }
    };

    useEffect(() => {
        const getDetails = async () => {
            const supabase = createClient()
            try {
                const { data, error } = await supabase.auth.getUser()
                if (error) throw error
                const user_id = data.user.id
                const res = await supabase.from("restaurant")
                    .select("*")
                    .eq("owner_id", user_id)
                if (!res.error) {
                    setName(res.data[0].name)
                    if (res.data[0].description) {
                        setDescription(res.data[0].description)
                    }
                }
            } catch (error) {

            }
        }
        getDetails()
    }, [])

    return (
        <Card className="w-full">
            <CardHeader className="border-b">
                <CardTitle>Restaurant Details</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} noValidate className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="resto-name">Restaurant Name</Label>
                        <Input
                            id="resto-name"
                            name="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            aria-invalid={!!errors.name}
                            aria-describedby={errors.name ? "resto-name-error" : undefined}
                            placeholder="e.g., Cozy Corner"
                        />
                        {errors.name && (
                            <p id="resto-name-error" role="alert" className="text-destructive text-sm">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="resto-description">Description</Label>
                        <Textarea
                            id="resto-description"
                            name="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            aria-invalid={!!errors.description}
                            aria-describedby={errors.description ? "resto-description-error" : undefined}
                            placeholder="Short summary of the restaurant"
                            rows={4}
                        />
                        {errors.description && (
                            <p id="resto-description-error" role="alert" className="text-destructive text-sm">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : "Save"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setName(initial?.name ?? "");
                                setDescription(initial?.description ?? "");
                                setErrors({});
                            }}
                            disabled={isSubmitting}
                        >
                            Reset
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}