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


// ── HARDCODED CHATBOT DATA ──
const CHATBOT_DATA = {
  tutorName: 'Hafiza Mubarah Azeem',
  tutorQualification: 'BS Islamic Studies + Sharia',
  tutorExperience: 'Experienced Quran tutor with a strong focus on Tajweed, Quran reading, memorization, and dua learning.',
  tutorFocus: 'Teaching women and young children only, in a safe, respectful, and nurturing learning environment.',
  courses: [
    { name: 'Nazra Quran Course',    days: 'Monday to Friday',  time: '30 minutes/day', fee: '$50 / PKR 3,000 per month' },
    { name: 'Hifz Quran Course',     days: 'Monday to Friday',  time: '30 minutes/day', fee: '$50 / PKR 5,000 per month' },
    { name: 'Tajweed Course',        days: 'Monday to Friday',  time: '30 minutes/day', fee: '$50 / PKR 5,000 per month' },
    { name: 'Rabana Duaien Course',  days: 'Saturday & Sunday', time: '20 minutes/day', fee: '$50 / PKR 2,000 per month' },
  ]
};

const CHATBOT_ANSWERS = {
  tutorName: `The tutor's name is ${CHATBOT_DATA.tutorName}.`,
  tutorQualification: `${CHATBOT_DATA.tutorName} holds a ${CHATBOT_DATA.tutorQualification}.\n${CHATBOT_DATA.tutorExperience}\n${CHATBOT_DATA.tutorFocus}`,
  courses: `We offer the following courses:\n\n` +
    CHATBOT_DATA.courses.map((c, i) => `${i + 1}. ${c.name}\n   Days: ${c.days}\n   Duration: ${c.time}`).join('\n\n'),
  coursesWithPrices: `Our courses and monthly fees:\n\n` +
    CHATBOT_DATA.courses.map((c, i) => `${i + 1}. ${c.name}\n   Days: ${c.days} | Duration: ${c.time}\n   Fee: ${c.fee}`).join('\n\n'),
};

// ── CHATBOT HELPERS ──
function makeChatMessage(text, sender = 'bot') {
  const el = document.createElement('div');
  el.className = `chatbot-message ${sender}`;
  el.style.whiteSpace = 'pre-wrap';
  el.textContent = text;
  return el;
}

function setChatStatus(message) {
  const status = document.getElementById('chatbotStatus');
  if (status) status.textContent = message;
}

function toggleChatWindow(show) {
  const windowEl = document.getElementById('chatbotWindow');
  if (!windowEl) return;
  windowEl.classList.toggle('hidden', !show);
}

// ── RENDER DROPDOWN MENU ──
// ── RENDER FULL MENU (4 questions + Continue + End Chat — all at once) ──
function renderDropdownMenu() {
  const bodyEl = document.getElementById('chatbotBody');
  if (!bodyEl) return;

  const label = document.createElement('p');
  label.className = 'chatbot-message bot';
  label.textContent = 'Please select a topic:';
  bodyEl.appendChild(label);

  const menuWrapper = document.createElement('div');
  menuWrapper.className = 'chatbot-dropdown-menu';
  menuWrapper.id = 'chatbotDropdownMenu';

  const questions = [
    { key: 'tutorName',          label: 'What is the Tutor Name?' },
    { key: 'tutorQualification', label: 'What is the Tutor Qualification?' },
    { key: 'courses',            label: 'Courses' },
    { key: 'coursesWithPrices',  label: 'Courses with Prices' },
  ];

  // ── 4 question buttons ──
  questions.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'chatbot-dropdown-btn';
    btn.textContent = opt.label;
    btn.type = 'button';
    btn.addEventListener('click', () => handleDropdownChoice(opt.key, opt.label));
    menuWrapper.appendChild(btn);
  });

  // ── divider ──
  const divider = document.createElement('div');
  divider.className = 'chatbot-menu-divider';
  menuWrapper.appendChild(divider);

  // ── End Chat button ──
  const endBtn = document.createElement('button');
  endBtn.className = 'chatbot-dropdown-btn chatbot-dropdown-btn-end';
  endBtn.textContent = 'End Chat';
  endBtn.type = 'button';
  endBtn.addEventListener('click', () => {
    if (menuWrapper.previousElementSibling && menuWrapper.previousElementSibling.classList.contains('chatbot-message')) {
      menuWrapper.previousElementSibling.remove();
    }
    menuWrapper.remove();
    bodyEl.appendChild(makeChatMessage('Thank you for chatting with us! May Allah bless you. Feel free to return anytime. \uD83C\uDF19', 'bot'));
    setChatStatus('Chat ended.');
    bodyEl.scrollTop = bodyEl.scrollHeight;
  });
  menuWrapper.appendChild(endBtn);

  bodyEl.appendChild(menuWrapper);
  bodyEl.scrollTop = bodyEl.scrollHeight;
}

// ── HANDLE DROPDOWN CHOICE ──
function handleDropdownChoice(key, label) {
  const bodyEl = document.getElementById('chatbotBody');
  if (!bodyEl) return;

  // Remove existing menu and its label
  const menu = document.getElementById('chatbotDropdownMenu');
  if (menu) {
    if (menu.previousElementSibling && menu.previousElementSibling.classList.contains('chatbot-message')) {
      menu.previousElementSibling.remove();
    }
    menu.remove();
  }

  // Show user question bubble
  bodyEl.appendChild(makeChatMessage(label, 'user'));

  // Show answer bubble
  const answer = CHATBOT_ANSWERS[key] || 'Sorry, I do not have information on that topic.';
  bodyEl.appendChild(makeChatMessage(answer, 'bot'));
  bodyEl.scrollTop = bodyEl.scrollHeight;

  // Rebuild menu AFTER the browser has painted the answer
  setTimeout(() => {
    renderDropdownMenu();
    bodyEl.scrollTop = bodyEl.scrollHeight;
  }, 0);
}

// ── SETUP CHATBOT ──
function setupChatbot() {
  const toggle   = document.getElementById('chatbotToggle');
  const closeBtn = document.getElementById('chatbotClose');

  if (toggle) {
    toggle.addEventListener('click', () => toggleChatWindow(true));
  }
  if (closeBtn) {
    closeBtn.addEventListener('click', () => toggleChatWindow(false));
  }

  const refreshBtn = document.getElementById('chatbotRefresh');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      // Spin animation
      refreshBtn.classList.add('spinning');
      setTimeout(() => refreshBtn.classList.remove('spinning'), 500);

      // Clear chat body back to greeting
      const bodyEl = document.getElementById('chatbotBody');
      if (bodyEl) {
        bodyEl.innerHTML = '<div class="chatbot-message bot">Hello! Ask me anything about Mubarah Online Quran Academy, the tutor, available courses, schedule or fees.</div>';
      }
      setChatStatus('Select a topic from the menu above.');
      renderDropdownMenu();
    });
  }

  // Pre-render the menu immediately on page load so it's instant when opened
  renderDropdownMenu();
}

setupChatbot();
