export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Invalid email format";
    if (email.length > 100) return "Email must be less than 100 characters";
    return "";
  };
  
  export const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (password.length > 50) return "Password must be less than 50 characters";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter";
    if (!/[0-9]/.test(password)) return "Password must contain at least one number";
    if (!/[!@#$%^&*]/.test(password)) return "Password must contain at least one special character (!@#$%^&*)";
    return "";
  };
  
  export const validateFullName = (fullName) => {
    if (!fullName) return "Full name is required";
    if (fullName.length < 2) return "Full name must be at least 2 characters";
    if (fullName.length > 100) return "Full name must be less than 100 characters";
    if (!/^[a-zA-Z\s'-]+$/.test(fullName)) return "Full name can only contain letters, spaces, hyphens and apostrophes";
    return "";
  };