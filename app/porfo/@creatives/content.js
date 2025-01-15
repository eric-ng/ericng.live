import SlideViewer from "@/components/slideViewer";
import { list } from '@vercel/blob';

export default async function CreativesContent() {
    const resp = await list();
    const blobs = resp.blobs.filter((blob) => blob.pathname.indexOf('creatives/') === 0 && blob.pathname !== 'creatives/');
    const creativesArts = blobs.map((blob) => ({
        src: `${blob.url}`,
        alt: `${blob.url}`,
        desc: `${blob.pathname.substring(blob.pathname.indexOf('/') + 1)}`,
    }));
    return (
        <SlideViewer id="creatives" artifacts={creativesArts} />
    );
}