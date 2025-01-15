import SlideViewer from "@/components/slideViewer";
import { list } from '@vercel/blob';

export default async function PhotosContent() {
    const resp = await list();
    const blobs = resp.blobs.filter((blob) => blob.pathname.indexOf('photoes/') === 0 && blob.pathname !== 'photoes/');
    const photosArts = blobs.map((blob) => ({
        src: `${blob.url}`,
        alt: `${blob.url}`,
        desc: `${blob.pathname.substring(blob.pathname.indexOf('/') + 1)}`,
    }));
    return (
        <SlideViewer id="photos" artifacts={photosArts} />
    );
}