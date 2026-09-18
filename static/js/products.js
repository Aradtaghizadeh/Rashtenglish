const cardContainers = document.querySelectorAll('.card-container');
cardContainers.forEach(cardContainer => {
    const teaserCard = cardContainer.querySelector('.card.teaser');
    const detailCard = cardContainer.querySelector('.card.detail');
    const closeBtn = cardContainer.querySelector('.close-btn');
    const buyBtn = cardContainer.querySelector('button');

    teaserCard.addEventListener('click', () => {
    cardContainer.classList.add('active');
    });

    closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    cardContainer.classList.remove('active');
    });

    cardContainer.addEventListener('click', (e) => {
    if (e.target === cardContainer) {
        cardContainer.classList.remove('active');
    }
    });

    buyBtn.addEventListener('click', (e) => {
    createRipple(e);
    setTimeout(() => {
        alert('Purchased!');
        cardContainer.classList.remove('active');
    }, 300);
    });

    function createRipple(event) {
    const btn = event.currentTarget;
    const circle = document.createElement("span");
    circle.classList.add("ripple");
    btn.appendChild(circle);
    const d = Math.max(btn.clientWidth, btn.clientHeight);
    circle.style.width = circle.style.height = d + "px";
    const rect = btn.getBoundingClientRect();
    circle.style.left = event.clientX - rect.left - d/2 + "px";
    circle.style.top = event.clientY - rect.top - d/2 + "px";
    circle.addEventListener("animationend", () => {
        circle.remove();
    });
    }
});