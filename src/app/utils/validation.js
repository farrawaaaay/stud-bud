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
  
  export const validateUsername = (name) => {
    if (!name) return "Username is required";
    if (name.length < 3) return "Username must be at least 3 characters";
    if (name.length > 100) return "Username must be less than 100 characters";
    if (!/^[a-zA-Z0-9\s'-]+$/.test(name)) return "Username can only contain letters, numbers, spaces, hyphens, and apostrophes";
    return "";
};