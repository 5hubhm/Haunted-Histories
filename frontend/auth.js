document.addEventListener("DOMContentLoaded", async function () {
    async function checkAccess() {
      try {
        const response = await fetch('/api/auth/check-session', { credentials: 'include' });
        const data = await response.json();
  
        // Get the navigation buttons
        const loginButton = document.getElementById("login-button");
        const signupButton = document.getElementById("signup-button");
        const logoutButton = document.getElementById("logout-button");
  
        if (data.loggedIn) {
          // Hide login and signup, show logout
          if (loginButton) loginButton.style.display = "none";
          if (signupButton) signupButton.style.display = "none";
          if (logoutButton) logoutButton.style.display = "inline-block";
        } else {
          // Show login and signup, hide logout
          if (loginButton) loginButton.style.display = "inline-block";
          if (signupButton) signupButton.style.display = "inline-block";
          if (logoutButton) logoutButton.style.display = "none";
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    }
  
    await checkAccess();
  });
  
  // Logout function
  async function logout() {
    try {
      const response = await fetch(`/api/auth/logout`, { method: 'POST', credentials: 'include' });
      const data = await response.json();
  
      if (data.message === 'Logged out successfully') {
        alert("You have been logged out!");
        window.location.href = '/index.html';
      } else {
        alert("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("Something went wrong. Please try again later.");
    }
  }
  