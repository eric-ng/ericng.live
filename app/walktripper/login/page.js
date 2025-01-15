'use client';

import {useState} from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/auth/firebase";
import { useRouter } from "next/navigation";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async () => {
        setError('');

        try {
            const credential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            const idToken = await credential.user.getIdToken();
      
            await fetch("/api/login", {
                headers: {
                    Authorization: `Bearer ${idToken}`,
                },
            });
            router.push("/walktripper");
            router.refresh();
        } catch (e) {
            setError(e.message);
        }
    }

    return (
        <div className="h-full w-1/2 flex flex-col gap-4 place-content-center justify-self-center">
            <div className="rounded-xl border p-8">
                <div className="text-center">
                    Login
                </div>
                <div className="text-center text-red-600 p-2">
                    {error}
                </div>
                <div className="w-full">
                    <TextField className="w-full py-2" required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <TextField className="w-full py-2" required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <div className="text-center py-2">
                        <Button variant="contained" className="bg-sky-600" onClick={handleSubmit}>Login</Button>
                        <Button variant="text" className="text-sky-600" onClick={() => router.push('/')}>Cancel</Button>
                    </div>
                </div>
                <div className="text-center mt-8">
                    Don't have an account?
                    <div className="text-sky-600 hover:underline">
                        <a href="/walktripper/register">Signup here</a>
                    </div>
                </div>
            </div>
        </div>
    );
}