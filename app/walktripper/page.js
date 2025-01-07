'use client';

import { useEffect, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import LoopOutlinedIcon from '@mui/icons-material/LoopOutlined';
import OutputMsgBox from '@/app/walktripper/outputMsgBox';
import Logo from '@/app/walktripper/logo';

const loader = new Loader({
    apiKey: process.env.NEXT_PUBLIC_GAPI_KEY,
    version: "weekly",
    // ...additionalOptions,
});

const getResp = async (prompt, onErr) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/gen`, {
            method: 'POST',
            body: JSON.stringify(
                {
                    prompt
                }
            ),
        });
        if (!res.ok) {
            throw new Error('Something went wrong.');
        }
        const data = (await res.json()).data;
        if (data.error) {
            throw new Error(`Something went wrong with the API.  ${JSON.stringify(data)}`);
        }
        return data;
    } catch (e) {
        console.log(e);
        onErr();
        return [];
    }
}

let markers = [];

export default function AiTool() {
    const [libs, setLibs] = useState({});
    const [prompt, setPrompt] = useState('');
    const [outputs, setOutputs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [map, setMap] = useState();
    const [geocenter, setGeocenter] = useState({lat: 0, lng: 0});
    const [zoom, setZoom] = useState(2);
    const [curRoute, setCurRoute] = useState();
    const addMarker = (marker) => {
        markers.push(marker);
    };
    useEffect(() => {
        if (!loading) {
            document.getElementById('prompt-input').focus();
        }
    }, [loading]);
    useEffect(() => {
        (async () => {
            const { LatLng } = await loader.importLibrary('core');
            const { Map } = await loader.importLibrary("maps");
            const { 
                DirectionsRenderer, 
                DirectionsService, 
                TravelMode 
            } = await loader.importLibrary('routes');
            const { AdvancedMarkerElement } = await loader.importLibrary('marker');
            setLibs({
                ...libs,
                LatLng,
                Map,
                DirectionsRenderer, 
                DirectionsService, 
                TravelMode,
                AdvancedMarkerElement,
            });
            const newMap = new Map(document.getElementById("imap"), {
                mapId: 'walktripper-map',
                center: new LatLng(geocenter.lat, geocenter.lng),
                zoom,
                fullscreenControl: false,
            });
            setMap(newMap);
        })();
    }, []);
    const changeHandler = (e) => {
        setPrompt(e.target.value);
    };
    const keyHandler = (e) => {
        if (e.keyCode === 13) {
            sendResp();
        }
    }
    const setCenter = (latlng) => {
        map.setCenter(latlng);
    }
    const sendResp = async () => {
        if (!loading && prompt != '') {
            map.setZoom(2);
            map.setCenter({lat: 0, lng: 0});
            if (curRoute) {
                curRoute.setMap(null);
            }
            markers.forEach((marker) => marker.ref.map = null);
            markers = [];
            setOutputs([]);
            setLoading(true);
            const tmpPrompt = prompt;
            let tmpOutputs = [
                {
                    role: 'user',
                    data: {value: tmpPrompt},
                },
            ];
            setPrompt('');
            try {
                const data = await getResp(prompt, () => setLoading(false));
                const processedData = JSON.parse(data).sort((a, b) => a.latitude - b.latitude + a.longitude - b.longitude);
                map.setCenter(new libs.LatLng(
                    processedData[processedData.length - 1].latitude, 
                    processedData[processedData.length - 1].longitude
                ));
                setOutputs([
                    ...tmpOutputs,
                    ...processedData
                    .map((item, ind) => (
                        {
                            role: 'model',
                            data: {
                                id: ind,
                                name: item.locationName,
                                address: item.address,
                                desc: item.description,
                                latlng: {lat: item.latitude, lng: item.longitude},
                                rating: item.rating,
                                selected: false,
                            },
                        }
                    )),
                ]);
                setLoading(false);
                const directionsService = new libs.DirectionsService();
                map.setZoom(14);
                const directionResult = await directionsService.route({
                    origin: new libs.LatLng({lat: processedData[0].latitude, lng: processedData[0].longitude}),
                    destination: new libs.LatLng({lat: processedData[processedData.length - 1].latitude, lng: processedData[processedData.length - 1].longitude}),
                    waypoints: processedData.filter((_, ind) => ind > 0 && ind < processedData.length - 1).map((item) => (
                        {
                            location: new libs.LatLng(item.latitude, item.longitude),
                            stopover: false,
                        }
                    )),
                    travelMode: libs.TravelMode.WALKING,
                });
                if (typeof directionResult.routes == Array) {
                    setCurRoute(directionResult.routes[0]);
                    new libs.DirectionsRenderer({
                        map,
                        directions: directionResult.routes[0],
                    });
                } else {
                    throw new Error("No routes found");
                }
            } catch (e) {
                console.log(e);
            }
        }
    }

    const selectionChange = (data) => {
        setCenter(data.latlng);
        setOutputs(outputs.map((line) => (
            {
                role: line.role,
                data: {
                    ...line.data,
                    selected: line.data.id === data.id ? true : false,
                },
            }
        )));
    };

    return (
        <div className="w-screen h-screen flex flex-col">
            <div className="grow basis-[5%] px-4 pt-2 flex">
                <Logo />
                <span className="leading-10 pl-1">WalkTripper</span>
                <small className="align-super pl-1 leading-8">beta</small>
            </div>
            <div className="h-[90%]">
                <div className="px-4 flex gap-2 h-full">
                    <div className="grid w-1/3">
                        <div className="w-full mt-4">
                            <OutlinedInput
                                id={`prompt-input`}
                                autoFocus
                                className="w-full"
                                placeholder={'A tourist attraction.  Ex. Eiffel tower'}
                                value={prompt}
                                onChange={changeHandler}
                                onKeyDown={keyHandler}
                                disabled={loading}
                                endAdornment={
                                <InputAdornment position="end">
                                    {!loading && 
                                        <SearchOutlinedIcon className="cursor-pointer" onClick={sendResp} />
                                    }
                                    {loading &&
                                        <LoopOutlinedIcon className="prompt-loader" />
                                    }
                                </InputAdornment>
                                }
                            />
                        </div>
                        <div className="prompt-chat my-4 overflow-y-auto">
                            <div className="flex flex-col gap-4 h-full">
                                {outputs.map((line, ind) => {
                                    if (line.role === 'user') {
                                        return (
                                            <div 
                                                className="bg-green-200 py-2 px-4 w-fit justify-self-end self-end rounded-lg"
                                                key={`prompt-chat-${line.role}-${ind}`}
                                            >
                                                Here are some tourist attractions near {line.data.value}
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <OutputMsgBox 
                                                key={`prompt-chat-${line.role}-${ind}`} 
                                                map={map}
                                                data={line.data}
                                                selectionChange={selectionChange}
                                                libs={libs}
                                                addMarker={addMarker}
                                            />
                                        );
                                    }
                                })}
                                <div className="" id="scrollRef"></div>
                            </div>
                        </div>
                    </div>
                    <div className="grow w-2/3 p-4" id="imap"></div>
                </div>
            </div>
            <div className="basis-[5%] grow w-full">
                <div className="bg-slate-100 h-full p-4">
                    Copyright WalkTripper &copy; 2025
                </div>
            </div>
        </div>
    );
};
