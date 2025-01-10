'use client';

import {useState, useEffect, useRef} from 'react';
import {createRoot} from 'react-dom/client';
import Rating from '@mui/material/Rating';
import Logo from '@/app/walktripper/logo';

export default function OutputMsgBox({addMarker, libs, selectionChange = () => {}, map, data = {id, name, address, desc, latlng: {lat: 0, lng: 0}, rating, selected}}) {
    const [output, setOutput] = useState('');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [desc, setDesc] = useState('');
    const [rating] = useState(data.rating);
    const [showRating, setShowRating] = useState(false);
    const marker = useRef();

    const targetOutput = `${data.name}${data.address}${data.desc}`;

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

    if (marker.current) {
        marker.current.addEventListener('gmp-click', () => {
            markerClickHandler(true);
        });
    }
    useEffect(() => {
        return () => {
            if (marker.current) {
                marker.current.map = null;
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
                map,
            });
            marker.current = tmpmarker;
            addMarker({
                ref: tmpmarker,
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

    return (
        <div 
            className={`p-2 cursor-pointer rounded border border-sky-100 ${data.selected ? 'bg-orange-100' : ''}`} id={`marker-id-${data.id}`}
            onClick={markerClickHandler}
        >
            <div className="text-xl font-bold">{name}</div>
            <div className="text-sm italic text-slate-400">{address}</div>
            <div className="">{desc}</div>
            {showRating && <div className="">
                <Rating defaultValue={rating} size="small" precision={0.5} readOnly />
            </div>}
        </div>
    );
};
