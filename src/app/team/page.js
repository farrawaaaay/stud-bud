"use client"; // Marks the file as a Client Component

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import "../../styles/team.css";
import { MdAlternateEmail, MdFacebook } from "react-icons/md";
    

export default function Home() {
  const router = useRouter();
  const accounts = [
    { name: "Jonlee A. Altar", email: "altarjonlee@gmail.com", facebook: "https://www.facebook.com/jonlee.altar.3", role: "Business Analyst" },
    { name: "Yuan Angelo B. Fedelino", email: "yuanfedelino@gmail.com", facebook: "https://www.facebook.com/yuanangelo.fedelino", role: "Quality Assurance"},
    { name: "Melchizedek Haynes", email: "senyahmelchi124@gmail.com", facebook: "https://www.facebook.com/melchi123", role: "Business Analyst" },
    { name: "Alexandre Jerwen M. Jacquez", email: "alexjacquez0811@gmail.com", facebook: "https://www.facebook.com/gentle.11", role: "Developer || UI/UX Designer" },
    { name: "Farrah Mae L. Magana", email: "farrahmaemagana@gmail.com", facebook: "https://www.facebook.com/Farrawaaaay", role: "Quality Assurance || Developer" },
    { name: "Isaiah Rohan P. Perez", email: "rohanperez01@gmail.com", facebook: "https://www.facebook.com/26haaan", role: "Project Manager" },
  ];


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

        <div className="team-main-section">
            <div className="gallery">
                <div className="gallery-photo-1">
                <Image
                            src="/yuan.svg"
                            alt="Yuan Angelo Fedelino"
                            width={100}
                            height={100}
                        />
                </div>
                <div className="gallery-photo-2">
                <Image
                            src="/melchizedek.svg"
                            alt="Melchizedek Haynes"
                            width={100}
                            height={100}
                        />
                </div>
                <div className="gallery-photo-3">
                        <Image
                            src="/farrah.svg"
                            alt="Farrah Mae Magana"
                            width={100}
                            height={100}
                        />
                </div>
                <div className="gallery-photo-4">
                    <Image
                            src="/isaiah.svg"
                            alt="Isaiah Rohan Perez"
                            width={100}
                            height={100}
                        />
                </div>
                <div className="gallery-photo-5">
                <Image
                            src="/jonlee.svg"
                            alt="Jonlee Altar"
                            width={100}
                            height={100}
                        />
                </div>
                <div className="gallery-photo-6">
                    <Image
                            src="/alexandre.svg"
                            alt="Alexandre Jerwen M. Jacquez"
                            width={100}
                            height={100}
                        />
                </div>
            </div>
            <h1>Meet our TEAM</h1>
            <div className="team-container">
            {accounts.map((account, index) => (
                <div key={index} className={`member-container ${index % 2 === 1 ? "reversed" : ""}`}>
                    <div className="member-details">
                        <h2>{account.name}</h2>
                        <p>{account.role}</p>
                        <br/>
                        <div className="socials">
                            <a href={`mailto:${account.email}`} aria-label={`Email ${account.name}`}>
                            <MdAlternateEmail size={20} />
                            </a>
                            <a href={account.facebook} target="_blank" rel="noopener noreferrer">
                            <MdFacebook size={20} />
                            </a>
                        </div>
                    </div>
                    <div className="member-photo-container">
                        <Image
                        className="member-photo"
                        src={`/${account.name.toLowerCase().split(" ")[0]}.svg`}
                        alt={account.name}
                        width={100}
                        height={100}
                        />
                    </div>
                </div>
            ))}
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