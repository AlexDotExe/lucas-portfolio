(() => {
  // ── Lens Intro ────────────────────────────

  const lensIntro = document.getElementById('lens-intro');
  if (lensIntro) {
    document.body.classList.add('loading');
    setTimeout(() => {
      lensIntro.classList.add('done');
      document.body.classList.remove('loading');
    }, 2200);
    setTimeout(() => {
      lensIntro.remove();
    }, 2700);
  }

  // ── Theme Toggle ───────────────────────────

  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  // ── Mobile Menu ────────────────────────────

  const menuToggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('open');
      nav.classList.toggle('open');
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('open');
        nav.classList.remove('open');
      });
    });
  }

  // ── Hero Slideshow ─────────────────────────

  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    const slides = heroSection.querySelectorAll('.hero-slide');
    const dotsContainer = heroSection.querySelector('.hero-dots');
    let current = 0;
    let interval;

    // build dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.classList.add('hero-dot');
      if (i === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.hero-dot');

    function goTo(index) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = index;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
      resetInterval();
    }

    function next() {
      goTo((current + 1) % slides.length);
    }

    function resetInterval() {
      clearInterval(interval);
      interval = setInterval(next, 5000);
    }

    resetInterval();
  }

  // ── Gallery & Filtering ───────────────────

  const gallery = document.querySelector('.gallery');
  if (gallery) {
    const items = document.querySelectorAll('.gallery-item');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');

    let visibleItems = [];
    let currentIndex = 0;

    function updateVisibleItems() {
      visibleItems = [...document.querySelectorAll('.gallery-item:not(.hidden)')];
    }

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        items.forEach(item => {
          const match = filter === 'all' || item.dataset.category === filter;
          item.classList.toggle('hidden', !match);
          if (match) {
            item.classList.remove('fade-in');
            void item.offsetWidth;
            item.classList.add('fade-in');
          }
        });

        updateVisibleItems();
      });
    });

    updateVisibleItems();

    // ── Lightbox ────────────────────────────────

    function openLightbox(index) {
      currentIndex = index;
      const item = visibleItems[currentIndex];
      const img = item.querySelector('img');
      const caption = item.querySelector('.overlay span');

      lightboxImg.classList.remove('loaded');
      lightboxImg.src = img.src.replace(/\/\d+\/\d+$/, '/1200/800');
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = caption ? caption.textContent : '';

      lightboxImg.onload = () => lightboxImg.classList.add('loaded');
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    function navigate(direction) {
      currentIndex = (currentIndex + direction + visibleItems.length) % visibleItems.length;
      const item = visibleItems[currentIndex];
      const img = item.querySelector('img');
      const caption = item.querySelector('.overlay span');

      lightboxImg.classList.remove('loaded');
      lightboxImg.src = img.src.replace(/\/\d+\/\d+$/, '/1200/800');
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = caption ? caption.textContent : '';

      lightboxImg.onload = () => lightboxImg.classList.add('loaded');
    }

    gallery.addEventListener('click', e => {
      const item = e.target.closest('.gallery-item');
      if (!item || item.classList.contains('hidden')) return;
      const index = visibleItems.indexOf(item);
      if (index !== -1) openLightbox(index);
    });

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => navigate(-1));
    nextBtn.addEventListener('click', () => navigate(1));

    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    });
  }
})();
