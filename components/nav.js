'use client';

import { usePathname } from "next/navigation";

export default function Nav({children}) {
    const pathname = usePathname();
    return (
        <nav className="flex gap-4">
            <div className="nav-item m-4">
                <a href="/">
                    Home
                </a>
            </div>
            <div className="nav-item m-4">
                <a href="/porfo">
                    Media
                </a>
            </div>
            <div className="flex-grow-1">

            </div>
        </nav>
    );
}