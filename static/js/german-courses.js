
/* =========================
   CONFIG
========================= */

const API_URL = 'http://localhost:3000';

/* =========================
   AUTH
========================= */

let authToken = localStorage.getItem('token') || null;

function isLoggedIn() {
    return !!authToken;
}

function logout() {
    localStorage.removeItem('token');
    authToken = null;
    location.reload();
}

/* =========================
   VIDEOS
========================= */

let videos = [
    {
        id: 1,
        title: 'Beginner German Basics',
        description: 'Learn the fundamentals of German language.',
        price: 10,
        date: new Date('2023-01-01'),
        popularity: 100,
        rating: 4.5,
        duration: 20,
        level: 'beginner',
        thumbnail: './static/images/account.svg',
        infoText: 'This video covers basic greetings, numbers, and simple sentences in German.'
    },
    {
        id: 2,
        title: 'Intermediate Conversations',
        description: 'Practice everyday conversations in German.',
        price: 15,
        date: new Date('2023-02-15'),
        popularity: 150,
        rating: 4.7,
        duration: 45,
        level: 'intermediate',
        thumbnail: 'https://picsum.photos/300/200?random=2',
        infoText: 'Focus on conversational German for daily interactions like shopping and dining.'
    },
    {
        id: 3,
        title: 'Advanced Grammar',
        description: 'Deep dive into complex German grammar.',
        price: 20,
        date: new Date('2023-03-20'),
        popularity: 80,
        rating: 4.8,
        duration: 70,
        level: 'advanced',
        thumbnail: 'https://picsum.photos/300/200?random=3',
        infoText: 'Explore advanced topics such as subjunctive mood and passive voice.'
    }
];

/* =========================
   PURCHASES
========================= */

let purchasedVideos = [];

async function loadPurchasedVideos() {

    if (!isLoggedIn()) {
        purchasedVideos = [];
        return;
    }

    try {

        const response = await fetch(`${API_URL}/api/my-courses`, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to load purchases');
        }

        const data = await response.json();

        purchasedVideos = data.courseIds || [];

    } catch (err) {
        console.error(err);
        purchasedVideos = [];
    }
}

/* =========================
   ICON
========================= */

function cssIcon(varName) {
    return `<span class="icon" style="--icon: var(${varName})"></span>`;
}

/* =========================
   RENDER
========================= */

function renderVideos(filteredVideos) {

    const videoList = document.getElementById('video-list');
    videoList.innerHTML = '';

    filteredVideos.forEach(video => {

        const unlocked = purchasedVideos.includes(video.id);

        const card = document.createElement('div');
        card.className = `video-card ${unlocked ? '' : 'locked'}`;

        card.innerHTML = `
            <div class="video-thumbnail" style="background-image: url('${video.thumbnail}');"></div>

            <h2>${video.title}</h2>

            <p>
                <i class="fa-solid fa-align-left"></i>
                ${video.description}
            </p>

            <p>
                <i class="fa-solid fa-tag"></i>
                Price: $${video.price}
            </p>

            <p>
                <i class="fa-solid fa-clock"></i>
                Duration: ${video.duration} min
            </p>

            <p>
                <i class="fa-solid fa-layer-group"></i>
                Level: ${video.level}
            </p>

            <p>
                <i class="fa-solid fa-star"></i>
                Rating: ${video.rating}
            </p>

            <button class="info-button">i</button>
            <div class="info-bubble">${video.infoText}</div>
        `;
        const infoBtn = card.querySelector('.info-button');
        const infoBubble = card.querySelector('.info-bubble');

        infoBtn.onclick = () => {
            infoBubble.classList.toggle('visible');
        };

        if (unlocked) {

            const playBtn = document.createElement('button');
            playBtn.className = 'play-button';
            playBtn.textContent = 'Play';

            playBtn.onclick = () => {
                startVideo(card, video.id);
            };

            card.appendChild(playBtn);

        } else {

            const buyBtn = document.createElement('button');
            buyBtn.className = 'unlock-button';
            buyBtn.textContent = 'Buy Course';

            buyBtn.onclick = () => {
                openPurchaseModal(video.id);
            };

            card.appendChild(buyBtn);
        }

        videoList.appendChild(card);
    });
}

/* =========================
   VIDEO
========================= */

async function startVideo(card, videoId) {

    if (!isLoggedIn()) {
        alert('Please login first');
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/api/video/${videoId}/${authToken}`
        );

        if (!response.ok) {
            alert('You do not have access to this course');
            return;
        }

        const thumbnail = card.querySelector('.video-thumbnail');

        thumbnail.innerHTML = '';
        thumbnail.classList.add('playing');

        const videoElem = document.createElement('video');

        videoElem.src =
        `${API_URL}/api/video/${videoId}/${authToken}`;
        videoElem.autoplay = true;
        videoElem.controls = true;
        videoElem.controlsList = 'nodownload';

        videoElem.oncontextmenu = () => false;

        thumbnail.appendChild(videoElem);

    } catch (err) {
        console.error(err);
        alert('Video loading failed');
    }
}

/* =========================
   PURCHASE
========================= */

function openPurchaseModal(videoId) {

    if (!isLoggedIn()) {
        alert('Please login first');
        return;
    }

    const code = prompt('Enter purchase code');

    if (!code) return;

    unlockCourse(videoId, code);
}

async function unlockCourse(videoId, code) {

    try {

        const response = await fetch(`${API_URL}/api/unlock-course`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`
            },
            body: JSON.stringify({
                videoId,
                code
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || 'Unlock failed');
            return;
        }

        alert('Course unlocked successfully');

        await loadPurchasedVideos();

        applyFiltersAndSort();

    } catch (err) {
        console.error(err);
        alert('Server error');
    }
}

/* =========================
   FILTERS
========================= */

let currentSort = 'cheapest';
let currentLevel = 'all';
let currentDuration = 'all';

function sortVideos(vids) {

    let sortedVideos = [...vids];

    if (currentSort === 'cheapest') {
        sortedVideos.sort((a, b) => a.price - b.price);
    }

    else if (currentSort === 'most-expensive') {
        sortedVideos.sort((a, b) => b.price - a.price);
    }

    else if (currentSort === 'recent') {
        sortedVideos.sort((a, b) => b.date - a.date);
    }

    else if (currentSort === 'rating') {
        sortedVideos.sort((a, b) => b.rating - a.rating);
    }

    return sortedVideos;
}

const searchInput = document.getElementById('searchInput');

function applyFiltersAndSort() {

    const searchTerm = searchInput.value.toLowerCase().trim();

    let filtered = videos.filter(video => {

        const matchesSearch =
            video.title.toLowerCase().includes(searchTerm);

        let levelMatch =
            currentLevel === 'all' ||
            video.level === currentLevel;

        let durationMatch = true;

        if (currentDuration === 'short') {
            durationMatch = video.duration < 30;
        }

        else if (currentDuration === 'medium') {
            durationMatch =
                video.duration >= 30 &&
                video.duration <= 60;
        }

        else if (currentDuration === 'long') {
            durationMatch = video.duration > 60;
        }

        return matchesSearch && levelMatch && durationMatch;
    });

    const sorted = sortVideos(filtered);

    renderVideos(sorted);
}

searchInput.addEventListener('input', () => {
    applyFiltersAndSort();
});

/* =========================
   BUTTONS
========================= */

function initButtons() {

    const sortButtons = document.querySelectorAll('#sort-buttons .filter-button');

    sortButtons.forEach(btn => {

        btn.addEventListener('click', () => {

            sortButtons.forEach(b => b.classList.remove('active'));

            btn.classList.add('active');

            currentSort = btn.dataset.value;

            applyFiltersAndSort();
        });
    });

    const levelButtons = document.querySelectorAll('#level-buttons .filter-button');

    levelButtons.forEach(btn => {

        btn.addEventListener('click', () => {

            levelButtons.forEach(b => b.classList.remove('active'));

            btn.classList.add('active');

            currentLevel = btn.dataset.value;

            applyFiltersAndSort();
        });
    });

    const durationButtons = document.querySelectorAll('#duration-buttons .filter-button');

    durationButtons.forEach(btn => {

        btn.addEventListener('click', () => {

            durationButtons.forEach(b => b.classList.remove('active'));

            btn.classList.add('active');

            currentDuration = btn.dataset.value;

            applyFiltersAndSort();
        });
    });
}

/* =========================
   INIT
========================= */

async function initPage() {

    await loadPurchasedVideos();

    initButtons();

    document.querySelector('#sort-buttons .filter-button[data-value="cheapest"]')
    ?.classList.add('active');

    document.querySelector('#level-buttons .filter-button[data-value="all"]')
    ?.classList.add('active');

    document.querySelector('#duration-buttons .filter-button[data-value="all"]')
    ?.classList.add('active');

    applyFiltersAndSort();
}
initPage();