import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const apiKey = process.env.GEMINI_AI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

const schema = {
    description: "List of locations",
    type: SchemaType.ARRAY,
    items: {
        type: SchemaType.OBJECT,
        properties: {
            locationName: {
                type: SchemaType.STRING,
                description: "Name of the location",
                nullable: false,
            },
            address: {
                type: SchemaType.STRING,
            },
            regionCode: {
                type: SchemaType.STRING,
            },
            longitude: {
                type: SchemaType.NUMBER,
            },
            latitude: {
                type: SchemaType.NUMBER,
            },
            description: {
                type: SchemaType.STRING,
            },
            rating: {
                type: SchemaType.NUMBER,
            },
        },
        required: [
            'locationName',
            'description',
            'longitude',
            'latitude',
            'rating',
            'regionCode',
            'address',
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
                        {text: `Please list up to 10 tourist attractions locations within 30 mins of walking distance from ${prompt}`}
                    ],
                },
            ],
            generationConfig: {
                responseMimeType: 'application/json',
                responseSchema: schema,
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
    const {prompt} = await req.json();
    const data = await generateData(prompt);

    return Response.json({ data });
    // const data = ("Vancouver offers a diverse range of attractions! To give you the best recommendations, tell me what you're interested in.  But in the meantime, here are some suggestions categorized by interest:\n" +
    // '\n' +
    // '**For the Nature Lover:**\n' +
    // '\n' +
    // '* **Stanley Park:** A massive urban park with stunning seawall views, beaches, totem poles, and lush forests. Rent bikes, walk, or run along the seawall.\n' +
    // "* **Granville Island Market:**  While bustling, it's set on the waterfront with views of the city and harbour.\n" +
    // '* **Capilano Suspension Bridge Park:** A thrilling walk across a swaying suspension bridge high above the Capilano River, with treetop walks and Cliffwalk. (Can be pricey)\n' +
    // '* **Queen Elizabeth Park:** Beautiful gardens, stunning city views, and the Bloedel Conservatory (tropical rainforest).\n' +
    // '* **Cypress Mountain:** Hiking and mountain biking trails in summer, and skiing and snowboarding in winter.  (Requires a drive outside the city)\n' +
    // '* **Deep Cove:** A charming seaside village with kayaking and hiking opportunities.\n' +
    // '\n' +
    // '\n' +
    // '**For the City Explorer:**\n' +
    // '\n' +
    // "* **Gastown:** Vancouver's oldest neighbourhood, with Victorian architecture, cobblestone streets, and unique shops and restaurants.\n" +
    // '* **Robson Street:** A major shopping street with high-end boutiques and department stores.\n' +
    // '* **Granville Street:** Known for its entertainment and nightlife, with theatres, restaurants, and bars.\n' +
    // '* **Yaletown:** A trendy neighbourhood with modern architecture, upscale restaurants, and boutique hotels.\n' +
    // '* **Museum of Anthropology at UBC:** Stunning collection of First Nations art and artifacts.\n' +
    // '\n' +
    // '\n' +
    // '**For the Foodie:**\n' +
    // '\n' +
    // '* **Granville Island Market:** As mentioned above, a must-visit for fresh produce, seafood, and diverse food stalls.\n' +
    // '* **Main Street:** A vibrant area with numerous restaurants and cafes catering to various tastes.\n' +
    // '* **Commercial Drive:** Known for its diverse culinary scene, with many ethnic restaurants and cafes.\n' +
    // '* **Richmond:** (Requires a short drive)  Home to a huge selection of Asian restaurants.\n' +
    // '\n' +
    // '\n' +
    // '**For the Arts & Culture Enthusiast:**\n' +
    // '\n' +
    // '* **Museum of Anthropology at UBC:** (As mentioned above)\n' +
    // '* **Vancouver Art Gallery:** Showcases a diverse collection of both Canadian and international art.\n' +
    // '* **Science World:** Interactive science museum, great for families.\n' +
    // '\n' +
    // '\n' +
    // 'To help me narrow down the best suggestions for *you*, tell me:\n' +
    // '\n' +
    // '* **What kind of activities do you enjoy?** (hiking, shopping, museums, etc.)\n' +
    // '* **How much time do you have?**\n' +
    // "* **What's your budget?**\n" +
    // '* **Who are you travelling with?** (solo, partner, family, friends)\n' +
    // '\n' +
    // 'With more information, I can give you much more specific and helpful recommendations.\n');
    // return Response.json({ data });
}