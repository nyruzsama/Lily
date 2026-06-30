/* ============================================
   HOMEWITHLILY — PREMIUM COOKBOOK LANDING PAGE
   JavaScript — Animations, Interactions, 3D
   ============================================ */

// ============================================
// 1. LOADING SCREEN
// ============================================
(function initLoader() {
  const loader = document.getElementById('loader');
  const barFill = document.querySelector('.loader-bar-fill');
  let progress = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 15 + 2;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
        initScrollAnimations();
      }, 500);
    }
    barFill.style.width = Math.min(progress, 100) + '%';
  }, 200);

  document.body.style.overflow = 'hidden';
})();


// ============================================
// 2. LENIS SMOOTH SCROLL
// ============================================
const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 0.8,
  touchMultiplier: 1.2,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

lenis.on('scroll', ScrollTrigger.update);


// ============================================
// 3. GSAP + SCROLLTRIGGER SETUP
// ============================================
gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.scrollerProxy(document.body, {
  scrollTop(value) {
    if (arguments.length) {
      lenis.scrollTo(value, { immediate: true });
    }
    return lenis.scroll;
  },
  getBoundingClientRect() {
    return {
      top: 0,
      left: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    };
  },
  pinType: document.body.style.transform ? 'transform' : 'fixed',
});


// ============================================
// 4. PARTICLE BACKGROUND (Canvas 2D)
// ============================================
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 60; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 3 + 1,
      alpha: Math.random() * 0.3 + 0.05,
    });
  }

  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of particles) {
      const dx = mouseX - p.x;
      const dy = mouseY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        const force = (200 - dist) / 200 * 0.02;
        p.vx -= dx * force;
        p.vy -= dy * force;
      }

      p.vx *= 0.98;
      p.vy *= 0.98;
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(196, 149, 106, ${p.alpha})`;
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }
  draw();
})();


// ============================================
// 5. THREE.JS — 3D BOOK
// ============================================
(function init3DBook() {
  const container = document.getElementById('book3DContainer');
  if (!container) return;

  const width = container.clientWidth;
  const height = container.clientHeight;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 1000);
  camera.position.set(0, 0, 10);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ReinhardToneMapping;
  renderer.toneMappingExposure = 1.2;
  container.appendChild(renderer.domElement);

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffeedd, 0.5);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xffe4cc, 1.2);
  keyLight.position.set(5, 8, 7);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xccddff, 0.6);
  fillLight.position.set(-5, 0, 5);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xffffff, 0.4);
  rimLight.position.set(0, 5, -8);
  scene.add(rimLight);

  // Book Group
  const bookGroup = new THREE.Group();

  // Cover (back)
  const coverGeom = new THREE.BoxGeometry(4.2, 0.3, 5.6);
  const coverMat = new THREE.MeshStandardMaterial({
    color: 0x5C3D2E,
    roughness: 0.6,
    metalness: 0.3,
  });
  const cover = new THREE.Mesh(coverGeom, coverMat);
  cover.position.set(0, 0, 0);
  bookGroup.add(cover);

  // Pages
  const pagesGeom = new THREE.BoxGeometry(3.8, 0.6, 5.2);
  const pagesMat = new THREE.MeshStandardMaterial({
    color: 0xF5F0EB,
    roughness: 0.8,
    metalness: 0.0,
  });
  const pages = new THREE.Mesh(pagesGeom, pagesMat);
  pages.position.set(0, 0.35, 0);
  bookGroup.add(pages);

  // Front cover
  const frontGeom = new THREE.BoxGeometry(4.2, 0.15, 5.6);
  const frontMat = new THREE.MeshStandardMaterial({
    color: 0x8B7355,
    roughness: 0.4,
    metalness: 0.5,
  });
  const front = new THREE.Mesh(frontGeom, frontMat);
  front.position.set(0, 0.7, 0);
  bookGroup.add(front);

  // Gold frame on cover
  const frameMat = new THREE.MeshStandardMaterial({
    color: 0xC4956A,
    roughness: 0.3,
    metalness: 0.8,
  });
  const frameGeom = new THREE.BoxGeometry(3.6, 0.02, 5.0);
  const frame = new THREE.Mesh(frameGeom, frameMat);
  frame.position.set(0, 0.78, 0);
  bookGroup.add(frame);

  // Title plate
  const plateMat = new THREE.MeshStandardMaterial({
    color: 0x3D342E,
    roughness: 0.5,
    metalness: 0.2,
  });
  const plateGeom = new THREE.BoxGeometry(2.8, 0.02, 1.0);
  const plate = new THREE.Mesh(plateGeom, plateMat);
  plate.position.set(0, 0.79, -0.5);
  bookGroup.add(plate);

  // Gold stripe on spine
  const stripeMat = new THREE.MeshStandardMaterial({
    color: 0xC4956A,
    roughness: 0.3,
    metalness: 0.7,
  });
  const stripeGeom = new THREE.BoxGeometry(0.08, 0.5, 5.6);
  const stripe = new THREE.Mesh(stripeGeom, stripeMat);
  stripe.position.set(-2.1, 0.35, 0);
  bookGroup.add(stripe);

  // Page edges (gold)
  const edgeMat = new THREE.MeshStandardMaterial({
    color: 0xD4AB7A,
    roughness: 0.4,
    metalness: 0.6,
  });
  const edgeGeom = new THREE.BoxGeometry(3.8, 0.6, 0.04);
  const edgeTop = new THREE.Mesh(edgeGeom, edgeMat);
  edgeTop.position.set(0, 0.35, 2.6);
  bookGroup.add(edgeTop);

  const edgeBottom = new THREE.Mesh(edgeGeom, edgeMat);
  edgeBottom.position.set(0, 0.35, -2.6);
  bookGroup.add(edgeBottom);

  scene.add(bookGroup);

  // Ground shadow
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.1,
  });
  const shadowGeom = new THREE.CircleGeometry(3.5, 32);
  const shadow = new THREE.Mesh(shadowGeom, shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(0, -1.5, 0);
  scene.add(shadow);

  // Floating particles around book
  const particleGeom = new THREE.BufferGeometry();
  const particleCount = 80;
  const positions = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  for (let i = 0; i < particleCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    const r = 3 + Math.random() * 3;
    positions[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
    positions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r;
    positions[i * 3 + 2] = Math.cos(phi) * r;
    sizes[i] = Math.random() * 0.08 + 0.02;
  }
  particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeom.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const particleMat = new THREE.PointsMaterial({
    color: 0xC4956A,
    size: 0.05,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });
  const particlesMesh = new THREE.Points(particleGeom, particleMat);
  scene.add(particlesMesh);

  // Mouse interaction
  let mouse3D = { x: 0, y: 0 };
  let targetRot = { x: 0, y: 0 };
  let isHovering = false;

  renderer.domElement.addEventListener('mousemove', (e) => {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse3D.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse3D.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  });

  renderer.domElement.addEventListener('mouseenter', () => { isHovering = true; });
  renderer.domElement.addEventListener('mouseleave', () => { isHovering = false; });

  let autoRotate = true;
  let autoAngle = 0;

  function animateBook() {
    requestAnimationFrame(animateBook);

    if (isHovering) {
      targetRot.x = mouse3D.y * 0.3;
      targetRot.y = mouse3D.x * 0.5;
      autoRotate = false;
    } else {
      autoRotate = true;
    }

    if (autoRotate) {
      autoAngle += 0.005;
      targetRot.y = Math.sin(autoAngle) * 0.3;
      targetRot.x = Math.sin(autoAngle * 0.5) * 0.1;
    }

    bookGroup.rotation.x += (targetRot.x - bookGroup.rotation.x) * 0.05;
    bookGroup.rotation.y += (targetRot.y - bookGroup.rotation.y) * 0.05;

    particlesMesh.rotation.y += 0.002;
    particlesMesh.rotation.x += 0.001;

    shadow.material.opacity = 0.1 + Math.sin(autoAngle * 2) * 0.03;

    renderer.render(scene, camera);
  }

  animateBook();

  // Resize
  window.addEventListener('resize', () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
})();


// ============================================
// 6. CUSTOM CURSOR
// ============================================
(function initCursor() {
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let mouse = { x: 0, y: 0 };
  let dotPos = { x: 0, y: 0 };
  let ringPos = { x: 0, y: 0 };

  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  document.querySelectorAll('a, button, .btn, .gallery-card, .feature-card, .faq-question').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.classList.add('hover');
      ring.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('hover');
      ring.classList.remove('hover');
    });
  });

  function updateCursor() {
    dotPos.x += (mouse.x - dotPos.x) * 0.15;
    dotPos.y += (mouse.y - dotPos.y) * 0.15;
    ringPos.x += (mouse.x - ringPos.x) * 0.08;
    ringPos.y += (mouse.y - ringPos.y) * 0.08;

    dot.style.left = dotPos.x + 'px';
    dot.style.top = dotPos.y + 'px';
    ring.style.left = ringPos.x + 'px';
    ring.style.top = ringPos.y + 'px';

    requestAnimationFrame(updateCursor);
  }
  updateCursor();
})();


// ============================================
// 7. NAVBAR SCROLL EFFECT
// ============================================
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-btn');

  lenis.on('scroll', (e) => {
    if (e.offset > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile menu
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  mobileLinks.forEach((link, i) => {
    link.style.setProperty('--i', i);
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('href');
      if (target && target.startsWith('#')) {
        const el = document.querySelector(target);
        if (el) {
          lenis.scrollTo(el, { offset: -80 });
        }
      }
      toggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Desktop nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('href');
      if (target && target.startsWith('#')) {
        const el = document.querySelector(target);
        if (el) {
          lenis.scrollTo(el, { offset: -80 });
        }
      }
    });
  });
})();


// ============================================
// 8. HERO ANIMATIONS (GSAP)
// ============================================
(function initHeroAnimations() {
  const hero = document.getElementById('hero');
  const chef = document.getElementById('chefContainer');
  const goldenCircle = document.querySelector('.hero-golden-circle');
  const badges = document.querySelectorAll('.hero-badge-item');
  const cards = document.querySelectorAll('.floating-card');

  // Floating cards entrance
  gsap.from(cards, {
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5,
    },
    y: 60,
    opacity: 0.3,
    stagger: 0.2,
    duration: 2,
  });

  // Parallax on chef
  gsap.to(chef, {
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: 2,
    },
    y: 80,
    scale: 0.95,
    opacity: 0.8,
    duration: 2,
  });

  // Golden circle pulse on scroll
  gsap.to(goldenCircle, {
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5,
    },
    scale: 1.2,
    opacity: 0.3,
    duration: 2,
  });

  // Badges parallax
  badges.forEach((badge, i) => {
    gsap.from(badge, {
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
      y: 20 + i * 10,
      opacity: 0.5,
      duration: 2,
    });
  });

  // Mouse follow on chef
  document.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX / window.innerWidth - 0.5) * 6;
    const y = (e.clientY / window.innerHeight - 0.5) * 6;

    if (chef) {
      chef.style.transform = `translate(${x}px, ${y}px)`;
    }
    if (goldenCircle) {
      goldenCircle.style.transform = `translate(${x * -0.5}px, ${y * -0.5}px)`;
    }
  });
})();


// ============================================
// 9. COUNTER ANIMATIONS
// ============================================
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number');

  counters.forEach(counter => {
    const target = parseInt(counter.dataset.target);

    ScrollTrigger.create({
      trigger: counter,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        const isRating = counter.classList.contains('stat-rating');
        const suffix = isRating ? '' : '+';
        const duration = 2;
        const startValue = 0;
        const endValue = target;
        let startTime = null;

        function animate(timestamp) {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(startValue + (endValue - startValue) * eased);

          if (isRating) {
            counter.textContent = (current / 10).toFixed(1);
          } else {
            counter.textContent = current.toLocaleString();
          }

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            if (isRating) {
              counter.textContent = (endValue / 10).toFixed(1);
            } else {
              counter.textContent = endValue.toLocaleString();
            }
          }
        }
        requestAnimationFrame(animate);
      },
    });
  });
})();


// ============================================
// 10. FEATURES — STAGGER REVEAL
// ============================================
(function initFeaturesReveal() {
  const cards = document.querySelectorAll('.feature-card');

  cards.forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        once: true,
      },
      y: 60,
      opacity: 0,
      scale: 0.9,
      duration: 0.8,
      delay: i * 0.1,
      ease: 'power3.out',
    });
  });
})();


// ============================================
// 11. GALLERY — STAGGER REVEAL
// ============================================
(function initGalleryReveal() {
  const cards = document.querySelectorAll('.gallery-card');

  cards.forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        once: true,
      },
      y: 50,
      opacity: 0,
      rotation: i % 2 === 0 ? -2 : 2,
      duration: 0.7,
      delay: i * 0.08,
      ease: 'power2.out',
    });
  });
})();


// ============================================
// 12. WHY CHOOSE — TIMELINE REVEAL
// ============================================
(function initWhyReveal() {
  const items = document.querySelectorAll('.why-item');
  const line = document.querySelector('.why-line');

  // Animate the connecting line
  gsap.from(line, {
    scrollTrigger: {
      trigger: line,
      start: 'top 90%',
      end: 'bottom 60%',
      scrub: 1,
    },
    scaleY: 0,
    transformOrigin: 'top center',
    duration: 2,
  });

  items.forEach((item, i) => {
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: 'top 85%',
        once: true,
      },
      x: -30,
      opacity: 0,
      duration: 0.8,
      delay: i * 0.2,
      ease: 'power3.out',
    });
  });
})();


// ============================================
// 13. TESTIMONIALS — STAGGER REVEAL
// ============================================
(function initTestimonialsReveal() {
  const cards = document.querySelectorAll('.testimonial-card');

  cards.forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        once: true,
      },
      y: 40,
      opacity: 0,
      scale: 0.95,
      duration: 0.7,
      delay: i * 0.12,
      ease: 'power2.out',
    });
  });
})();


// ============================================
// 14. FAQ ACCORDION
// ============================================
(function initFAQ() {
  const items = document.querySelectorAll('.faq-item');

  items.forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all
      items.forEach(other => {
        other.classList.remove('active');
      });

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
})();


// ============================================
// 15. CTA — SCROLL REVEAL
// ============================================
(function initCTAReveal() {
  const cta = document.querySelector('.cta-content');

  gsap.from(cta, {
    scrollTrigger: {
      trigger: cta,
      start: 'top 85%',
      once: true,
    },
    y: 60,
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out',
  });

  // Float the CTA particles
  document.querySelectorAll('.cta-particle').forEach((p, i) => {
    gsap.to(p, {
      scrollTrigger: {
        trigger: '.cta-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
      },
      y: -100 + i * 50,
      x: (i - 1) * 30,
      opacity: 0.6,
      duration: 2,
    });
  });
})();


// ============================================
// 16. FOOTER REVEAL
// ============================================
(function initFooterReveal() {
  const footer = document.querySelector('.footer');

  gsap.from(footer, {
    scrollTrigger: {
      trigger: footer,
      start: 'top 95%',
      once: true,
    },
    y: 40,
    opacity: 0,
    duration: 1,
    ease: 'power2.out',
  });
})();


// ============================================
// 17. SCROLL ANIMATIONS (Intersection Observer)
// ============================================
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
    observer.observe(el);
  });
}


// ============================================
// 18. HOVER TILT ON FEATURE CARDS
// ============================================
(function initTilt() {
  document.querySelectorAll('.feature-card, .testimonial-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / centerY * -8;
      const rotateY = (x - centerX) / centerX * 8;

      card.style.transform =
        `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform =
        'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
})();


// ============================================
// 19. PARALLAX ON SCROLL
// ============================================
(function initParallax() {
  // Slow-moving background blobs
  document.querySelectorAll('.blob').forEach(blob => {
    gsap.to(blob, {
      scrollTrigger: {
        trigger: blob.closest('section') || document.body,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2,
      },
      y: () => (Math.random() - 0.5) * 80,
      x: () => (Math.random() - 0.5) * 40,
      scale: 1.1,
      duration: 1,
      ease: 'none',
    });
  });

  // Floating ingredients parallax
  document.querySelectorAll('.floating-ingredient, .floating-herb').forEach(el => {
    gsap.to(el, {
      scrollTrigger: {
        trigger: el.closest('section') || document.body,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
      },
      y: () => (Math.random() - 0.5) * 60 + 30,
      rotation: () => (Math.random() - 0.5) * 30,
      duration: 1,
      ease: 'none',
    });
  });
})();


// ============================================
// 20. NEWSLETTER FORM
// ============================================
(function initNewsletter() {
  const form = document.querySelector('.newsletter-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input');
    if (input.value) {
      // Placeholder — would connect to API
      input.value = '';
      input.placeholder = 'Thank you for subscribing!';
      setTimeout(() => {
        input.placeholder = 'Enter your email';
      }, 3000);
    }
  });
})();


// ============================================
// 21. HERO BUTTON SMOOTH SCROLL
// ============================================
document.querySelectorAll('.btn-primary, .btn-secondary, .btn-cta').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const href = btn.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        lenis.scrollTo(target, { offset: -60 });
      }
    }
  });
});


// ============================================
// 22. WINDOW RESIZE — REFRESH SCROLLTRIGGER
// ============================================
window.addEventListener('resize', () => {
  ScrollTrigger.refresh();
});


// ============================================
// 23. PREVENT DEFAULT FOR EMPTY LINKS
// ============================================
document.querySelectorAll('a[href="#"]').forEach(link => {
  link.addEventListener('click', (e) => e.preventDefault());
});


console.log('%c HomeWithLily 🍳✨ ', 'background: #2C2520; color: #C4956A; font-size: 18px; padding: 10px 20px; border-radius: 8px; font-weight: bold;');
console.log('%c Premium Cookbook Landing Page', 'color: #8B7355; font-size: 13px;');
