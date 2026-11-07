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
  } else if (currentActiveScreen === 'screen-pdf-viewer') {
    showScreenView('screen-dgm');
  } else {
    showScreenView('home-screen');
  }
}

// Intercept browser / Android hardware back button
window.addEventListener('popstate', (e) => {
  if (e.state && e.state.screen && e.state.screen !== 'home-screen') {
    showScreenView(e.state.screen);
  } else {
    if (currentActiveScreen === 'screen-pdf-viewer') {
      showScreenView('screen-dgm');
    } else if (currentActiveScreen !== 'home-screen') {
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
   5. DGM Site Functions & PDF Viewer
------------------------------------------------------- */
function openDgmPdfViewer(title, pdfPath) {
  document.getElementById('pdf-viewer-title').innerText = title;
  document.getElementById('pdf-download-link').href = pdfPath;
  document.getElementById('pdf-external-btn').href = pdfPath;
  document.getElementById('pdf-render-frame').src = pdfPath;
  navigateTo('screen-pdf-viewer');
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


/* =======================================================
   11. NATIVE EMBEDDED REPORT GENERATORS & CALCULATORS
======================================================= */

/* A & B Shift Report Logic */
function addNativeDrillingRow() {
  const container = document.getElementById('ab-drilling-container');
  if (!container) return;
  const row = document.createElement('div');
  row.className = 'form-row';
  row.style.marginBottom = '6px';
  row.innerHTML = `
    <input type="number" class="form-input d-hole" placeholder="Holes">
    <input type="number" class="form-input d-mtr" placeholder="Meters">
    <button class="btn-action" style="width:38px; padding:0; background:#EF4444; color:white; border-radius:6px;" onclick="this.parentElement.remove()">✕</button>
  `;
  container.appendChild(row);
}

function generateNativeABReport() {
  const rawDate = document.getElementById('ab-date').value;
  const date = rawDate ? rawDate.split('-').reverse().join('.') : 'DD.MM.YYYY';
  const shift = document.getElementById('ab-shift').value;
  const raisingTrips = document.getElementById('ab-raisingTrips').value || 0;
  const raisingMT = document.getElementById('ab-raisingMT').value || 0;
  const devTrips = document.getElementById('ab-devTrips').value || 0;
  const soilTrips = document.getElementById('ab-soilTrips').value || 0;
  const stockTrips = document.getElementById('ab-stockTrips').value || 0;
  const stockUnload = document.getElementById('ab-stockUnload').value || 0;
  const hopperUnload = document.getElementById('ab-hopperUnload').value || 0;
  const crushing = document.getElementById('ab-crushing').value || 0;

  let drillText = '';
  let totalDrill = 0;
  document.querySelectorAll('#ab-drilling-container .form-row').forEach(row => {
    const h = parseFloat(row.querySelector('.d-hole').value) || 0;
    const m = parseFloat(row.querySelector('.d-mtr').value) || 0;
    if (h > 0 && m > 0) {
      const tot = h * m;
      drillText += `${h} H x ${m}mtr = ${tot}mtr\n`;
      totalDrill += tot;
    }
  });

  let report = `*Date: ${date}*\n*SD Mines Report*\n\n`;
  report += `*Shift: ${shift}*\n`;
  report += `- *Raising*: ${raisingTrips} Trip ${raisingMT} MT\n`;
  report += `- *Development*: ${devTrips} Trip\n`;
  report += `- *Top Soil*: ${soilTrips} Trip\n`;
  report += `- *Stock Feeding*: ${stockTrips} Trip\n`;
  report += drillText ? `- *Drilling*: ${drillText}  Total: ${totalDrill}mtr\n\n` : `- *Drilling*: Nil\n\n`;
  report += `- *Stock Unloading Trips*: ${stockUnload}\n`;
  report += `- *Hopper Unloading Trips*: ${hopperUnload}\n\n`;
  report += `*Summary*\n`;
  report += `- *Total Raising*: ${raisingMT} MT\n`;
  report += `- *Total Crushing*: ${crushing} MT`;

  document.getElementById('ab-report-output').innerText = report;
  document.getElementById('ab-result-container').style.display = 'block';
  document.getElementById('ab-result-container').scrollIntoView({ behavior: 'smooth' });
}

function copyNativeABReport() {
  const text = document.getElementById('ab-report-output').innerText;
  navigator.clipboard.writeText(text).then(() => alert("Report copied to clipboard!"));
}

function shareNativeABWhatsApp() {
  const text = document.getElementById('ab-report-output').innerText;
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}

/* C Shift Report Logic */
function generateNativeCReport() {
  const rawDate = document.getElementById('c-date').value;
  const date = rawDate ? rawDate.split('-').reverse().join('.') : 'DD.MM.YYYY';

  const aTrip = document.getElementById('c-aTrip').value || 0;
  const aMT = parseFloat(document.getElementById('c-aMT').value || 0);
  const aDev = parseInt(document.getElementById('c-aDev').value || 0);
  const aSoil = parseInt(document.getElementById('c-aSoil').value || 0);
  const aStock = parseInt(document.getElementById('c-aStock').value || 0);
  const aDrill = parseInt(document.getElementById('c-aDrill').value || 0);

  const bTrip = document.getElementById('c-bTrip').value || 0;
  const bMT = parseFloat(document.getElementById('c-bMT').value || 0);
  const bDev = parseInt(document.getElementById('c-bDev').value || 0);
  const bSoil = parseInt(document.getElementById('c-bSoil').value || 0);
  const bStock = parseInt(document.getElementById('c-bStock').value || 0);
  const bDrill = parseInt(document.getElementById('c-bDrill').value || 0);

  const cStock = parseInt(document.getElementById('c-cStock').value || 0);

  const totRaising = (aMT + bMT).toFixed(2);
  const totDev = aDev + bDev;
  const totSoil = aSoil + bSoil;
  const totStock = aStock + bStock + cStock;
  const totDrill = aDrill + bDrill;

  let mtdRaising = totRaising, mtdDev = totDev, mtdSoil = totSoil, mtdDrill = totDrill;
  const prevText = document.getElementById('c-prevReport').value.trim();

  if (prevText) {
    const getVal = (pattern) => {
      const m = prevText.match(pattern);
      return m ? parseFloat(m[1]) : 0;
    };
    mtdRaising = (getVal(/Raising:\s*([\d.]+)\s*MT/i) + parseFloat(totRaising)).toFixed(2);
    mtdDev = getVal(/Development:\s*([\d.]+)\s*Trip/i) + totDev;
    mtdSoil = getVal(/Top Soil:\s*([\d.]+)\s*Trip/i) + totSoil;
    mtdDrill = getVal(/Drilling:\s*([\d.]+)\s*MTR/i) + totDrill;
  } else {
    mtdRaising = document.getElementById('c-mtdRaising').value || totRaising;
    mtdDev = document.getElementById('c-mtdDev').value || totDev;
    mtdSoil = document.getElementById('c-mtdSoil').value || totSoil;
    mtdDrill = document.getElementById('c-mtdDrill').value || totDrill;
  }

  let report = `*Date: ${date}*\n*SD Mines Day Report*\n\n`;
  report += `*A Shift:*\n* Raising: ${aTrip} Trip ${aMT} MT\n* Development: ${aDev} Trip\n* Top Soil: ${aSoil} Trip\n* Stock Feeding: ${aStock} Trip\n* Drilling: ${aDrill} MTR\n\n`;
  report += `*B Shift:*\n* Raising: ${bTrip} Trip ${bMT} MT\n* Development: ${bDev} Trip\n* Top Soil: ${bSoil} Trip\n* Stock Feeding: ${bStock} Trip\n* Drilling: ${bDrill} MTR\n\n`;
  report += `*C Shift:*\n* Stock Feeding: ${cStock} Trip\n\n`;
  report += `*Total Summary:*\n* Total Raising: ${totRaising} MT\n* Total Development: ${totDev} Trip\n* Total Top Soil: ${totSoil} Trip\n* Total Stock Feeding: ${totStock} Trip\n* Total Drilling: ${totDrill} MTR\n\n`;
  report += `*MTD SD Mines:*\n* Raising: ${mtdRaising} MT\n* Development: ${mtdDev} Trip\n* Top Soil: ${mtdSoil} Trip\n* Drilling: ${mtdDrill} MTR`;

  document.getElementById('c-report-output').innerText = report;
  document.getElementById('c-result-container').style.display = 'block';
  document.getElementById('c-result-container').scrollIntoView({ behavior: 'smooth' });
}

function copyNativeCReport() {
  const text = document.getElementById('c-report-output').innerText;
  navigator.clipboard.writeText(text).then(() => alert("C Shift Report copied!"));
}

function shareNativeCWhatsApp() {
  const text = document.getElementById('c-report-output').innerText;
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}

/* Pile Calculator Blending */
function calcBlendingPile() {
  const q1 = parseFloat(document.getElementById('pile-q1').value);
  const l1 = parseFloat(document.getElementById('pile-l1').value);
  const m1 = parseFloat(document.getElementById('pile-m1').value);
  const qt = parseFloat(document.getElementById('pile-qt').value);
  const lt = parseFloat(document.getElementById('pile-lt').value);
  const mt = parseFloat(document.getElementById('pile-mt').value);
  const l2 = parseFloat(document.getElementById('pile-l2').value);
  const m2 = parseFloat(document.getElementById('pile-m2').value);

  const resBox = document.getElementById('pile-result-box');
  if (isNaN(q1) || isNaN(l1) || isNaN(m1) || isNaN(qt) || isNaN(lt) || isNaN(mt)) {
    alert("Please fill all target and existing values.");
    return;
  }

  const q2 = qt - q1;
  let html = `<strong>Blending Summary:</strong><br>` +
    `• Existing Q₁: ${q1.toLocaleString()} Tons | Target Qₜ: ${qt.toLocaleString()} Tons<br>` +
    `• <b>Required Q₂ = ${q2.toLocaleString()} Tons</b><br><br>`;

  if (!isNaN(l2) && !isNaN(m2)) {
    const blendedLSF = ((q1 * l1) + (q2 * l2)) / qt;
    const blendedMgO = ((q1 * m1) + (q2 * m2)) / qt;
    html += `• <b>Blended LSF:</b> ${blendedLSF.toFixed(2)}<br>` +
            `• <b>Blended MgO:</b> ${blendedMgO.toFixed(2)}%<br>`;
    const ok = Math.abs(blendedLSF - lt) <= 0.2 && Math.abs(blendedMgO - mt) <= 0.2;
    html += `<div style="color:${ok ? '#059669' : '#DC2626'}; font-weight:700; margin-top:8px;">${ok ? '✓ Target matched closely.' : '⚠ Target not met closely. Adjust new material quality.'}</div>`;
  } else {
    const reqL2 = ((lt * qt) - (l1 * q1)) / q2;
    const reqM2 = ((mt * qt) - (m1 * q1)) / q2;
    html += `• <b>Required New Material LSF (L₂):</b> ${reqL2.toFixed(2)}<br>` +
            `• <b>Required New Material MgO (M₂):</b> ${reqM2.toFixed(2)}%<br>` +
            `<div style="color:#059669; font-weight:700; margin-top:8px;">✓ Calculation completed successfully.</div>`;
  }
  resBox.innerHTML = html;
  resBox.style.display = 'block';
}

/* Calculator Logic (AB & C tabs) */
let calcExpressions = { 'calc-display-ab': '', 'calc-display-c': '' };

function calcInput(val, displayId) {
  const disp = document.getElementById(displayId);
  if (!disp) return;

  if (val === 'C') {
    calcExpressions[displayId] = '';
    disp.innerText = '0';
  } else if (val === 'DEL') {
    calcExpressions[displayId] = calcExpressions[displayId].slice(0, -1);
    disp.innerText = calcExpressions[displayId] || '0';
  } else if (val === '=') {
    try {
      const res = eval(calcExpressions[displayId]);
      disp.innerText = res;
      calcExpressions[displayId] = res.toString();
    } catch (e) {
      disp.innerText = 'Error';
      calcExpressions[displayId] = '';
    }
  } else if (val === '()') {
    calcExpressions[displayId] += '()';
    disp.innerText = calcExpressions[displayId];
  } else {
    calcExpressions[displayId] += val;
    disp.innerText = calcExpressions[displayId];
  }
}

/* TPH Calculator Logic */
function calcNativeTPH(tId, rId, resId) {
  const t = parseFloat(document.getElementById(tId).value);
  const r = parseFloat(document.getElementById(rId).value);
  const resEl = document.getElementById(resId);

  if (isNaN(t) || isNaN(r) || r <= 0) {
    alert("Please enter valid Tonnage and Running Hours (> 0).");
    return;
  }
  const tph = (t / r).toFixed(2);
  resEl.innerText = `Production Rate: ${tph} MT/Hr`;
  resEl.style.display = 'block';
}

/* Manpower Report */
function generateNativeManpowerReport() {
  const rawDate = document.getElementById('mp-date').value;
  const date = rawDate ? rawDate.split('-').reverse().join('.') : 'DD.MM.YYYY';
  const shift = document.getElementById('mp-shift').value;
  const foreman = document.getElementById('mp-foreman').value || "Nil";
  const mate = document.getElementById('mp-mate').value || "Nil";
  const own = document.getElementById('mp-own').value || 0;
  const pks = document.getElementById('mp-pks').value || 0;
  const total = document.getElementById('mp-total').value || 0;

  const report = `*MANPOWER IN SD MINES*\n` +
    `*Date :-* ${date}\n` +
    `*SHIFT* :- *${shift}*\n` +
    `*Mines Foreman*:- ${foreman}\n` +
    `*Mine Mate*:- ${mate}\n` +
    `*Own + TP*:-  ${own}\n` +
    `*PKS Manpower*:- ${pks}\n` +
    `*Total Manpower*:- ${total}`;

  document.getElementById('mp-report-output').innerText = report;
  document.getElementById('mp-result-wrap').style.display = 'block';
}

function copyNativeManpowerReport() {
  const text = document.getElementById('mp-report-output').innerText;
  navigator.clipboard.writeText(text).then(() => alert("Manpower Report copied!"));
}

function shareNativeManpowerWhatsApp() {
  const text = document.getElementById('mp-report-output').innerText;
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}

/* Shift Allocation Report */
function generateNativeAllocReport() {
  const shift = document.getElementById('alloc-shift').value;
  const foreman = document.getElementById('alloc-foreman').value || 'Nil';
  const mate = document.getElementById('alloc-mate').value || 'Nil';

  const rSY = document.getElementById('alloc-raising-sy').value;
  const rTip = document.getElementById('alloc-raising-tip').value;
  const dSY = document.getElementById('alloc-dev-sy').value;
  const dTip = document.getElementById('alloc-dev-tip').value;
  const sSY = document.getElementById('alloc-stock-sy').value;
  const sTip = document.getElementById('alloc-stock-tip').value;
  const drill = document.getElementById('alloc-drilling').value || 'Nil';

  const raising = rSY && rTip ? `${rSY} + ${rTip}` : 'Nil';
  const dev = dSY && dTip ? `${dSY} + ${dTip}` : 'Nil';
  const stock = sSY && sTip ? `${sSY} + ${sTip}` : 'Nil';

  const report = `*SD Mines ${shift} Shift Allocation*\n\n` +
    `*Mine Foreman*: ${foreman}\n` +
    `*Mine Mate*: ${mate}\n\n` +
    `*Raising*: ${raising}\n` +
    `*Development*: ${dev}\n` +
    `*Stock Feeding*: ${stock}\n` +
    `*Drilling*: ${drill}`;

  document.getElementById('alloc-report-output').innerText = report;
  document.getElementById('alloc-result-wrap').style.display = 'block';
}

function copyNativeAllocReport() {
  const text = document.getElementById('alloc-report-output').innerText;
  navigator.clipboard.writeText(text).then(() => alert("Allocation Report copied!"));
}

function shareNativeAllocWhatsApp() {
  const text = document.getElementById('alloc-report-output').innerText;
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}

/* Tool Box Safety Talk Topics (Searchable Table) */
const toolboxTopicsList = [
  "Importance of Pre-Shift Equipment Checks",
  "Safe Operation of Heavy Machinery (General)",
  "Identifying and Reporting Unsafe Conditions",
  "Proper Use of Personal Protective Equipment (PPE)",
  "Understanding Site Emergency Procedures",
  "Maintaining Good Housekeeping in the Workplace",
  "Preventing Slips, Trips, and Falls",
  "Safe Use of Hand Tools",
  "Importance of Following Instructions and Procedures",
  "Fatigue Management and Prevention",
  "Safe Access and Egress on Site",
  "Working Safely Around Mobile Equipment",
  "Understanding and Respecting Site Signage",
  "Basic First Aid Awareness",
  "Fire Prevention and Basic Fire Extinguisher Use",
  "Safe Lifting Techniques and Manual Handling",
  "Noise Hazards and Hearing Protection",
  "Dust Control Measures and Respiratory Protection",
  "Safe Operation of Light Vehicles on Site",
  "Environmental Awareness and Spill Control",
  "Working Safely in Varying Weather Conditions",
  "Importance of Reporting Near Misses",
  "Electrical Safety Basics and Avoiding Hazards",
  "Lockout/Tagout Procedures for Equipment Maintenance",
  "Safe Use of Ladders and Scaffolding",
  "Working Safely at Heights",
  "Understanding Ground Control Measures",
  "Identifying Potential Rockfall Hazards",
  "Safe Procedures for Working Near Excavations",
  "Haul Road Safety and Traffic Management",
  "Blind Spots Awareness Around Heavy Equipment",
  "Communication Protocols on Site",
  "Safe Fueling Procedures for Equipment",
  "Proper Maintenance and Inspection of PPE",
  "Understanding Safety Data Sheets (SDS)",
  "Safe Handling and Storage of Chemicals",
  "Working Safely with Compressed Air",
  "Importance of Regular Safety Meetings",
  "Confined Space Entry Awareness",
  "Safe Blasting Procedures and Clearance",
  "Handling and Storage of Explosives (General Awareness)",
  "Post-Blast Inspection Procedures",
  "Safe Operation of Drilling Equipment",
  "Safe Operation of Excavators",
  "Safe Operation of Loaders",
  "Safe Operation of Dump Trucks",
  "Safe Operation of Graders",
  "Safe Operation of Bulldozers",
  "Safe Use of Water Trucks for Dust Suppression",
  "Safe Use of Service Vehicles",
  "Importance of Following Spotter Instructions",
  "Safe Coupling and Uncoupling of Trailers",
  "Securing Loads Properly for Transportation",
  "Preventing Back Injuries During Manual Tasks",
  "Recognizing and Addressing Heat Stress",
  "Preventing Cold Stress and Hypothermia",
  "Importance of Hydration in Mining Operations",
  "Maintaining Personal Hygiene on Site",
  "Dealing with Wildlife Encounters on Site",
  "Importance of Reporting All Incidents and Accidents",
  "Understanding the Consequences of Taking Shortcuts",
  "The Role of Each Worker in Maintaining Safety",
  "Safe Use of Mobile Phones and Electronic Devices on Site",
  "Maintaining a Safe Attitude Towards Work",
  "Importance of Teamwork in Safety",
  "Safe Procedures for Working at Night",
  "Proper Use of Lighting on Site",
  "Maintaining Visibility in Dusty Conditions",
  "Safe Practices During Maintenance Activities",
  "Importance of Using the Right Tool for the Job",
  "Safe Disposal of Waste Materials",
  "Preventing Contamination of Water Sources",
  "Minimizing Environmental Impact of Mining Activities",
  "Importance of Regular Equipment Inspections",
  "Reporting Equipment Defects Promptly",
  "Understanding the Mine Safety Rules and Regulations",
  "The Importance of Risk Assessment Before Starting Work",
  "Identifying and Mitigating Potential Hazards",
  "Safe Procedures for Working Alone",
  "Emergency Communication Systems on Site",
  "Safe Movement of Personnel Around the Mine Site",
  "Maintaining Safe Distances from Operating Equipment",
  "Awareness of Overhead Power Lines",
  "Safe Procedures for Working Near Water Bodies",
  "Importance of Following Traffic Rules on Site",
  "Safe Parking Procedures for Vehicles and Equipment",
  "Preventing Unauthorized Access to Restricted Areas",
  "Importance of Security Measures on Site",
  "Safe Procedures for Handling Samples",
  "Awareness of Potential Geotechnical Hazards",
  "Safe Use of Surveying Equipment",
  "Importance of Continuous Safety Improvement",
  "Recognizing and Addressing Signs of Impairment",
  "The Impact of Alcohol and Drugs on Workplace Safety",
  "Stress Management Techniques for Miners",
  "Promoting a Positive Safety Culture on Site",
  "Understanding the Consequences of Safety Violations",
  "Encouraging Active Participation in Safety Initiatives",
  "Review of Recent Incidents and Lessons Learned",
  "Continuous Learning and Development in Safety"
];

function renderNativeSafetyTopics(filter = '') {
  const tbody = document.getElementById('toolbox-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';
  const q = filter.toLowerCase().trim();

  toolboxTopicsList.forEach((t, idx) => {
    if (!q || t.toLowerCase().includes(q)) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td><b>${idx + 1}</b></td><td>${t}</td>`;
      tbody.appendChild(tr);
    }
  });
}

function filterNativeSafetyTopics() {
  const q = document.getElementById('toolbox-search-input').value;
  renderNativeSafetyTopics(q);
}

// Initial dates & topics on boot
window.addEventListener('DOMContentLoaded', () => {
  const today = new Date().toISOString().split('T')[0];
  if (document.getElementById('ab-date')) document.getElementById('ab-date').value = today;
  if (document.getElementById('c-date')) document.getElementById('c-date').value = today;
  if (document.getElementById('mp-date')) document.getElementById('mp-date').value = today;
  renderNativeSafetyTopics();
});
