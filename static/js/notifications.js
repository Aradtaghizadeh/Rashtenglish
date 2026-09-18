/* ==========================================
GLASS NOTIFICATIONS
========================================== */

function showGlassNotification(
title,
message,
type = "success"
) {


const notification =
    document.getElementById(
        "glassNotification"
    );


if (!notification) {

    console.error(
        "glassNotification element was not found."
    );

    return false;

}


const titleElement =
    notification.querySelector(
        ".notification-title"
    );

const messageElement =
    notification.querySelector(
        ".notification-message"
    );

const icon =
    notification.querySelector(
        ".notification-icon i"
    );


if (
    !titleElement ||
    !messageElement ||
    !icon
) {

    console.error(
        "Glass notification elements are missing."
    );

    return false;

}


/* ==================================
   SET TEXT
================================== */

titleElement.textContent =
    title || "";


messageElement.textContent =
    message || "";


/* ==================================
   REMOVE OLD TYPES
================================== */

notification.classList.remove(
    "success",
    "error",
    "warning",
    "info"
);


/* ==================================
   ADD NEW TYPE
================================== */

if (
    type !== "success" &&
    type !== "error" &&
    type !== "warning" &&
    type !== "info"
) {

    type = "success";

}


notification.classList.add(
    type
);


/* ==================================
   ICON
================================== */

if (type === "success") {

    icon.className =
        "fa-solid fa-check";

}

else if (type === "error") {

    icon.className =
        "fa-solid fa-xmark";

}

else if (type === "warning") {

    icon.className =
        "fa-solid fa-triangle-exclamation";

}

else if (type === "info") {

    icon.className =
        "fa-solid fa-circle-info";

}


/* ==================================
   SHOW IMMEDIATELY
================================== */

notification.classList.add(
    "show"
);


/* ==================================
   CLEAR PREVIOUS TIMER
================================== */

if (
    window.notificationTimer
) {

    clearTimeout(
        window.notificationTimer
    );

}


/* ==================================
   AUTO HIDE
================================== */

window.notificationTimer =
    setTimeout(
        () => {

            notification.classList.remove(
                "show"
            );

        },
        4500
    );


return true;


}

/* ==========================================
SAVE NOTIFICATION FOR NEXT PAGE LOAD
========================================== */

function saveProfileNotification(
title,
message,
type = "success"
) {


try {

    sessionStorage.setItem(
        "profileNotification",
        JSON.stringify({

            title:
                title || "",

            message:
                message || "",

            type:
                type || "success"

        })
    );

}

catch (error) {

    console.error(
        "Unable to save profile notification:",
        error
    );

}


}

/* ==========================================
SHOW SAVED NOTIFICATION AFTER
REFRESH / REDIRECT
========================================== */

function loadSavedProfileNotification() {

let saved = null;


try {

    saved =
        sessionStorage.getItem(
            "profileNotification"
        );

}

catch (error) {

    console.error(
        "Unable to read profile notification:",
        error
    );

    return;

}


if (!saved) {

    return;

}


/*
 * Remove it immediately.
 *
 * This prevents the same notification
 * from being shown twice.
 */

sessionStorage.removeItem(
    "profileNotification"
);


try {

    const data =
        JSON.parse(
            saved
        );


    showGlassNotification(
        data.title,
        data.message,
        data.type || "success"
    );

}

catch (error) {

    console.error(
        "Invalid saved notification:",
        error
    );

}


}

/* ==========================================
INITIALIZE NOTIFICATIONS
========================================== */

function initializeGlassNotifications() {


const closeButton =
    document.getElementById(
        "closeNotification"
    );

const notification =
    document.getElementById(
        "glassNotification"
    );


/* ==================================
   CLOSE BUTTON
================================== */

if (
    closeButton &&
    notification
) {

    closeButton.addEventListener(
        "click",
        () => {

            notification.classList.remove(
                "show"
            );


            if (
                window.notificationTimer
            ) {

                clearTimeout(
                    window.notificationTimer
                );

            }

        }
    );

}


/* ==================================
   LOAD SAVED NOTIFICATION
================================== */

loadSavedProfileNotification();


}

/* ==========================================
DOM READY
========================================== */

if (
document.readyState ===
"loading"
) {


document.addEventListener(
    "DOMContentLoaded",
    initializeGlassNotifications
);


} else {


initializeGlassNotifications();


}

/* ==========================================
GLASS CONFIRM
========================================== */

function showGlassConfirm(
title,
message,
yesText = "Continue"
) {


return new Promise(
    (resolve) => {

        const modal =
            document.getElementById(
                "glassConfirm"
            );

        const titleElement =
            document.getElementById(
                "confirmTitle"
            );

        const messageElement =
            document.getElementById(
                "confirmMessage"
            );

        const yesButton =
            document.getElementById(
                "confirmYes"
            );

        const cancelButton =
            document.getElementById(
                "confirmCancel"
            );

        const closeButton =
            document.getElementById(
                "confirmClose"
            );


        /* ==================================
           CHECK ELEMENTS
        ================================== */

        if (
            !modal ||
            !titleElement ||
            !messageElement ||
            !yesButton ||
            !cancelButton ||
            !closeButton
        ) {

            console.error(
                "Glass confirm elements are missing."
            );

            resolve(false);

            return;

        }


        /* ==================================
           SET CONTENT
        ================================== */

        titleElement.textContent =
            title || "";


        messageElement.textContent =
            message || "";


        yesButton.textContent =
            yesText || "Continue";


        /* ==================================
           SHOW MODAL
        ================================== */

        modal.classList.add(
            "show"
        );


        /* ==================================
           FINISH FUNCTION
        ================================== */

        function finish(
            result
        ) {

            modal.classList.remove(
                "show"
            );


            yesButton.removeEventListener(
                "click",
                yesHandler
            );


            cancelButton.removeEventListener(
                "click",
                cancelHandler
            );


            closeButton.removeEventListener(
                "click",
                cancelHandler
            );


            resolve(
                result
            );

        }


        /* ==================================
           YES
        ================================== */

        function yesHandler() {

            finish(
                true
            );

        }


        /* ==================================
           CANCEL
        ================================== */

        function cancelHandler() {

            finish(
                false
            );

        }


        /* ==================================
           EVENT LISTENERS
        ================================== */

        yesButton.addEventListener(
            "click",
            yesHandler
        );


        cancelButton.addEventListener(
            "click",
            cancelHandler
        );


        closeButton.addEventListener(
            "click",
            cancelHandler
        );

    }
);

}
