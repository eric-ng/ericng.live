import Selector from '@/components/selector';
import GsApp from '@/app/porfo/@nanoapps/gsapp';

export default function AppsContent() {
    const opts = [
        {
            val: 0,
            name: 'Simple Google Sheets Renderer App',
        },
    ]

    const changeHandler = () => {
        
    }

    return (
        <div className="h-screen" id="nanoapps">
            <div className="h-screen pt-24">
                <div className="h-full flex flex-col">
                    <div className="mt-4 mx-12 grid grid-cols-2">
                        <Selector title="NanoApps" options={opts} />
                    </div>
                    <div className="overflow-y-auto">
                        <GsApp />
                    </div>
                </div>
            </div>
        </div>
    );
}