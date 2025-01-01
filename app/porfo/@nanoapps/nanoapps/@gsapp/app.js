'use client';

import { useEffect, useState } from 'react';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';

const massageVal = (key, val) => {
    if (val.match(/^https?:\/\/\w+/)) {
        return <a className="text-sky-800" target="_blank" href={val}>{key}</a>;
    }
    return `${key}: ${val}`;
}

const getData = async () => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/gs`);
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

export default function App({term = ''}) {
    const [keys, setKeys] = useState([]);
    const [rows, setRows] = useState([]);
    useEffect(() => {
        (async () => {
            const tmpdata = await getData();
            if(tmpdata.values) {
                setKeys(tmpdata.values[0]);
                setRows(tmpdata.values.filter((val, ind) => {
                    return ind > 0
                        && (term != '' ? val.indexOf(term) > -1 : true);
                }));
            }
        })();
    }, []);

    const handleDrill = () => {

    }

    return (
        <div className="grid divide-y divide-slate-300">
            {rows.filter((row) => (term != '' ? row[0].toLowerCase().indexOf(term) > -1 : true)).map((row, ind) => {
                return (
                    <div key={`nanoapps-rows-${ind}`} className="flex bg-slate-100 shadow p-4">
                        <div className="grow">
                            <div className="text-2xl font-sans">{row[0]}</div>
                            {keys.map((key, ind) => {
                                if (ind === 0) {
                                    return null;
                                }
                                return (
                                    <div key={key}>{
                                        massageVal(key, row[ind])
                                    }</div>
                                );
                            })}
                        </div>
                        <div className="place-content-center px-2 hover:bg-slate-200 cursor-pointer" onClick={handleDrill}>
                            <ArrowForwardIosOutlinedIcon />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}