'use client';

import Image from "next/image";
import SlideViewer from "@/components/slideViewer";

const creatives = [
    {
        src: '/30anni-poster-color.png',
        alt: '30anni',
    },
    {
        src: '/ChristmasEveCelebPoster5a.png',
        alt: 'ChristmasEve',
    },
    {
        src: '/Dec24Poster.png',
        alt: 'Dec24-2024',
    },
    {
        src: '/promoPosterAug20-23.png',
        alt: 'promo',
    },
    {
        src: '/rhandbook2024.png',
        alt: 'rhandbook2024',
    },
]

const photos = [
    {
        src: '/p1.jpg',
        alt: 'photo1',
    },
    {
        src: '/p2.jpg',
        alt: 'photo2',
    },
    {
        src: '/p3.jpg',
        alt: 'photo3',
    },
    {
        src: '/p4.jpg',
        alt: 'photo4',
    },
    {
        src: '/p5.jpg',
        alt: 'photo5',
    },
    {
        src: '/p6.jpg',
        alt: 'photo6',
    },
    {
        src: '/p7.jpg',
        alt: 'photo7',
    },
    {
        src: '/p8.jpg',
        alt: 'photo8',
    },
    {
        src: '/p9.jpg',
        alt: 'photo9',
    },
    {
        src: '/p10.jpg',
        alt: 'photo10',
    },
    {
        src: '/p11.jpg',
        alt: 'photo11',
    },
    {
        src: '/p12.jpg',
        alt: 'photo12',
    },
    {
        src: '/p13.jpg',
        alt: 'photo13',
    },
    {
        src: '/p14.jpg',
        alt: 'photo14',
    },
    {
        src: '/p15.jpg',
        alt: 'photo15',
    },
    {
        src: '/p16.jpg',
        alt: 'photo16',
    },
    {
        src: '/p17.jpg',
        alt: 'photo17',
    },
]

export default function Media({children}) {
    return (
        // <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <div className="grid h-screen font-[family-name:var(--font-geist-sans)]">
            <SlideViewer id="creatives" artifacts={creatives} />
            <SlideViewer id="photos" artifacts={photos} />
        </div>
    );
}