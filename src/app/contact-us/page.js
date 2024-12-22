"use client"; // Marks the file as a Client Component

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import "../../styles/contact-us.css";

import { FiMapPin, FiMail, FiPhone } from "react-icons/fi";

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
            <Link href="/contact-us ">Contact Us</Link>
            </div>
            <h3 className="hide dots">.............................</h3>
        </div>

        <div className="contact-main-section">
            <div className="form-container">
                <div className="contact-side">
                    <h2>CONTACT US</h2>
                    <ul>
                        <li><FiMapPin /> 8474+9MV, Tiongco Subdivision, 
                        Santa Rosa, Laguna</li>
                        <li><FiMail /> studbud@gmail.com</li>
                        <li><FiPhone /> 09453419798</li>
                    </ul>
                </div>
                <div className="form-side">
                    <div className="form-side-content">
                        <h1>Get in Touch</h1>
                        <p>Feel free to write your thoughts.</p>
                        <form className="form">
                            <div className="form-group">
                                    <label htmlFor="name">Name</label>
                                    <input type="text" id="name" name="name" placeholder="Enter your name" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input type="email" id="email" name="email" placeholder="Enter your email" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="message">Message</label>
                                <textarea id="message" name="message" rows="5" placeholder="Enter your message" required></textarea>
                            </div>
                            <button type="submit" className="submit-button">Submit</button>
                        </form>
                               
                    </div>        
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