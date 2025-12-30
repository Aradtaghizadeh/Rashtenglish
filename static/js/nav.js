(function (){
  // Elements
  const nav = document.querySelector('.glass-nav');
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('nav-menu');
  const menuItems = Array.from(menu.querySelectorAll('li'));
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Performance detection (graceful)
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection || null;
  const saveData = conn && conn.saveData;
  const deviceMemory = navigator.deviceMemory || 4; // assume 4 if not available
  const lowPower = saveData || (deviceMemory && deviceMemory <= 1.5) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2);

  if (lowPower) document.body.classList.add('reduced-effects');

  // Stagger: ensure each li has a CSS var --i (already set inline as fallback)
  menuItems.forEach((li, idx) => {
    if (!li.style.getPropertyValue('--i')) li.style.setProperty('--i', idx);
  });

  // Mobile menu toggle (only toggles transform/opacity -> avoids layout thrash)
  function openMenu(){
    menu.classList.add('open');
    menu.setAttribute('aria-hidden','false');
    toggle.setAttribute('aria-expanded','true');
    // set delay on children to animate in (CSS handles per --i)
  }
  function closeMenu(returnFocus = true){
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden','true');
    toggle.setAttribute('aria-expanded','false');
    if(returnFocus) toggle.focus();
  }
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    if(expanded) closeMenu(); else openMenu();
  });

  // close menu if click outside
  document.addEventListener('click', (e) => {
    if(!menu.contains(e.target) && !toggle.contains(e.target)) closeMenu(false);
  });

  // keyboard: ESC to close; arrow nav inside menu
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') {
      if (menu.classList.contains('open')) closeMenu();
    }
  });

  // Ripple on click for anchors (micro-interaction)
  function createRipple(e){
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const r = Math.max(rect.width, rect.height) * 0.9;
    const y = e.clientY - rect.top - r/2;
    const span = document.createElement('span');
    span.className = 'ripple';
    span.style.width = span.style.height = r + 'px';
    span.style.left = x + 'px';
    span.style.top = y + 'px';
    target.style.position = 'relative';
    target.appendChild(span);
    // force style recalc then animate (CSS transition)
    requestAnimationFrame(() => {
      span.style.transform = 'scale(1)';
      span.style.opacity = '0';
    });
    // remove after animation
    setTimeout(()=> span.remove(), 520);
  }
  // attach ripple to each anchor in nav
  const anchors = document.querySelectorAll('.nav-menu a, .brand');
  anchors.forEach(a=>{
    a.addEventListener('click', (e)=> {
      // only create ripple for primary button-like clicks (left-click or touch)
      createRipple(e);
    });
  });

  // Parallax on scroll (very small, sets CSS var --nav-parallax used inside keyframes)
  // throttle using rAF and tiny magnitude to avoid layout thrash
  let lastScroll = window.scrollY, ticking = false;
  function onScroll(){
    if(prefersReduced || lowPower) return;
    lastScroll = window.scrollY;
    if(!ticking){
      window.requestAnimationFrame(() => {
        // small parallax: clamp to ±8px
        const p = Math.max(-8, Math.min(8, (lastScroll - (window.innerHeight/2)) * 0.005));
        nav.style.setProperty('--nav-parallax', (p).toFixed(2) + 'px');
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, {passive:true});

  // Pointer tilt (fine pointers only) - subtle and smoothed
  let tiltY = 0, targetY = 0, rafId;
  const supportTilt = window.matchMedia('(hover: hover) and (pointer: fine)').matches && !prefersReduced && !lowPower;

  if(supportTilt){
    nav.addEventListener('pointermove', (e) => {
      const r = nav.getBoundingClientRect();
      const cx = r.left + r.width/2;
      const cy = r.top + r.height/2;
      const dx = (e.clientX - cx) / (r.width/2); // -1..1
      const dy = (e.clientY - cy) / (r.height/2); // -1..1
      // max tilt 6deg * gentle factor
      targetY = (-dx * 6).toFixed(2) + 'deg';
    });
    nav.addEventListener('pointerleave', () => {
      targetY = '0deg';
    });

    // smoothing loop
    function tiltLoop(){
      // lerp towards target
      const curY = parseFloat(tiltY) || 0;
      const tY = parseFloat(targetY) || 0;
      const newY = curY + (tY - curY) * 0.14;
      tiltY = newY;
      nav.style.setProperty('--tilt-y', newY.toFixed(2) + 'deg');
      rafId = requestAnimationFrame(tiltLoop);
    }
    tiltLoop();
  }

  // Adaptive: if device is low-power or user prefers reduced motion, tone down effects
  if(prefersReduced){
    document.body.classList.add('reduced-effects');
  }

  // Initialize menu aria state depending on viewport
  
  // Cleanup on unload
  window.addEventListener('unload', () => {
    if(rafId) cancelAnimationFrame(rafId);
  });

  // Expose for debugging (optional)
  window._navPerf = {
    lowPower, prefReduced: prefersReduced
  };

})();
