# SD Mines Report - Official Web App

Yeh **SD Mines Report** Android Flutter mobile application ka exact 1:1 replica **Web Application** hai. Iske sabhi files ek separate organized folder me rakhe gaye hain.

---

## 📁 Folder Structure

```
SD_Mines_Web_App/
│
├── index.html                   # Main Web App UI (Home Screen, Sub-screens, Dialogs)
├── styles.css                   # Complete Styling (Flutter Themes, Animated Gradient, Cards)
├── app.js                       # Logic (Navigation, Quotes Carousel, LocalStorage, Cropper)
│
└── assets/                      # Sub-pages and tools
    ├── A_B_shift_Report.html    # A & B Shift Report Generator
    ├── C_shift_Report.html      # C Shift Day Report with MTD Auto-Calculation
    ├── calculator.html          # Modern Full Calculator
    ├── TPH_Calculator.html      # Running Hours & Tonnage TPH Calculator
    ├── Pile_Calculator.html     # Blending Calculator (LSF, MgO, Target Qty)
    ├── Manpower_report.html     # Manpower Report Generator
    ├── allocation.html          # Shift Allocation Report Generator
    └── Tool_box_safety_talk_topic.html # 100+ Searchable Tool Box Topics
```

---

## 🚀 Features (Android App jaisa Same-to-Same)

1. **Animated 12-Second Gradient Background:**
   Flutter ke `AnimatedGradientBackground` jaisa smooth aur soft ambient color shift.

2. **Quotes Carousel (5 Seconds):**
   20 official mining safety quotes 5 second ke interval par smooth animation se badalte hain.

3. **Row 1 Tiles (3 Buttons):**
   - **Pile Calculator:** Blending calculation + Formula explanation guide.
   - **DGM Site:** 5 Procedure Documents & Direct Portals.
   - **Share Report:** 5 Report Types selection + Camera/Gallery capture + High-Resolution Inline Crop + Rotate 90° (Left/Right) + Direct WhatsApp Share!

4. **Row 2 Tiles (3 Buttons):**
   - **Shift Chart:** Duty chart upload + Permanent `localStorage` storage + Interactive Zoom & Pan controls.
   - **Safety Checklist:** 5 Mining Safety Categories (20 items) + Live % Progress Bar + Auto-Saved in memory + Reset dialog.
   - **Reminder Notes:** Faded yellow lined notebook pad + Auto-saves continuously + Character counter + Clear dialog.

5. **5 Horizontal Long Action Buttons:**
   - **A & B Shift Report:** Tabs for Report, Calculator, TPH (State persistence - switching tabs never clears user data).
   - **C Shift Report:** Tabs for Day Report, Calculator, TPH with MTD auto-calculation.
   - **Manpower Report:** Shifts, Foreman, Mate, Counts & WhatsApp share.
   - **Shift Allocation Report:** Machine & Tipper allocation.
   - **Tool Box Safety Talk Topics:** 100+ Safety Topics with live search filter.

6. **Exit App Dialog:**
   Back button press par Flutter jaisa pop-up alert: *"Close SD Report? Are you sure you want to exit the application?"*

---

## 💻 Kaise Chalayein? (How to Run)

1. Apne computer me `SD_Mines_Web_App` folder open karein.
2. `index.html` file par **Double Click** karein.
3. Kisi bhi browser (Google Chrome, Microsoft Edge, Safari) me pura mobile app jaisa smooth chalega!

---

## 🌐 Blogger / Online Hosting

- **Option A (Blogger):**
  Aap `index.html` ko iframe ke zariye Blogger page me embed kar sakte hain ya pure folder ko GitHub Pages, Netlify ya Vercel par 1 minute me FREE host karke link Blogger me de sakte hain.
- **Option B (Direct):**
  Kisi bhi static hosting (GitHub Pages, Netlify, Firebase Hosting) par is folder ko drag-and-drop karke live website bana sakte hain!
