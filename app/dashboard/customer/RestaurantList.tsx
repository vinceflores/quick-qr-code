"use client"
import { useState, useEffect } from "react"
import { createClient } from "../../../lib/supabase/client"
import { Button } from "../../../components/ui/button";
import { Plus } from "lucide-react";

type Restaurant = {
    created_at: string;
    description: string | null;
    id: number;
    name: string;
    owner_id: string;
}

export default function RestaurantList() {
    const [restos, setRestos] = useState<Restaurant[]>([])
    const getRestos = async () => {
        const supabase = createClient()
        const { data, error } = await supabase.from("restaurant").select("*")
        if (!error) {
            setRestos(data)
        }
    }
    useEffect(() => {
        getRestos()
    }, [])
    return (
        <div className="m-4 w-full">
            <h1>Restaurants</h1>
            <div id="resto-list" className="w-3/4 mx-auto">
                <ul className="">
                    {
                        restos.length > 0 &&
                        restos.map(i => (
                            <li key={i.id} className="flex justify-between items-center border space-x-1.5 w-full gap-2">
                                <div className="">
                                    <h1 className="capitalize font-bold">{i.name}</h1>
                                    <p>{i.description}</p>
                                </div>
                                <Button className="cursor-pointer"> Order </Button>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div>
    )
}