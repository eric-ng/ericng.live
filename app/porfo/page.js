import Image from "next/image";

export default function Media({children}) {
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <div>
                <Image 
                    className="dark:invert"
                    src="/30anni-poster-color.png"
                    alt="30anni"
                    width={180}
                    height={38}
                    priority
                />
            </div>
            <div>
                <Image
                    className="dark:invert"
                    src="/ChristmasEveCelebPoster5a.png"
                    alt="ChristmasEve"
                    width={180}
                    height={38}
                    priority
                />
            </div>
            <div>
                <Image
                    className="dark:invert"
                    src="/Dec24Poster.png"
                    alt="Dec24-2024"
                    width={180}
                    height={38}
                    priority
                />
            </div>
            <div>
                <Image
                    className="dark:invert"
                    src="/promoPosterAug20-23.png"
                    alt="promo"
                    width={180}
                    height={38}
                    priority
                />
            </div>
            <div>
                <Image
                    className="dark:invert"
                    src="/rhandbook2024.png"
                    alt="rhandbook2024"
                    width={180}
                    height={38}
                    priority
                />
            </div>
        </div>
    );
}