'use client';

import {useState} from 'react';
import Selector from '@/components/selector';

export default function AppsContent({gsapp, aitool}) {
    const [curApp, setCurApp] = useState(0);
    const opts = [
        {
            val: 0,
            name: 'Simple Google Sheets Renderer App',
            app: gsapp,
        },
        {
            val: 1,
            name: 'Simple New App App',
            app: aitool,
        },
    ]

    const changeHandler = (val) => {
        setCurApp(val);
    }

    return (
        <div className="h-screen" id="nanoapps">
            <div className="h-screen pt-24">
                <div className="h-full flex flex-col">
                    <div className="mt-4 mx-12 grid grid-cols-2">
                        <Selector title="NanoApps" options={opts} changeHandler={changeHandler} />
                    </div>
                    {opts.filter((opt) => opt.val === curApp).map((opt) => (
                        <div className="overflow-y-auto" key={opt.val}>
                            {opt.app}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}