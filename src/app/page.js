import Image from "next/image";

export default function signIn() {
  return (
    <div className="flex h-screen">
      {/* Side Section */}
      <div className="rounded-rectangle">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">Hi, Welcome Back!</h1>
        <h3 className="mt-2 text-sm sm:text-base md:text-lg lg:text-xl">Don't have an account? <a href="#" className="click-here hover:underline">FarrahClick here</a></h3>
      </div>

      {/* Right Section - Sign In Form */}
      <div className="signin-form items-center w-1/2">
        <Image
          src="/studbud-logo.svg"  // Ensure the path starts with a leading slash and image is in the public folder
          alt="Studbud Logo"
          width={100}  // You can adjust the width and height
          height={100}  // Adjust height sas needed
        />
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">Sign in to your account</h2>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" action="#" method="POST">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-900">Username</label>
              <div className="mt-2">
                <input
                  type="username"
                  name="username"
                  id="username"
                  autoComplete="username"
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-900">Password</label>
                
              </div>
              <div className="mt-2">
                <input
                  type="password"
                  name="password"
                  id="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                />
              </div>
              <div className="text-sm mt-1 text-right">
                  <a href="#" className="forgot-password font-semibold">Forgot password?</a>
                </div>
            </div>

            <div>
            <button
                type="submit"
                className="button"
                >
                Sign in
            </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
