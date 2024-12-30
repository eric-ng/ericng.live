'use client';

import SubNav from "@/components/subnav";

const scrollOpts = {
    behavior: "smooth",
    block: "start",
    inline: "nearest",
};

const navs = [
    {
        id: '/porfo/creatives',
        handler: () => {
            document.getElementById(`creatives`).scrollIntoView(scrollOpts);
            return false;
        },
        name: 'Creatives',
    },
    {
        id: '/porfo/photos',
        handler: () => {
            document.getElementById(`photos`).scrollIntoView(scrollOpts);
            return false;
        },
        name: 'Photos',
    },
];

export default function PorfoLayout({children, creatives, photos}) {
    return (
        <div className="grid h-screen">
            <SubNav navs={navs}/>
            <div className="grid max-h-full">
                {children}
            </div>
            {creatives}
            {photos}
        </div>
    );
}