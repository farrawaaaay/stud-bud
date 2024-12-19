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
          <Link href="#">Home</Link>
          <Link href="#">About</Link>
          <Link href="#">Team</Link>
          <Link href="#">Contact Us</Link>
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

      {/* Main Section */}
      <div className="main-section">
        {/* Section 1 */}
        <div className="section-1">
          <div className="section-1-start">
            <h1>Welcome to StudBud</h1>
            <p>Your personal study companion that helps you achieve your academic goals.</p>
            <Link href="/signup" className="get-started">
              Get Started
            </Link>
          </div>
          <div className="student-home-container">
            <Image
              src="/student-home.svg"
              alt="Student Home"
              width={500}
              height={500}
            />
          </div>
        </div>

        {/* Section 2 */}
        <div className="section-2">
          <div className="student-home-container-2">
            <Image
              src="/student-home-2.svg"
              alt="Student Home 2"
              width={500}
              height={500}
            />
          </div>
          <div className="section-1-start">
            <h1>About StudBud</h1>
            <p>
              Discover how StudBud is revolutionizing education by fostering collaboration, inclusivity,
              and innovation. Learn more about our mission, vision, and journey.
            </p>
            <Link href="/about-us" className="get-started">
              About Us
            </Link>
          </div>
        </div>

        {/* Section 3 */}
        <div className="section-3">
          <h1>
            Our Special <p>Features</p>
          </h1>
          <div className="features-section">

            <div className="divisions">
              <div className="feature-pic">
                  <Image 
                    src="/calendar-icon.svg"
                    alt="Student Home 2"
                    width={70}
                    height={70}
                  />
              </div>
              <div className="features">
                <h1>Calendar</h1>
                <p>This will allows students to see and set their schedules such as deadlines, school events, exams, and assignments.</p>
              </div>
            </div>

            <div className="divisions">
              <div className="feature-pic">
                  <Image 
                    src="/task-icon.svg"
                    alt="Student Home 2"
                    width={70}
                    height={70}
                  />
              </div>
              <div className="features">
                <h1>Task Manager</h1>
                <p>Through this task manager, students can efficiently track and organize tasks or activities, ensuring that deadlines are accomplished within a set time frame.</p>
              </div>
            </div>

            <div className="divisions">
              <div className="feature-pic">
                  <Image 
                    src="/file-icon.svg"
                    alt="Student Home 2"
                    width={70}
                    height={70}
                  />
              </div>
              <div className="features">
                <h1>File Manager</h1>
                <p>This will allow students to effectively manage, categorize, and access their academic files in one centralized location, so they can easily find their files.</p>
              </div>
            </div>

            <div className="divisions">
              <div className="feature-pic">
                  <Image 
                    src="/timer-icon.svg"
                    alt="Student Home 2"
                    width={70}
                    height={70}
                  />
              </div>
              <div className="features">
                <h1>Timer</h1>
                <p>A timer can be used by students to improve time management and increase productivity by setting specific times for studying or taking breaks while working on activities. This can help students improve focus, reduce procrastination, and maintain a balanced routine.</p>
              </div>
            </div>

            <div className="divisions">
              <div className="feature-pic">
                  <Image 
                    src="/music-icon.svg"
                    alt="Student Home 2"
                    width={70}
                    height={70}
                  />
              </div>
              <div className="features">
                <h1>Music</h1>
                <p>Listening to music while studying or doing any kind of activity can enhance focus and concentration during study sessions. That's why having these features helps students reduce stress and improve overall productivity.</p>
              </div>
            </div>

            <div className="divisions">
              <div className="feature-pic">
                  <Image 
                    src="/quotes-icon.svg"
                    alt="Student Home 2"
                    width={70}
                    height={70}
                  />
              </div>
              <div className="features">
                <h1>Quotes</h1>
                <p>Having a quotes feature in Studbud will help students to stay motivated and inspired throughout their academic works by providing them with uplifting quotes, fostering a positive mindset, and encouraging persistence in the face of challenges.</p>
              </div>
            </div>

            <div className="divisions">
              <div className="feature-pic">
                  <Image 
                    src="/notes-icon.svg"
                    alt="Student Home 2"
                    width={70}
                    height={70}
                  />
              </div>
              <div className="features">
                <h1>Notes</h1>
                <p>This notes feature of Studbud provides a similar feature to sticky notes, allowing students to quickly jot down ideas.</p>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
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
                <li><Link href="#">Home</Link></li>
                <li><Link href="#">About</Link></li>
                <li><Link href="#">Team</Link></li>
                <li><Link href="#">Contact Us</Link></li>
              </ul>
            </div>
            <div className="footer-divisions hide">
              <h6>CONTACT</h6>
              <ul>
                <li>studbud@gmail.com</li>
                <li>09453419798</li>
                <br></br>
                <li><Link href="#">Terms of Service</Link></li>
              </ul>
            </div>
          </div>


          <div className="green-space">
            <p>© 2024. StudBud - Student Study Tools.</p>
          </div>
        </div>


      </div>
    </div>
  );
}
