import Image from "next/image";

export default function Media({children}) {
    return (
        // <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <div className="justify-items-center min-h-screen p-8 sm:p-10 sm:pt-4 pb-20 gap-16 font-[family-name:var(--font-geist-sans)]">
            <div className="overflow-x-auto">
                <div className="inline-flex items-center gap-4 m-2">
                    <div className="porfo-thumbs">
                        <Image 
                            className=""
                            src="/30anni-poster-color.png"
                            alt="30anni"
                            width={180}
                            height={200}
                        />
                    </div>
                    <div className="porfo-thumbs brightness-50">
                        <Image
                            className=""
                            src="/ChristmasEveCelebPoster5a.png"
                            alt="ChristmasEve"
                            width={180}
                            height={200}
                        />
                    </div>
                    <div className="porfo-thumbs brightness-50">
                        <Image
                            className=""
                            src="/Dec24Poster.png"
                            alt="Dec24-2024"
                            width={180}
                            height={200}
                        />
                    </div>
                    <div className="porfo-thumbs brightness-50">
                        <Image
                            className=""
                            src="/promoPosterAug20-23.png"
                            alt="promo"
                            width={180}
                            height={200}
                        />
                    </div>
                    <div className="porfo-thumbs brightness-50">
                        <Image
                            className=""
                            src="/rhandbook2024.png"
                            alt="rhandbook2024"
                            width={180}
                            height={200}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}