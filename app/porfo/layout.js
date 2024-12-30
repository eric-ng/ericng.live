'use client';

import { useEffect } from 'react';
import SubNav from "@/components/subnav";

const scrollOpts = {
    behavior: "smooth",
    block: "start",
    inline: "nearest",
};

const navs = [
    {
        handler: () => {
            document.getElementById(`creatives`).scrollIntoView(scrollOpts);
            return false;
        },
        name: 'Creatives',
    },
    {
        handler: () => {
            document.getElementById(`photos`).scrollIntoView(scrollOpts);
            return false;
        },
        name: 'Photos',
    },
];

export default function PorfoLayout({children}) {
    const listener = () => {
        document.getElementById(`creatives`).scrollIntoView(scrollOpts);
    };
    useEffect(() => {
        window.addEventListener('resize', listener);
        return window.removeEventListener('resize', listener);
    });
    return (
        <div className="grid h-screen">
            <SubNav navs={navs}/>
            <div className="grid max-h-full">
                {children}
            </div>
        </div>
    );
}