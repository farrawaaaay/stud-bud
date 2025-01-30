"use client"; // Required for client components in the App Router

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate an async operation (e.g., fetching user data)
    const loadData = async () => {
      try {
        // Example: Simulate data fetching
        await new Promise((resolve) => setTimeout(resolve, 2000));
        router.push("/home");
      } catch (error) {
        console.error("Error loading data", error);
      }
    };

    loadData();
  }, [router]);

  return (
    <div style={{ textAlign: "center", position: "relative", height: "90vh" }}>
      <div style={{
        position: "absolute",
        top: "50%",
        left: "45%",
        transform: "translate(-50%, -50%)",
      }}>
        <div className="loader">
          <Image
            className="example-class"
            src="/redirect.gif"
            alt="Redirect Animation"
            width={100}
            height={100}
            unoptimized={true}
          />
        </div>
      </div>
      <style jsx>{`
        .loader {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          width: 150px;
          height: 150px;
        }
        .loader:before {
          content: "";
          position: absolute;
          width: 150px;
          height: 150px;
          border: 10px solid #f3f3f3;
          border-top: 10px solid #3C6E71;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
