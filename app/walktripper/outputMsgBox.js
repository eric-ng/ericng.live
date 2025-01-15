'use client';

import {useState, useEffect, useRef} from 'react';
import {createRoot} from 'react-dom/client';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import LoopIcon from '@mui/icons-material/Loop';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import Rating from '@mui/material/Rating';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import Logo from '@/app/walktripper/logo';

const sendConvert = async (prompt) => {
    try {
        const rest = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/textConvert`, {
            method: 'POST',
            body: JSON.stringify({prompt}),
        });
        const rawData = await rest.blob();
        var url = URL.createObjectURL(rawData);
        return (url);
    } catch (e) {
        console.log(e);
    }
}

export default function OutputMsgBox({libs, selectionChange = () => {}, map, data = {id, name, address, addressComps, desc, latlng: {lat: 0, lng: 0}, rating, photo, selected}}) {
    const [output, setOutput] = useState('');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [desc, setDesc] = useState('');
    const [rating] = useState(data.rating);
    const [showRating, setShowRating] = useState(false);
    const [loadingMp3, setLoadingMp3] = useState(false);
    const [audioFile, setAudioFile] = useState();
    const [currentTime, setCurrentTime] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef();
    const marker = useRef();

    const targetOutput = `${data.name}${data.address}${data.desc}`;

    const playHandler = async (name) => {
        if (audioFile) {
            handlePlayPause();
        } else {
            setLoadingMp3(true);
            const file = await sendConvert(name);
            setLoadingMp3(false);
            setAudioFile(file);
            audioRef.current.src = file;
            audioRef.current.load();
            setCurrentTime(0);
            setProgress(0);
            audioRef.current.play();
            setIsPlaying(true);
        }
    }

    const buildContent = (data) => {
        const content = document.createElement('div');
        content.classList.add('marker-info');
        if (data.selected) {
            content.classList.add('open');
        }
        const iconDiv = document.createElement('div');
        iconDiv.classList.add('icon');
        const root = createRoot(iconDiv);
        root.render(<Logo />);
        content.appendChild(iconDiv);
        return content;
    };

    const markerClickHandler = (scroll = false) => {
        if (marker.current.content.classList.contains('open')) {
            selectionChange();
            marker.current.content.classList.remove('open');
            marker.current.zIndex = null;
        } else {
            selectionChange(data);
            if (!!scroll) {
                document.getElementById(`marker-id-${data.id}`).scrollIntoView();
            }
            marker.current.content.classList.add('open');
            marker.current.zIndex = 1;
        }
    };

    useEffect(() => {
        return () => {
            if (marker.current) {
                marker.current.map = null;
                marker.current.removeEventListener('gmp-click');
            }
        }
    }, []);
    useEffect(() => {
        setTimeout(() => {
            if (output === targetOutput) {
                setShowRating(true);
            } else {
                if (name !== data.name) {
                    setName(data.name.substring(0, name.length + 1));
                } else if (address !== data.address) {
                    setAddress(data.address.substring(0, address.length + 1));
                } else if (desc !== data.desc) {
                    setDesc(data.desc.substring(0, desc.length + 1));
                }
                setOutput(targetOutput.substring(0, output.length + 1));
            }
        }, 1);
    }, [output, data]);
    useEffect(() => {
        if (!marker.current) {
            const tmpmarker = new libs.AdvancedMarkerElement({
                position: new libs.LatLng(data.latlng.lat, data.latlng.lng),
                title: data.name,
                gmpClickable: true,
                map,
            });
            marker.current = tmpmarker;
            marker.current.addEventListener('gmp-click', () => {
                markerClickHandler(true);
            });
        } else {
            marker.current.map = map;
            marker.current.position = new libs.LatLng(data.latlng.lat, data.latlng.lng);
        }
    }, [data]);
    useEffect(() => {
        if (marker.current) {
            marker.current.content = buildContent(data);
        }
    }, [marker.current, data]);

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            setProgress(
                (audioRef.current.currentTime / audioRef.current.duration) * 100
            )
        }
    }
    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            // setDuration(audioRef.current.duration);
        }
    }
    const handlePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play();
                setIsPlaying(true);
            }
        }
    }
    const handlePause = () => {
        setIsPlaying(false);
    }

    return (
        <div 
            className={`flex gap-2 p-2 rounded border border-sky-100 ${data.selected ? 'bg-amber-100 border-sky-400' : ''}`} id={`marker-id-${data.id}`}
        >
            <div className="w-1/4">
                {data.photo &&
                <img className="aspect-square w-full h-full" src={data.photo.getURI()} />
                }
                {!data.photo &&
                <div className="aspect-square w-full h-full rounded-2xl bg-sky-200 text-slate-400 font-bold text-5xl text-center place-content-center">{name.substring(0, 1).toUpperCase()}</div>
                }
            </div>
            <div className="w-3/4">
                <div className="flex gap-1">
                    <Avatar sx={{bgcolor: data.selected ? '#995566' : ''}} className="cursor-pointer" onClick={() => markerClickHandler(false)}>
                        <GpsFixedIcon />
                    </Avatar>
                    <div className="relative">
                    <Avatar className={`${loadingMp3 ? '': 'cursor-pointer'}`} onClick={() => playHandler({name, area: data.addressComps.filter((add) => add.types.indexOf('locality') > -1)[0].longText})}>
                        {!loadingMp3 && !isPlaying &&
                        <PlayCircleIcon />
                        }
                        {!loadingMp3 && isPlaying &&
                        <PauseCircleIcon />
                        }
                        {!loadingMp3 && audioFile &&
                        <CircularProgress className="absolute z-0" variant="determinate" value={progress} />
                        }
                        {loadingMp3 &&
                        <LoopIcon className="prompt-loader w-1/2 h-1/2 text-sky-600" />
                        }
                    </Avatar>
                    </div>
                    <div className="w-full">
                        <audio 
                            className="hidden" 
                            ref={audioRef}
                            onTimeUpdate={handleTimeUpdate}
                            onLoadedMetadata={handleLoadedMetadata}
                            onPause={handlePause}
                        >
                        </audio>
                    </div>
                </div>
                <div className="text-xl font-bold">{name}</div>
                <div className="line-clamp-1 text-sm italic text-slate-400">{address}</div>
                <div className="line-clamp-2">{desc}</div>
                {showRating && <div className="">
                    <Rating defaultValue={rating} size="small" precision={0.5} readOnly />
                </div>}
            </div>
        </div>
    );
};
