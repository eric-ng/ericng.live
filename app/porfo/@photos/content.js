import SlideViewer from "@/components/slideViewer";

const photosArts = [];
for(let i = 0; i < 17; i++) {
    photosArts.push({
        src: `/p${i+1}.jpg`,
        alt: `photo${i+1}`,
        desc: `Photo ${i+1}`,
    });
}


export default function PhotosContent() {
    return (
        <SlideViewer id="photos" artifacts={photosArts} />
    );
}