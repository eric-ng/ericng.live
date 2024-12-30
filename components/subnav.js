'use client';

import { useState } from 'react';
import { usePathname } from "next/navigation";
import Link from 'next/link';

export default function SubNav({navs = []}) {
    const pathname = usePathname();
    const [subnavCur, setSubnavCur] = useState(navs?.[0]?.id);
    return (
        <div className="absolute top-14 left-0 right-0 shadow z-10">
            <div className="flex bg-slate-200 shadow divide-x divide-yellow-100">
                {navs.map((nav) => (
                    <div className={`nav-item p-2 pl-4 pr-4 ${subnavCur === nav.id ? 'bg-sky-600 text-gray-200':''}`} key={`${nav.link}-${nav.name}`}>
                        {nav.link && <Link href={nav.link}>
                            {nav.name}
                        </Link>}
                        {nav.handler && <a className="cursor-pointer" onClick={() => {setSubnavCur(nav.id);nav.handler();}}>
                            {nav.name}
                        </a>}
                    </div>
                ))}
                <div className="flex-grow-1">

                </div>
            </div>
        </div>
    );
}