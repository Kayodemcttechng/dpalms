/* ===========================================================
   D'PALM WELLNESS SPA & MEDSPA — SCRIPT.JS
   Vanilla JS only. No frameworks, no dependencies.
   =========================================================== */
(function () {
  'use strict';

  /* ---------- 1. PRELOADER ---------- */
  var preloader = document.getElementById('preloader');
  function hidePreloader() {
    if (!preloader) return;
    preloader.classList.add('is-hidden');
    window.setTimeout(function () { preloader.remove(); }, 700);
  }
  window.addEventListener('load', function () {
    window.setTimeout(hidePreloader, 500); // brief minimum display so it doesn't just flash
  });
  // Safety net in case 'load' is delayed by slow third-party assets
  window.setTimeout(hidePreloader, 4000);

  /* ---------- 2. STICKY HEADER ---------- */
  var header = document.getElementById('siteHeader');
  function onScrollHeader() {
    if (window.scrollY > 40) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }
  document.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------- 3. MOBILE NAVIGATION ---------- */
  var hamburger = document.getElementById('hamburgerBtn');
  var nav = document.getElementById('primaryNav');
  var navLinks = document.querySelectorAll('.nav__link');

  function closeNav() {
    nav.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open menu');
  }
  function toggleNav() {
    var isOpen = nav.classList.toggle('is-open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  }
  hamburger.addEventListener('click', toggleNav);
  navLinks.forEach(function (link) {
    link.addEventListener('click', closeNav);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav();
  });

  /* ---------- 4. SMOOTH SCROLL WITH HEADER OFFSET ---------- */
  var allAnchorLinks = document.querySelectorAll('a[href^="#"]');
  allAnchorLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = link.getAttribute('href');
      if (targetId.length < 2) return;
      var target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      var headerHeight = header.offsetHeight + 12;
      var top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ---------- 5. SCROLL REVEAL (fade-in) ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- 6. COUNTER ANIMATION ---------- */
  var statNumbers = document.querySelectorAll('.stat__number');
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var duration = 1400;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      var current = Math.floor(eased * target);
      el.textContent = current.toLocaleString();
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString();
      }
    }
    window.requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window && statNumbers.length) {
    var statObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statNumbers.forEach(function (el) { statObserver.observe(el); });
  }

  /* ---------- 7. GALLERY LIGHTBOX ---------- */
  var galleryItems = Array.prototype.slice.call(document.querySelectorAll('.gallery-item'));
  var lightbox = document.getElementById('lightbox');
  var lightboxCaption = document.getElementById('lightboxCaption');
  var lightboxClose = document.getElementById('lightboxClose');
  var lightboxPrev = document.getElementById('lightboxPrev');
  var lightboxNext = document.getElementById('lightboxNext');
  var currentGalleryIndex = 0;

  function openLightbox(index) {
    currentGalleryIndex = index;
    updateLightbox();
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }
  function updateLightbox() {
    var item = galleryItems[currentGalleryIndex];
    var caption = item.getAttribute('data-caption') || '';
    lightboxCaption.textContent = caption;
  }
  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
  }
  function showNext() {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryItems.length;
    updateLightbox();
  }
  function showPrev() {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryItems.length) % galleryItems.length;
    updateLightbox();
  }

  galleryItems.forEach(function (item, index) {
    item.addEventListener('click', function () { openLightbox(index); });
  });
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxNext.addEventListener('click', showNext);
  lightboxPrev.addEventListener('click', showPrev);
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', function (e) {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });

  /* ---------- 8. TESTIMONIAL SLIDER ---------- */
const track = document.getElementById("testimonialTrack");
const slides = document.querySelectorAll(".testimonial-slide");

let index = 0;
const total = slides.length;

function showSlide(i){

    index = i;

    track.style.transition = "transform 0.6s ease";

    track.style.transform = `translateX(-${index * 100}%)`;

    updateDots();

}

// smooth infinite loop fix
function nextSlide(){

    index++;

    track.style.transition = "transform 0.6s ease";

    track.style.transform = `translateX(-${index * 100}%)`;

    // when last slide reached → reset WITHOUT animation
    if(index === total){

        setTimeout(()=>{

            track.style.transition = "none";
            index = 0;
            track.style.transform = `translateX(0%)`;

        }, 600);
    }

    updateDots();
}

function prevSlide(){

    if(index === 0){

        track.style.transition = "none";
        index = total - 1;
        track.style.transform = `translateX(-${index * 100}%)`;

        setTimeout(()=>{
            track.style.transition = "transform 0.6s ease";
        },50);

    } else {
        index--;
        track.style.transform = `translateX(-${index * 100}%)`;
    }

    updateDots();
}

// dots optional
function updateDots(){
    const dots = document.querySelectorAll(".testimonial-dots button");
    dots.forEach((d,i)=>d.classList.toggle("is-active", i===index));
}

document.getElementById("testimonialNext").onclick = nextSlide;
document.getElementById("testimonialPrev").onclick = prevSlide;

setInterval(nextSlide, 5000);

  /* ---------- 9. BOOKING FORM VALIDATION ---------- */
  var form = document.getElementById('bookingForm');
  var successMsg = document.getElementById('formSuccess');
  var dateInput = document.getElementById('date');

  // Prevent selecting a past date
  if (dateInput) {
    var today = new Date();
    var minDate = today.toISOString().split('T')[0];
    dateInput.setAttribute('min', minDate);
  }

  var validators = {
    fullName: function (v) { return v.trim().length >= 2 || 'Please enter your full name.'; },
    phone: function (v) { return /^[\d+\s()-]{7,20}$/.test(v.trim()) || 'Please enter a valid phone number.'; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Please enter a valid email address.'; },
    service: function (v) { return v.trim().length > 0 || 'Please select a service.'; },
    date: function (v) { return v.trim().length > 0 || 'Please choose a preferred date.'; },
    time: function (v) { return v.trim().length > 0 || 'Please choose a preferred time.'; }
  };

  function showError(fieldName, message) {
    var field = form.elements[fieldName];
    var errorEl = document.getElementById('err-' + fieldName);
    field.closest('.form-group').classList.add('has-error');
    if (errorEl) errorEl.textContent = message;
  }
  function clearError(fieldName) {
    var field = form.elements[fieldName];
    var errorEl = document.getElementById('err-' + fieldName);
    field.closest('.form-group').classList.remove('has-error');
    if (errorEl) errorEl.textContent = '';
  }
  function validateField(fieldName) {
    var field = form.elements[fieldName];
    var result = validators[fieldName](field.value);
    if (result === true) { clearError(fieldName); return true; }
    showError(fieldName, result);
    return false;
  }

  Object.keys(validators).forEach(function (fieldName) {
    var field = form.elements[fieldName];
    if (!field) return;
    field.addEventListener('blur', function () { validateField(fieldName); });
    field.addEventListener('input', function () {
      if (field.closest('.form-group').classList.contains('has-error')) validateField(fieldName);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var isValid = true;
    Object.keys(validators).forEach(function (fieldName) {
      if (!validateField(fieldName)) isValid = false;
    });

    if (!isValid) {
      var firstError = form.querySelector('.has-error input, .has-error select');
      if (firstError) firstError.focus();
      successMsg.hidden = true;
      return;
    }

    // No backend wired up yet — this is where a real fetch() call to your
    // booking API or email service would go. We simulate success locally.
    successMsg.hidden = false;
    form.reset();
    if (dateInput) dateInput.setAttribute('min', minDate);
    successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  /* ---------- 10. SCROLL-TO-TOP BUTTON ---------- */
  var scrollTopBtn = document.getElementById('scrollTopBtn');
  function onScrollTopBtn() {
    scrollTopBtn.classList.toggle('is-visible', window.scrollY > 480);
  }
  document.addEventListener('scroll', onScrollTopBtn, { passive: true });
  scrollTopBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  onScrollTopBtn();

  /* ---------- 11. FOOTER YEAR ---------- */
  var yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();