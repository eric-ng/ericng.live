'use client';

import { usePathname } from "next/navigation";

export default function Nav({navs = []}) {
    const pathname = usePathname();
    return (
        <nav className="flex gap-4 shadow">
            {navs.map((nav) => (
                <div className="nav-item m-4" key={nav.link}>
                    <a href={nav.link}>
                        {nav.name}
                    </a>
                </div>
            ))}
            <div className="flex-grow-1">

            </div>
        </nav>
    );
}