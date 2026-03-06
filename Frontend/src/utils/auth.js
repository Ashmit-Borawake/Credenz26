export const getToken = () => {
  return localStorage.getItem("token");
};

// Decode JWT token and check if it's expired
const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiryTime = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= expiryTime;
  } catch (error) {
    return true; // If we can't decode, consider it expired
  }
};

export const isAuthenticated = () => {
  const token = getToken();
  
  if (!token) return false;
  
  // Check if token is expired
  if (isTokenExpired(token)) {
    // Clear expired token
    localStorage.removeItem("token");
    localStorage.removeItem("profilePic");
    return false;
  }
  
  return true;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("profilePic");
};
