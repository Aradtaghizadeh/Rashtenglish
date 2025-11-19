// document.getElementById('submitBtn').addEventListener('click', function() {
//   const name = document.getElementById('name').value;
//   const age  = document.getElementById('age').value;
  
//   // Create a data object
//   const profileData = {
//     name: name,
//     age: age
//     // add more fields as needed
//   };
  
//   // Save to localStorage (stringify since localStorage stores strings)
//   localStorage.setItem('myProfileData', JSON.stringify(profileData));
//   // Then redirect to profile page (or next step)
//   window.location.href = '/Rashtenglish/profile.html';  // adjust path
// });
document.addEventListener('DOMContentLoaded', function() {
      const form = document.getElementById('login');
      const userName = document.getElementById('name');
      const userAge = document.getElementById('age');
      
      // 1⃣ Pre-fill form from URL parameters using URLSearchParams
      const params = new URLSearchParams(window.location.search);
      const pName = params.get('name');
      const pAge = params.get('age');
      const pLevel = params.get('level');

      if (pName) userName.value = decodeURIComponent(pName);
      if (pAge) userAge.value = decodeURIComponent(pAge);
      if (pLevel) {
        const radio = document.querySelector(`input[name="level"][value="${pLevel}"]`);
        if (radio) radio.checked = true;
      }

form.addEventListener('submit', function(event) {
  event.preventDefault();

  const name = userName.value.trim();
  const age = userAge.value.trim();
  const selected = document.querySelector('input[name="level"]:checked')?.value;


  // regex rules
  const nameRule = /^[A-Za-z ]+$/; // letters + spaces only
  const ageRule = /^[0-9]+$/; // numbers only

  // --- Validation cases ---
  if (!name && !age) {
    alert("Please enter your name and age.");
    userName.classList.add('error');
    userAge.classList.add('error');
    userName.focus();
    return;
  }

  if (!name) {
    alert("Please enter your name.");
    userName.classList.add('error');
    userName.focus();
    return;
  }

  if (!nameRule.test(name)) {
    alert("Name must contain only letters (A-Z).");
    userName.classList.add('error');
    userName.focus();
    return;
  }

  if (!age) {
    alert("Please enter your age.");
    userAge.classList.add('error');
    userAge.focus();
    return;
  }

  const ageNum = parseInt(age, 10);
  if (ageNum > 100) {
    alert("Age must be 100 or less.");
    userAge.classList.add('error');
    userAge.focus();
    return;
  }


  // ✅ All good → Save to localStorage
  const profileData = { name, age };
  localStorage.setItem('myProfileData', JSON.stringify(profileData));

  // ✅ redirect based on selected level
  if (selected) {
    window.location.href = selected;
  } else {
    alert("Please select your level.");
  }
});
});
