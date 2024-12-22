"use client"; // Marks the file as a Client Component

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  return (
    <div className="bg-gray-100">
      {/* Navigation Menu */}
        <div className="menu">
            <Image
            className="studbud-logo"
            src="/studbud-logo.svg"
            alt="Studbud Logo"
            width={100}
            height={100}
            />
            <div className="menu-content">
            <Link href="/home">Home</Link>
            <Link href="/about-us">About</Link>
            <Link href="/team">Team</Link>
            <Link href="/contact-us">Contact Us</Link>
            </div>
            <div className="sign-buttons">
            <button
                onClick={() => router.push("/login")}
                className="login-button w-full p-2 mt-4 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
                Login
            </button>
            <button
                onClick={() => router.push("/signup")}
                className="signup-button w-full p-2 mt-4 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
                Register
            </button>
            </div>


        </div>

        

        <div className="footer">
            <div className="white-space">
                <div className="footer-divisions">
                <Image
                src="/studbud-logo.svg"
                alt="Student Home"
                width={80}
                height={80}
                />
                <p> serves you in many ways, providing tools to enhance productivity, organization, and focus. Your success is our priority, every step of the way</p>
                </div>
                <div className="footer-divisions hide">
                <h6>MENU</h6>
                <ul>
                    <li><Link href="/home">Home</Link></li>
                    <li><Link href="/about-us">About</Link></li>
                    <li><Link href="/team">Team</Link></li>
                    <li><Link href="/contact-us">Contact Us</Link></li>
                </ul>
                </div>
                <div className="footer-divisions hide">
                <h6>CONTACT</h6>
                <ul>
                    <li>studbud@gmail.com</li>
                    <li>09453419798</li>
                    <br></br>
                    <li><Link href="/terms-of-service">Terms of Service</Link></li>
                </ul>
                </div>
            </div>


            <div className="green-space">
                <p>© 2024. StudBud - Student Study Tools.</p>
            </div>
            </div>
        </div>
    );
}