"use client";

import { useEffect } from 'react';
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/auth/firebase";

export default function Logout() {
    const router = useRouter();

    const handleLogout = async () => {
        await signOut(auth);
        await fetch('/api/logout');
        router.push('/walktripper');
        router.refresh();
    }

    useEffect(() => {
        handleLogout();
    }, []);

    return null;
}