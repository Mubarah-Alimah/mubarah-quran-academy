/* =========================================
   MUBARAH ONLINE QURAN ACADEMY — Shared Script
   All course data is read from courses.json
   Edit courses.json → changes reflect on all pages
   ========================================= */

const ICONS = { nazra: '📖', hifz: '🌙', tajweed: '🎵', rabana: '🤲' };

// ── FETCH COURSES.JSON ──
async function loadCourses() {
  const res  = await fetch('courses.json');
  const data = await res.json();
  window.COURSES = data;
  return data;
}

// ── NAV SCROLL EFFECT ──
const nav = document.querySelector('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  });
}

// ── MOBILE HAMBURGER ──
const hamburger = document.querySelector('.hamburger');
const navLinks  = document.querySelector('.nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => navLinks.classList.remove('open'))
  );
}

// ── MARK ACTIVE NAV LINK ──
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    a.classList.add('active');
  }
});

// ── ANIMATE ON SCROLL ──
const observerOptions = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);
document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

// ── COURSE DETAIL OVERLAY ──
const overlay = document.getElementById('courseOverlay');
if (overlay) {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeCourseDetail();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCourseDetail();
  });
}

function formatCourseFee(course) {
  return course.feeLocal ? `${course.fee} • PKR ${course.feeLocal}` : course.fee;
}

function openCourseDetail(courseId) {
  if (!window.COURSES) return;
  const all = [...(window.COURSES.weekdayCourses || []), ...(window.COURSES.weekendCourses || [])];
  const course = all.find(c => c.id === courseId);
  if (!course || !overlay) return;

  document.getElementById('detailArabic').textContent = course.nameUrdu;
  document.getElementById('detailTitle').textContent  = course.name;
  document.getElementById('detailType').textContent   = course.type + ' Course';
  document.getElementById('detailDesc').textContent   = course.description;
  document.getElementById('detailDays').textContent   = course.days;
  document.getElementById('detailTime').textContent   = course.classTime;
  document.getElementById('detailFee').textContent    = formatCourseFee(course);
  document.getElementById('detailRegLink').href       = `register.html?course=${course.id}`;

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCourseDetail() {
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

// ── BUILD A COURSE CARD ──
function buildCard(c) {
  return `
    <div class="course-card" onclick="openCourseDetail('${c.id}')">
      <div class="card-badge">${c.type}</div>
      <div class="card-body">
        <div class="card-icon">${ICONS[c.id] || '📘'}</div>
        <div class="card-type">${c.type} Programme</div>
        <div class="card-arabic">${c.nameUrdu}</div>
        <h3 class="card-title">${c.name}</h3>
        <p class="card-desc">${c.description}</p>
        <div class="card-meta">
          <span class="meta-item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            ${c.days}
          </span>
          <span class="meta-item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            ${c.classTime}
          </span>
        </div>
      </div>
      <div class="card-footer">
        <div class="card-fee">
          <span class="fee-label">Monthly Fee</span>
          <span class="fee-amount">${c.fee}</span>
          ${c.feeLocal ? `<span class="fee-local">PKR ${c.feeLocal}</span>` : ''}
          <span class="fee-period">per month</span>
        </div>
        <span class="btn btn-primary" style="padding:0.5rem 1rem;font-size:0.75rem;">Details →</span>
      </div>
    </div>`;
}
