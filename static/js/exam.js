  const MAX_SECONDS = 60 * 5;
  const LOCK_THRESHOLD = 60;
  const CANCEL_THRESHOLD = 70;

  const recBtn = document.getElementById('recBtn');
  const lockBubble = document.getElementById('lockBubble');
  const timerEl = document.getElementById('timer');
  const miniHint = document.getElementById('miniHint');
  const statusEl = document.getElementById('status');
  const pauseBtn = document.getElementById('pauseBtn');
  const stopBtn = document.getElementById('stopBtn');
  const downloadBtn = document.getElementById('downloadBtn');

  const playerContainer = document.getElementById('audioBar');
  const player = document.getElementById('player');
  const playTime = document.getElementById('playTime');
  const playSpeed = document.getElementById('playSpeed');

  let isRecording = false, isLocked = false, isPaused = false;
  let startX = null, startY = null, pointerId = null;
  let elapsedSeconds = 0, timerInterval = null, startTime = 0;

  let mediaStream = null, mediaRecorder = null, chunks = [];

  let waveSurfer = null, micPlugin = null;
  (function setupWave() {
    if (typeof WaveSurfer === 'undefined') return;
    if (WaveSurfer.microphone) {
      micPlugin = WaveSurfer.microphone.create();
      waveSurfer.registerPlugin(micPlugin).initPlugin('microphone');
    }
  })();

  function formatTime(s) {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  }
  function setStatus(txt) { statusEl.textContent = txt; }
  function show(el) { el.classList.remove('hidden'); }
  function hide(el) { el.classList.add('hidden'); }

  let timerFrame = null;

  function updateTimer() {
    if (!isRecording) return;
    elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    timerEl.textContent = formatTime(elapsedSeconds);
    if (elapsedSeconds >= MAX_SECONDS) stopRecording();
  }

  function startTimer() {
    startTime = Date.now() - elapsedSeconds * 1000;
    function loop() {
      if (!isRecording) return;
      updateTimer();
      timerFrame = requestAnimationFrame(loop);
    }
    timerFrame = requestAnimationFrame(loop);
  }

  function stopTimer() {
    if (timerFrame) cancelAnimationFrame(timerFrame);
    timerFrame = null;
  }

  async function initMedia() {
    if (mediaStream) return mediaStream;
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation:true, noiseSuppression:true } });
      if (micPlugin && micPlugin.start) micPlugin.start();
      return mediaStream;
    } catch(err) {
      console.error('initMedia error:', err);
      throw err;
    }
  }


  function updateMiniHint() {
    if (recordingCancelled) miniHint.textContent = 'Cancelled';
    else if (!isRecording) miniHint.textContent = 'Play or download';
    else if (isPaused) miniHint.textContent = 'Paused — resume or stop';
    else if (isLocked) miniHint.textContent = 'Locked — continue or stop';
    else miniHint.textContent = 'Recording';
  }
  async function startRecording() {
    recordingCancelled = false;
    if (isRecording) return;
    try {
      await initMedia();
      chunks = [];
      mediaRecorder = new MediaRecorder(mediaStream, { mimeType: 'audio/webm;codecs=opus' });

      mediaRecorder.ondataavailable = e => {
        if (e.data && e.data.size) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        chunks = [];

        const url = URL.createObjectURL(blob);
        player.src = url;

        // ✅ show download button after recording ends
        downloadBtn.onclick = () => {
          const a = document.createElement('a');
          a.href = url;
          a.download = `voice_${new Date().toISOString().replace(/[:.]/g,'-')}.webm`;
          document.body.appendChild(a);
          a.click();
          a.remove();
        };

        show(downloadBtn);

        // ✅ show play/pause button
        show(playPauseBtn);
      updateMiniHint()
    };

    mediaRecorder.start(250);

    isRecording = true;
    isPaused = false;
    isLocked = false;
    elapsedSeconds = 0;
    timerEl.textContent = '00:00';
    recBtn.classList.add('recording');
    recBtn.setAttribute('aria-pressed', 'true');
    lockBubble.textContent = 'Slide up to lock';
    lockBubble.style.transform = 'translateX(-50%) translateY(0)';
    lockBubble.classList.add('show');
    setStatus('Recording — slide up to lock, slide left to cancel');

    hide(playerContainer);
    hide(stopBtn);
    hide(pauseBtn);
    hide(downloadBtn);

    startTimer();
  } catch (err) {
    setStatus('Mic access denied or unavailable');
  }
  updateMiniHint()
}

  function onRecordingStop() {
    stopTimer();
    recBtn.classList.remove('recording','locked');
    recBtn.setAttribute('aria-pressed','false');
    lockBubble.classList.remove('show');

    try { if (micPlugin && micPlugin.stop) micPlugin.stop(); } catch(e){}

    const blob = new Blob(chunks, { type:'audio/webm' });
    const url = URL.createObjectURL(blob);
    attachBlobUrl(url);

    show(playerContainer);

    player.addEventListener('loadedmetadata', () => {
      playTime.textContent = `00:00 / ${formatTime(player.duration)}`;
    });
    player.addEventListener('timeupdate', () => {
      playTime.textContent = `${formatTime(player.currentTime)} / ${formatTime(player.duration)}`;
    });

    show(downloadBtn);
    // Download button becomes available when finished
    downloadBtn.onclick = () => {
      const a = document.createElement('a');
      a.href = url;
      a.download = `voice_${new Date().toISOString().replace(/[:.]/g,'-')}.webm`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    };

    statusEl.textContent = 'Recording finished — play or download';
  }

  function stopRecording() {
    if (!isRecording) return;
  isRecording = false;

  // ✅ Stop the recorder
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }

  // ✅ Stop the timer
  stopTimer();
  player.addEventListener('loadedmetadata', () => {
  playTime.textContent = `00:00 / ${formatTime(player.duration)}`;
});



  // Reset UI
  hide(stopBtn);
  hide(pauseBtn);
  pauseBtn.textContent = 'Pause'; // reset
  lockBubble.classList.remove('show');
  recBtn.classList.remove('recording');
  recBtn.setAttribute('aria-pressed', 'false');
  setStatus('Recording stopped');
  updateMiniHint()
  }

// === JavaScript (replace previous playback code with this) ===
const audio = document.getElementById('player');
const playPauseBtn = document.getElementById('playPauseBtn');
const playPauseImg = document.getElementById('playPauseImg');
const playTime2 = document.getElementById('playTime');
const timeBarContainer = document.getElementById('timeBarContainer');
const timeBarProgress = document.getElementById('timeBarProgress');
const download = document.getElementById('downloadBtn');

// Icon mapping (adjust paths or add night icons if you want)
const ICONS = {
  play: {
    day:  'static/images/play.png',
    night:'static/images/play-night.png'
  },
  pause: {
    day:  'static/images/pause.png',
    night:'static/images/pause-night.png'
  }
};

function getTheme(){ return playPauseBtn.dataset.theme || 'day'; }

function formatTime(s){
  if (!isFinite(s) || isNaN(s)) return '00:00';
  const m = Math.floor(s/60).toString().padStart(2,'0');
  const sec = Math.floor(s%60).toString().padStart(2,'0');
  return `${m}:${sec}`;
}

function hasPlayableSource(){
  // Consider it playable if src exists and either readyState > 0 or duration is known
  return !!audio.src && (audio.readyState > 0 || (audio.duration && !isNaN(audio.duration)));
}

function updatePlayButtonUI(){
  const theme = getTheme();
  // If no source -> show play icon, disable button
  if (!hasPlayableSource()) {
    playPauseBtn.disabled = true;
    playPauseBtn.classList.remove('pause');
    playPauseBtn.classList.add('play');
    playPauseImg.src = ICONS.play[theme] || ICONS.play.day;
    playPauseImg.alt = 'Play';
    return;
  }

  // enable button and set icon based on current playback state
  playPauseBtn.disabled = false;
  if (audio.paused || audio.ended) {
    playPauseBtn.classList.remove('pause');
    playPauseBtn.classList.add('play');
    playPauseImg.src = ICONS.play[theme] || ICONS.play.day;
    playPauseImg.alt = 'Play';
  } else {
    playPauseBtn.classList.remove('play');
    playPauseBtn.classList.add('pause');
    playPauseImg.src = ICONS.pause[theme] || ICONS.pause.day;
    playPauseImg.alt = 'Pause';
  }
}

/* ---------- single click handler: toggles playback only ---------- */
playPauseBtn.addEventListener('click', () => {
  if (!hasPlayableSource()) return; // do nothing when no audio
  if (audio.paused || audio.ended) audio.play();
  else audio.pause();
});

/* ---------- audio event listeners keep UI in sync ---------- */
audio.addEventListener('loadedmetadata', () => {
  // Duration is now available
  playTime2.textContent = `${formatTime(0)} / ${formatTime(audio.duration)}`;
  updatePlayButtonUI();
});

audio.addEventListener('play', updatePlayButtonUI);
audio.addEventListener('pause', updatePlayButtonUI);

audio.addEventListener('ended', () => {
  // When finished set UI back to "play"
  updatePlayButtonUI();
  // optional: reset to start so subsequent play begins from start
  audio.currentTime = 0;
});

audio.addEventListener('timeupdate', () => {
  const dur = audio.duration || 0;
  playTime2.textContent = `${formatTime(audio.currentTime)} / ${formatTime(dur)}`;
  const percent = dur ? (audio.currentTime / dur) * 100 : 0;
  timeBarProgress.style.width = percent + '%';
});

/* ---------- click-to-seek on custom time bar ---------- */
timeBarContainer.addEventListener('click', (e) => {
  if (!hasPlayableSource()) return;
  const rect = timeBarContainer.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const pct = Math.max(0, Math.min(1, clickX / rect.width));
  audio.currentTime = pct * audio.duration;
});

/* ---------- helper: call this with the blob URL when recording stops ---------- */
function attachBlobUrl(blobUrl) {
  // Use this instead of assigning player.src directly in your onRecordingStop
  audio.src = blobUrl;
  audio.load(); // triggers loadedmetadata when metadata available
  updatePlayButtonUI();
  // show download, enable it and wire it (if you want)
  downloadBtn.classList.remove('hidden');
  downloadBtn.onclick = () => {
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = `voice_${new Date().toISOString().replace(/[:.]/g,'-')}.webm`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };
}


function cancelRecording() {
    if (!isRecording) return;
    isRecording = false;
    chunks = [];
    recordingCancelled = true;  // set the flag

    if (mediaRecorder) {
        mediaRecorder.onstop = null;
        if (mediaRecorder.state !== 'inactive') mediaRecorder.stop();
    }
    stopTimer();
    timerEl.textContent = '00:00';
    recBtn.classList.remove('recording','locked');
    lockBubble.classList.remove('show');
    statusEl.textContent = 'Recording cancelled';
    updateMiniHint(); // updates to 'Cancelled'
    hide(playerContainer);
    hide(stopBtn);
    hide(pauseBtn);
    hide(downloadBtn);
}


  function togglePause() {
    if (!isRecording) return;
    if (!isPaused) {
      if (mediaRecorder.pause) mediaRecorder.pause();
      isPaused = true;
      pauseBtn.textContent = 'Resume';
      stopTimer();
    } else {
      if (mediaRecorder.resume) mediaRecorder.resume();
      isPaused = false;
      startTimer();
      pauseBtn.textContent = 'Pause';
    }
    updateMiniHint();
  }

  let usingWindowFallback = false;

  function onPointerDown(ev) {
    ev.preventDefault();
    startX = ev.clientX; startY = ev.clientY; pointerId = ev.pointerId;
    try {
      recBtn.setPointerCapture(pointerId);
      usingWindowFallback = false;
    } catch(e) {
      usingWindowFallback = true;
      window.addEventListener('pointermove', windowPointerMove, { passive:false });
      window.addEventListener('pointerup', windowPointerUp);
      window.addEventListener('pointercancel', windowPointerCancel);
    }
    startRecording();
  }

  function onPointerMove(ev) {
    if (!isRecording) return;
    const dy = startY - ev.clientY;
    const dx = ev.clientX - startX;
    if (!isLocked) {
      const ty = Math.max(-40, -dy/3);
      lockBubble.style.transform = `translateX(-50%) translateY(${ty}px)`;
      lockBubble.textContent = 'Slide up to lock';
      lockBubble.classList.add('show');
    }
    if (dy > LOCK_THRESHOLD && !isLocked) {
      isLocked = true;
      recBtn.classList.add('locked');
      lockBubble.textContent = 'Locked 🔒';
      setStatus('Locked — recording continues until Stop');
      miniHint.textContent = 'Locked — continue or Stop';
      // Show Stop and Pause now
      show(stopBtn);
      show(pauseBtn);
    }
    if (dx < -CANCEL_THRESHOLD && !isLocked) {
      lockBubble.textContent = 'Canceled ✖';
      setTimeout(() => cancelRecording(), 120);
    }
  }

  function onPointerUp(ev) {
    try { if (pointerId != null) recBtn.releasePointerCapture(pointerId); } catch(e){}
    if (usingWindowFallback) cleanupWindowFallback();
    if (!isRecording) return;
    if (!isLocked) {
      // user released without locking -> finish immediately
      stopRecording();
      // onRecordingStop will handle showing audio etc
    } else {
      // locked -> keep recording; stop only with Stop button
      setStatus('Locked — continue or Stop');
      miniHint.textContent = 'Locked — continue or Stop';
    }
    // reset bubble position
    lockBubble.style.transform = 'translateX(-50%) translateY(0)';
    startX = startY = pointerId = null;
  }

  function onPointerCancel(ev) {
    try { if (pointerId != null) recBtn.releasePointerCapture(pointerId); } catch(e){}
    if (usingWindowFallback) cleanupWindowFallback();
    if (!isRecording) return;
    if (!isLocked) cancelRecording();
    startX = startY = pointerId = null;
  }

  function windowPointerMove(ev) { onPointerMove(ev); }
  function windowPointerUp(ev) { onPointerUp(ev); }
  function windowPointerCancel(ev) { onPointerCancel(ev); }
  function cleanupWindowFallback() {
    window.removeEventListener('pointermove', windowPointerMove, { passive:false });
    window.removeEventListener('pointerup', windowPointerUp);
    window.removeEventListener('pointercancel', windowPointerCancel);
    usingWindowFallback = false;
  }

  recBtn.addEventListener('pointerdown', onPointerDown);
  recBtn.addEventListener('pointermove', onPointerMove);
  recBtn.addEventListener('pointerup', onPointerUp);
  recBtn.addEventListener('pointercancel', onPointerCancel);

  recBtn.addEventListener('keydown', (e)=>{
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (!isRecording) startRecording();
      else if (!isLocked) stopRecording();
    }
  });

  stopBtn.addEventListener('click', ()=> {
    if (isRecording && isLocked) {
      stopRecording();
    }
  });
  pauseBtn.addEventListener('click', ()=> {
    if (isRecording && isLocked) togglePause();
  });

  (function detectSupport() {
    const missing = [];
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) missing.push('getUserMedia');
    if (typeof MediaRecorder === 'undefined') missing.push('MediaRecorder');
    if (missing.length) setStatus('Warning: missing support: ' + missing.join(', '));
    else setStatus('Ready — hold to record');
  })();


recBtn.addEventListener("contextmenu", e => e.preventDefault());

// Also block long-press menu on mobile
recBtn.addEventListener("touchstart", e => {
  e.preventDefault(); // stops long-press triggering
}, { passive: false });