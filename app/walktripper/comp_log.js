'use client';

import {useRouter} from 'next/navigation';
import Logo from '@/app/walktripper/logo';

export default function CompLog() {
    const router = useRouter();
    return (
        <div className="flex cursor-pointer" onClick={() => router.push('/walktripper')}>
            <Logo />
            <span className="leading-10 pl-1">WalkTripper</span>
            <small className="align-super pl-1 leading-8">beta</small>
        </div>
    );
}