const stored = localStorage.getItem('myProfileData');
  if (stored) {
    const data = JSON.parse(stored);
    // Populate UI
    document.getElementById('showinfo').innerHTML =
      `<div class="profile-name">Name: ${data.name}</div>` +
      `<div class="profile-age">Age: ${data.age}</div>`;
  } else {
    document.getElementById('showinfo').textContent =
      'No profile data found.';
  }