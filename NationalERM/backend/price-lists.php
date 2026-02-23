<?php
// ============================================
// Central Industries PLC — Price List Page
// ============================================

// Define your PDFs here — using Google Drive links
$pdfs = [
    [
        'label' => 'National PVC',
        'desc'  => 'Switches, Sockets & Fittings',
        'link'  => 'https://drive.google.com/file/d/1YLPL47O8ZWQtPMdgYBqTkp5h8MsI6whO/view?usp=sharing',
        'icon'  => '🔵',
        'color' => ['bg' => '#eff6ff', 'border' => '#2563eb', 'text' => '#1d4ed8'],
    ],
    [
        'label' => 'Krypton Electric',
        'desc'  => 'N-Series, MCB, Protection Devices',
        'link'  => 'https://drive.google.com/file/d/1iEQP8jAZAGBqjbabyJbhQwWE6SWSd9O-/view?usp=sharing',
        'icon'  => '⚡',
        'color' => ['bg' => '#fef9ec', 'border' => '#d97706', 'text' => '#b45309'],
    ],
    [
        'label' => 'CIPLC Profile',
        'desc'  => 'Who We Are',
        'link'  => 'https://drive.google.com/file/d/1oR7b3fraKPIZ6s0kq_4ARyAP1sgOzuvQ/view?usp=sharing',
        'icon'  => '🏢',
        'color' => ['bg' => '#f0fdf4', 'border' => '#16a34a', 'text' => '#15803d'],
    ],
    // To add more, copy one block above and paste here ↑
];

// Define website links
$websites = [
    [
        'label'   => 'National PVC',
        'url'     => 'https://nationalpvc.com/',
        'icon'    => '🔵',
        'tagline' => 'nationalpvc.com',
        'color'   => ['bg' => '#eff6ff', 'border' => '#2563eb', 'text' => '#1d4ed8'],
    ],
    [
        'label'   => 'Krypton Electric',
        'url'     => 'http://www.kryptonelectric.com/',
        'icon'    => '⚡',
        'tagline' => 'kryptonelectric.com',
        'color'   => ['bg' => '#fef9ec', 'border' => '#d97706', 'text' => '#b45309'],
    ],
];
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Central Industries PLC — Documents</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Segoe UI', Arial, sans-serif;
    background: linear-gradient(135deg, #1e3a8a 0%, #1e1b4b 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
  }
  .card {
    background: rgba(255,255,255,0.97);
    border-radius: 24px;
    padding: 2.5rem 2rem;
    max-width: 480px;
    width: 100%;
    text-align: center;
    box-shadow: 0 25px 60px rgba(0,0,0,0.4);
  }
  .company-name {
    font-size: 0.85rem;
    font-weight: 900;
    color: #1e3a8a;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
  h1 {
    font-size: 1.5rem;
    font-weight: 900;
    color: #111827;
    margin: 0.4rem 0 0.3rem;
  }
  .subtitle {
    color: #6b7280;
    font-size: 0.85rem;
    margin-bottom: 2rem;
  }

  /* ── Price List Buttons ── */
  .btn-row {
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
  }
  .pdf-btn {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.1rem 1.4rem;
    border-radius: 14px;
    text-decoration: none;
    font-weight: 800;
    font-size: 0.95rem;
    border: 2.5px solid transparent;
    transition: transform 0.15s, box-shadow 0.15s;
    cursor: pointer;
  }
  .pdf-btn:active { transform: scale(0.97); }
  .pdf-btn:hover  { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
  .btn-icon { font-size: 1.9rem; flex-shrink: 0; }
  .btn-text { text-align: left; }
  .btn-text .brand { font-size: 1rem; font-weight: 900; }
  .btn-text .desc  { font-size: 0.75rem; font-weight: 500; opacity: 0.65; margin-top: 0.1rem; }
  .arrow { margin-left: auto; font-size: 1.2rem; opacity: 0.4; }

  /* ── Divider ── */
  .section-divider {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 1.8rem 0 1.2rem;
  }
  .section-divider::before,
  .section-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e5e7eb;
  }
  .section-label {
    font-size: 0.7rem;
    font-weight: 800;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    white-space: nowrap;
  }

  /* ── Website Link Buttons ── */
  .website-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }
  .web-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    padding: 1rem 0.75rem;
    border-radius: 14px;
    text-decoration: none;
    font-weight: 800;
    border: 2.5px solid transparent;
    transition: transform 0.15s, box-shadow 0.15s;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .web-btn:active  { transform: scale(0.97); }
  .web-btn:hover   { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
  .web-btn-icon    { font-size: 1.6rem; }
  .web-btn-label   { font-size: 0.88rem; font-weight: 900; }
  .web-btn-url     { font-size: 0.68rem; font-weight: 500; opacity: 0.6; word-break: break-all; }
  .web-badge {
    position: absolute;
    top: 7px;
    right: 8px;
    font-size: 0.58rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    opacity: 0.5;
  }

  /* ── Footer Notes ── */
  .gdrive-note {
    margin-top: 1.5rem;
    font-size: 0.72rem;
    color: #9ca3af;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
  }
  .footer {
    margin-top: 0.6rem;
    font-size: 0.72rem;
    color: #9ca3af;
  }

  /* ── Responsive: stack website buttons on very small screens ── */
  @media (max-width: 340px) {
    .website-row {
      grid-template-columns: 1fr;
    }
  }
</style>
</head>
<body>
<div class="card">

  <div class="company-name">Central Industries PLC</div>
  <h1>📋 Price Lists 2026</h1>
  <p class="subtitle">Effective from 01 April 2025 — Tap a brand to view</p>

  <!-- ── Price List PDFs ── -->
  <div class="btn-row">
    <?php foreach ($pdfs as $pdf): ?>
      <?php
        $href   = htmlspecialchars($pdf['link']);
        $bg     = htmlspecialchars($pdf['color']['bg']);
        $border = htmlspecialchars($pdf['color']['border']);
        $color  = htmlspecialchars($pdf['color']['text']);
      ?>
      <a href="<?= $href ?>"
         target="_blank"
         rel="noopener noreferrer"
         class="pdf-btn"
         style="background:<?= $bg ?>; border-color:<?= $border ?>; color:<?= $color ?>;">
        <span class="btn-icon"><?= $pdf['icon'] ?></span>
        <div class="btn-text">
          <div class="brand"><?= htmlspecialchars($pdf['label']) ?></div>
          <div class="desc"><?= htmlspecialchars($pdf['desc']) ?></div>
        </div>
        <span class="arrow">→</span>
      </a>
    <?php endforeach; ?>
  </div>

  <!-- ── Section Divider ── -->
  <div class="section-divider">
    <span class="section-label">🌐 Visit Our Websites</span>
  </div>

  <!-- ── Website Links ── -->
  <div class="website-row">
    <?php foreach ($websites as $site): ?>
      <?php
        $href   = htmlspecialchars($site['url']);
        $bg     = htmlspecialchars($site['color']['bg']);
        $border = htmlspecialchars($site['color']['border']);
        $color  = htmlspecialchars($site['color']['text']);
      ?>
      <a href="<?= $href ?>"
         target="_blank"
         rel="noopener noreferrer"
         class="web-btn"
         style="background:<?= $bg ?>; border-color:<?= $border ?>; color:<?= $color ?>;">
        <span class="web-badge">↗ Visit</span>
        <span class="web-btn-icon"><?= $site['icon'] ?></span>
        <div class="web-btn-label"><?= htmlspecialchars($site['label']) ?></div>
        <div class="web-btn-url"><?= htmlspecialchars($site['tagline']) ?></div>
      </a>
    <?php endforeach; ?>
  </div>

  <p class="gdrive-note">
    <svg width="13" height="13" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
      <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
      <path d="M43.65 25 29.9 1.2C28.55 2 27.4 3.1 26.6 4.5L1.2 48.5c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="#00ac47"/>
      <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.8z" fill="#ea4335"/>
      <path d="M43.65 25 57.4 1.2C56.05.4 54.5 0 52.9 0H34.4c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
      <path d="M59.8 53H27.5L13.75 76.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
      <path d="M73.4 26.5l-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25 59.8 53h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
    </svg>
    Price lists open in Google Drive
  </p>
  <p class="footer">Central Industries PLC — Since 1985 | nationalpvc.com</p>

</div>
</body>
</html>