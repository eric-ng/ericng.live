'use client';

import {useEffect, useState} from 'react';
import {usePathname} from 'next/navigation';
import SubNav from "@/components/subnav";
import { scrollOpts } from '@/app/utils/configs';

export default function PorfoLayout({children, creatives, photos, nanoapps}) {
    const pathname = usePathname();
    const [curMedia, setCurMedia] = useState(pathname.substring(pathname.lastIndexOf('/')+1));
    const [scroll, setScroll] = useState(false);
    const navs = [
        {
            link: '/porfo/creatives',
            id: '/porfo/creatives',
            handler: () => {
                setCurMedia('creatives');
                setScroll(!scroll);
                return false;
            },
            name: 'Creatives',
        },
        {
            link: '/porfo/photos',
            id: '/porfo/photos',
            handler: () => {
                setCurMedia('photos');
                setScroll(!scroll);
                return false;
            },
            name: 'Photos',
        },
        {
            id: '/porfo/nanoapps',
            link: '/porfo/nanoapps',
            handler: () => {
                setCurMedia('nanoapps');
                // setScroll(!scroll);
                return false;
            },
            name: 'NanoApps',
        },
    ];
    useEffect(() => {
        const intev = setInterval(() => {
            const ele = document.getElementById(curMedia)
            if (ele) {
                // ele.scrollIntoView(scrollOpts);
                clearInterval(intev);
            }
        }, 300);
    }, [scroll]);

    return (
        <div className="grid h-screen">
            <SubNav navs={navs}/>
            <div className="grid max-h-full">
                {children}
                <div className="grid h-screen font-[family-name:var(--font-geist-sans)]">
                    {creatives}
                    {photos}
                    {nanoapps}
                </div>
            </div>
        </div>
    );
}