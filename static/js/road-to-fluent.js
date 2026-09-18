console.log("Road to Fluent JS loaded.");


/* =========================================================
   CONFIG
========================================================= */

/*
 * FRONTEND
 * ----------
 * Live Server:
 * http://127.0.0.1:5500/Rashtenglish/
 *
 * BACKEND
 * ----------
 * Node/Express:
 * http://127.0.0.1:3000/
 *
 * Therefore, when the frontend is running on port 5500,
 * API requests MUST be sent to port 3000.
 */

const API_BASE =
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "localhost"
        ? "http://127.0.0.1:3000/api/road-to-fluent"
        : "/api/road-to-fluent";

console.log("API BASE:", API_BASE);


console.log(
    "API BASE:",
    API_BASE
);


/* =========================================================
   QUIZ STATE
========================================================= */

let attemptId = null;

let questions = [];

let currentQuestion = 0;

let answered = false;

let isFinishing = false;


/* =========================================================
   ELEMENTS
========================================================= */

const startButton =
    document.getElementById("startQuiz");

const startCard =
    document.getElementById("startCard");

const quizSection =
    document.getElementById("quizSection");

const resultSection =
    document.getElementById("resultSection");

const questionCounter =
    document.getElementById("questionCounter");

const questionXP =
    document.getElementById("questionXP");

const questionMeta =
    document.getElementById("questionMeta");

const questionText =
    document.getElementById("questionText");

const optionsContainer =
    document.getElementById("options");

const explanation =
    document.getElementById("explanation");

const nextButton =
    document.getElementById("nextButton");

const progressBar =
    document.getElementById("quizProgressBar");

const continueButton =
    document.getElementById("continueButton");


/* =========================================================
   SAFETY CHECK
========================================================= */

if (!startButton) {

    console.error(
        "ERROR: #startQuiz was not found."
    );
}

if (!quizSection) {

    console.error(
        "ERROR: #quizSection was not found."
    );
}

if (!questionCounter) {

    console.error(
        "ERROR: #questionCounter was not found."
    );
}

if (!questionText) {

    console.error(
        "ERROR: #questionText was not found."
    );
}

if (!optionsContainer) {

    console.error(
        "ERROR: #options was not found."
    );
}


/* =========================================================
   TOKEN
========================================================= */

function getToken() {

    const token =
        localStorage.getItem("token");


    if (
        !token ||
        token === "null" ||
        token === "undefined"
    ) {

        return null;
    }


    return token;
}


/* =========================================================
   API JSON HELPER
========================================================= */

async function readJSON(response) {

    const text =
        await response.text();


    if (!text) {

        return {};
    }


    try {

        return JSON.parse(text);

    } catch (error) {

        console.error(
            "Invalid JSON response:",
            text
        );

        throw new Error(
            "Server returned an invalid response."
        );
    }
}


/* =========================================================
   LOAD PROGRESS
========================================================= */

async function loadProgress() {

    try {

        const token =
            getToken();


        if (!token) {

            console.log(
                "No login token found."
            );

            return;
        }


        console.log(
            "Loading progress from:",
            `${API_BASE}/quiz/progress`
        );


        const response =
            await fetch(
                `${API_BASE}/quiz/progress`,
                {
                    method: "GET",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`,

                        "Accept":
                            "application/json"
                    }
                }
            );


        console.log(
            "PROGRESS STATUS:",
            response.status
        );


        const data =
            await readJSON(
                response
            );


        console.log(
            "Progress:",
            data
        );


        if (!response.ok) {

            console.error(
                "Progress error:",
                data.error ||
                data.message
            );

            return;
        }


        /* =================================================
           HEADER VALUES
        ================================================= */

        const starsElement =
            document.getElementById(
                "stars"
            );

        const xpElement =
            document.getElementById(
                "xp"
            );

        const streakElement =
            document.getElementById(
                "streak"
            );

        const abilityElement =
            document.getElementById(
                "ability"
            );


        if (starsElement) {

            starsElement.textContent =
                data.stars ?? 0;
        }


        if (xpElement) {

            xpElement.textContent =
                data.totalXP ?? 0;
        }


        if (streakElement) {

            streakElement.textContent =
                data.currentStreak ?? 0;
        }


        if (abilityElement) {

            abilityElement.textContent =
                data.abilityScore ?? 0;
        }


    } catch (error) {

        console.error(
            "LOAD PROGRESS ERROR:",
            error
        );
    }
}


/* =========================================================
   START BUTTON LOADING STATE
========================================================= */

function setStartLoading(isLoading) {

    if (!startButton) {

        return;
    }


    startButton.disabled =
        isLoading;


    startButton.textContent =
        isLoading
            ? "Loading..."
            : "Start Today's Quiz";
}


/* =========================================================
   START QUIZ
========================================================= */

async function startQuiz(event) {

    if (event) {

        event.preventDefault();

        event.stopPropagation();
    }


    console.log(
        "START QUIZ"
    );


    if (!startButton) {

        console.error(
            "Start button missing."
        );

        return;
    }


    try {

        setStartLoading(true);


        /* =================================================
           TOKEN
        ================================================= */

        const token =
            getToken();


        if (!token) {

            throw new Error(
                "Please log in first."
            );
        }


        /* =================================================
           REQUEST
        ================================================= */

        const url =
            `${API_BASE}/quiz/start`;


        console.log(
            "Starting quiz:",
            url
        );


        const response =
            await fetch(
                url,
                {
                    method: "POST",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json",

                        "Accept":
                            "application/json"
                    }
                }
            );


        console.log(
            "START STATUS:",
            response.status
        );


        const data =
            await readJSON(
                response
            );


        console.log(
            "START RESPONSE:",
            data
        );


        /* =================================================
           ERROR
        ================================================= */

        if (!response.ok) {

            throw new Error(
                data.error ||
                data.message ||
                `Could not start quiz. Server returned ${response.status}.`
            );
        }


        /* =================================================
           VALIDATE
        ================================================= */

        if (!data.attemptId) {

            throw new Error(
                "Server did not return an attempt ID."
            );
        }


        if (
            !Array.isArray(
                data.questions
            )
        ) {

            throw new Error(
                "Server did not return questions."
            );
        }


        if (
            data.questions.length !== 10
        ) {

            throw new Error(
                `Quiz contains ${data.questions.length} questions instead of 10.`
            );
        }


        /* =================================================
           SAVE STATE
        ================================================= */

        attemptId =
            data.attemptId;

        questions =
            data.questions;

        currentQuestion = 0;

        answered = false;

        isFinishing = false;


        console.log(
            "Attempt:",
            attemptId
        );

        console.log(
            "Questions:",
            questions.length
        );

        console.log(
            "Resumed:",
            data.resumed
        );


        /* =================================================
           SHOW QUIZ
        ================================================= */

        if (startCard) {

            startCard.classList.add(
                "hidden"
            );
        }


        if (quizSection) {

            quizSection.classList.remove(
                "hidden"
            );
        }


        if (resultSection) {

            resultSection.classList.add(
                "hidden"
            );
        }


        /* =================================================
           SHOW FIRST QUESTION
        ================================================= */

        showQuestion();


    } catch (error) {

        console.error(
            "START QUIZ ERROR:",
            error
        );


        alert(
            error.message ||
            "Could not start quiz."
        );


    } finally {

        setStartLoading(false);
    }
}


/* =========================================================
   SHOW QUESTION
========================================================= */

function showQuestion() {

    if (!questions.length) {

        console.error(
            "No questions available."
        );

        return;
    }


    const question =
        questions[currentQuestion];


    if (!question) {

        console.error(
            "Question does not exist:",
            currentQuestion
        );

        return;
    }


    console.log(
        `Showing question ${
            currentQuestion + 1
        }`
    );


    answered = false;


    /* =================================================
       RESET UI
    ================================================= */

    if (explanation) {

        explanation.classList.add(
            "hidden"
        );

        explanation.textContent = "";
    }


    if (nextButton) {

        nextButton.classList.add(
            "hidden"
        );

        nextButton.disabled = false;
    }


    /* =================================================
       COUNTER
    ================================================= */

    if (questionCounter) {

        questionCounter.textContent =
            `Question ${
                currentQuestion + 1
            } / ${
                questions.length
            }`;
    }


    /* =================================================
       XP
    ================================================= */

    if (questionXP) {

        questionXP.textContent =
            `+${question.xp ?? 0} XP`;
    }


    /* =================================================
       META
    ================================================= */

    if (questionMeta) {

        questionMeta.textContent =
            [
                question.cefr,
                question.category,
                question.difficulty
            ]
                .filter(Boolean)
                .join(" • ");
    }


    /* =================================================
       QUESTION
    ================================================= */

    if (questionText) {

        questionText.textContent =
            question.question || "";
    }


    /* =================================================
       PROGRESS
    ================================================= */

    if (progressBar) {

        const percentage =
            (
                (currentQuestion + 1) /
                questions.length
            ) * 100;


        progressBar.style.width =
            `${percentage}%`;
    }


    /* =================================================
       CLEAR OPTIONS
    ================================================= */

    if (!optionsContainer) {

        return;
    }


    optionsContainer.innerHTML = "";


    /* =================================================
       OPTIONS
    ================================================= */

    const options = [

        {
            letter: "A",
            text: question.option_a
        },

        {
            letter: "B",
            text: question.option_b
        },

        {
            letter: "C",
            text: question.option_c
        },

        {
            letter: "D",
            text: question.option_d
        }

    ];


    /* =================================================
       FISHER-YATES SHUFFLE
    ================================================= */

    for (
        let i = options.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        [
            options[i],
            options[j]
        ] = [
            options[j],
            options[i]
        ];
    }


    /* =================================================
       CREATE BUTTONS
    ================================================= */

    options.forEach(
        option => {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "answer-option";


            button.dataset.answer =
                option.letter;


            const letterSpan =
                document.createElement(
                    "span"
                );


            letterSpan.className =
                "option-letter";


            letterSpan.textContent =
                option.letter;


            const textSpan =
                document.createElement(
                    "span"
                );


            textSpan.textContent =
                option.text ?? "";


            button.appendChild(
                letterSpan
            );


            button.appendChild(
                textSpan
            );


            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    event.stopPropagation();


                    submitAnswer(
                        question.id,
                        option.letter,
                        button
                    );
                }
            );


            optionsContainer.appendChild(
                button
            );
        }
    );
}


/* =========================================================
   SUBMIT ANSWER
========================================================= */

async function submitAnswer(
    questionId,
    answer,
    clickedButton
) {

    if (answered) {
        return;
    }

    if (!attemptId) {
        alert("No active quiz attempt.");
        return;
    }

    answered = true;

    console.log(
        "Submitting:",
        questionId,
        answer
    );

    const buttons =
        optionsContainer
            ? optionsContainer.querySelectorAll(
                ".answer-option"
            )
            : [];

    buttons.forEach(button => {
        button.disabled = true;
    });

    try {

        const token = getToken();

        if (!token) {
            throw new Error(
                "Your login session has expired. Please log in again."
            );
        }

        const response =
            await fetch(
                `${API_BASE}/quiz/answer`,
                {
                    method: "POST",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json",

                        "Accept":
                            "application/json"
                    },

                    body: JSON.stringify({
                        attemptId,
                        questionId,
                        answer
                    })
                }
            );

        console.log(
            "ANSWER STATUS:",
            response.status
        );

        const data =
            await readJSON(response);

        console.log(
            "ANSWER RESPONSE:",
            data
        );


        /* =================================================
           ALREADY ANSWERED
        ================================================= */

        if (response.status === 409) {

            /*
                The backend is telling us that this
                question was already answered in this
                attempt.

                Do NOT show an error.

                Simply move to the next question.
            */

            console.log(
                "Question already answered. Skipping:",
                questionId
            );

            answered = true;

            /*
                Give the user a very short delay so the
                transition feels natural.
            */

            setTimeout(() => {

                currentQuestion++;

                if (
                    currentQuestion >=
                    questions.length
                ) {

                    finishQuiz();

                    return;
                }

                showQuestion();

            }, 150);

            return;
        }


        /* =================================================
           OTHER SERVER ERRORS
        ================================================= */

        if (!response.ok) {

            throw new Error(
                data.error ||
                data.message ||
                "Could not submit answer."
            );
        }


        /* =================================================
           NORMAL ANSWER RESULT
        ================================================= */

        if (data.correct) {

            clickedButton.classList.add(
                "correct"
            );

        } else {

            clickedButton.classList.add(
                "wrong"
            );
        }


        /* =================================================
           EXPLANATION
        ================================================= */

        if (explanation) {

            explanation.textContent =
                data.explanation ||
                "No explanation available.";

            explanation.classList.remove(
                "hidden"
            );
        }


        /* =================================================
           NEXT BUTTON
        ================================================= */

        if (nextButton) {

            nextButton.classList.remove(
                "hidden"
            );

            nextButton.disabled = false;
        }


    } catch (error) {

        console.error(
            "ANSWER ERROR:",
            error
        );

        alert(
            error.message ||
            "Could not submit answer."
        );

        answered = false;

        buttons.forEach(button => {
            button.disabled = false;
        });
    }
}


/* =========================================================
   NEXT QUESTION
========================================================= */

async function handleNextQuestion(
    event
) {

    if (event) {

        event.preventDefault();

        event.stopPropagation();
    }


    if (!answered) {

        return;
    }


    if (isFinishing) {

        return;
    }


    console.log(
        "NEXT QUESTION"
    );


    currentQuestion++;


    /* =================================================
       FINISH
    ================================================= */

    if (
        currentQuestion >=
        questions.length
    ) {

        await finishQuiz();

        return;
    }


    /* =================================================
       NEXT
    ================================================= */

    showQuestion();
}


/* =========================================================
   FINISH QUIZ
========================================================= */

async function finishQuiz() {

    if (isFinishing) {

        return;
    }


    isFinishing = true;


    console.log(
        "FINISHING QUIZ:",
        attemptId
    );


    try {

        if (nextButton) {

            nextButton.disabled =
                true;
        }


        const token =
            getToken();


        if (!token) {

            throw new Error(
                "Your login session has expired."
            );
        }


        const response =
            await fetch(
                `${API_BASE}/quiz/finish`,
                {
                    method: "POST",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json",

                        "Accept":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            attemptId
                        })
                }
            );


        console.log(
            "FINISH STATUS:",
            response.status
        );


        const data =
            await readJSON(
                response
            );


        console.log(
            "FINISH RESPONSE:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.error ||
                data.message ||
                "Could not finish quiz."
            );
        }


        /* =================================================
           HIDE QUIZ
        ================================================= */

        if (quizSection) {

            quizSection.classList.add(
                "hidden"
            );
        }


        /* =================================================
           SHOW RESULT
        ================================================= */

        if (resultSection) {

            resultSection.classList.remove(
                "hidden"
            );
        }


        /* =================================================
           SCORE
        ================================================= */

        const resultScore =
            document.getElementById(
                "resultScore"
            );


        if (resultScore) {

            resultScore.textContent =
                `${data.score} / ${data.totalQuestions}`;
        }


        /* =================================================
           XP
        ================================================= */

        const resultXP =
            document.getElementById(
                "resultXP"
            );


        if (resultXP) {

            resultXP.textContent =
                `+${data.xp} XP`;
        }


        /* =================================================
           STARS
        ================================================= */

        const resultStars =
            document.getElementById(
                "resultStars"
            );


        if (resultStars) {
            resultStars.innerHTML =
                `+${data.starsEarned} <i class="fa-solid fa-star"></i>`;
        }


        /* =================================================
           ABILITY
        ================================================= */

        const resultAbility =
            document.getElementById(
                "resultAbility"
            );


        if (resultAbility) {

            resultAbility.textContent =
                `Ability Score: ${
                    data.abilityBefore
                } → ${
                    data.abilityAfter
                }`;
        }


        /* =================================================
           UPDATE HEADER
        ================================================= */

        await loadProgress();


    } catch (error) {

        console.error(
            "FINISH QUIZ ERROR:",
            error
        );


        alert(
            error.message ||
            "Could not finish quiz."
        );


        currentQuestion =
            questions.length - 1;


        showQuestion();


    } finally {

        isFinishing = false;


        if (nextButton) {

            nextButton.disabled =
                false;
        }
    }
}


/* =========================================================
   CONTINUE
========================================================= */

if (continueButton) {

    continueButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();


            attemptId = null;

            questions = [];

            currentQuestion = 0;

            answered = false;

            isFinishing = false;


            window.location.reload();
        }
    );
}


/* =========================================================
   START BUTTON
========================================================= */

if (startButton) {

    startButton.addEventListener(
        "click",
        startQuiz
    );
}


/* =========================================================
   NEXT BUTTON
========================================================= */

if (nextButton) {

    nextButton.addEventListener(
        "click",
        handleNextQuestion
    );
}


/* =========================================================
   INITIAL LOAD
========================================================= */

loadProgress();