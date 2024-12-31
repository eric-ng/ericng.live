'use client';

import { usePathname } from "next/navigation";
import Link from 'next/link';

export default function Nav({navs = []}) {
    const pathname = usePathname();
    return (
        <nav className="shadow absolute top-0 left-0 right-0 z-40 bg-white">
            <div className="flex items-center bg-white divide-x divide-blue-200">
                {navs.map((nav) => (
                    <div className={`nav-item p-4 ${nav.link != '/' && pathname.indexOf(nav.link) > -1 ? 'bg-sky-100' : ''}`} key={nav.link}>
                        <Link href={nav.link}>
                            {nav.name}
                        </Link>
                    </div>
                ))}
                <div className="flex-grow-1">

                </div>
            </div>
        </nav>
    );
}