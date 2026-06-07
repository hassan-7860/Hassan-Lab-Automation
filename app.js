/* =============================================
   HASSAN LAB — app.js
   All interactivity, animations, and data logic
   ============================================= */

// ===== CUSTOM CURSOR =====
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mx = 0, my = 0, fx = 0, fy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  if (cursor) {
    cursor.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
  }
});

function animateFollower() {
  fx += (mx - fx) * 0.12;
  fy += (my - fy) * 0.12;
  if (follower) {
    follower.style.transform = `translate(${fx - 16}px, ${fy - 16}px)`;
  }
  requestAnimationFrame(animateFollower);
}
animateFollower();

document.querySelectorAll('a, button, .workflow-card, .testimonial-card, input, textarea').forEach(el => {
  el.addEventListener('mouseenter', () => {
    if (cursor) cursor.style.transform += ' scale(2)';
    if (follower) follower.style.transform += ' scale(1.5)';
    if (follower) follower.style.opacity = '0.5';
  });
  el.addEventListener('mouseleave', () => {
    if (follower) follower.style.opacity = '1';
  });
});

// ===== HEADER SCROLL =====
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (header) {
    header.classList.toggle('scrolled', window.scrollY > 50);
  }
}, { passive: true });

// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
    });
  });
}

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== PARTICLE CANVAS =====
const canvas = document.getElementById('particleCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function createParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.5 + 0.1
    };
  }
  for (let i = 0; i < 80; i++) particles.push(createParticle());

  function drawParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,200,255,${p.alpha})`;
      ctx.fill();
    });
    // Draw connections
    particles.forEach((a, i) => {
      particles.slice(i + 1).forEach(b => {
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(0,200,255,${0.08 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });
    requestAnimationFrame(drawParticles);
  }
  drawParticles();
}

// ===== COUNTER ANIMATION =====
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 2000;
  const start = performance.now();
  function update(now) {
    const elapsed = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - elapsed, 3);
    el.textContent = Math.floor(eased * target);
    if (elapsed < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }
  requestAnimationFrame(update);
}

const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[data-target]').forEach(animateCounter);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
const heroStats = document.querySelector('.hero-stats');
if (heroStats) statObserver.observe(heroStats);

// ===== DATA STORAGE =====
const WORKFLOWS_KEY = 'hassanlab_workflows';
const TESTIMONIALS_KEY = 'hassanlab_testimonials';
const ADMIN_KEY = 'hassanlab_admin';

const DEFAULT_WORKFLOWS = [
  {
    emoji: '🤖', title: 'LinkedIn Content Planning Agent',
    category: 'Content Automation',
    desc: 'AI agent that researches trending topics, generates structured theme briefs, and outputs them to Notion and Slack for manual review. Saves 5+ hours per week on content planning.',
    tools: ['n8n', 'OpenAI', 'Notion', 'Slack'],
    status: 'Live'
  },
  {
    emoji: '📚', title: 'Student RAG Knowledge Agent',
    category: 'AI Agents',
    desc: 'Production-grade RAG system with hybrid BM25 + vector search using pgvector. Supports Q&A, quiz generation, summarization, and multi-format file ingestion for students.',
    tools: ['n8n', 'PostgreSQL', 'pgvector', 'OpenAI', 'GPT-4o'],
    status: 'Live'
  },
  {
    emoji: '📧', title: 'Google Maps Lead Generator + Cold Email',
    category: 'Lead Generation',
    desc: 'Scrapes Google Maps for business data, enriches with AI analysis (strengths, weaknesses, pain points), and auto-writes personalized cold emails via Gmail.',
    tools: ['n8n', 'OpenAI', 'Gmail', 'Google Sheets'],
    status: 'Live'
  },
  {
    emoji: '⚡', title: 'Automated Invoice & Billing Workflow',
    category: 'Business Automation',
    desc: 'End-to-end billing automation integrated with Billwaala — auto-generates invoices, sends reminders, and logs payments to Google Sheets without human intervention.',
    tools: ['n8n', 'Billwaala', 'Google Sheets', 'SMTP'],
    status: 'Live'
  },
  {
    emoji: '🎬', title: 'YouTube Script Analysis & Rewrite Agent',
    category: 'Content Automation',
    desc: 'Analyzes Hindi YouTube scripts for hook strength, retention, CTA effectiveness, and storytelling flow — then produces a polished, production-ready rewrite.',
    tools: ['n8n', 'OpenAI', 'Google Docs'],
    status: 'Live'
  },
  {
    emoji: '🔍', title: 'AI Review Response Automation',
    category: 'Customer Experience',
    desc: 'Monitors Google Reviews and auto-drafts personalized, human-tone responses using AI — routed to human approval before posting. Reduces response time from days to minutes.',
    tools: ['n8n', 'OpenAI', 'Google My Business API'],
    status: 'In Progress'
  }
];

const DEFAULT_TESTIMONIALS = [
  {
    name: 'Arjun Mehta', role: 'Founder, QuickScale SaaS',
    text: 'Hassan built an automation that replaced 3 manual processes we were doing every day. The n8n workflow he designed is clean, well-documented, and has been running flawlessly for 3 months.',
    rating: 5
  },
  {
    name: 'Priya Sharma', role: 'Marketing Head, EduTech Startup',
    text: 'The LinkedIn content planning agent he built is incredible. We went from spending hours planning content to reviewing a clean brief every Monday morning. Massive time saver.',
    rating: 5
  },
  {
    name: 'Rohit Agarwal', role: 'CEO, Retail Chain',
    text: 'I was skeptical about automation at first. Hassan explained everything in simple terms, built the workflow, and showed us exactly how it works. Our lead follow-up time dropped from 2 days to 15 minutes.',
    rating: 5
  },
  {
    name: 'Divya Kapoor', role: 'Freelance Consultant',
    text: 'Highly recommend Hassan for any n8n or AI automation work. He understood my problem quickly, built a smart solution, and even taught me how to maintain it myself.',
    rating: 5
  }
];

function getWorkflows() {
  try {
    const stored = localStorage.getItem(WORKFLOWS_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_WORKFLOWS;
  } catch { return DEFAULT_WORKFLOWS; }
}
function saveWorkflows(data) {
  localStorage.setItem(WORKFLOWS_KEY, JSON.stringify(data));
}
function getTestimonials() {
  try {
    const stored = localStorage.getItem(TESTIMONIALS_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_TESTIMONIALS;
  } catch { return DEFAULT_TESTIMONIALS; }
}
function saveTestimonials(data) {
  localStorage.setItem(TESTIMONIALS_KEY, JSON.stringify(data));
}

// ===== EDIT MODE =====
let editMode = false;
function isAdmin() {
  return sessionStorage.getItem(ADMIN_KEY) === 'true';
}
function toggleEditMode() {
  const pwInput = document.getElementById('adminPassword');
  const submitBtn = document.getElementById('adminSubmit');
  if (isAdmin() && editMode) {
    editMode = false;
    sessionStorage.removeItem(ADMIN_KEY);
    document.getElementById('editToggleText').textContent = '🔒 Admin Mode';
    document.querySelectorAll('.card-actions, .workflows-add, .testimonials-add').forEach(el => el.style.display = 'none');
    const banner = document.getElementById('editBanner');
    if (banner) banner.remove();
    return;
  }
  if (pwInput && submitBtn) {
    pwInput.style.display = pwInput.style.display === 'none' ? 'block' : 'none';
    submitBtn.style.display = submitBtn.style.display === 'none' ? 'inline-flex' : 'none';
    if (pwInput.style.display !== 'none') pwInput.focus();
  }
}
function checkPassword() {
  const pw = document.getElementById('adminPassword').value;
  if (pw === 'hassanlab2025') {
    sessionStorage.setItem(ADMIN_KEY, 'true');
    editMode = true;
    document.getElementById('editToggleText').textContent = '🔓 Exit Admin';
    document.getElementById('adminPassword').style.display = 'none';
    document.getElementById('adminSubmit').style.display = 'none';
    document.getElementById('adminPassword').value = '';
    enableEditMode();
  } else {
    document.getElementById('adminPassword').style.border = '1px solid #ff5555';
    setTimeout(() => { document.getElementById('adminPassword').style.border = ''; }, 1500);
  }
}
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && document.getElementById('adminPassword') && document.getElementById('adminPassword').style.display !== 'none') {
    checkPassword();
  }
});
function enableEditMode() {
  document.querySelectorAll('.card-actions').forEach(el => el.style.display = 'flex');
  const addWf = document.getElementById('addWorkflowBtn');
  const addT = document.getElementById('addTestimonialBtn');
  if (addWf) addWf.style.display = 'block';
  if (addT) addT.style.display = 'block';
  if (!document.getElementById('editBanner')) {
    const banner = document.createElement('div');
    banner.id = 'editBanner';
    banner.className = 'edit-mode-banner';
    banner.textContent = '✏️ Edit Mode Active — You can add, edit, and delete workflows and testimonials';
    document.body.insertBefore(banner, document.body.children[2]);
  }
}

// ===== WORKFLOW RENDERING =====
function getStatusClass(status) {
  if (status === 'Live') return 'status-live';
  if (status === 'In Progress') return 'status-progress';
  return 'status-concept';
}
function renderWorkflows() {
  const grid = document.getElementById('workflowsGrid');
  if (!grid) return;
  const workflows = getWorkflows();
  grid.innerHTML = '';
  workflows.forEach((wf, i) => {
    const card = document.createElement('div');
    card.className = 'workflow-card reveal';
    card.style.animationDelay = `${i * 0.08}s`;
    const tools = Array.isArray(wf.tools) ? wf.tools : wf.tools.split(',').map(t => t.trim());
    card.innerHTML = `
      <span class="card-emoji">${wf.emoji || '⚡'}</span>
      <div class="card-header">
        <h3 class="card-title">${wf.title}</h3>
        <span class="card-status ${getStatusClass(wf.status)}">${wf.status}</span>
      </div>
      <div class="card-category">${wf.category}</div>
      <p class="card-desc">${wf.desc}</p>
      <div class="card-tools">${tools.map(t => `<span class="tool-tag">${t}</span>`).join('')}</div>
      <div class="card-actions" style="display:${isAdmin() ? 'flex' : 'none'}">
        <button class="card-edit-btn" onclick="editWorkflow(${i})">Edit</button>
        <button class="card-del-btn" onclick="deleteWorkflow(${i})">Delete</button>
      </div>
    `;
    grid.appendChild(card);
  });
  // Re-observe new reveal elements
  grid.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

// ===== WORKFLOW MODAL =====
function openWorkflowModal(index) {
  document.getElementById('workflowModal').classList.add('open');
  document.getElementById('editIndex').value = index !== undefined ? index : '';
  if (index !== undefined) {
    const wf = getWorkflows()[index];
    document.getElementById('wfTitle').value = wf.title;
    document.getElementById('wfCategory').value = wf.category;
    document.getElementById('wfDesc').value = wf.desc;
    document.getElementById('wfTools').value = Array.isArray(wf.tools) ? wf.tools.join(', ') : wf.tools;
    document.getElementById('wfEmoji').value = wf.emoji || '';
    document.getElementById('wfStatus').value = wf.status;
  } else {
    document.getElementById('wfTitle').value = '';
    document.getElementById('wfCategory').value = '';
    document.getElementById('wfDesc').value = '';
    document.getElementById('wfTools').value = '';
    document.getElementById('wfEmoji').value = '';
    document.getElementById('wfStatus').value = 'Live';
  }
}
function closeWorkflowModal() {
  document.getElementById('workflowModal').classList.remove('open');
}
function saveWorkflow() {
  const title = document.getElementById('wfTitle').value.trim();
  if (!title) { alert('Please enter a workflow title.'); return; }
  const wf = {
    title,
    category: document.getElementById('wfCategory').value.trim(),
    desc: document.getElementById('wfDesc').value.trim(),
    tools: document.getElementById('wfTools').value.split(',').map(t => t.trim()).filter(Boolean),
    emoji: document.getElementById('wfEmoji').value.trim() || '⚡',
    status: document.getElementById('wfStatus').value
  };
  const workflows = getWorkflows();
  const idx = document.getElementById('editIndex').value;
  if (idx !== '') { workflows[parseInt(idx)] = wf; }
  else { workflows.push(wf); }
  saveWorkflows(workflows);
  closeWorkflowModal();
  renderWorkflows();
}
function editWorkflow(i) { openWorkflowModal(i); }
function deleteWorkflow(i) {
  if (!confirm('Delete this workflow?')) return;
  const workflows = getWorkflows();
  workflows.splice(i, 1);
  saveWorkflows(workflows);
  renderWorkflows();
}
document.getElementById('workflowModal')?.addEventListener('click', e => {
  if (e.target === document.getElementById('workflowModal')) closeWorkflowModal();
});

// ===== TESTIMONIALS =====
let currentSlide = 0;
function renderTestimonials() {
  const track = document.getElementById('testimonialsTrack');
  const dots = document.getElementById('tDots');
  if (!track) return;
  const testimonials = getTestimonials();
  track.innerHTML = '';
  if (dots) dots.innerHTML = '';
  const isMobile = window.innerWidth <= 768;
  const perPage = isMobile ? 1 : 2;
  const totalSlides = Math.ceil(testimonials.length / perPage);

  testimonials.forEach((t, i) => {
    const card = document.createElement('div');
    card.className = 'testimonial-card';
    const stars = '★'.repeat(Math.min(5, Math.max(1, t.rating)));
    const initials = t.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2);
    card.innerHTML = `
      <div class="t-quote">"</div>
      <p class="t-text">${t.text}</p>
      <div class="t-author">
        <div class="t-avatar">${initials}</div>
        <div>
          <div class="t-name">${t.name}</div>
          <div class="t-role">${t.role}</div>
          <div class="t-stars">${stars.split('').map(() => '<span class="t-star">★</span>').join('')}</div>
        </div>
      </div>
      ${isAdmin() ? `
      <div class="card-actions" style="display:flex;margin-top:16px;padding-top:12px;border-top:1px solid var(--border);">
        <button class="card-edit-btn" onclick="editTestimonial(${i})">Edit</button>
        <button class="card-del-btn" onclick="deleteTestimonial(${i})">Delete</button>
      </div>` : ''}
    `;
    track.appendChild(card);
  });

  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('div');
    dot.className = 't-dot' + (i === 0 ? ' active' : '');
    dot.onclick = () => goToSlide(i);
    if (dots) dots.appendChild(dot);
  }
  goToSlide(0);
}

function goToSlide(n) {
  const track = document.getElementById('testimonialsTrack');
  if (!track) return;
  const isMobile = window.innerWidth <= 768;
  const perPage = isMobile ? 1 : 2;
  const testimonials = getTestimonials();
  const totalSlides = Math.ceil(testimonials.length / perPage);
  currentSlide = Math.max(0, Math.min(n, totalSlides - 1));
  const cardW = track.children[0]?.offsetWidth || 0;
  const gap = 24;
  const offset = currentSlide * perPage * (cardW + gap);
  track.style.transform = `translateX(-${offset}px)`;
  document.querySelectorAll('.t-dot').forEach((d, i) => {
    d.classList.toggle('active', i === currentSlide);
  });
}
function prevTestimonial() { goToSlide(currentSlide - 1); }
function nextTestimonial() { goToSlide(currentSlide + 1); }
window.addEventListener('resize', () => { renderTestimonials(); });

// ===== TESTIMONIAL MODAL =====
function openTestimonialModal(index) {
  document.getElementById('testimonialModal').classList.add('open');
  document.getElementById('tEditIndex').value = index !== undefined ? index : '';
  if (index !== undefined) {
    const t = getTestimonials()[index];
    document.getElementById('tName').value = t.name;
    document.getElementById('tRole').value = t.role;
    document.getElementById('tText').value = t.text;
    document.getElementById('tRating').value = t.rating;
  } else {
    document.getElementById('tName').value = '';
    document.getElementById('tRole').value = '';
    document.getElementById('tText').value = '';
    document.getElementById('tRating').value = 5;
  }
}
function closeTestimonialModal() {
  document.getElementById('testimonialModal').classList.remove('open');
}
function saveTestimonial() {
  const name = document.getElementById('tName').value.trim();
  if (!name) { alert('Please enter a client name.'); return; }
  const t = {
    name,
    role: document.getElementById('tRole').value.trim(),
    text: document.getElementById('tText').value.trim(),
    rating: parseInt(document.getElementById('tRating').value) || 5
  };
  const testimonials = getTestimonials();
  const idx = document.getElementById('tEditIndex').value;
  if (idx !== '') { testimonials[parseInt(idx)] = t; }
  else { testimonials.push(t); }
  saveTestimonials(testimonials);
  closeTestimonialModal();
  renderTestimonials();
}
function editTestimonial(i) { openTestimonialModal(i); }
function deleteTestimonial(i) {
  if (!confirm('Delete this testimonial?')) return;
  const testimonials = getTestimonials();
  testimonials.splice(i, 1);
  saveTestimonials(testimonials);
  renderTestimonials();
}
document.getElementById('testimonialModal')?.addEventListener('click', e => {
  if (e.target === document.getElementById('testimonialModal')) closeTestimonialModal();
});

// ===== CONTACT FORM =====
function submitForm(e) {
  e.preventDefault();
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (form && success) {
    form.style.display = 'none';
    success.style.display = 'block';
  }
}

// ===== SMOOTH ANCHOR SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const y = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  });
});

// ===== ACTIVE NAV ON SCROLL =====
const sections = ['home', 'about', 'workflows', 'testimonials'];
const navLinks = document.querySelectorAll('.nav-link');
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => {
        l.classList.toggle('active', l.getAttribute('href').includes(entry.target.id));
      });
    }
  });
}, { threshold: 0.4 });
sections.forEach(id => {
  const el = document.getElementById(id);
  if (el) sectionObserver.observe(el);
});

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  renderWorkflows();
  renderTestimonials();
  if (isAdmin()) {
    editMode = true;
    enableEditMode();
    document.getElementById('editToggleText').textContent = '🔓 Exit Admin';
  }
});
