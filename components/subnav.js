'use client';

import { usePathname } from "next/navigation";

export default function SubNav({children}) {
    const pathname = usePathname();
    return (
        <div className="flex gap-4 bg-slate-200 shadow">
            <div className="nav-item m-2 ml-4 mr-4">
                <a href="/">
                    Creatives
                </a>
            </div>
            <div className="nav-item m-2 ml-4 mr-4">
                <a href="/porfo">
                    Photos
                </a>
            </div>
            <div className="flex-grow-1">

            </div>
        </div>
    );
}