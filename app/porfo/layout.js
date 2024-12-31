'use client';

import SubNav from "@/components/subnav";

const scrollOpts = {
    behavior: "smooth",
    block: "start",
    inline: "nearest",
};

export default function PorfoLayout({children, creatives, photos, nanoapps}) {
    const navs = [
        {
            link: '/porfo/creatives',
            id: '/porfo/creatives',
            handler: () => {
                setTimeout(() => {
                    document.getElementById('creatives').scrollIntoView(scrollOpts);
                }, 300);
                return false;
            },
            name: 'Creatives',
        },
        {
            link: '/porfo/photos',
            id: '/porfo/photos',
            handler: () => {
                setTimeout(() => {
                    document.getElementById('photos').scrollIntoView(scrollOpts);
                }, 300);
                return false;
            },
            name: 'Photos',
        },
        {
            id: '/porfo/nanoapps',
            link: '/porfo/nanoapps',
            handler: () => {
                setTimeout(() => {
                    document.getElementById('nanoapps').scrollIntoView(scrollOpts);
                }, 300);
                return false;
            },
            name: 'NanoApps',
        },
    ];

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