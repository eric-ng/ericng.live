'use client';

import {useState} from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/auth/firebase";
import { useRouter } from "next/navigation";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmation, setConfirmation] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async () => {
        setError('');
        if (password !== confirmation) {
            setError('Passwords do not match');
            return;
        }
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            router.push('/walktripper');
        } catch (e) {
            setError(e.message);
        }
    }

    return (
        <div className="h-full w-1/2 flex flex-col gap-4 place-content-center justify-self-center">
            <div className="text-center">
                Register
            </div>
            <div className="text-center text-red-600">
                {error}
            </div>
            <TextField required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <TextField required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <TextField required type="password" placeholder="Confirm Password" value={confirmation} onChange={(e) => setConfirmation(e.target.value)} />
            <div className="text-center">
                <Button variant="contained" className="bg-sky-600" onClick={handleSubmit}>Create Account</Button>
                <Button variant="text" className="text-sky-600" onClick={() => router.push('/')}>Cancel</Button>
            </div>
            <div className="text-center mt-8">
                Already has an account?
                <div className="text-sky-600 hover:underline">
                    <a href="/walktripper/login">Login</a>
                </div>
            </div>
        </div>
    );
}