"use client"; // Required for client components in the App Router

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";


export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the landing page after 3 seconds
    const timer = setTimeout(() => {
      router.push("/home");
    }, 3000);

    // Cleanup the timer when the component unmounts
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <Image
        className="example-class"
        src="/redirect.gif"
        alt="Redirect Animation"
        width={100}
        height={100}
        unoptimized={true}
      />
    </div>
  );
}
