/* =========================================================
   PROFILE.JS
   Local + Production
========================================================= */


/* =========================================================
   API BASE
========================================================= */

const isLocal =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

const API_BASE = isLocal
    ? "http://localhost:3000/api"
    : "/api";


/* =========================================================
   AUTHENTICATION
========================================================= */

const token =
    localStorage.getItem("token");

if (!token) {

    window.location.href = "login.html";

}


/* =========================================================
   DOM ELEMENTS
========================================================= */

const profileName =
    document.getElementById("profileName");

const editName =
    document.getElementById("editName");

const editAge =
    document.getElementById("editAge");

const editEmail =
    document.getElementById("editEmail");

const editPassword =
    document.getElementById("editPassword");

const memberSince =
    document.getElementById("memberSince");

const lastLogin =
    document.getElementById("lastLogin");

const editBtn =
    document.getElementById("editProfileBtn");

const saveBtn =
    document.getElementById("saveProfileBtn");

const profileImage =
    document.getElementById("profileImage");

const defaultAvatar =
    document.getElementById("defaultAvatar");

const photoInput =
    document.getElementById("photoInput");

const deletePhoto =
    document.getElementById("deletePhoto");

const profilePhoto =
    document.querySelector(".profile-photo");

const messageBox =
    document.getElementById("messageBox");

const logoutBtn =
    document.getElementById("logoutBtn");

const clearMessagesBtn =
    document.getElementById("clearMessages");


/* =========================================================
   ORIGINAL PROFILE
========================================================= */

let originalProfile = {};

let isEditing = false;


/* =========================================================
   API REQUEST
========================================================= */

async function apiRequest(
    endpoint,
    options = {}
) {

    const requestOptions = {
        ...options,

        headers: {
            ...(options.headers || {})
        }
    };


    /*
     * Do not add Content-Type when using FormData.
     *
     * The browser automatically creates:
     *
     * multipart/form-data; boundary=...
     */

    if (!(options.body instanceof FormData)) {

        requestOptions.headers["Content-Type"] =
            requestOptions.headers["Content-Type"] ||
            "application/json";

    }


    /*
     * Add authentication token.
     */

    if (token) {

        requestOptions.headers.Authorization =
            `Bearer ${token}`;

    }


    let response;


    try {

        response =
            await fetch(
                `${API_BASE}${endpoint}`,
                requestOptions
            );

    }

    catch (error) {

        console.error(
            "Network error:",
            error
        );

        throw new Error(
            "Unable to connect to the server. Make sure the backend server is running on http://localhost:3000."
        );

    }


    /*
     * Read response safely.
     */

    const contentType =
        response.headers.get(
            "content-type"
        ) || "";


    let data;


    if (
        contentType.includes(
            "application/json"
        )
    ) {

        try {

            data =
                await response.json();

        }

        catch (error) {

            data = {
                message:
                    "The server returned invalid JSON."
            };

        }

    }

    else {

        const text =
            await response.text();

        data = {

            message:
                text ||
                `Request failed (${response.status})`

        };

    }


    /*
     * Handle HTTP errors.
     */

    if (!response.ok) {

        throw new Error(
            data.message ||
            data.error ||
            `Request failed (${response.status})`
        );

    }


    return data;

}


/* =========================================================
   SAFE JSON PARSE
========================================================= */

function getStoredProfile() {

    try {

        return (
            JSON.parse(
                localStorage.getItem(
                    "myProfileData"
                )
            ) || {}
        );

    }

    catch (error) {

        console.error(
            "Profile JSON error:",
            error
        );

        return {};

    }

}


/* =========================================================
   DATE FORMAT
========================================================= */

function formatDate(date) {

    if (!date) {

        return "Not available";

    }


    const parsed =
        new Date(date);


    if (
        Number.isNaN(
            parsed.getTime()
        )
    ) {

        return "Not available";

    }


    return parsed.toLocaleDateString(
        undefined,
        {
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );

}


/* =========================================================
   DATE + TIME FORMAT
========================================================= */

function formatDateTime(date) {

    if (!date) {

        return "Not available";

    }


    const parsed =
        new Date(date);


    if (
        Number.isNaN(
            parsed.getTime()
        )
    ) {

        return "Not available";

    }


    return parsed.toLocaleString(
        undefined,
        {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


/* =========================================================
   LOAD STORED PROFILE
========================================================= */

function loadStoredProfile() {

    const data =
        getStoredProfile();


    if (
        !data ||
        Object.keys(data).length === 0
    ) {

        if (profileName) {

            profileName.textContent =
                "No profile found.";

        }

        return;

    }


    if (profileName) {

        profileName.textContent =
            data.name ||
            "Unknown User";

    }


    if (editName) {

        editName.value =
            data.name ||
            "";

    }


    if (editAge) {

        editAge.value =
            data.age ||
            "";

    }


    if (editEmail) {

        editEmail.value =
            data.email ||
            "";

    }


    if (editPassword) {

        editPassword.value =
            "********";

    }


    originalProfile = {

        name:
            data.name ||
            "",

        age:
            String(
                data.age ||
                ""
            ),

        email:
            data.email ||
            ""

    };

}


/* =========================================================
   LOAD ACCOUNT FROM SERVER
========================================================= */

async function loadAccountInformation() {

    try {

        const data =
            await apiRequest(
                "/me",
                {
                    method: "GET"
                }
            );


        const user =
            data.user ||
            data;


        if (!user) {

            throw new Error(
                "User information was not returned by the server."
            );

        }


        /*
         * Save latest server profile.
         */

        localStorage.setItem(
            "myProfileData",
            JSON.stringify(user)
        );


        /* ==========================
           NAME
        ========================== */

        if (profileName) {

            profileName.textContent =
                user.name ||
                "Unknown User";

        }


        /* ==========================
           EDIT NAME
        ========================== */

        if (editName) {

            editName.value =
                user.name ||
                "";

        }


        /* ==========================
           EDIT AGE
        ========================== */

        if (editAge) {

            editAge.value =
                user.age ||
                "";

        }


        /* ==========================
           EDIT EMAIL
        ========================== */

        if (editEmail) {

            editEmail.value =
                user.email ||
                "";

        }


        /* ==========================
           PASSWORD
        ========================== */

        if (editPassword) {

            editPassword.value =
                "********";

        }


        /* ==========================
           MEMBER SINCE
        ========================== */

        if (memberSince) {

            memberSince.textContent =
                formatDate(
                    user.createdAt ||
                    user.created_at ||
                    user.memberSince
                );

        }


        /* ==========================
           LAST LOGIN
        ========================== */

        if (lastLogin) {

            lastLogin.textContent =
                formatDateTime(
                    user.lastLogin ||
                    user.last_login
                );

        }


        /* ==========================
           ORIGINAL PROFILE
        ========================== */

        originalProfile = {

            name:
                user.name ||
                "",

            age:
                String(
                    user.age ||
                    ""
                ),

            email:
                user.email ||
                ""

        };


        /*
         * Refresh profile photo.
         */

        loadProfilePhoto();


        console.log(
            "Account loaded successfully:",
            user
        );

    }

    catch (error) {

        console.error(
            "Account information error:",
            error
        );


        if (
            typeof showGlassNotification ===
            "function"
        ) {

            showGlassNotification(
                "Profile error",
                error.message ||
                "Unable to load your profile.",
                "error"
            );

        }

    }

}


/* =========================================================
   EDIT PROFILE
========================================================= */

if (editBtn) {

    editBtn.addEventListener(
        "click",
        () => {

            isEditing = true;


            originalProfile = {

                name:
                    editName
                        ? editName.value
                        : "",

                age:
                    editAge
                        ? editAge.value
                        : "",

                email:
                    editEmail
                        ? editEmail.value
                        : ""

            };


            if (editName) {

                editName.disabled =
                    false;

            }


            if (editAge) {

                editAge.disabled =
                    false;

            }


            if (editEmail) {

                editEmail.disabled =
                    false;

            }


            editBtn.style.display =
                "none";


            if (saveBtn) {

                saveBtn.style.display =
                    "inline-block";

            }

        }
    );

}


/* =========================================================
   UNSAVED CHANGES
========================================================= */

function hasUnsavedChanges() {

    if (!isEditing) {

        return false;

    }


    const currentName =
        editName
            ? editName.value.trim()
            : "";

    const currentAge =
        editAge
            ? editAge.value.trim()
            : "";

    const currentEmail =
        editEmail
            ? editEmail.value.trim()
            : "";


    return (

        currentName !==
            String(
                originalProfile.name ||
                ""
            ) ||

        currentAge !==
            String(
                originalProfile.age ||
                ""
            ) ||

        currentEmail !==
            String(
                originalProfile.email ||
                ""
            )

    );

}


/* =========================================================
   SAVE PROFILE
========================================================= */

if (saveBtn) {

    saveBtn.addEventListener(
        "click",
        async () => {

            const stored =
                getStoredProfile();


            const name =
                editName
                    ? editName.value.trim()
                    : "";

            const age =
                editAge
                    ? editAge.value.trim()
                    : "";

            const email =
                editEmail
                    ? editEmail.value.trim()
                    : "";


            if (!name) {

                if (
                    typeof showGlassNotification ===
                    "function"
                ) {

                    showGlassNotification(
                        "Invalid name",
                        "Please enter your name.",
                        "error"
                    );

                }

                return;

            }


            try {

                const data =
                    await apiRequest(
                        "/update-profile",
                        {
                            method: "PUT",

                            body:
                                JSON.stringify({
                                    name,
                                    age,
                                    email
                                })
                        }
                    );


                /*
                 * Some APIs return:
                 *
                 * { user: {...} }
                 *
                 * or:
                 *
                 * { profile: {...} }
                 */

                const updatedUser =
                    data.user ||
                    data.profile ||
                    null;


                if (updatedUser) {

                    localStorage.setItem(
                        "myProfileData",
                        JSON.stringify(
                            updatedUser
                        )
                    );

                }

                else {

                    stored.name =
                        name;

                    stored.age =
                        age;

                    stored.email =
                        email;


                    localStorage.setItem(
                        "myProfileData",
                        JSON.stringify(
                            stored
                        )
                    );

                }


                originalProfile = {

                    name,

                    age,

                    email

                };


                isEditing =
                    false;


                if (editName) {

                    editName.disabled =
                        true;

                }


                if (editAge) {

                    editAge.disabled =
                        true;

                }


                if (editEmail) {

                    editEmail.disabled =
                        true;

                }


                editBtn.style.display =
                    "inline-block";


                saveBtn.style.display =
                    "none";


                if (
                    typeof saveProfileNotification ===
                    "function"
                ) {

                    saveProfileNotification(
                        "Profile updated",
                        "Your profile information has been saved.",
                        "success"
                    );

                }


                /*
                 * Reload after successful update.
                 */

                window.location.reload();

            }

            catch (error) {

                console.error(
                    "Profile update error:",
                    error
                );


                if (
                    typeof showGlassNotification ===
                    "function"
                ) {

                    showGlassNotification(
                        "Update failed",
                        error.message ||
                        "Unable to update your profile.",
                        "error"
                    );

                }

            }

        }
    );

}


/* =========================================================
   CONFIRM UNSAVED CHANGES
========================================================= */

async function confirmUnsavedChanges() {

    if (
        !hasUnsavedChanges()
    ) {

        return true;

    }


    if (
        typeof showGlassConfirm !==
        "function"
    ) {

        return true;

    }


    return await showGlassConfirm(
        "Unsaved changes",
        "You have unsaved changes. Do you want to save them before leaving?",
        "Save"
    );

}


/* =========================================================
   PASSWORD MODAL
========================================================= */

const passwordModal =
    document.getElementById(
        "passwordModal"
    );

const newPassword =
    document.getElementById(
        "newPassword"
    );

const passwordError =
    document.getElementById(
        "passwordError"
    );

const changePasswordBtn =
    document.getElementById(
        "changePasswordBtn"
    );

const closePasswordModal =
    document.getElementById(
        "closePasswordModal"
    );

const togglePassword =
    document.getElementById(
        "togglePassword"
    );

const passwordEye =
    document.getElementById(
        "passwordEye"
    );

const confirmPasswordBtn =
    document.getElementById(
        "confirmPasswordBtn"
    );


/* =========================================================
   OPEN PASSWORD MODAL
========================================================= */

if (
    changePasswordBtn &&
    passwordModal
) {

    changePasswordBtn.addEventListener(
        "click",
        () => {

            passwordModal.classList.add(
                "show"
            );


            if (newPassword) {

                newPassword.focus();

            }

        }
    );

}


/* =========================================================
   CLOSE PASSWORD MODAL
========================================================= */

if (
    closePasswordModal &&
    passwordModal
) {

    closePasswordModal.addEventListener(
        "click",
        () => {

            passwordModal.classList.remove(
                "show"
            );


            if (newPassword) {

                newPassword.value =
                    "";

                newPassword.type =
                    "password";

            }


            if (passwordError) {

                passwordError.textContent =
                    "";

            }


            if (passwordEye) {

                passwordEye.className =
                    "fa-solid fa-eye";

            }

        }
    );

}


/* =========================================================
   PASSWORD VISIBILITY
========================================================= */

if (
    togglePassword &&
    newPassword
) {

    togglePassword.addEventListener(
        "click",
        () => {

            if (
                newPassword.type ===
                "password"
            ) {

                newPassword.type =
                    "text";


                if (passwordEye) {

                    passwordEye.className =
                        "fa-solid fa-eye-slash";

                }


                togglePassword.setAttribute(
                    "aria-label",
                    "Hide password"
                );

            }

            else {

                newPassword.type =
                    "password";


                if (passwordEye) {

                    passwordEye.className =
                        "fa-solid fa-eye";

                }


                togglePassword.setAttribute(
                    "aria-label",
                    "Show password"
                );

            }

        }
    );

}


/* =========================================================
   CHANGE PASSWORD
========================================================= */

if (confirmPasswordBtn) {

    confirmPasswordBtn.addEventListener(
        "click",
        async () => {

            const password =
                newPassword
                    ? newPassword.value.trim()
                    : "";


            if (passwordError) {

                passwordError.textContent =
                    "";

            }


            if (password.length < 6) {

                if (passwordError) {

                    passwordError.textContent =
                        "Password must contain at least 6 characters.";

                }

                return;

            }


            try {

                await apiRequest(
                    "/change-password",
                    {
                        method: "PUT",

                        body:
                            JSON.stringify({
                                password
                            })
                    }
                );


                addMessage(
                    "Password changed successfully."
                );


                if (
                    typeof saveProfileNotification ===
                    "function"
                ) {

                    saveProfileNotification(
                        "Password changed",
                        "Your password was successfully updated.",
                        "success"
                    );

                }


                if (passwordModal) {

                    passwordModal.classList.remove(
                        "show"
                    );

                }


                if (newPassword) {

                    newPassword.value =
                        "";

                }


                window.location.reload();

            }

            catch (error) {

                console.error(
                    "Password change error:",
                    error
                );


                if (passwordError) {

                    passwordError.textContent =
                        error.message ||
                        "Unable to change password.";

                }

            }

        }
    );

}


/* =========================================================
   PHOTO URL
========================================================= */

function getPhotoUrl(photo) {

    if (!photo) {

        return "";

    }


    /*
     * Already an absolute URL.
     */

    if (
        photo.startsWith("http://") ||
        photo.startsWith("https://")
    ) {

        return photo;

    }


    /*
     * Make sure the path begins with /.
     */

    const normalizedPhoto =
        photo.startsWith("/")
            ? photo
            : "/" + photo;


    /*
     * Local development:
     *
     * Frontend:
     * http://127.0.0.1:5500
     *
     * Backend:
     * http://localhost:3000
     *
     * Therefore:
     *
     * /uploads/example.png
     *
     * becomes:
     *
     * http://localhost:3000/uploads/example.png
     */

    if (isLocal) {

        return (
            "http://localhost:3000" +
            normalizedPhoto
        );

    }


    /*
     * Production:
     *
     * /uploads/example.png
     */

    return normalizedPhoto;

}


/* =========================================================
   LOAD PROFILE PHOTO
========================================================= */

function loadProfilePhoto() {

    const profile =
        getStoredProfile();


    const photo =
        profile &&
        profile.photo
            ? profile.photo
            : "";


    const photoUrl =
        getPhotoUrl(
            photo
        );


    /* =====================================================
       MAIN PROFILE PHOTO
    ===================================================== */

    if (
        profileImage &&
        defaultAvatar
    ) {

        if (photoUrl) {

            profileImage.src =
                photoUrl;

            profileImage.style.display =
                "block";

            defaultAvatar.style.display =
                "none";


            if (deletePhoto) {

                deletePhoto.style.display =
                    "inline-flex";

            }

        }

        else {

            profileImage.removeAttribute(
                "src"
            );

            profileImage.style.display =
                "none";

            defaultAvatar.style.display =
                "flex";


            if (deletePhoto) {

                deletePhoto.style.display =
                    "none";

            }

        }

    }


    /* =====================================================
       OTHER USER PHOTO ELEMENTS
    ===================================================== */

    document
        .querySelectorAll(
            ".user-photo"
        )
        .forEach(
            img => {

                if (photoUrl) {

                    img.src =
                        photoUrl;

                }

                else {

                    img.src =
                        "static/images/default-profile.png";

                }

            }
        );

}


/* =========================================================
   CLICK PROFILE PHOTO
========================================================= */

if (
    profilePhoto &&
    photoInput
) {

    profilePhoto.addEventListener(
        "click",
        () => {

            photoInput.click();

        }
    );

}


/* =========================================================
   PHOTO UPLOAD
========================================================= */

if (photoInput) {

    photoInput.addEventListener(
        "change",
        async () => {

            const file =
                photoInput.files &&
                photoInput.files[0];


            if (!file) {

                return;

            }


            /* =================================================
               VALIDATE IMAGE
            ================================================= */

            if (
                !file.type ||
                !file.type.startsWith(
                    "image/"
                )
            ) {

                if (
                    typeof showGlassNotification ===
                    "function"
                ) {

                    showGlassNotification(
                        "Invalid file",
                        "Please select an image file.",
                        "error"
                    );

                }


                photoInput.value =
                    "";

                return;

            }


            /*
             * Optional file size protection.
             *
             * 10 MB maximum.
             */

            const maxSize =
                10 * 1024 * 1024;


            if (
                file.size >
                maxSize
            ) {

                if (
                    typeof showGlassNotification ===
                    "function"
                ) {

                    showGlassNotification(
                        "File too large",
                        "Please select an image smaller than 10 MB.",
                        "error"
                    );

                }


                photoInput.value =
                    "";

                return;

            }


            /* =================================================
               FORM DATA
            ================================================= */

            const formData =
                new FormData();


            formData.append(
                "photo",
                file
            );


            try {

                console.log(
                    "Uploading profile photo..."
                );


                /*
                 * IMPORTANT:
                 *
                 * Do NOT manually add:
                 *
                 * Content-Type: multipart/form-data
                 *
                 * apiRequest() leaves it alone because
                 * the body is FormData.
                 */

                const data =
                    await apiRequest(
                        "/upload-photo",
                        {
                            method: "POST",

                            body:
                                formData
                        }
                    );


                console.log(
                    "Photo upload response:",
                    data
                );


                if (
                    !data ||
                    !data.photo
                ) {

                    throw new Error(
                        "The server did not return the uploaded photo."
                    );

                }


                /* =================================================
                   UPDATE LOCAL PROFILE
                ================================================= */

                const profile =
                    getStoredProfile();


                profile.photo =
                    data.photo;


                localStorage.setItem(
                    "myProfileData",
                    JSON.stringify(
                        profile
                    )
                );


                /* =================================================
                   ADD MESSAGE
                ================================================= */

                addMessage(
                    '<i class="fa-solid fa-camera"></i> Profile picture updated.'
                );


                /* =================================================
                   SUCCESS NOTIFICATION
                ================================================= */

                if (
                    typeof saveProfileNotification ===
                    "function"
                ) {

                    saveProfileNotification(
                        "Profile picture updated",
                        "Your new profile picture is now active.",
                        "success"
                    );

                }


                /* =================================================
                   UPDATE IMAGE
                ================================================= */

                loadProfilePhoto();


                /*
                 * Reset input so the same image can
                 * be selected again later.
                 */

                photoInput.value =
                    "";


                console.log(
                    "Profile photo uploaded successfully."
                );

            }

            catch (error) {

                console.error(
                    "Photo upload error:",
                    error
                );


                if (
                    typeof showGlassNotification ===
                    "function"
                ) {

                    showGlassNotification(
                        "Upload failed",
                        error.message ||
                        "Unable to upload your profile picture.",
                        "error"
                    );

                }

            }

        }
    );

}


/* =========================================================
   DELETE PROFILE PHOTO
========================================================= */

if (deletePhoto) {

    deletePhoto.addEventListener(
        "click",
        async () => {

            try {

                const data =
                    await apiRequest(
                        "/delete-photo",
                        {
                            method: "DELETE"
                        }
                    );


                console.log(
                    "Delete photo response:",
                    data
                );


                /*
                 * Update local profile.
                 */

                const profile =
                    getStoredProfile();


                profile.photo =
                    "";


                localStorage.setItem(
                    "myProfileData",
                    JSON.stringify(
                        profile
                    )
                );


                /*
                 * Update UI.
                 */

                loadProfilePhoto();


                /*
                 * Add message.
                 */

                addMessage(
                    '<i class="fa-solid fa-trash"></i> Profile picture removed.'
                );


                /*
                 * Notification.
                 */

                if (
                    typeof saveProfileNotification ===
                    "function"
                ) {

                    saveProfileNotification(
                        "Photo removed",
                        "Your profile picture has been removed.",
                        "success"
                    );

                }

            }

            catch (error) {

                console.error(
                    "Delete photo error:",
                    error
                );


                if (
                    typeof showGlassNotification ===
                    "function"
                ) {

                    showGlassNotification(
                        "Delete failed",
                        error.message ||
                        "Unable to remove your profile picture.",
                        "error"
                    );

                }

            }

        }
    );

}


/* =========================================================
   WEBSITE MESSAGES
========================================================= */

function addMessage(text) {

    let messages = [];


    try {

        messages =
            JSON.parse(
                localStorage.getItem(
                    "messages"
                )
            ) || [];

    }

    catch (error) {

        messages = [];

    }


    messages.unshift({

        text,

        date:
            new Date()
                .toLocaleString()

    });


    localStorage.setItem(
        "messages",
        JSON.stringify(
            messages
        )
    );


    loadMessages();

}


/* =========================================================
   LOAD MESSAGES
========================================================= */

function loadMessages() {

    if (!messageBox) {

        return;

    }


    let messages = [];


    try {

        messages =
            JSON.parse(
                localStorage.getItem(
                    "messages"
                )
            ) || [];

    }

    catch (error) {

        messages = [];

    }


    messageBox.innerHTML =
        "";


    if (
        messages.length === 0
    ) {

        messageBox.innerHTML =
            `
            <div class="message">
                No messages.
            </div>
            `;

        return;

    }


    messages.forEach(
        message => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "message";


            const date =
                document.createElement(
                    "h4"
                );


            date.textContent =
                message.date ||
                "";


            const text =
                document.createElement(
                    "p"
                );


            /*
             * IMPORTANT:
             *
             * Messages can contain Font Awesome HTML,
             * for example:
             *
             * <i class="fa-solid fa-camera"></i>
             *
             * Therefore we intentionally use innerHTML
             * here.
             */

            text.innerHTML =
                message.text ||
                "";


            item.appendChild(
                date
            );


            item.appendChild(
                text
            );


            messageBox.appendChild(
                item
            );

        }
    );

}


/* =========================================================
   LOGOUT
========================================================= */

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async () => {

            /*
             * Check unsaved changes.
             */

            if (
                isEditing &&
                hasUnsavedChanges()
            ) {

                if (
                    typeof showGlassConfirm ===
                    "function"
                ) {

                    const save =
                        await showGlassConfirm(
                            "Unsaved changes",
                            "You have unsaved changes. Do you want to save them?",
                            "Save"
                        );


                    if (save) {

                        if (saveBtn) {

                            saveBtn.click();

                        }

                        return;

                    }

                }

            }


            /*
             * Logout confirmation.
             */

            let logout =
                true;


            if (
                typeof showGlassConfirm ===
                "function"
            ) {

                logout =
                    await showGlassConfirm(
                        "Log out?",
                        "Are you sure you want to log out of your account?",
                        "Log out"
                    );

            }


            if (!logout) {

                return;

            }


            /*
             * Remove local authentication data.
             */

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "myProfileData"
            );

            localStorage.removeItem(
                "messages"
            );


            /*
             * Notification.
             */

            if (
                typeof saveProfileNotification ===
                "function"
            ) {

                saveProfileNotification(
                    "Logged out",
                    "You have been logged out successfully.",
                    "success"
                );

            }


            /*
             * Go home.
             */

            window.location.href =
                "index.html";

        }
    );

}


/* =========================================================
   BEFORE UNLOAD
========================================================= */

window.addEventListener(
    "beforeunload",
    event => {

        if (
            !isEditing ||
            !hasUnsavedChanges()
        ) {

            return;

        }


        event.preventDefault();

        event.returnValue =
            "";

    }
);


/* =========================================================
   CLEAR ALL MESSAGES
========================================================= */

if (clearMessagesBtn) {

    clearMessagesBtn.addEventListener(
        "click",
        async () => {

            let messages = [];

            try {

                messages =
                    JSON.parse(
                        localStorage.getItem(
                            "messages"
                        )
                    ) || [];

            }

            catch (error) {

                messages = [];

            }


            /* ==========================
               NOTHING TO CLEAR
            ========================== */

            if (messages.length === 0) {

                if (
                    typeof showGlassNotification ===
                    "function"
                ) {

                    showGlassNotification(
                        "Nothing to clear",
                        "All messages have already been cleared.",
                        "warning"
                    );

                }

                return;

            }


            /* ==========================
               CONFIRMATION
            ========================== */

            let confirmed = true;

            if (
                typeof showGlassConfirm ===
                "function"
            ) {

                confirmed =
                    await showGlassConfirm(
                        "Clear messages?",
                        "Are you sure you want to remove all your messages?",
                        "Clear all"
                    );

            }


            if (!confirmed) {

                return;

            }


            /* ==========================
               DELETE MESSAGES
            ========================== */

            localStorage.removeItem(
                "messages"
            );


            /* ==========================
               UPDATE UI INSTANTLY
            ========================== */

            const box =
                document.getElementById(
                    "messageBox"
                );

            if (box) {

                box.innerHTML = `
                    <div class="message">
                        <h4>Messages deleted</h4>
                        <p>Your messages have been deleted.</p>
                    </div>
                `;

            }


            /* ==========================
               SUCCESS NOTIFICATION
            ========================== */

            if (
                typeof saveProfileNotification ===
                "function"
            ) {

                saveProfileNotification(
                    "Messages deleted",
                    "Your messages have been successfully deleted.",
                    "success"
                );

            }

        }
    );

}


/* =========================================================
   INITIALIZATION
========================================================= */

loadStoredProfile();

loadProfilePhoto();

loadMessages();

loadAccountInformation();