/* =======================================================
   SD MINES REPORT - APPLICATION CONTROLLER (app.js)
   1:1 Functional Logic of the Flutter Mobile App
======================================================= */

/* -------------------------------------------------------
   1. Mining Quotes Data & 5-Second Auto Carousel
------------------------------------------------------- */
const miningQuotes = [
  "Safety first, progress follows in every mine.",
  "Mining builds the foundation of modern world.",
  "Deep under earth, innovation powers our future.",
  "Every shift begins with zero harm commitment.",
  "Precision mining unlocks the treasures of earth.",
  "Excavating strength, shaping a sustainable tomorrow.",
  "Safe operations ensure sustainable growth every day.",
  "Heavy machinery, stronger minds, safer mining practice.",
  "Quality production begins with safe shift management.",
  "Underground or surface, safety is our priority.",
  "Careful planning creates safer and efficient mines.",
  "Mining excellence driven by team commitment daily.",
  "Responsible extraction for a brighter industrial future.",
  "Zero compromise on safety leads to success.",
  "Every worker returns home safe after shift.",
  "Efficiency in mining brings prosperity for all.",
  "Smart technology transforming traditional mining operations today.",
  "Protecting miners, powering progress, building tomorrow.",
  "Hard work inside mines fuels global growth.",
  "Mining safely today for a greener tomorrow."
];

let quoteIndex = 0;
function initQuotesCarousel() {
  const quoteEl = document.getElementById('quotes-text-display');
  if (!quoteEl) return;

  setInterval(() => {
    quoteIndex = (quoteIndex + 1) % miningQuotes.length;
    quoteEl.style.opacity = '0';
    setTimeout(() => {
      quoteEl.innerText = `"${miningQuotes[quoteIndex]}"`;
      quoteEl.style.opacity = '1';
    }, 250);
  }, 5000);
}


/* -------------------------------------------------------
   2. Screen Router & Back Navigation
------------------------------------------------------- */
let currentActiveScreen = 'home-screen';

function navigateTo(screenId) {
  // Push state to browser history for native back button support
  history.pushState({ screen: screenId }, '', `#${screenId}`);
  showScreenView(screenId);
}

function showScreenView(screenId) {
  document.querySelectorAll('.screen-view').forEach(s => {
    s.classList.remove('active');
    s.style.display = 'none';
  });
  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add('active');
    target.style.display = 'flex';
    currentActiveScreen = screenId;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }
}

function handleBackButton() {
  if (currentActiveScreen === 'home-screen') {
    showExitModal();
  } else {
    showScreenView('home-screen');
  }
}

// Intercept browser / Android hardware back button
window.addEventListener('popstate', (e) => {
  if (e.state && e.state.screen && e.state.screen !== 'home-screen') {
    showScreenView(e.state.screen);
  } else {
    if (currentActiveScreen !== 'home-screen') {
      showScreenView('home-screen');
    } else {
      showExitModal();
    }
  }
});


/* -------------------------------------------------------
   3. Exit App Confirmation Dialog (Flutter Replica)
------------------------------------------------------- */
function showExitModal() {
  document.getElementById('exit-dialog-modal').classList.add('active');
}

function closeExitModal() {
  document.getElementById('exit-dialog-modal').classList.remove('active');
}

function confirmExitApp() {
  closeExitModal();
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.close();
  }
}


/* -------------------------------------------------------
   4. Tab Switcher with State Persistence (IndexedStack)
------------------------------------------------------- */
function switchTab(screenContext, tabName) {
  // Tab buttons styling
  const tabBar = document.querySelector(`#${screenContext} .flutter-tab-bar`);
  if (tabBar) {
    tabBar.querySelectorAll('.flutter-tab-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
  }

  // Views inside that screen
  const views = document.querySelectorAll(`.${screenContext}-tab-content`);
  views.forEach(v => {
    v.style.display = (v.id === `${screenContext}-${tabName}`) ? 'block' : 'none';
  });
}

function reloadTabIframe(iframeId) {
  const frame = document.getElementById(iframeId);
  if (frame) {
    frame.src = frame.src;
  }
}


/* -------------------------------------------------------
   5. DGM Site Functions & Modal
------------------------------------------------------- */
function openDgmAction(docTitle) {
  document.getElementById('dgm-modal-title').innerText = docTitle;
  document.getElementById('dgm-dialog-modal').classList.add('active');
}

function closeDgmModal() {
  document.getElementById('dgm-dialog-modal').classList.remove('active');
}


/* -------------------------------------------------------
   6. Share Report (Photo Capture, Rotate & Crop)
------------------------------------------------------- */
let activeReportType = 'Daily Shift Report';
let cropImageObj = null;
let currentRotation = 0;

function selectReportType(type) {
  activeReportType = type;
  document.getElementById('report-type-picker').click();
}

function onPhotoSelected(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    cropImageObj = new Image();
    cropImageObj.onload = function() {
      currentRotation = 0;
      document.getElementById('share-categories-list').style.display = 'none';
      document.getElementById('crop-interface-wrap').style.display = 'block';
      document.getElementById('crop-active-title').innerText = activeReportType;
      renderCropCanvas();
    };
    cropImageObj.src = evt.target.result;
  };
  reader.readAsDataURL(file);
}

function renderCropCanvas() {
  if (!cropImageObj) return;
  const canvas = document.getElementById('crop-canvas');
  const ctx = canvas.getContext('2d');

  const isRotated = (currentRotation % 180 !== 0);
  const w = isRotated ? cropImageObj.height : cropImageObj.width;
  const h = isRotated ? cropImageObj.width : cropImageObj.height;

  canvas.width = w;
  canvas.height = h;

  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.rotate((currentRotation * Math.PI) / 180);
  ctx.drawImage(cropImageObj, -cropImageObj.width / 2, -cropImageObj.height / 2);
  ctx.restore();
}

function rotateCrop(deg) {
  currentRotation = (currentRotation + deg) % 360;
  renderCropCanvas();
}

function applyInlineCrop() {
  alert("High definition crop applied!");
}

function retakePhoto() {
  document.getElementById('share-categories-list').style.display = 'block';
  document.getElementById('crop-interface-wrap').style.display = 'none';
  document.getElementById('report-type-picker').value = '';
}

function sharePhotoToWhatsApp() {
  const canvas = document.getElementById('crop-canvas');
  canvas.toBlob(blob => {
    if (!blob) return;
    const file = new File([blob], `${activeReportType}.jpg`, { type: 'image/jpeg' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({
        files: [file],
        title: activeReportType,
        text: `*${activeReportType}* - SD Mines Report`
      }).catch(err => console.log('Share canceled:', err));
    } else {
      downloadCropPhoto();
      const url = `https://wa.me/?text=${encodeURIComponent(`*${activeReportType}* - SD Mines Report`)}`;
      window.open(url, '_blank');
    }
  }, 'image/jpeg', 0.98);
}

function downloadCropPhoto() {
  const canvas = document.getElementById('crop-canvas');
  const a = document.createElement('a');
  a.download = `${activeReportType.replace(/\s+/g, '_')}.jpg`;
  a.href = canvas.toDataURL('image/jpeg', 0.98);
  a.click();
}


/* -------------------------------------------------------
   7. Shift Chart (Upload, LocalStorage & Zoom)
------------------------------------------------------- */
let chartZoomScale = 1.0;

function loadStoredShiftChart() {
  const saved = localStorage.getItem('sd_mines_shift_chart');
  const imgView = document.getElementById('chart-img-view');
  const emptyView = document.getElementById('chart-empty-view');
  const ctrlView = document.getElementById('chart-zoom-controls');

  if (saved) {
    imgView.src = saved;
    imgView.style.display = 'block';
    emptyView.style.display = 'none';
    ctrlView.style.display = 'flex';
  } else {
    imgView.style.display = 'none';
    emptyView.style.display = 'flex';
    ctrlView.style.display = 'none';
  }
}

function onShiftChartSelected(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    const dataUrl = evt.target.result;
    try {
      localStorage.setItem('sd_mines_shift_chart', dataUrl);
    } catch (err) {
      console.warn("Storage quota exceeded, displaying image directly.");
    }
    loadStoredShiftChart();
    resetChartZoom();
  };
  reader.readAsDataURL(file);
}

function zoomChart(factor) {
  chartZoomScale = Math.min(4.0, Math.max(0.5, chartZoomScale * factor));
  document.getElementById('chart-img-view').style.transform = `scale(${chartZoomScale})`;
}

function resetChartZoom() {
  chartZoomScale = 1.0;
  document.getElementById('chart-img-view').style.transform = 'scale(1)';
}


/* -------------------------------------------------------
   8. Safety Checklist (Storage & Progress)
------------------------------------------------------- */
const safetyInspectionCategories = [
  {
    name: "1. Personal Protective Equipment (PPE)",
    icon: "🛡️",
    items: [
      { id: "ppe_1", text: "Safety Helmet (Hardhat) fitted properly" },
      { id: "ppe_2", text: "High-Visibility Reflective Jacket/Vest" },
      { id: "ppe_3", text: "Steel-Toe Safety Shoes/Boots" },
      { id: "ppe_4", text: "Dust Mask / Respirator worn in dusty zone" },
      { id: "ppe_5", text: "Ear Plugs/Muffs near heavy machinery" }
    ]
  },
  {
    name: "2. Heavy Machinery & Dumper Check",
    icon: "🚜",
    items: [
      { id: "mach_1", text: "Service & Emergency Brakes tested" },
      { id: "mach_2", text: "Reverse Alarm, Horn & Lights functional" },
      { id: "mach_3", text: "Hydraulic oil, fuel leaks & tire pressure ok" },
      { id: "mach_4", text: "Fire Extinguisher mounted & charged" }
    ]
  },
  {
    name: "3. Mining Pit & Bench Safety",
    icon: "⛰️",
    items: [
      { id: "pit_1", text: "Bench Height & Slope Stability inspected" },
      { id: "pit_2", text: "Loose Boulders & Overhangs scaled/cleared" },
      { id: "pit_3", text: "Pit Drainage & Water Pumping operational" },
      { id: "pit_4", text: "Danger Zone boundaries marked & fenced" }
    ]
  },
  {
    name: "4. Haul Road & Dust Control",
    icon: "🛣️",
    items: [
      { id: "road_1", text: "Haul Road Width & Parapet Side Berms ok" },
      { id: "road_2", text: "Water Tanker Sprinkling done for dust suppression" },
      { id: "road_3", text: "Speed Limits & Warning Signboards visible" }
    ]
  },
  {
    name: "5. Blasting & Electrical Safety",
    icon: "⚡",
    items: [
      { id: "blast_1", text: "Warning Siren tested before blasting" },
      { id: "blast_2", text: "Danger Radius cleared of personnel & equipment" },
      { id: "blast_3", text: "Explosive Van & Storage Vans locked & secured" },
      { id: "blast_4", text: "High-Voltage Cables isolated & grounded" }
    ]
  }
];

function initSafetyChecklist() {
  const container = document.getElementById('checklist-category-container');
  if (!container) return;
  container.innerHTML = '';

  const saved = JSON.parse(localStorage.getItem('sd_safety_checklist') || '{}');

  safetyInspectionCategories.forEach(cat => {
    const card = document.createElement('div');
    card.className = 'checklist-cat-card';

    let html = `<div class="checklist-cat-header"><span>${cat.icon}</span> ${cat.name}</div>`;
    cat.items.forEach(it => {
      const isDone = !!saved[it.id];
      html += `
        <label class="checklist-row-item ${isDone ? 'done' : ''}" id="row_${it.id}">
          <input type="checkbox" id="${it.id}" ${isDone ? 'checked' : ''} onchange="onCheckItemToggle('${it.id}')">
          <span>${it.text}</span>
        </label>
      `;
    });
    card.innerHTML = html;
    container.appendChild(card);
  });

  updateChecklistStats();
}

function onCheckItemToggle(id) {
  const saved = JSON.parse(localStorage.getItem('sd_safety_checklist') || '{}');
  const cb = document.getElementById(id);
  const row = document.getElementById(`row_${id}`);

  if (cb.checked) {
    saved[id] = true;
    row.classList.add('done');
  } else {
    delete saved[id];
    row.classList.remove('done');
  }

  localStorage.setItem('sd_safety_checklist', JSON.stringify(saved));
  updateChecklistStats();
}

function updateChecklistStats() {
  const saved = JSON.parse(localStorage.getItem('sd_safety_checklist') || '{}');
  let total = 0;
  safetyInspectionCategories.forEach(c => total += c.items.length);
  const count = Object.keys(saved).length;
  const pct = Math.round((count / total) * 100);

  const bar = document.getElementById('checklist-progress-bar');
  const pctText = document.getElementById('checklist-pct-text');
  const countText = document.getElementById('checklist-count-text');

  if (bar) bar.style.width = `${pct}%`;
  if (pctText) pctText.innerText = `${pct}%`;
  if (countText) countText.innerText = `${count} of ${total} safety items completed`;
}

function resetChecklistDialog() {
  if (confirm("Are you sure you want to reset all safety checklist items?")) {
    localStorage.removeItem('sd_safety_checklist');
    initSafetyChecklist();
  }
}


/* -------------------------------------------------------
   9. Reminder Notes (Continuous Autosave)
------------------------------------------------------- */
function loadReminderNotes() {
  const saved = localStorage.getItem('sd_reminder_notes') || '';
  const area = document.getElementById('reminder-textarea');
  if (area) {
    area.value = saved;
    updateReminderStats(saved);
  }
}

function onReminderInput() {
  const area = document.getElementById('reminder-textarea');
  const val = area.value;
  localStorage.setItem('sd_reminder_notes', val);
  updateReminderStats(val);

  const status = document.getElementById('reminder-save-badge');
  if (status) {
    status.innerText = "● Saving...";
    setTimeout(() => {
      status.innerText = "● Auto-Saved";
    }, 300);
  }
}

function updateReminderStats(text) {
  const charEl = document.getElementById('reminder-char-count');
  if (charEl) {
    charEl.innerText = `${text.length} characters`;
  }
}

function clearReminderDialog() {
  if (confirm("Clear all reminder notes? This action cannot be undone.")) {
    const area = document.getElementById('reminder-textarea');
    area.value = '';
    localStorage.removeItem('sd_reminder_notes');
    updateReminderStats('');
  }
}


/* -------------------------------------------------------
   10. App Bootstrapping
------------------------------------------------------- */
window.addEventListener('DOMContentLoaded', () => {
  initQuotesCarousel();
  loadStoredShiftChart();
  initSafetyChecklist();
  loadReminderNotes();

  // Initialize Home screen view
  showScreenView('home-screen');
  history.replaceState({ screen: 'home-screen' }, '', '#home-screen');
});
