
document.getElementById("doneBtn").addEventListener("click", function () {
    // Create empty object for storing answers
    let answers = {};

    // --- Collect radio buttons ---
    document.querySelectorAll("input[type='radio']").forEach(radio => {
        if (radio.checked) {
            answers[radio.name] = radio.value;
        }
    });

    // --- Collect text/number/email inputs ---
    document.querySelectorAll("input[type='text'], input[type='number'], input[type='email']").forEach(input => {
        answers[input.name] = input.value;
    });

    // --- Collect textareas ---
    document.querySelectorAll("textarea").forEach(text => {
        answers[text.name] = text.value;
    });

    // --- Collect selects ---
    document.querySelectorAll("select").forEach(select => {
        answers[select.name] = select.value;
    });

    // Save everything to localStorage
    localStorage.setItem("examResults", JSON.stringify(answers));

    // Go to results page
    window.location.href = "results.html";
});
