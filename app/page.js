'use client';

import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import {useRouter} from 'next/navigation';
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  setTimeout(() => {
    router.push('/porfo');
  }, 1500);
  return (
    <div className="absolute w-screen h-screen top-0 left-0 bg-slate-950 z-20">
      <div className="grid grid-cols-9 h-screen items-center justify-items-center text-gray-200">
        <CircleOutlinedIcon className="loader-dot col-start-4"/>
        <CircleOutlinedIcon className="loader-dot col-start-5" style={{animationDelay: '300ms'}}/>
        <CircleOutlinedIcon className="loader-dot col-start-6" style={{animationDelay: '600ms'}}/>
      </div>
    </div>
  );
}
