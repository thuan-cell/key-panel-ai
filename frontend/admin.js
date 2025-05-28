// Đăng nhập admin → Gọi API để bật quyền truy cập toàn cục
function adminLogin() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  // Simple hardcoded check for demonstration. In a real app, use secure authentication
  // and ideally send credentials to the backend for verification.
  // For this example, we'll keep the client-side check but emphasize it's insecure.
  if (username === "admin" && password === "admin123") {
    // Call backend API to grant global access
    fetch("/api/grant-access", { method: "POST" })
      .then(response => {
        if (!response.ok) {
          // Check for specific error responses from the backend if needed
          if (response.status === 401) { // Example: Unauthorized
             throw new Error('Authentication failed on backend.');
          }
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        // Assuming the API returns success status or text
        return response.text();
      })
      .then(() => {
        // Access granted successfully by the backend
        Swal.fire("Thành công", "Đã cấp quyền truy cập toàn cục!", "success")
          .then(() => {
            // Redirect to index.html after successful access grant
            window.location.href = "/index.html";
          });
      })
      .catch(error => {
        console.error("Error granting access:", error);
        // Display a more specific error if the backend provided one
        const errorMessage = error.message.includes('API') || error.message.includes('Network')
                             ? "Không thể cấp quyền truy cập. Vui lòng thử lại."
                             : error.message; // Use backend error if available
        Swal.fire("Lỗi", errorMessage, "error");
      });
  } else {
    Swal.fire("Lỗi", "Sai tài khoản hoặc mật khẩu!", "error");
  }
}


// Đăng xuất admin → Thu hồi quyền truy cập toàn cục
function adminLogout() {
  // Call backend API to revoke global access
  fetch("/api/revoke-access", { method: "POST" })
    .then(response => {
      if (!response.ok) {
         // Check for specific error responses from the backend if needed
         throw new Error(`Network response was not ok: ${response.status}`);
      }
      // Assuming the API returns success status or text
      return response.text();
    })
    .then(() => {
      // Access revoked successfully by the backend
      Swal.fire("Đăng xuất", "Quyền truy cập đã bị thu hồi", "info")
        .then(() => {
          // Redirect back to the admin login page or reload
          window.location.href = "/admin.html"; // Redirect to login page
        });
    })
    .catch(error => {
      console.error("Error revoking access:", error);
      Swal.fire("Lỗi API", "Không thể thu hồi quyền truy cập. Vui lòng thử lại.", "error");
    });
}

// Attach event listeners when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Attach event listener to the login button
  const loginButton = document.getElementById('loginButton'); // Assuming your login button has this ID
  if (loginButton) {
    loginButton.addEventListener('click', adminLogin);
  } else {
    console.error("Login button with ID 'loginButton' not found.");
  }

  // Attach event listener to the logout button (if it exists on this page)
  // Note: The logout button might only be shown on index.html or another page
  // if the admin is already logged in. If it's on admin.html, it would typically
  // only be shown *after* a successful login, which would redirect away.
  // However, keeping the listener attachment here for completeness if the UI logic changes.
  const logoutButton = document.getElementById('adminLogoutButton'); // Assuming you have a logout button
  if (logoutButton) {
    logoutButton.addEventListener('click', adminLogout);
  } else {
     // This is expected if the logout button is not on admin.html initially
     console.log("Logout button with ID 'adminLogoutButton' not found on this page.");
  }

  // Note: The logic to show/hide login/logout forms based on a *global* admin state
  // should ideally involve checking the backend state when the page loads,
  // similar to how index.html will check before loading genkey.js.
  // However, for simplicity in admin.js, we primarily focus on the login/logout actions
  // that *change* the backend state and then redirect.
  // The previous local storage check is removed as it's not suitable for cross-machine control.
});

// Note: Controlling genkey.js loading on index.html based on admin login state
// requires changes in index.html. index.html must check the *backend* state
// (e.g., via a new API endpoint like /api/check-access) to determine if genkey.js
// should be dynamically loaded. The admin.js file is only responsible for
// changing that backend state via grant/revoke API calls.
// The local storage flag 'isAdminLoggedIn' is removed as it's not used for
// the cross-machine access control requirement.
