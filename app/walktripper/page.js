'use client';

import { useEffect, useState } from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import LoopOutlinedIcon from '@mui/icons-material/LoopOutlined';
import OutputMsgBox from '@/app/walktripper/outputMsgBox';

const getResp = async (prompt) => {
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
        return [];
    }
}

export default function AiTool() {
    const [prompt, setPrompt] = useState('');
    const [outputs, setOutputs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [geocenter, setGeocenter] = useState('0,0');
    const [zoom, setZoom] = useState(2);
    const [origin, setOrigin] = useState('%');
    const [destination, setDestination] = useState('%');
    const [waypoints, setWaypoints] = useState([]);
    const [regionCode, setRegionCode] = useState('');
    useEffect(() => {
        if (!loading) {
            document.getElementById('prompt-input').focus();
        }
    }, [loading]);
    const changeHandler = (e) => {
        setPrompt(e.target.value);
    };
    const keyHandler = (e) => {
        if (e.keyCode === 13) {
            sendResp();
        }
    }
    const sendResp = async () => {
        if (!loading && prompt != '') {
            setOutputs([]);
            setRegionCode('');
            setOrigin(`%`);
            setDestination(`%`);
            setLoading(true);
            setZoom(2);
            const tmpPrompt = prompt;
            let tmpOutputs = [
                {
                    role: 'user',
                    data: tmpPrompt,
                },
            ];
            setPrompt('');
            const data = await getResp(prompt);
            const processedData = JSON.parse(data);
            setOrigin(`${processedData[0].address}`);
            setDestination(`${processedData[processedData.length - 1].address}`);
            setGeocenter(`${processedData[processedData.length - 1].latitude},${processedData[processedData.length - 1].longitude}`);
            setOutputs([
                ...tmpOutputs,
                ...processedData.map((item) => (
                    {
                        role: 'model',
                        data: {
                            name: item.locationName,
                            address: item.address,
                            desc: item.description,
                            rating: item.rating,
                        },
                    }
                )),
            ]);
            setLoading(false);
            setWaypoints(processedData.map((item) => (`${item.locationName}+${item.address}`)));
            setRegionCode(processedData[0].regionCode);
            setZoom(14);
        }
    }

    return (
        <div className="w-screen h-screen flex flex-col">
            <div className="grow basis-[5%] px-4 pt-2">
                WalkTripper <small className="align-super">beta</small>
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
                                                Here are some tourist attractions near {line.data}
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <OutputMsgBox 
                                                key={`prompt-chat-${line.role}-${ind}`} 
                                                data={line.data}
                                            />
                                        );
                                    }
                                })}
                                <div className="" id="scrollRef"></div>
                            </div>
                        </div>
                    </div>
                    <div className="grow w-2/3 p-4" id="imap">
                        <iframe
                            className="h-full w-full"
                            style={{border:0}}
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                            src={`https://www.google.com/maps/embed/v1/directions?origin=${origin}&destination=${destination}${waypoints.length?`&waypoints=${waypoints.join('|')}`:''}${regionCode.length?`${regionCode}`:''}&center=${geocenter}&zoom=${zoom}&mode=walking&key=${process.env.NEXT_PUBLIC_GAPI_KEY}`}>
                        </iframe>
                    </div>
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
