import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import Image from "next/image";

export default function Home() {
  return (
    <div className="absolute w-screen h-screen top-0 left-0 bg-red-950">
      <div className="grid grid-cols-9 h-screen items-center justify-items-center text-gray-200">
        <CircleOutlinedIcon className="col-start-4"/>
        <CircleOutlinedIcon className="col-start-5"/>
        <CircleOutlinedIcon className="col-start-6"/>
      </div>
    </div>
  );
}
