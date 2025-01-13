import Profile from '@/app/walktripper/profile';
import CompLog from '@/app/walktripper/comp_log';

export default function AiTool({children}) {

    return (
        <div className="w-screen h-screen flex flex-col gap-2">
            <div className="max-h-[5%] basis-[5%] px-4 pt-2 flex bg-black text-slate-100">
                <CompLog />
                <div className="grow justify-items-end place-content-center">
                    <div>
                        <Profile />
                    </div>
                </div>
            </div>
            <div className="h-[90%]">
                {children}
            </div>
            <div className="basis-[5%] grow w-full">
                <div className="bg-slate-100 h-full p-4">
                    Copyright WalkTripper &copy; 2025
                </div>
            </div>
        </div>
    );
};
