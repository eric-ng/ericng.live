const massageVal = (key, val) => {
    if (val.match(/^https?:\/\/\w+/)) {
        return <a className="text-sky-800" target="_blank" href={val}>{key}</a>;
    }
    return `${key}: ${val}`;
}

export default async function GsApp() {
    let keys = [];
    let rows = [];

    try {
        const res = await fetch(`${process.env.SERVER}/api/gs`);
        if (!res.ok) {
            throw new Error('Something went wrong.');
        }
        const data = (await res.json()).data;
        if (data.error) {
            throw new Error(`Something went wrong with the API.  ${JSON.stringify(data)}`);
        }

        keys = data.values[0];
        rows = data.values.filter((val, ind) => ind > 0);
    } catch (e) {
        console.log(e);
        return null;
    }

    return (
        <div className="m-12 grid divide-y divide-slate-300">
            {rows.map((row, ind) => {
                return (
                    <div key={`nanoapps-rows-${ind}`} className="bg-slate-100 shadow p-4">
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
                );
            })}
        </div>
    );
}