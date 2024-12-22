"use client"; // Marks the file as a Client Component

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import "../../styles/terms-of-service.css"; 

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

        <div className="main-section">
            <div className="intro">
                <h1>TERMS OF SERVICE</h1>
                <p>Before embarking on your academic journey with Studbud, it's essential to familiarize yourself with our Terms of Service. 
                    These terms outline the rules and conditions that govern your use of the platform. 
                    By understanding and adhering to these terms, you can ensure a smooth and positive experience.</p>
                <p>Studbud is more than just a web application. It's a digital companion designed to empower students. 
                    This innovative platform offers a suite of features to optimize study habits. 
                    These features include time management tools, focus aids, motivational quotes, note-taking features, and a supportive community forum. 
                    By using Studbud, students can improve time management, enhance focus, increase motivation, better organize their studies.</p>
            </div>

            <div className="column-container">
                <div className="column">
                    <div className="number">
                        <h2>1. Use of Service</h2>
                        <p>By accessing or using the Studbud website and its services, you agree to be bound by these Terms of Service. 
                            If you disagree with any part of these terms, please do not use our services.</p>
                    </div>
                    <div className="number">
                        <h2>2. User Conduct</h2>
                        <ul>
                            <li>Respectful Usage: You agree to use Studbud in a respectful and lawful manner.</li>
                            <li>No Harmful Content: You will not upload, share, or transmit any harmful, illegal, or offensive content.</li>
                            <li>Privacy of Others: You will respect the privacy of other users and not share their personal information without consent.</li>
                            </ul>
                    </div>
                    <div className="number">
                        <h2>3. Prohibited Use</h2>
                        <p>You agree not to:</p>
                            <ul>
                            <li>Violate any applicable laws or regulations.</li>
                            <li>Post or share content that is defamatory, </li>
                            <li>Transmit malicious code </li>
                            <li>Access or attempt to access restricted areas </li>
                            </ul>
                    </div>
                    <div className="number">
                        <h2>4. Privacy Policy</h2>
                        <p>Your privacy is important to us. 
                            Please refer to our separate Privacy Policy for details on how we collect, use, and protect your personal information. 
                            In compliance with the Data Privacy Act of 2012 (Republic Act No. 10173), we are committed to safeguarding your privacy and ensuring the secure handling of your personal data.</p>
                    </div>
                </div>

                <div className="column">
                    <div className="number">
                        <h2>5. Disclaimer of Warranties</h2>
                        <p>Studbud offers its services without any specific promises or guarantees. 
                            This means we don't assure a perfect, error-free platform. 
                            You use the service at your own risk, and we're not responsible for any problems or inaccuracies you might encounter.</p>
                    </div>
                    <div className="number">
                        <h2>6. Limitation of Liability</h2>
                        <p>We won't be held responsible for any indirect or accidental losses or damages that may arise from using Studbud. 
                            This means we're not liable for things like lost profits, data loss, or other indirect consequences.</p>
                    </div>
                    <div className="number">
                        <h2>7. Changes to Terms of Service</h2>
                        <p>We reserve the right to update these Terms of Service at any time. 
                            This means we may change the rules and conditions that govern your use of Studbud. 
                            We'll do our best to notify you of significant changes, but it's a good idea to review these Terms periodically. 
                            By continuing to use Studbud after these changes, you agree to be bound by them.</p>
                    </div>
                    <div className="number">
                        <h2>8. Termination</h2>
                        <p>We may terminate your access to Studbud at any time, with or without notice, for any reason, including violation of these Terms of Service.</p>
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