import SlideViewer from "@/components/slideViewer";

const creativesArts = [
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
];

export default function CreativesContent() {
    return (
        <SlideViewer id="creatives" artifacts={creativesArts} />
    );
}