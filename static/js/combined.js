// combined.js - All JS in one file: inline + assumed exam.js + script.js + validateAnswers.js

// Spelling Checker Functions
const wordList = [
  'the', 'of', 'and', 'to', 'a', 'in', 'for', 'is', 'on', 'that', 'by', 'this', 'with', 'i', 'you', 'it', 'not', 'or', 'be', 'are', 'from', 'at', 'as', 'your', 'all', 'have', 'new', 'more', 'an', 'was', 'we', 'will', 'home', 'can', 'us', 'about', 'if', 'page', 'my', 'has', 'search', 'free', 'but', 'our', 'one', 'other', 'do', 'no', 'information', 'time', 'they', 'site', 'he', 'up', 'may', 'what', 'which', 'their', 'news', 'out', 'use', 'any', 'there', 'see', 'only', 'so', 'his', 'when', 'contact', 'here', 'business', 'who', 'web', 'also', 'now', 'help', 'get', 'pm', 'view', 'online', 'c', 'e', 'first', 'am', 'been', 'would', 'how', 'were', 'me', 's', 'services', 'some', 'these', 'click', 'its', 'like', 'service', 'x', 'than', 'find', 'price', 'date', 'back', 'top', 'people', 'had', 'list', 'name', 'just', 'over', 'state', 'year', 'day', 'into', 'email', 'two', 'health', 'n', 'world', 're', 'next', 'used', 'go', 'b', 'work', 'last', 'most', 'products', 'music', 'buy', 'data', 'make', 'them', 'should', 'product', 'system', 'post', 'her', 'city', 't', 'add', 'policy', 'number', 'such', 'please', 'available', 'copyright', 'support', 'message', 'after', 'best', 'software', 'then', 'jan', 'good', 'video', 'well', 'd', 'where', 'info', 'rights', 'public', 'books', 'high', 'school', 'through', 'm', 'each', 'links', 'she', 'review', 'years', 'order', 'very', 'privacy', 'book', 'items', 'company', 'r', 'read', 'group', 'need', 'many', 'user', 'said', 'de', 'does', 'set', 'under', 'general', 'research', 'university', 'january', 'mail', 'full', 'map', 'reviews', 'program', 'life', 'know', 'games', 'way', 'days', 'management', 'p', 'part', 'could', 'great', 'united', 'hotel', 'real', 'f', 'item', 'international', 'center', 'ebay', 'must', 'store', 'travel', 'comments', 'made', 'development', 'report', 'off', 'member', 'details', 'line', 'terms', 'before', 'hotels', 'did', 'send', 'right', 'type', 'because', 'local', 'those', 'using', 'results', 'office', 'education', 'national', 'car', 'design', 'take', 'posted', 'internet', 'address', 'community', 'within', 'states', 'area', 'want', 'phone', 'dvd', 'shipping', 'reserved', 'subject', 'between', 'forum', 'family', 'l', 'long', 'based', 'w', 'code', 'show', 'o', 'even', 'black', 'check', 'special', 'prices', 'website', 'index', 'being', 'women', 'much', 'sign', 'file', 'link', 'open', 'today', 'technology', 'south', 'case', 'project', 'same', 'pages', 'uk', 'version', 'section', 'own', 'found', 'sports', 'house', 'related', 'security', 'both', 'g', 'county', 'american', 'photo', 'game', 'members', 'power', 'while', 'care', 'network', 'down', 'computer', 'systems', 'three', 'total', 'place', 'end', 'following', 'download', 'h', 'him', 'without', 'per', 'access', 'think', 'north', 'resources', 'current', 'posts', 'big', 'media', 'law', 'control', 'water', 'history', 'pictures', 'size', 'art', 'personal', 'since', 'including', 'guide', 'shop', 'directory', 'board', 'location', 'change', 'white', 'text', 'small', 'rating', 'rate', 'government', 'children', 'during', 'usa', 'return', 'students', 'v', 'shopping', 'account', 'times', 'sites', 'level', 'digital', 'profile', 'previous', 'form', 'events', 'love', 'old', 'john', 'main', 'call', 'hours', 'image', 'department', 'title', 'description', 'non', 'k', 'y', 'insurance', 'another', 'why', 'shall', 'property', 'class', 'cd', 'still', 'money', 'quality', 'every', 'listing', 'content', 'country', 'private', 'little', 'visit', 'save', 'tools', 'low', 'reply', 'customer', 'december', 'compare', 'movies', 'include', 'college', 'value', 'article', 'york', 'man', 'card', 'jobs', 'provide', 'j', 'food', 'source', 'author', 'different', 'press', 'u', 'learn', 'sale', 'around', 'print', 'course', 'job', 'canada', 'process', 'teen', 'room', 'stock', 'training', 'too', 'credit', 'point', 'join', 'science', 'men', 'categories', 'advanced', 'west', 'sales', 'look', 'english', 'left', 'team', 'estate', 'box', 'conditions', 'select', 'windows', 'photos', 'gay', 'thread', 'week', 'category', 'note', 'live', 'large', 'gallery', 'table', 'register', 'however', 'june', 'october', 'november', 'market', 'library', 'really', 'action', 'start', 'series', 'model', 'features', 'air', 'industry', 'plan', 'human', 'provided', 'tv', 'yes', 'required', 'second', 'hot', 'accessories', 'cost', 'movie', 'forums', 'march', 'la', 'september', 'better', 'say', 'questions', 'july', 'yahoo', 'going', 'medical', 'test', 'friend', 'come', 'dec', 'server', 'pc', 'study', 'application', 'cart', 'staff', 'articles', 'san', 'feedback', 'again', 'play', 'looking', 'issues', 'april', 'never', 'users', 'complete', 'street', 'topic', 'comment', 'financial', 'things', 'working', 'against', 'standard', 'tax', 'person', 'below', 'mobile', 'less', 'got', 'blog', 'party', 'payment', 'equipment', 'login', 'student', 'let', 'programs', 'offers', 'legal', 'above', 'recent', 'park', 'stores', 'side', 'act', 'problem', 'red', 'give', 'memory', 'performance', 'social', 'q', 'august', 'quote', 'language', 'story', 'sell', 'options', 'experience', 'rates', 'create', 'key', 'body', 'young', 'america', 'important', 'field', 'few', 'east', 'paper', 'single', 'ii', 'age', 'activities', 'club', 'example', 'girls', 'additional', 'password', 'z', 'latest', 'something', 'road', 'gift', 'question', 'changes', 'night', 'ca', 'hard', 'texas', 'oct', 'pay', 'four', 'poker', 'status', 'browse', 'issue', 'range', 'building', 'seller', 'court', 'february', 'always', 'result', 'audio', 'light', 'write', 'war', 'nov', 'offer', 'blue', 'groups', 'al', 'easy', 'given', 'files', 'event', 'release', 'analysis', 'request', 'fax', 'china', 'making', 'picture', 'needs', 'possible', 'might', 'professional', 'yet', 'month', 'major', 'star', 'areas', 'future', 'space', 'committee', 'hand', 'sun', 'cards', 'problems', 'london', 'washington', 'meeting', 'rss', 'become', 'interest', 'id', 'child', 'keep', 'enter', 'california', 'share', 'similar', 'garden', 'schools', 'million', 'added', 'reference', 'companies', 'listed', 'baby', 'learning', 'energy', 'run', 'delivery', 'net', 'popular', 'term', 'film', 'stories', 'put', 'computers', 'journal', 'reports', 'co', 'try', 'welcome', 'central', 'images', 'president', 'notice', 'original', 'head', 'radio', 'until', 'cell', 'color', 'self', 'council', 'away', 'includes', 'track', 'australia', 'discussion', 'archive', 'once', 'others', 'entertainment', 'agreement', 'format', 'least', 'society', 'months', 'log', 'safety', 'friends', 'sure', 'faq', 'trade', 'edition', 'cars', 'messages', 'marketing', 'tell', 'further', 'updated', 'association', 'able', 'having', 'provides', 'david', 'fun', 'already', 'green', 'studies', 'close', 'common', 'drive', 'specific', 'several', 'gold', 'feb', 'living', 'sep', 'collection', 'called', 'short', 'arts', 'lot', 'ask', 'display', 'limited', 'powered', 'solutions', 'means', 'director', 'daily', 'beach', 'past', 'natural', 'whether', 'due', 'et', 'electronics', 'five', 'upon', 'period', 'planning', 'database', 'says', 'official', 'weather', 'mar', 'land', 'average', 'done', 'technical', 'window', 'france', 'pro', 'region', 'island', 'record', 'direct', 'microsoft', 'conference', 'environment', 'records', 'st', 'district', 'calendar', 'costs', 'style', 'url', 'front', 'statement', 'update', 'parts', 'aug', 'ever', 'downloads', 'early', 'miles', 'sound', 'resource', 'present', 'applications', 'either', 'ago', 'document', 'word', 'works', 'material', 'bill', 'apr', 'written', 'talk', 'federal', 'hosting', 'rules', 'final', 'adult', 'tickets', 'thing', 'centre', 'requirements', 'via', 'cheap', 'kids', 'finance', 'true', 'minutes', 'else', 'mark', 'third', 'rock', 'gifts', 'europe', 'reading', 'topics', 'bad', 'individual', 'tips', 'plus', 'auto', 'cover', 'usually', 'edit', 'together', 'videos', 'percent', 'fast', 'function', 'fact', 'unit', 'getting', 'global', 'tech', 'meet', 'far', 'economic', 'en', 'player', 'projects', 'lyrics', 'often', 'subscribe', 'submit', 'germany', 'amount', 'watch', 'included', 'feel', 'though', 'bank', 'risk', 'thanks', 'everything', 'deals', 'various', 'words', 'linux', 'jul', 'production', 'commercial', 'james', 'weight', 'town', 'heart', 'advertising', 'received', 'choose', 'treatment', 'newsletter', 'archives', 'points', 'knowledge', 'magazine', 'error', 'camera', 'jun', 'girl', 'currently', 'construction', 'toys', 'registered', 'clear', 'golf', 'receive', 'domain', 'methods', 'chapter', 'makes', 'protection', 'policies', 'loan', 'wide', 'beauty', 'manager', 'india', 'position', 'taken', 'sort', 'listings', 'models', 'michael', 'known', 'half', 'cases', 'step', 'engineering', 'florida', 'simple', 'quick', 'none', 'wireless', 'license', 'paul', 'friday', 'lake', 'whole', 'annual', 'published', 'later', 'basic', 'sony', 'shows', 'corporate', 'google', 'church', 'method', 'purchase', 'customers', 'active', 'response', 'practice', 'hardware', 'figure', 'materials', 'fire', 'holiday', 'chat', 'enough', 'designed', 'along', 'among', 'death', 'writing', 'speed', 'html', 'countries', 'loss', 'face', 'brand', 'discount', 'higher', 'effects', 'created', 'remember', 'standards', 'oil', 'bit', 'yellow', 'political', 'increase', 'advertise', 'kingdom', 'base', 'football', 'reading', 'books', 'listening', 'music', 'traveling', 'places', 'meet', 'weekends', 'play', 'games', 'watch', 'movies', 'third', 'cooking', 'food', 'going', 'park', 'anna', 'david', 'john' // Added for proper names and common words in example
];
const WORDS = new Set(wordList);

function edits1(word) {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const splits = [...Array(word.length + 1)].map((_, i) => [word.slice(0, i), word.slice(i)]);
  const deletes = splits.slice(1).map(([a, b]) => a + b.slice(1)).filter(w => w);
  const transposes = splits.slice(0, -1).map(([a, b]) => a + b[1] + b[0] + b.slice(2)).filter(w => w);
  const replaces = splits.flatMap(([a, b]) => letters.split('').map(c => a + c + b.slice(1))).filter(w => w);
  const inserts = splits.flatMap(([a, b]) => letters.split('').map(c => a + c + b));
  return new Set([...deletes, ...transposes, ...replaces, ...inserts]);
}

function edits2(word) {
  const e1 = edits1(word);
  return new Set(Array.from(e1).flatMap(e => Array.from(edits1(e))));
}

function known(words) {
  return new Set(Array.from(words).filter(w => WORDS.has(w)));
}

function candidates(word) {
  const k1 = known([word]);
  if (k1.size > 0) return k1;
  const k2 = known(edits1(word));
  if (k2.size > 0) return k2;
  const k3 = known(edits2(word));
  if (k3.size > 0) return k3;
  return new Set([word]);
}

function correct(word) {
  const cand = candidates(word.toLowerCase());
  return Array.from(cand)[0];
}

function checkSpelling(text) {
  const words = text.match(/\b\w+\b/g) || [];
  const errors = [];
  words.forEach(w => {
    if (w[0] === w[0].toUpperCase()) return; // Skip proper names
    const corr = correct(w);
    if (corr !== w.toLowerCase()) {
      errors.push({ word: w, suggestion: corr });
    }
  });
  return errors;
}

// Grammar Checker
function checkGrammar(text) {
  const sentences = text.match(/[^.!?]*[.!?]/g) || [text];
  const errors = [];

  sentences.forEach((sent, index) => {
    const trimmed = sent.trim();
    if (!trimmed) return;

    if (trimmed[0] !== trimmed[0].toUpperCase()) {
      errors.push(`Sentence ${index + 1}: Does not start with uppercase. ("${trimmed}")`);
    }

    if (!/[.!?]/.test(trimmed[trimmed.length - 1])) {
      errors.push(`Sentence ${index + 1}: No punctuation. ("${trimmed}")`);
    }

    if (/ {2,}/.test(trimmed)) {
      errors.push(`Sentence ${index + 1}: Double spaces. ("${trimmed}")`);
    }

    const wordCount = trimmed.split(/\s+/).length;
    if (wordCount < 3) {
      errors.push(`Sentence ${index + 1}: Fragment (${wordCount} words). ("${trimmed}")`);
    }

    if (wordCount > 50) {
      errors.push(`Sentence ${index + 1}: Run-on (${wordCount} words). ("${trimmed}")`);
    }
  });

  return errors;
}

// Submission handler
document.addEventListener('DOMContentLoaded', function() {
  const doneBtn = document.getElementById('doneBtn');
  if (doneBtn) {
    doneBtn.addEventListener('click', function () {
      let answers = {};
      document.querySelectorAll('input, textarea, select').forEach(el => {
        if (!el.name) return;
        if (el.type === 'radio' || el.type === 'checkbox') {
          if (el.checked) answers[el.name] = el.value;
        } else {
          answers[el.name] = el.value.trim();
        }
      });
      localStorage.setItem('examAnswers', JSON.stringify(answers));

      try {
        const results = validateAnswers(answers);
        localStorage.setItem('examResults', JSON.stringify(results));
      } catch (e) {
        console.error('Validation error:', e);
        localStorage.setItem('examResults', JSON.stringify({ score: 0, feedback: ['Error during validation: ' + e.message], totalPossible: 100 }));
      }

      window.location.href = 'review.html';
    });
  }
});

// toggleMenu, scrollToTop, themeRadios, audio player (unchanged)

// validateAnswers with try-catch per section
function validateAnswers(answers) {
  const correctVocab = ['cold', 'apple', 'glass', 'cat', 'glad'];
  const correctGrammar = ['goes', 'were', 'Do', 'am drinking', 'have'];
  const correctReading = ['london', '20', 'student', 'playing football', 'no'];
  const correctListening = ['john', 'canada', '25', 'reading books', 'guitar'];

  let score = 0;
  let feedback = [];
  let totalPossible = 100;

  // List all correct answers
  feedback.push('Correct Vocabulary Answers: ' + correctVocab.join(', '));
  feedback.push('Correct Grammar Answers: ' + correctGrammar.join(', '));
  feedback.push('Correct Reading Answers: ' + correctReading.join(', '));
  feedback.push('Correct Listening Answers: ' + correctListening.join(', '));

  // Vocabulary
  try {
    for (let i = 1; i <= 5; i++) {
      const key = `v${i}`;
      if (answers[key] && answers[key].toLowerCase() === correctVocab[i-1]) {
        score += 5;
        feedback.push(`Vocabulary Q${i}: Correct (${answers[key]}) - 5 points`);
      } else if (answers[key]) {
        feedback.push(`Vocabulary Q${i}: Incorrect (Selected: ${answers[key]}, Correct: ${correctVocab[i-1]}) - 0 points`);
      } else {
        feedback.push(`Vocabulary Q${i}: Not answered (Correct: ${correctVocab[i-1]}) - 0 points`);
      }
    }
  } catch (e) {
    feedback.push('Vocabulary section error: ' + e.message);
  }

  // Grammar
  try {
    for (let i = 1; i <= 5; i++) {
      const key = `g${i}`;
      if (answers[key] && answers[key].toLowerCase() === correctGrammar[i-1].toLowerCase()) {
        score += 5;
        feedback.push(`Grammar Q${i}: Correct (${answers[key]}) - 5 points`);
      } else if (answers[key]) {
        feedback.push(`Grammar Q${i}: Incorrect (Selected: ${answers[key]}, Correct: ${correctGrammar[i-1]}) - 0 points`);
      } else {
        feedback.push(`Grammar Q${i}: Not answered (Correct: ${correctGrammar[i-1]}) - 0 points`);
      }
    }
  } catch (e) {
    feedback.push('Grammar section error: ' + e.message);
  }

  // Reading
  try {
    for (let i = 1; i <= 5; i++) {
      const key = `r${i}`;
      if (answers[key] && answers[key].toLowerCase().includes(correctReading[i-1])) {
        score += 5;
        feedback.push(`Reading Q${i}: Correct (${answers[key]}) - 5 points`);
      } else if (answers[key]) {
        feedback.push(`Reading Q${i}: Incorrect (Entered: ${answers[key]}, Expected to include: ${correctReading[i-1]}) - 0 points`);
      } else {
        feedback.push(`Reading Q${i}: Not answered (Expected to include: ${correctReading[i-1]}) - 0 points`);
      }
    }
  } catch (e) {
    feedback.push('Reading section error: ' + e.message);
  }

  // Listening
  try {
    for (let i = 1; i <= 5; i++) {
      const key = `l${i}`;
      if (answers[key] && answers[key].toLowerCase().includes(correctListening[i-1])) {
        score += 5;
        feedback.push(`Listening Q${i}: Correct (${answers[key]}) - 5 points`);
      } else if (answers[key]) {
        feedback.push(`Listening Q${i}: Incorrect (Entered: ${answers[key]}, Expected to include: ${correctListening[i-1]}) - 0 points`);
      } else {
        feedback.push(`Listening Q${i}: Not answered (Expected to include: ${correctListening[i-1]}) - 0 points`);
      }
    }
  } catch (e) {
    feedback.push('Listening section error: ' + e.message);
  }

  // Writing
  try {
    const writingText = answers['q1'] || '';
    let writingScore = 0;
    let writingFeedback = `Writing: `;
    if (writingText) {
      const words = writingText.split(/\s+/).filter(word => word.length > 0).length;
      const spellingErrors = checkSpelling(writingText);
      const grammarErrors = checkGrammar(writingText);

      if (words >= 50 && words <= 80) {
        writingScore += 10;
        writingFeedback += 'Word count OK (10 pts). ';
      } else {
        writingFeedback += `Word count invalid (${words}; must 50-80, 0 pts). `;
      }
      if (spellingErrors.length === 0) {
        writingScore += 7.5;
        writingFeedback += 'No spelling errors (7.5 pts). ';
      } else {
        writingFeedback += `Spelling errors: ${spellingErrors.map(e => `${e.word} -> ${e.suggestion}`).join(', ')} (0 pts). `;
      }
      if (grammarErrors.length === 0) {
        writingScore += 7.5;
        writingFeedback += 'No grammar errors (7.5 pts). ';
      } else {
        writingFeedback += `Grammar errors: ${grammarErrors.join(', ')} (0 pts). `;
      }
      writingFeedback += `Content: ${writingText.substring(0, 100)}... (Total writing: ${writingScore}/25 pts)`;
      score += writingScore;
    } else {
      writingFeedback += 'Not answered (0/25 pts)';
    }
    feedback.push(writingFeedback);
  } catch (e) {
    feedback.push('Writing section error: ' + e.message + ' (0/25 pts)');
  }

  return { score, feedback, totalPossible };
}
