'use client';

import { remark } from 'remark';
import html from 'remark-html';
import { useState } from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import LoopOutlinedIcon from '@mui/icons-material/LoopOutlined';

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
        // console.log(JSON.parse(await res.text()));
        const data = (await res.json()).data;
        if (data.error) {
            throw new Error(`Something went wrong with the API.  ${JSON.stringify(data)}`);
        }

        const processedData = await remark().use(html).process(data);
        return processedData.value;
    } catch (e) {
        console.log(e);
        return [];
    }
}

export default function AiTool() {
    const [prompt, setPrompt] = useState('');
    const [outputs, setOutputs] = useState([]);
    const [loading, setLoading] = useState(false);
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
            setLoading(true);
            const tmpPrompt = prompt;
            const tmpOutputs = [...outputs];
            setPrompt('');
            const data = await getResp(prompt);
            let outputData = '';
            const intRef = setInterval(() => {
                if (outputData === data) {
                    clearInterval(intRef);
                    setLoading(false);
                } else {
                    setOutputs([
                        ...tmpOutputs,
                        {
                            role: 'user',
                            data: tmpPrompt,
                        },
                        {
                            role: 'model',
                            data: outputData,
                        },
                    ]);
                    document.getElementById('scrollRef').scrollIntoView(false);
                    outputData = data.substring(0, outputData.length + 1);
                }
            }, 1);
        }
    }
    return (
        <div className="mx-12 flex h-full">
            <div className="grid h-full w-full">
                <div className="prompt-chat my-4 grid gap-4 overflow-y-auto">
                    {outputs.map((line, ind) => {
                        if (line.role === 'user') {
                            return (
                                <div 
                                    className="bg-green-200 py-2 px-4 w-3/4 justify-self-end content-center text-end rounded-lg"
                                    key={`prompt-chat-${line.role}-${ind}`}
                                >
                                    {line.data}
                                </div>
                            );
                        } else {
                            return (
                                <div 
                                    key={`prompt-chat-${line.role}-${ind}`} 
                                    dangerouslySetInnerHTML={{ __html: line.data }} 
                                />
                            );
                        }
                    })}
                    <div id="scrollRef"></div>
                </div>
                <div className="w-full mb-4">
                    <OutlinedInput
                        className="w-full"
                        placeholder={'Start typing...'}
                        value={prompt}
                        onChange={changeHandler}
                        onKeyDown={keyHandler}
                        disabled={loading}
                        endAdornment={
                        <InputAdornment position="end">
                            {!loading && 
                                <SendOutlinedIcon className="cursor-pointer" onClick={sendResp} />
                            }
                            {loading &&
                                <LoopOutlinedIcon className="prompt-loader" />
                            }
                        </InputAdornment>
                        }
                    />
                </div>
            </div>
        </div>
    );
};
