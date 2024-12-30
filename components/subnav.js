'use client';

import { usePathname } from "next/navigation";

export default function SubNav({navs = []}) {
    const pathname = usePathname();
    return (
        <div className="absolute top-14 left-0 right-0 shadow z-10">
            <div className="flex gap-4 bg-slate-200 shadow">
                {navs.map((nav) => (
                    <div className="nav-item m-2 ml-4 mr-4" key={`${nav.link}-${nav.name}`}>
                        {nav.link && <a href={nav.link}>
                            {nav.name}
                        </a>}
                        {nav.handler && <a className="cursor-pointer" onClick={nav.handler}>
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