'use client';

import {useState, useEffect} from 'react';
import Rating from '@mui/material/Rating';

export default function OutputMsgBox({data = {name, address, desc, rating}}) {
    const [output, setOutput] = useState('');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [desc, setDesc] = useState('');
    const [showRating, setShowRating] = useState(false);

    const targetOutput = `${data.name}${data.address}${data.desc}`;

    useEffect(() => {
        console.log(output, targetOutput)
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
    }, [output]);

    return (
        <div className="p-2 rounded border border-sky-100">
            <div className="text-xl font-bold">{name}</div>
            <div className="text-sm italic text-slate-400">{address}</div>
            <div className="">{desc}</div>
            {showRating && <div className="">
                <Rating defaultValue={data.rating} size="small" precision={0.5} readOnly />
            </div>}
        </div>
    );
};
