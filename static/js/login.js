document.addEventListener("DOMContentLoaded", () => {


// ==========================================
// ELEMENTS
// ==========================================

const form = document.getElementById("login");

const userName = document.getElementById("name");
const userAge = document.getElementById("age");
const userEmail = document.getElementById("email");
const userPassword = document.getElementById("password");

const loginBtn = document.getElementById("loginBtn");


// ==========================================
// URL PARAMETERS
// ==========================================

const params =
    new URLSearchParams(window.location.search);

const pName = params.get("name");
const pAge = params.get("age");
const pLevel = params.get("level");

if (pName) {
    userName.value = pName;
}

if (pAge) {
    userAge.value = pAge;
}

if (pLevel) {

    const radio =
        document.querySelector(
            `input[name="level"][value="${pLevel}"]`
        );

    if (radio) {
        radio.checked = true;
    }

}


// ==========================================
// VALIDATION
// ==========================================

function validateForm() {

    const name =
        userName.value.trim();

    const age =
        userAge.value.trim();

    const email =
        userEmail.value.trim();

    const password =
        userPassword.value.trim();

    const selected =
        document.querySelector(
            'input[name="level"]:checked'
        )?.value;


    const nameRule =
        /^[A-Za-z ]+$/;

    const emailRule =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    // ==========================================
    // NAME
    // ==========================================

    if (!name) {

        showGlassNotification(
            "Name required",
            "Please enter your name.",
            "warning"
        );

        userName.focus();
        return false;
    }


    if (!nameRule.test(name)) {

        showGlassNotification(
            "Invalid name",
            "Name must contain only letters (A-Z).",
            "error"
        );

        userName.focus();
        return false;
    }


    // ==========================================
    // AGE
    // ==========================================

    if (!age) {

        showGlassNotification(
            "Age required",
            "Please enter your age.",
            "warning"
        );

        userAge.focus();
        return false;
    }


    const ageNum =
        Number(age);


    if (
        !Number.isInteger(ageNum) ||
        ageNum < 1 ||
        ageNum > 100
    ) {

        showGlassNotification(
            "Invalid age",
            "Please enter a valid age between 1 and 100.",
            "error"
        );

        userAge.focus();
        return false;
    }


    // ==========================================
    // LEVEL
    // ==========================================

    if (!selected) {

        showGlassNotification(
            "Level required",
            "Please select your level.",
            "warning"
        );

        return false;
    }


    // ==========================================
    // EMAIL
    // ==========================================

    if (!email) {

        showGlassNotification(
            "Email required",
            "Please enter your email.",
            "warning"
        );

        userEmail.focus();
        return false;
    }


    if (!emailRule.test(email)) {

        showGlassNotification(
            "Invalid email",
            "Please enter a valid email address.",
            "error"
        );

        userEmail.focus();
        return false;
    }


    // ==========================================
    // PASSWORD
    // ==========================================

    if (!password) {

        showGlassNotification(
            "Password required",
            "Please enter your password.",
            "warning"
        );

        userPassword.focus();
        return false;
    }


    if (password.length < 6) {

        showGlassNotification(
            "Invalid password",
            "Password must be at least 6 characters.",
            "error"
        );

        userPassword.focus();
        return false;
    }


    return true;
}


// ==========================================
// REGISTER
// ==========================================

if (form) {

    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            // Stop if validation fails
            if (!validateForm()) {
                return;
            }


            const name =
                userName.value.trim();

            const age =
                userAge.value.trim();

            const email =
                userEmail.value.trim();

            const password =
                userPassword.value.trim();

            const selected =
                document.querySelector(
                    'input[name="level"]:checked'
                )?.value;


            try {

                console.log(
                    "Creating account..."
                );


                // ==================================
                // REGISTER
                // ==================================

                const response =
                    await fetch(
                        "http://localhost:3000/api/register",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                name,
                                age,
                                email,
                                password
                            })
                        }
                    );


                const data =
                    await response.json();


                console.log(
                    "Register response:",
                    data
                );


                // ==================================
                // REGISTRATION FAILED
                // ==================================

                if (!response.ok) {

                    if (
                        data.message ===
                        "Email already exists"
                    ) {

                        showGlassNotification(
                            "Email already registered",
                            "This email is already registered. Please log in instead.",
                            "warning"
                        );

                    } else {

                        showGlassNotification(
                            "Registration failed",
                            data.message ||
                            "Unable to create your account.",
                            "error"
                        );

                    }

                    return;
                }


                // ==================================
                // AUTOMATIC LOGIN
                // ==================================

                console.log(
                    "Registration successful. Logging in..."
                );


                const loginResponse =
                    await fetch(
                        "http://localhost:3000/api/login",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                email,
                                password
                            })
                        }
                    );


                const loginData =
                    await loginResponse.json();


                console.log(
                    "Automatic login response:",
                    loginData
                );


                // ==================================
                // AUTOMATIC LOGIN FAILED
                // ==================================

                if (!loginResponse.ok) {

                    showGlassNotification(
                        "Account created",
                        "Your account was created, but automatic login failed. Please log in manually.",
                        "warning"
                    );

                    return;
                }


                // ==================================
                // SAVE TOKEN
                // ==================================

                localStorage.setItem(
                    "token",
                    loginData.token
                );


                // ==================================
                // SAVE PROFILE
                // ==================================

                if (loginData.user) {

                    localStorage.setItem(
                        "myProfileData",
                        JSON.stringify(
                            loginData.user
                        )
                    );

                } else {

                    // Fallback if backend
                    // doesn't return user

                    localStorage.setItem(
                        "myProfileData",
                        JSON.stringify({
                            name: name,
                            age: age,
                            email: email
                        })
                    );

                }


                // ==================================
                // SAVE SUCCESS NOTIFICATION
                // ==================================

                saveProfileNotification(
                    "Welcome!",
                    "Your account has been created successfully.",
                    "success"
                );


                // ==================================
                // REDIRECT
                // ==================================

                if (selected) {

                    window.location.href =
                        selected;

                }

            }

            catch (error) {

                console.error(
                    "Registration error:",
                    error
                );

                showGlassNotification(
                    "Connection error",
                    "Unable to connect to the server. Please try again.",
                    "error"
                );

            }

        }
    );

}


// ==========================================
// LOGIN
// ==========================================

if (loginBtn) {

    loginBtn.addEventListener(
        "click",
        async (event) => {

            event.preventDefault();


            const email =
                userEmail.value.trim();

            const password =
                userPassword.value.trim();


            const selected =
                document.querySelector(
                    'input[name="level"]:checked'
                )?.value;


            const emailRule =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            // ==================================
            // EMAIL
            // ==================================

            if (!email) {

                showGlassNotification(
                    "Email required",
                    "Please enter your email.",
                    "warning"
                );

                userEmail.focus();
                return;
            }


            if (!emailRule.test(email)) {

                showGlassNotification(
                    "Invalid email",
                    "Please enter a valid email address.",
                    "error"
                );

                userEmail.focus();
                return;
            }


            // ==================================
            // PASSWORD
            // ==================================

            if (!password) {

                showGlassNotification(
                    "Password required",
                    "Please enter your password.",
                    "warning"
                );

                userPassword.focus();
                return;
            }


            if (password.length < 6) {

                showGlassNotification(
                    "Invalid password",
                    "Password must be at least 6 characters.",
                    "error"
                );

                userPassword.focus();
                return;
            }


            // ==================================
            // LEVEL
            // ==================================

            if (!selected) {

                showGlassNotification(
                    "Level required",
                    "Please select your level.",
                    "warning"
                );

                return;
            }


            try {

                console.log(
                    "Logging in..."
                );


                // ==================================
                // LOGIN REQUEST
                // ==================================

                const response =
                    await fetch(
                        "http://localhost:3000/api/login",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                email,
                                password
                            })
                        }
                    );


                const data =
                    await response.json();


                console.log(
                    "Login response:",
                    data
                );


                // ==================================
                // LOGIN FAILED
                // ==================================

                if (!response.ok) {

                    const message =
                        data.message ||
                        "Login failed.";


                    // Invalid email/password
                    showGlassNotification(
                        "Login failed",
                        message,
                        "error"
                    );

                    return;
                }


                // ==================================
                // SAVE TOKEN
                // ==================================

                localStorage.setItem(
                    "token",
                    data.token
                );


                // ==================================
                // SAVE PROFILE
                // ==================================

                if (data.user) {

                    localStorage.setItem(
                        "myProfileData",
                        JSON.stringify(
                            data.user
                        )
                    );

                }


                // ==================================
                // SAVE LOGIN NOTIFICATION
                // ==================================

                saveProfileNotification(
                    "Welcome back!",
                    "You have successfully logged in.",
                    "success"
                );


                // ==================================
                // REDIRECT
                // ==================================

                window.location.href =
                    selected;

            }

            catch (error) {

                console.error(
                    "Login error:",
                    error
                );

                showGlassNotification(
                    "Connection error",
                    "Unable to connect to the server. Please try again.",
                    "error"
                );

            }

        }
    );

}


});
