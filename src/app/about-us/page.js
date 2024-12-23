"use client"; // Marks the file as a Client Component

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import "../../styles/about-us.css";

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
            <h3 className="hide dots">.............................</h3>


        </div>

        <div className="about-main-section">
            <div className="about-section">
                <div className="picture-section">
                    <Image
                        src="/about-studying-1.svg"
                        alt="writing A+"
                        width={100}
                        height={100}
                    />
                </div>
                <div className="details-section">
                    <div className="top-details">
                    <h1>We helped Students</h1>
                    <p> reach their full potential</p>
                    </div>
                    <Link href="/signup" className="started">
                        Get Started
                    </Link>
                </div>
            </div>
            <div className="about-section reversed">
                <div className="picture-section">
                    <Image
                        src="/studbud-logo.svg"
                        alt="studbud logo"
                        width={100}
                        height={100}
                    />
                </div>
                <div className="details-section">
                    <p><b style={{color:"#3C6E71"}}>StudBud</b> is a comprehensive academic productivity platform designed to help students reach their full potential. </p>
                </div>
            </div>
            <div className="about-section">
                <div className="picture-section">
                    <Image
                        src="/about-study-2.svg"
                        alt="stressed studying"
                        width={100}
                        height={100}
                    />
                </div>
                <div className="details-section">
                    <p>Our <i><b style={{color:"#3C6E71"}}>mission</b></i> is to empower students with the tools and resources they need to streamline their studies, boost their focus, and achieve their academic goals.</p>
                </div>
            </div>
            <div className="about-section reversed">
                <div className="picture-section">
                    <Image
                        src="/about-study-3.svg"
                        alt="happy students"
                        width={100}
                        height={100}
                    />
                </div>
                <div className="details-section">
                    <p style={{fontStyle:"italic", fontWeight:"bold", fontSize:"20px"}}> "Sometimes you just need a <b style={{color:"#8aafb1" }}>StudBud</b> to make your academic life easier."</p>
                </div>
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