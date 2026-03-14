import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src="/new-logo.png"   // or new-logo.svg
      alt="RentNowEasy Logo"
      width={80}
      height={40}
      priority
      className="object-contain"
    />
  );
}