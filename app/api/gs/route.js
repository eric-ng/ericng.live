import { unstable_cache } from 'next/cache'

export const dynamic = 'force-static';

const sid = '1I5mNOVEeoXmZrpY3nleFyeGOyveE-XBpOGmfpOAWT7k';
const apiKey = 'AIzaSyAzQEXsrf52MBOppNadGF9sj5wU50j5FXM';
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