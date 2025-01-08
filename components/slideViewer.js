'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import Modal from '@mui/material/Modal';

const scrollOpts = {
    behavior: "smooth",
    block: "start",
    inline: "nearest",
};

export default function SlideViewer({id, artifacts = []}) {
    const PREFIX = `${id}-slideviewer`;
    const [cur, setCur] = useState(0);
    const [open, setOpen] = useState(false);
    const [clses, setClses] = useState('full');
    const listener = () => {
        document.getElementById(`${PREFIX}-${cur}`).scrollIntoView();
    };
    useEffect(() => {
        window.addEventListener('resize', listener);
        return () => {
            window.removeEventListener('resize', listener);
        };
    });
    const prevHandler = () => {
        const tmpCur =  cur == 0 ? artifacts.length - 1 : cur - 1;
        document.getElementById(`${PREFIX}-${tmpCur}`).scrollIntoView(scrollOpts);
        setCur(tmpCur);
    }
    const nextHandler = () => {
        const tmpCur =  cur == artifacts.length - 1 ? 0 : cur + 1;
        document.getElementById(`${PREFIX}-${tmpCur}`).scrollIntoView(scrollOpts);
        setCur(tmpCur);
    }
    const openHandler = () => {
        setTimeout(() => {
            setClses('half');
        }, 100);
        setOpen(true);
    }
    const closeHandler = () => {
        setClses('full');
        setOpen(false);
    }
    
    return (
        <div id={id} className="w-screen h-screen relative">
            <div className="h-screen w-screen overflow-hidden">
                <div className="h-screen inline-flex">
                    {
                        artifacts.map((artifact, ind) => (
                            <div 
                                className={`relative bg-slate-800 flex place-content-center h-screen w-screen pt-24 porfo-thumbs ${ind==cur ? '' : 'brightness-50'} ${open ? 'brightness-[.30]' : ''}`} 
                                id={`${PREFIX}-${ind}`} 
                                key={`${PREFIX}-${ind}`}
                            >
                                <div
                                    className="overflow-hidden cursor-pointer desc font-mono font-[1000] text-[400px] leading-[250px] -tracking-[0.2em] text-slate-500 opacity-50 text-wrap break-all max-w-full max-h-full pt-36 absolute top-1/2 left-1/2 z-10"
                                    onClick={openHandler}
                                >
                                    {`${artifact.desc}`.replace(/\s+/g, '')}
                                </div>
                                <img 
                                    className="max-h-full cursor-pointer"
                                    src={artifact.src}
                                    alt={artifact.alt}
                                    onClick={openHandler}
                                />
                            </div>
                        ))
                    }
                </div>
            </div>
            <Modal
                open={open}
                onClose={closeHandler}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className="modal"
            >
                <div className={`slideviewer-modal absolute ${clses}`}>
                    <div className="grid items-center">
                        <div className="flex items-center gap-4 h-screen">
                            <div className="opacity-50 hover:opacity-100 cursor-pointer rounded-xl p-2 bg-white" onClick={prevHandler}>
                                <ArrowBackIosNewOutlinedIcon />
                            </div>
                            <div className="col-span-10 grow flex place-content-center">
                                <img 
                                    className="max-h-screen"
                                    src={artifacts[cur].src}
                                    alt={artifacts[cur].alt}
                                />
                            </div>
                            <div className="opacity-50 hover:opacity-100 cursor-pointer rounded-xl p-2 bg-white" onClick={nextHandler}>
                                <ArrowForwardIosOutlinedIcon/>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
            {!open && <div className="absolute opacity-50 hover:opacity-100 cursor-pointer rounded-xl p-2 bg-white top-1/2 left-4" onClick={prevHandler}>
                <ArrowBackIosNewOutlinedIcon />
            </div>}
            {!open && <div className="absolute opacity-50 hover:opacity-100 cursor-pointer rounded-xl p-2 bg-white top-1/2 right-4" onClick={nextHandler}>
                <ArrowForwardIosOutlinedIcon/>
            </div>}
        </div>
    );
};
