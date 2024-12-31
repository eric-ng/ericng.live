const massageVal = (key, val) => {
    if (val.match(/^https?:\/\/\w+/)) {
        return <a className="text-sky-800" target="_blank" href={val}>{key}</a>;
    }
    return `${key}: ${val}`;
}

export default async function AppsContent() {
    const res = await fetch(`${process.env.SERVER}/api/gs`);
    const data = (await res.json()).data;
    console.log(process.env.SERVER, res, data);

    const keys = data.values[0];
    const rows = data.values.filter((val, ind) => ind > 0);
    
    return (
        <div className="h-screen" id="nanoapps">
            <div className="h-screen pt-24">
                <div className="h-full">
                    <div className="h-full overflow-y-auto">
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
                    </div>
                </div>
            </div>
        </div>
    );
}