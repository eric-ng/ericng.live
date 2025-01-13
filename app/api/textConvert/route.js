const fs = require('fs');
const gTTS = require('gtts');
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import {getTokens} from 'next-firebase-auth-edge/lib/next/tokens';
import {serverConfig} from '@/auth/config';

const apiKey = process.env.GEMINI_AI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

const schema = {
    description: "Location description",
    type: SchemaType.ARRAY,
    items: {
        type: SchemaType.OBJECT,
        properties: {
            description: {
                type: SchemaType.STRING,
            },
        },
        required: [
            'description',
        ],
    },
};

const generateData = //unstable_cache(
    async (prompt) => {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent({
            contents: [
                {
                    role: 'User',
                    parts: [
                        {text: `
                        Please tell me more about the attraction ${prompt.name} in ${prompt.area}.  
                        And if there isn't any info, just return "N/A".
                        `}
                    ],
                },
            ],
            generationConfig: {
                // responseMimeType: 'application/json',
                // responseSchema: schema,
                temperature: 2
            },
        });
        return result.response.text();
    }//,
    // ['data'],
    // {
    //     revalidate: 3600,
    //     tags: ['data'],
    // }
// );

export async function POST(req) {
    const tokens = await getTokens(req.cookies, serverConfig);

    if (!tokens) {
        throw new Error('Unauthicated user');
    }
    const {prompt} = await req.json();
    const outFileName = `mp3s/${JSON.stringify(prompt).split('').map((e) => e.charCodeAt(0)).join('')}.mp3`;
    if (fs.existsSync(`public/${outFileName}`)) {
        return Response.json({ data: outFileName });
    }
    const data = await generateData(prompt);
    let resp = data;
    // const data = `**Gastown:** Vancouver's oldest neighbourhood, with Victorian architecture, cobblestone streets, and unique shops and restaurants.\n" +
    // '* **Robson Street:** A major shopping street with high-end boutiques and department stores.\n' +
    // '* **Granville Street:** Known for its entertainment and nightlife, with theatres, restaurants, and bars.\n' +
    // '* **Yaletown:** A trendy neighbourhood with modern architecture, upscale restaurants, and boutique hotels.\n' +
    // '* **Museum of Anthropology at UBC:** Stunning collection of First Nations art and artifacts.\n' +`;
    
    if (data.trim() === 'N/A') {
        resp = `This little attraction is a quick pit stop while you experience and enjoy the walk.  `;
    }

    const gtts = new gTTS(resp, 'en');
    await new Promise((res, rej) => {
        gtts.save(`public/${outFileName}`, function (err, result){
            if(err) {
                throw new Error(err);
            }
            res();
        });
    });

    return Response.json({ data: outFileName });
}

