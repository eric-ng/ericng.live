import { unstable_cache } from 'next/cache'

export const dynamic = 'force-static';

const sid = process.env.NA_SID;
const apiKey = process.env.GAPI_KEY;
const url = `https://sheets.googleapis.com/v4/spreadsheets/${sid}/values/Sheet1?key=${apiKey}`;

const getData = unstable_cache(
    async () => {
        const res = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return await res.json();
    },
    ['data'],
    {
        revalidate: 3600,
        tags: ['data'],
    }
);

export async function GET() {
    const data = await getData();

    return Response.json({ data });
}