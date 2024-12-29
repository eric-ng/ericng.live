'use client';

import { usePathname } from "next/navigation";

export default function Nav({navs = []}) {
    const pathname = usePathname();
    return (
        <nav className="shadow absolute top-0 left-0 right-0 z-20 bg-white">
            <div className="flex items-center gap-4 bg-white">
                {navs.map((nav) => (
                    <div className="nav-item m-4" key={nav.link}>
                        <a href={nav.link}>
                            {nav.name}
                        </a>
                    </div>
                ))}
                <div className="flex-grow-1">

                </div>
            </div>
        </nav>
    );
}