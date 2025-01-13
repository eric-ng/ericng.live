'use client';

import {useEffect, useState} from 'react';

export default function () {
    const [s, setS] = useState();
    useEffect(() => {
        (async () => {
            const prompt = 'Please show me how';
            try {
                const rest = await fetch(`https://ericng.live/api/simplegen`, {
                    method: 'POST',
                    body: JSON.stringify({prompt}),
                });
                const {data} = await rest.json();
                setS(data);
                return (data);
            } catch (e) {
                console.log(e);
            }
        })();
    }, []);
    return (
        <div>
            {s}
        </div>
    )
}