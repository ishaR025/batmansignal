document.getElementById("year").textContent = new Date().getFullYear();

// Smooth scroll behavior and animations
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Add hover glow effect to cards
const cards = document.querySelectorAll('.card, .price-card');
cards.forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.cursor = 'pointer';
  });
});

// Interactive button feedback
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mousedown', function() {
    this.style.transform = this.style.transform ? 'scale(0.98)' : 'scale(0.98)';
  });
  btn.addEventListener('mouseup', function() {
    this.style.transform = '';
  });
  btn.addEventListener('mouseleave', function() {
    this.style.transform = '';
  });
});

// Intersection Observer for entrance animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe sections for animation
document.querySelectorAll('.section, .hero').forEach(el => {
  el.style.opacity = '0';
  observer.observe(el);
});

const FORM_URL = "https://formspree.io/f/xgooyayd";
const WA_NUMBER = "919804340701";

// Calendar functionality
let currentDate = new Date();
let selectedDate = null;

const dateInput = document.getElementById("date");
const calendarPopup = document.getElementById("calendarPopup");
const monthYear = document.getElementById("monthYear");
const calendarDays = document.getElementById("calendarDays");
const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");

function initCalendar() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  currentDate = new Date(today);
  renderCalendar();
}

function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  monthYear.textContent = new Date(year, month).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());
  
  calendarDays.innerHTML = "";
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let currentCell = new Date(startDate);
  
  for (let i = 0; i < 42; i++) {
    const day = document.createElement("div");
    day.className = "calendar-day";
    day.textContent = currentCell.getDate();
    
    const isOtherMonth = currentCell.getMonth() !== month;
    const isDisabled = currentCell < today;
    const isSelected = selectedDate && 
                       currentCell.toDateString() === new Date(selectedDate).toDateString();
    const isToday = currentCell.toDateString() === today.toDateString();
    
    if (isOtherMonth) day.classList.add("other-month");
    if (isDisabled) day.classList.add("disabled");
    if (isSelected) day.classList.add("selected");
    if (isToday) day.classList.add("today");
    
    if (!isDisabled && !isOtherMonth) {
      day.addEventListener("click", () => selectDate(new Date(currentCell)));
    }
    
    calendarDays.appendChild(day);
    currentCell.setDate(currentCell.getDate() + 1);
  }
}

function selectDate(date) {
  selectedDate = date;
  const dateStr = date.toISOString().split("T")[0];
  dateInput.value = date.toLocaleDateString("en-IN", { weekday: "short", year: "numeric", month: "short", day: "numeric" });
  dateInput.dataset.value = dateStr;
  calendarPopup.style.display = "none";
  fillTimes();
  updateSlotStatus();
}

dateInput.addEventListener("click", () => {
  calendarPopup.style.display = calendarPopup.style.display === "none" ? "block" : "none";
  if (calendarPopup.style.display === "block") {
    renderCalendar();
  }
});

prevMonth.addEventListener("click", (e) => {
  e.preventDefault();
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

nextMonth.addEventListener("click", (e) => {
  e.preventDefault();
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".date-picker-wrapper")) {
    calendarPopup.style.display = "none";
  }
});

// simple fixed time slots (no weekday/weekend logic)
const TIMES = [
  "09:00","10:00","11:00","12:00","13:00",
  "14:00","15:00","16:00","17:00","18:00",
  "19:00","20:00","21:00"
];

function buildWhatsAppLink(text) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}

const form = document.getElementById("bookingForm");
const statusEl = document.getElementById("status");

if (form) form.action = FORM_URL;

// Top CTA
const waTop = document.getElementById("waTop");
if (waTop) {
  waTop.href = buildWhatsAppLink("Hi Batman, I want to book a service.");
  waTop.target = "_blank";
  waTop.rel = "noopener noreferrer";
}

// Populate time dropdown when date is selected
function fillTimes() {
  const dateVal = document.getElementById("date")?.dataset.value;
  const timeSelect = document.getElementById("time");
  if (!timeSelect) return;

  timeSelect.innerHTML = "";

  if (!dateVal) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.disabled = true;
    opt.selected = true;
    opt.textContent = "pick a date first";
    timeSelect.appendChild(opt);
    return;
  }

  const first = document.createElement("option");
  first.value = "";
  first.disabled = true;
  first.selected = true;
  first.textContent = "pick a time";
  timeSelect.appendChild(first);

  TIMES.forEach((t) => {
    const opt = document.createElement("option");
    opt.value = t;
    opt.textContent = t;
    timeSelect.appendChild(opt);
  });
}

// Slot status
function updateSlotStatus() {
  const slotText = document.getElementById("slotText");
  const dateVal = document.getElementById("date")?.value;
  const timeVal = document.getElementById("time")?.value;

  if (slotText) {
    if (!dateVal) slotText.textContent = "pick a date";
    else if (!timeVal) slotText.textContent = "pick a time";
    else slotText.textContent = "available ✅";
  }
}

// Modal
const modal = document.getElementById("modal");
const confirmText = document.getElementById("confirmText");
const cancelBtn = document.getElementById("cancelBtn");
const confirmBtn = document.getElementById("confirmBtn");

function openModal(text) {
  if (confirmText) confirmText.textContent = text;
  if (modal) modal.classList.add("show");
}
function closeModal() {
  if (modal) modal.classList.remove("show");
}
cancelBtn?.addEventListener("click", closeModal);
modal?.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

form?.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const serviceKey = document.getElementById("service").value;
  const serviceLabel = document.getElementById("service").selectedOptions[0]?.textContent || "";
  const dateVal = document.getElementById("date").dataset.value;
  const timeVal = document.getElementById("time").value;
  const durationEl = document.getElementById("duration");
  const durationHours = Number(durationEl.value);
  const durationLabel = durationEl.selectedOptions[0]?.textContent || "";
  const location = document.getElementById("location").value.trim();
  const notes = document.getElementById("notes").value.trim();

  if (!serviceKey || !dateVal || !timeVal || !durationHours) {
    statusEl.textContent = "please select service, date, time, duration.";
    return;
  }

  const message =
    `Hi Batman,\n\n` +
    `New booking request:\n` +
    `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n` +
    `Service: ${serviceLabel}\nDate: ${dateVal}\nTime: ${timeVal}\nDuration: ${durationLabel}\n` +
    `Location: ${location}\n` +
    (notes ? `Notes: ${notes}\n` : "") +
    `\nSent from BatSignal website`;

  const waLink = buildWhatsAppLink(message);

  openModal(`${serviceLabel} • ${dateVal} ${timeVal} • ${durationLabel}`);

  confirmBtn.onclick = async () => {
    closeModal();
    statusEl.textContent = "sending…";

    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (res.ok) statusEl.textContent = "request sent ✅ opening whatsapp…";
      else statusEl.textContent = `email failed (${res.status}). opening whatsapp…`;
    } catch (err) {
      statusEl.textContent = "email error. opening whatsapp…";
      console.log("Formspree error:", err);
    }

    window.open(waLink, "_blank", "noopener,noreferrer");
  };
});

// hook up events
document.getElementById("date")?.addEventListener("input", () => {
  fillTimes();
  updateSlotStatus();
});
document.getElementById("date")?.addEventListener("change", () => {
  fillTimes();
  updateSlotStatus();
});
document.getElementById("time")?.addEventListener("change", updateSlotStatus);

// initial
initCalendar();
fillTimes();
updateSlotStatus();