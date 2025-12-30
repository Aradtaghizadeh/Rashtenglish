const switcher = document.querySelector('.switcher');
const radioInputs = switcher.querySelectorAll('input[name="theme"]');

// initialize previous tracking:
const trackPrevious = (el) => {
  const radios = el.querySelectorAll('input[type="radio"]');
  let previousValue = null;

  const initiallyChecked = el.querySelector('input[type="radio"]:checked');
  if (initiallyChecked) {
    previousValue = initiallyChecked.getAttribute("c-option");
    el.setAttribute('c-previous', previousValue);
  }

  radios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.checked) {
        el.setAttribute('c-previous', previousValue ?? '');
        previousValue = radio.getAttribute("c-option");

        // save theme
        localStorage.setItem("theme", radio.value);
      }
    });
  });
}

trackPrevious(switcher);


// — Apply stored theme on load —

const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  // select the correct radio
  const match = switcher.querySelector(`input[value="${savedTheme}"]`);
  if (match) {
    match.checked = true;
  }
}
