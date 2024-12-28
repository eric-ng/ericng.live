import Image from "next/image";

export default function Media({children}) {
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <div className="overflow-hidden">
                <div className="flex items-center gap-4 m-4">
                    <div className="">
                        <Image 
                            className="porfo-thumbs"
                            src="/30anni-poster-color.png"
                            alt="30anni"
                            width={180}
                            height={200}
                        />
                    </div>
                    <div className="brightness-50">
                        <Image
                            className="porfo-thumbs"
                            src="/ChristmasEveCelebPoster5a.png"
                            alt="ChristmasEve"
                            width={180}
                            height={200}
                        />
                    </div>
                    <div>
                        <Image
                            className="porfo-thumbs"
                            src="/Dec24Poster.png"
                            alt="Dec24-2024"
                            width={180}
                            height={200}
                        />
                    </div>
                    <div>
                        <Image
                            className="porfo-thumbs"
                            src="/promoPosterAug20-23.png"
                            alt="promo"
                            width={180}
                            height={200}
                        />
                    </div>
                    <div>
                        <Image
                            className="porfo-thumbs"
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