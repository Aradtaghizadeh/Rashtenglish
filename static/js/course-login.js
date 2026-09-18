document.addEventListener("DOMContentLoaded", async () => {

    console.log("course-login loaded");

    // If already logged in, verify token
    const token = localStorage.getItem("token");

    if (token) {
        try {
            const response = await fetch(
                "http://localhost:3000/api/verify-token",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.ok) {
                window.location.href = "german-courses.html";
                return;
            }

            localStorage.removeItem("token");

        } catch (err) {
            console.error(err);
            localStorage.removeItem("token");
        }
    }

    // Login button
    const loginBtn = document.getElementById("loginBtn");

    loginBtn.addEventListener("click", async () => {

        console.log("Login button clicked");

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!email || !password) {
            alert("Please enter email and password");
            return;
        }

        try {

            const response = await fetch(
                "http://localhost:3000/api/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            console.log(data);

            if (!response.ok) {
                alert(data.message);
                return;
            }

            localStorage.setItem("token", data.token);

            alert("Login successful");

            window.location.href = "german-courses.html";

        } catch (err) {

            console.error(err);

            alert("Server error");
        }

    });

});