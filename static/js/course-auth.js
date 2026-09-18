(async () => {

    console.log("course-auth loaded");

    const token = localStorage.getItem("token");

    console.log("Stored token:", token);

    if (!token) {
        location.href = "german-login.html";
        return;
    }

    try {

        const response = await fetch(
            "http://localhost:3000/api/verify-token",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        console.log("verify status:", response.status);

        if (!response.ok) {

            console.log(await response.text());

            localStorage.removeItem("token");

            location.href = "german-login.html";
        }

    } catch (err) {

        console.error(err);

    }

})();