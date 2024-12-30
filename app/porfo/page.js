'use client';

import Image from "next/image";
import SlideViewer from "@/components/slideViewer";

const creatives = [
    {
        src: '/30anni-poster-color.png',
        alt: '30anni',
        desc: 'Anniversary Poster',
    },
    {
        src: '/ChristmasEveCelebPoster5a.png',
        alt: 'ChristmasEve',
        desc: 'Christmas Eve Poster',
    },
    {
        src: '/Dec24Poster.png',
        alt: 'Dec24-2024',
        desc: '2024 Christmas Poster',
    },
    {
        src: '/promoPosterAug20-23.png',
        alt: 'promo',
        desc: 'Promotion Poster',
    },
    {
        src: '/rhandbook2024.png',
        alt: 'rhandbook2024',
        desc: 'Handbook Cover',
    },
]

const photos = [];
for(let i = 0; i < 17; i++) {
    photos.push({
        src: `/p${i+1}.jpg`,
        alt: `photo${i+1}`,
        desc: `Photo ${i+1}`,
    });
}

export default function Media({children}) {
    return (
        // <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <div className="grid h-screen font-[family-name:var(--font-geist-sans)]">
            <SlideViewer id="creatives" artifacts={creatives} />
            <SlideViewer id="photos" artifacts={photos} />
        </div>
    );
}