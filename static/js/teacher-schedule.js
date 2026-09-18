
const token =
    localStorage.getItem("token");


if (!token) {

    window.location.href =
        "login.html";

}


// ==========================
// LOAD TEACHER SCHEDULE
// ==========================

async function loadTeacherSchedule() {

    try {

        const response =
            await fetch(
                "http://localhost:3000/api/teacher-schedule",
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


        if (!response.ok) {

            const errorData =
                await response.json()
                    .catch(() => ({}));


            throw new Error(
                errorData.message ||
                "Unable to load schedule."
            );

        }


        const data =
            await response.json();


        // The backend returns
        // the bookings array directly.

        renderSchedule(data);

    }

    catch (error) {

        console.error(
            "Teacher schedule error:",
            error
        );


        const body =
            document.getElementById(
                "scheduleBody"
            );


        if (body) {

            body.innerHTML = `

                <tr>

                    <td
                        colspan="5"
                        class="empty"
                    >
                        Unable to load schedule.
                    </td>

                </tr>

            `;

        }

    }

}


// ==========================
// RENDER SCHEDULE
// ==========================

function renderSchedule(bookings) {

    const body =
        document.getElementById(
            "scheduleBody"
        );


    if (!body) {

        console.error(
            "scheduleBody element not found."
        );

        return;

    }


    body.innerHTML = "";


    // ==========================
    // NO BOOKINGS
    // ==========================

    if (
        !Array.isArray(bookings) ||
        bookings.length === 0
    ) {

        body.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="empty"
                >
                    No students have selected
                    class times yet.
                </td>

            </tr>

        `;

        return;

    }


    // ==========================
    // BOOKINGS
    // ==========================

    bookings.forEach(
        booking => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${escapeHTML(
                        booking.name ||
                        "Unknown"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        booking.email ||
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        booking.day ||
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        booking.time ||
                        "-"
                    )}
                </td>

                <td>
                    ${formatDate(
                        booking.created_at ||
                        booking.createdAt
                    )}
                </td>

            `;


            body.appendChild(row);

        }
    );

}


// ==========================
// DATE
// ==========================

function formatDate(date) {

    if (!date) {

        return "-";

    }


    const parsedDate =
        new Date(date);


    if (
        Number.isNaN(
            parsedDate.getTime()
        )
    ) {

        return "-";

    }


    return parsedDate.toLocaleString(
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


// ==========================
// SECURITY
// ==========================
//
// Prevent names/emails from being
// interpreted as HTML.
//

function escapeHTML(value) {

    const div =
        document.createElement("div");


    div.textContent =
        String(value);


    return div.innerHTML;

}


// ==========================
// START
// ==========================

loadTeacherSchedule();
