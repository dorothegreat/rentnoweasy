import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src="/logo.png"   // or logo.svg
      alt="RentNowEasy Logo"
      width={140}
      height={40}
      priority
      className="object-contain"
    />
  );
}