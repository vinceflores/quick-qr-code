
"use client"

import { useState } from "react";

export const useRoles = () => {
    const [role, setRole] = useState<'admin' | 'customer'>('customer');
    const [isRoleSelected, setisRoleSelected] = useState<boolean>(false);

    const selectAdmin = () => {
        setRole('admin')
        setisRoleSelected(true)
    }
    const selectCustomer = () => {
        setRole('customer')
        setisRoleSelected(true)
    }

    return {
        selectAdmin, selectCustomer, isRoleSelected, role
    }
}