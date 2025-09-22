const html = document.documentElement;
const saved = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
html.setAttribute('data-theme', saved || (prefersDark ? 'dark' : 'light'));

document.getElementById('toggle').addEventListener('click', () => {
const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
html.setAttribute('data-theme', newTheme);
localStorage.setItem('theme', newTheme);
});


const topButton = document.getElementById("topButton");

window.onscroll = function() {
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 100) {
    topButton.style.display = "block";
    } else {
    topButton.style.display = "none";
    }
};

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMenu(el) {
    const menu = document.getElementById('sideMenu');
    const overlay = document.getElementById('side');
    const menu2 = document.querySelector('.menu');

    menu.classList.toggle('open');
    overlay.classList.toggle('visible');
    menu2.classList.toggle('active');
}

const SOURCE_LANG = 'en';                // your page's original language
const OPTIONS = { en: 'English', fa: 'Persian', de: 'German' };
const MYMEMORY_ENDPOINT = 'https://api.mymemory.translated.net/get'; // no key needed for anonymous requests

// ---------- Helpers ----------
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

// Walk the DOM and collect text nodes to translate (skip scripts, styles, no-translate, and empty/whitespace-only)
function getTextNodes(root=document.body) {
    const skipTags = new Set(['SCRIPT','STYLE','NOSCRIPT','IFRAME','OBJECT','SVG']);
    const nodes = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        if (skipTags.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
        if (parent.closest('.no-translate')) return NodeFilter.FILTER_REJECT;
        const txt = node.nodeValue.trim();
        return txt.length ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
    });
    while (walker.nextNode()) nodes.push(walker.currentNode);
    return nodes;
}

// Split text into <= ~450-byte chunks (MyMemory limits ~500 bytes per 'q') and try to split on sentence/space
function chunkText(str, maxBytes=450) {
    const chunks = [];
    let buf = '';
    const parts = str.split(/(\.|\!|\?|\n)/g); // keep punctuation
    for (let i=0; i<parts.length; i++) {
    const piece = parts[i];
    const tryAdd = buf + piece;
    if (new TextEncoder().encode(tryAdd).length <= maxBytes) {
        buf = tryAdd;
    } else {
        if (buf) chunks.push(buf);
        if (new TextEncoder().encode(piece).length > maxBytes) {
        // very long word/segment: hard split
        let s = piece;
        while (new TextEncoder().encode(s).length > maxBytes) {
            let cut = Math.floor(maxBytes * s.length / new TextEncoder().encode(s).length);
            chunks.push(s.slice(0, cut));
            s = s.slice(cut);
        }
        buf = s;
        } else {
        buf = piece;
        }
    }
    }
    if (buf) chunks.push(buf);
    return chunks;
}
const DICTIONARY = {
  fa: {
    "Intermediate": "متوسط",
    "Advanced":"پیشرفته",
    "Enter your name...": "نام خود را وارد کنید...",
    "Enter your age...": "سن خود را وارد کنید...",
    "Next": "بعدی",
    "Basic":"مبتدی",
    "Grammar":"گرامر",
    "Cold":"سرد",
    "Cup":"استکان",
    "Apple":"سیب"
  },
  de: {
    "Enter your name...": "Geben Sie Ihren Namen ein...",
    "Enter your age...": "Geben Sie Ihr Alter ein..."
  },
  en: {
    "Enter your name...": "Enter your name...",
    "Enter your age...": "Enter your age..."
  }
};

async function myMemoryTranslate(text, from, to) {
    if (DICTIONARY[to] && DICTIONARY[to][text]) {
        return DICTIONARY[to][text];
    }

    // simple cache to avoid re-requests for identical strings
    myMemoryTranslate.cache ||= new Map();
    const key = `${from}|${to}|${text}`;
    if (myMemoryTranslate.cache.has(key)) return myMemoryTranslate.cache.get(key);

    // Respect per-request size by chunking, translate sequentially, then join
    const chunks = chunkText(text);
    const out = [];
    for (const chunk of chunks) {
    const url = `${MYMEMORY_ENDPOINT}?q=${encodeURIComponent(chunk)}&langpair=${encodeURIComponent(from)}|${encodeURIComponent(to)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const translated = (data && data.responseData && data.responseData.translatedText) ? data.responseData.translatedText : chunk;
    out.push(translated);
    }
    const finalText = out.join('');
    myMemoryTranslate.cache.set(key, finalText);
    return finalText;
}

// Store original text so we can revert to English instantly
const originalText = new WeakMap();

const originalPlaceholder = new WeakMap();

function snapshotPlaceholders() {
    const inputs = document.querySelectorAll('input[placeholder], textarea[placeholder]');
    inputs.forEach(el => {
        if (!originalPlaceholder.has(el)) {
            originalPlaceholder.set(el, el.getAttribute('placeholder'));
        }
    });
}

async function translatePlaceholders(target) {
    const inputs = document.querySelectorAll('input[placeholder], textarea[placeholder]');
    inputs.forEach(async el => {
        const original = originalPlaceholder.get(el);
        if (target === SOURCE_LANG) {
            // Restore original English placeholder
            el.setAttribute('placeholder', original);
        } else {
            // Check dictionary first
            if (DICTIONARY[target] && DICTIONARY[target][original]) {
                el.setAttribute('placeholder', DICTIONARY[target][original]);
            } else {
                try {
                    const translated = await myMemoryTranslate(original, SOURCE_LANG, target);
                    el.setAttribute('placeholder', translated);
                } catch {
                    el.setAttribute('placeholder', original);
                }
            }
        }
    });
}

function snapshotOriginal(nodes) {
    nodes.forEach(n => {
    if (!originalText.has(n)) originalText.set(n, n.nodeValue);
    });
}
async function translatePage(target) {
    const overlay = $('#overlay');
    overlay.classList.add('show');

    // Set page direction for Persian (rtl) or others (ltr)
    document.documentElement.dir = target === 'fa' ? 'rtl' : 'ltr';

    // --- Snapshot all text nodes ---
    const nodes = getTextNodes();
    snapshotOriginal(nodes);

    // --- Snapshot placeholders ---
    snapshotPlaceholders();

    if (target === SOURCE_LANG) {
        // Restore original text nodes
        nodes.forEach(n => n.nodeValue = originalText.get(n) ?? n.nodeValue);

        // Restore original placeholders
        await translatePlaceholders(target);

        overlay.classList.remove('show');
        return;
    }

    // --- Translate text nodes ---
    // Deduplicate identical strings to reduce requests
    const unique = new Map(); // text => Promise<string>
    for (const n of nodes) {
        const text = originalText.get(n) ?? n.nodeValue;
        if (!unique.has(text)) {
            unique.set(text, myMemoryTranslate(text, SOURCE_LANG, target).catch(() => text));
        }
    }

    // Apply translations
    for (const n of nodes) {
        const src = originalText.get(n) ?? n.nodeValue;
        try {
            n.nodeValue = await unique.get(src);
        } catch {
            n.nodeValue = src; // fallback
        }
    }

    // --- Translate placeholders ---
    await translatePlaceholders(target);

    overlay.classList.remove('show');
}

// ---- UI wiring (single button with 3 options) ----
const langBtn  = $('#langBtn');
const langMenu = $('#langMenu');
langBtn.addEventListener('click', () => {
    const open = langMenu.classList.toggle('open');
    langBtn.setAttribute('aria-expanded', String(open));
});
langMenu.addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-lang]');
    if (!btn) return;
    const lang = btn.getAttribute('data-lang');
    const name = btn.getAttribute('data-name');
    langBtn.textContent = name + '▾';
    localStorage.setItem('preferredLang', lang);
    langMenu.classList.remove('open');
    await translatePage(lang);
});
document.addEventListener('click', (e) => {
    if (!e.target.closest('#langSwitcher')) langMenu.classList.remove('open');
});

// ---- Initial load: apply saved language (English default) ----
(async function init() {
    const saved = localStorage.getItem('preferredLang') || 'en';
    langBtn.textContent = (OPTIONS[saved] || 'English') + '▾';
    if (saved !== 'en') await translatePage(saved);
})();






// login

// document.getElementById('login').addEventListener('submit', function(event) {
// event.preventDefault();  // Prevent immediate submission/redirect

// const nameInput = document.getElementById('name').value.trim();
// const selectedLevel = document.querySelector('input[name="level"]:checked');

// if (!nameInput) {
//     alert('Please fill in your name.');  // Block redirect and notify user
//     return;  // Stop further execution
//     }

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

      // 2⃣ Submit handler with validation and redirect
      form.addEventListener('submit', function(event) {
        event.preventDefault();  // Prevent native form submission

        const name = userName.value.trim();
        const age = userAge.value.trim();
        const selected = document.querySelector('input[name="level"]:checked').value;

        if (!name && !age) {
          userName.classList.add('error');
          userAge.classList.add('error');
          userName.focus();
          alert('Please fill your info.');
          return;
        }
        if (!name) {
          userName.classList.add('error');
          userName.focus();
          alert('Please fill your name.');
          return;
        }
        if (!age) {
          userAge.classList.add('error');
          userAge.focus();
          alert('Please fill your age.');
          return;
        }

        console.log('Redirecting to:', selected);
        window.location.href = selected;
      });

      // 3⃣ Clear error styling as users type
      userName.addEventListener('input', () => {
        if (userName.classList.contains('error') && userName.value.trim()) {
          userName.classList.remove('error');
        }
      });
      userAge.addEventListener('input', () => {
        if (userAge.classList.contains('error') && userAge.value.trim()) {
          userAge.classList.remove('error');
        }
      });
    });



window.addEventListener('DOMContentLoaded', () => {
    const h1 = document.getElementById('welcome');
    // Add the shadow class
    h1.classList.add('shadow');
    // Trigger fade-in by toggling visibility after a short delay
    setTimeout(() => h1.classList.add('visible'), 100);
});


fetch("https://api.countapi.xyz/hit/mywebsite.com/homepage")
  .then(res => res.json())
  .then(res => {
    document.getElementById("viewCounter").innerText =
      "Page views: " + res.value;
  });