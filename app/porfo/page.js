'use client';

import Image from "next/image";
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';

const prevHandler = () => {
    document.getElementById('one').scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
    });
}
const nextHandler = () => {
    document.getElementById('two').scrollIntoView();
}

export default function Media({children}) {
    return (
        // <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <div className="justify-items-center font-[family-name:var(--font-geist-sans)]">
            <div className="overflow-x-auto">
                <div className="inline-flex">
                    <div className="porfo-thumbs brightness-50" id="one">
                        <img 
                            className="mt-24"
                            src="/30anni-poster-color.png"
                            alt="30anni"
                            
                        />
                    </div>
                    <div className="porfo-thumbs brightness-50" id="two">
                        <img
                            className="mt-24"
                            src="/ChristmasEveCelebPoster5a.png"
                            alt="ChristmasEve"
                        />
                    </div>
                    <div className="porfo-thumbs brightness-50">
                        <img
                            className=""
                            src="/Dec24Poster.png"
                            alt="Dec24-2024"
                        />
                    </div>
                    <div className="porfo-thumbs brightness-50">
                        <img
                            className=""
                            src="/promoPosterAug20-23.png"
                            alt="promo"
                        />
                    </div>
                    <div className="porfo-thumbs brightness-50">
                        <img
                            className=""
                            src="/rhandbook2024.png"
                            alt="rhandbook2024"

                        />
                    </div>
                </div>
            </div>
            <div className="absolute top-1/2 left-4" onClick={prevHandler}>
                <ArrowBackIosNewOutlinedIcon />
            </div>
            <div className="absolute top-1/2 right-4" onClick={nextHandler}>
                <ArrowForwardIosOutlinedIcon/>
            </div>
        </div>
    );
}