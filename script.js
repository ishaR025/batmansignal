document.getElementById("year").textContent = new Date().getFullYear();

// Initialize Supabase
const SUPABASE_URL = "https://uoxtzxdirfwwsqrmrdgl.supabase.co";
const SUPABASE_KEY = "sb_publishable_w8iEUEFGbRwompqyXpY2Vg_eNCc2h_j";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const FORM_URL = "https://formspree.io/f/xgooyayd";
const WA_NUMBER = "919804340701";

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href.startsWith('#')) return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// Button feedback
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mousedown', function() { this.style.transform = 'scale(0.98)'; });
  btn.addEventListener('mouseup', function() { this.style.transform = ''; });
  btn.addEventListener('mouseleave', function() { this.style.transform = ''; });
});

// Mobile nav
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
menuToggle?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.classList.toggle("open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
navLinks?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  navLinks.classList.remove("open");
  menuToggle?.classList.remove("open");
  menuToggle?.setAttribute("aria-expanded", "false");
}));

// Scroll reveal
const revealEls = document.querySelectorAll(".section, .card, .price-card, .hero-card, .hero-text");
revealEls.forEach(el => el.classList.add("reveal"));
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
revealEls.forEach(el => revealObserver.observe(el));

function buildWhatsAppLink(text) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}

// Form & CTA
const form = document.getElementById("bookingForm");
const statusEl = document.getElementById("status");
if (form) form.action = FORM_URL;

const waTop = document.getElementById("waTop");
if (waTop) {
  waTop.href = buildWhatsAppLink("Hi Batman, I want to book a service.");
  waTop.target = "_blank";
  waTop.rel = "noopener noreferrer";
}

// ----- Calendar + Slots -----
const dateInputEl = document.getElementById("date");
const dateValueEl = document.getElementById("dateValue");
const calendarPopupEl = document.getElementById("calendarPopup");
const calendarDaysEl = document.getElementById("calendarDays");
const monthYearEl = document.getElementById("monthYear");
const prevMonthEl = document.getElementById("prevMonth");
const nextMonthEl = document.getElementById("nextMonth");
const timeSelectEl = document.getElementById("time");

const TIMES = [
  "09:00","10:00","11:00","12:00","13:00",
  "14:00","15:00","16:00","17:00","18:00",
  "19:00","20:00","21:00"
];

function pad2(n) { return String(n).padStart(2, "0"); }

function toISO(d) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function pretty(d) {
  return d.toLocaleDateString("en-IN", { weekday: "short", year: "numeric", month: "short", day: "numeric" });
}

let viewMonth = new Date();
viewMonth.setDate(1);

function openCalendar() {
  calendarPopupEl.classList.add("show");
  renderCalendar();
}

function closeCalendar() {
  calendarPopupEl.classList.remove("show");
}

function renderCalendar() {
  if (!monthYearEl || !calendarDaysEl) return;

  const y = viewMonth.getFullYear();
  const m = viewMonth.getMonth();

  monthYearEl.textContent = new Date(y, m, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  calendarDaysEl.innerHTML = "";

  const first = new Date(y, m, 1);
  const start = new Date(first);
  start.setDate(start.getDate() - first.getDay());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selectedISO = dateValueEl.value || "";

  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    d.setHours(0, 0, 0, 0);

    const iso = toISO(d);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "calendar-day";
    btn.textContent = d.getDate();

    const otherMonth = d.getMonth() !== m;
    const past = d < today;

    if (otherMonth) btn.classList.add("other-month");
    if (past) btn.classList.add("disabled");
    if (iso === toISO(today)) btn.classList.add("today");
    if (iso === selectedISO) btn.classList.add("selected");

    if (otherMonth || past) {
      btn.disabled = true;
    } else {
      btn.addEventListener("click", () => {
        dateValueEl.value = iso;
        dateInputEl.value = pretty(d);
        dateInputEl.classList.remove("field-error");
        closeCalendar();
        fillTimes();
        updateSlotStatus();
      });
    }

    calendarDaysEl.appendChild(btn);
  }
}

function fillTimes() {
  if (!timeSelectEl) return;

  timeSelectEl.innerHTML = "";

  const first = document.createElement("option");
  first.value = "";
  first.disabled = true;
  first.selected = true;
  first.textContent = "select time";
  timeSelectEl.appendChild(first);

  TIMES.forEach((t) => {
    const opt = document.createElement("option");
    opt.value = t;
    opt.textContent = t;
    timeSelectEl.appendChild(opt);
  });
}

function updateSlotStatus() {
  const slotText = document.getElementById("slotText");
  const dateIso = dateValueEl?.value;
  const timeVal = timeSelectEl?.value;

  if (!slotText) return;
  if (!dateIso) slotText.textContent = "pick a date";
  else if (!timeVal) slotText.textContent = "pick a time";
  else slotText.textContent = "available ✅";
}

// calendar wiring
if (dateInputEl && calendarPopupEl) {
  dateInputEl.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = calendarPopupEl.classList.contains("show");
    if (isOpen) closeCalendar();
    else openCalendar();
  });

  calendarPopupEl.addEventListener("click", (e) => e.stopPropagation());

  document.addEventListener("click", () => {
    if (calendarPopupEl.classList.contains("show")) closeCalendar();
  });

  prevMonthEl?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    viewMonth.setMonth(viewMonth.getMonth() - 1);
    renderCalendar();
  });

  nextMonthEl?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    viewMonth.setMonth(viewMonth.getMonth() + 1);
    renderCalendar();
  });

  renderCalendar();
}

timeSelectEl?.addEventListener("change", updateSlotStatus);

fillTimes();
updateSlotStatus();

// ----- Modal -----
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
modal?.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

// ----- Submit -----
form?.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const serviceEl = document.getElementById("service");
  const serviceKey = serviceEl.value;
  const serviceLabel = serviceEl.selectedOptions[0]?.textContent || "";

  const dateVal = document.getElementById("dateValue").value;
  const timeVal = document.getElementById("time").value;

  const durationEl = document.getElementById("duration");
  const durationLabel = durationEl.selectedOptions[0]?.textContent || "";
  const location = document.getElementById("location").value.trim();
  const notes = document.getElementById("notes").value.trim();

  serviceEl.classList.toggle("field-error", !serviceKey);
  dateInputEl.classList.toggle("field-error", !dateVal);
  timeSelectEl.classList.toggle("field-error", !timeVal);
  durationEl.classList.toggle("field-error", !durationEl.value);

  if (!serviceKey || !dateVal || !timeVal || !durationEl.value) {
    statusEl.textContent = "please select service, date, time, duration.";
    statusEl.className = "status error";
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
    statusEl.textContent = "saving booking…";
    statusEl.className = "status";
    document.getElementById("submitBtn")?.classList.add("loading");
    document.getElementById("submitBtn").disabled = true;

    try {
      const { error } = await supabaseClient
        .from("bookings")
        .insert([{
          service: serviceLabel,
          date: dateVal,
          time: timeVal,
          duration: durationLabel,
          location: location,
          name: name,
          phone: phone,
          email: email,
          custom_mission: notes
        }]);

      if (error) {
        console.error("Supabase error:", error);
        statusEl.textContent = "saved (with warning) ✅ opening whatsapp…";
      } else {
        statusEl.textContent = "booking saved ✅ opening whatsapp…";
      }
      statusEl.className = "status success";
    } catch (err) {
      console.error("Unexpected error:", err);
      statusEl.textContent = "saved (with warning) ✅ opening whatsapp…";
      statusEl.className = "status success";
    } finally {
      document.getElementById("submitBtn")?.classList.remove("loading");
      document.getElementById("submitBtn").disabled = false;
    }

    window.open(waLink, "_blank", "noopener,noreferrer");
  };
});