import LoaderScreen from '@/components/loaderScreen';
import Image from "next/image";

export default function Home() {
  return (
    <LoaderScreen redirDest="/porfo" />
  );
}
