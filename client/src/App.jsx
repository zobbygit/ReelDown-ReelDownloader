import { useState, useEffect, useRef } from "react";
import axios from "axios";

/* ─────────────────────────────────────────────
   GLOBAL STYLES injected via <style> tag
───────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --ig-pink:   #E1306C;
      --ig-orange: #F77737;
      --ig-purple: #833AB4;
      --grad: linear-gradient(135deg, #833AB4 0%, #E1306C 50%, #F77737 100%);
      --grad-soft: linear-gradient(135deg, #833AB420 0%, #E1306C15 50%, #F7773710 100%);
      --dark:  #0A0A0F;
      --dark2: #12121A;
      --dark3: #1C1C28;
      --border: rgba(255,255,255,0.07);
      --text:  #F0F0F5;
      --muted: #888899;
      --card-shadow: 0 20px 60px rgba(0,0,0,0.5);
      --glow: 0 0 40px rgba(225,48,108,0.25);
    }

    html { scroll-behavior: smooth; }

    body {
      font-family: 'DM Sans', sans-serif;
      background: var(--dark);
      color: var(--text);
      overflow-x: hidden;
      min-height: 100vh;
    }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: var(--dark2); }
    ::-webkit-scrollbar-thumb { background: var(--ig-pink); border-radius: 3px; }

    /* Noise overlay */
    body::before {
      content: '';
      position: fixed; inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
      pointer-events: none; z-index: 9999; opacity: 0.4;
    }

    /* ── NAV ── */
    nav {
      position: sticky; top: 0; z-index: 100;
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 clamp(16px, 5vw, 80px);
      height: 68px;
      background: rgba(10,10,15,0.85);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border);
    }

    .logo {
      display: flex; align-items: center; gap: 10px;
      font-family: 'Syne', sans-serif;
      font-weight: 800; font-size: 1.25rem;
      cursor: pointer; text-decoration: none; color: var(--text);
    }
    .logo-icon {
      width: 34px; height: 34px;
      background: var(--grad);
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      font-size: 1rem;
      box-shadow: 0 4px 15px rgba(225,48,108,0.4);
    }

    .nav-links {
      display: flex; align-items: center; gap: 8px;
    }
    .nav-links button {
      background: none; border: none;
      color: var(--muted); font-family: 'DM Sans', sans-serif;
      font-size: 0.9rem; padding: 8px 14px;
      border-radius: 8px; cursor: pointer;
      transition: color 0.2s, background 0.2s;
    }
    .nav-links button:hover,
    .nav-links button.active {
      color: var(--text); background: var(--dark3);
    }
    .nav-links button.active { color: var(--ig-pink); }

    .nav-cta {
      background: var(--grad) !important;
      color: white !important;
      padding: 8px 18px !important;
      font-weight: 500 !important;
      box-shadow: 0 4px 15px rgba(225,48,108,0.35);
    }
    .nav-cta:hover { opacity: 0.9; transform: translateY(-1px); }

    /* Mobile hamburger */
    .hamburger {
      display: none; flex-direction: column; gap: 5px;
      background: none; border: none; cursor: pointer; padding: 4px;
    }
    .hamburger span {
      display: block; width: 24px; height: 2px;
      background: var(--text); border-radius: 2px;
      transition: all 0.3s;
    }

    @media(max-width: 640px) {
      .hamburger { display: flex; }
      .nav-links { display: none; }
      .nav-links.open {
        display: flex; flex-direction: column; position: absolute;
        top: 68px; left: 0; right: 0;
        background: var(--dark2); border-bottom: 1px solid var(--border);
        padding: 12px 20px 20px; gap: 4px;
      }
      .nav-links.open button { width: 100%; text-align: left; }
    }

    /* ── HERO ── */
    .hero {
      position: relative;
      padding: clamp(60px, 10vw, 120px) clamp(16px, 5vw, 80px) clamp(40px, 6vw, 80px);
      text-align: center; overflow: hidden;
    }
    .hero-glow {
      position: absolute;
      width: 600px; height: 600px;
      background: radial-gradient(circle, rgba(225,48,108,0.15) 0%, transparent 70%);
      top: -100px; left: 50%; transform: translateX(-50%);
      pointer-events: none;
    }
    .hero-badge {
      display: inline-flex; align-items: center; gap: 8px;
      background: var(--dark3); border: 1px solid var(--border);
      border-radius: 100px; padding: 6px 16px;
      font-size: 0.8rem; color: var(--muted);
      margin-bottom: 28px;
      animation: fadeUp 0.6s ease both;
    }
    .hero-badge span { color: var(--ig-pink); font-weight: 500; }

    .hero h1 {
      font-family: 'Syne', sans-serif;
      font-size: clamp(2.4rem, 6vw, 5rem);
      font-weight: 800;
      line-height: 1.05;
      letter-spacing: -0.03em;
      margin-bottom: 20px;
      animation: fadeUp 0.6s 0.1s ease both;
    }
    .hero h1 .gradient-text {
      background: var(--grad);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero p {
      font-size: clamp(1rem, 2vw, 1.2rem);
      color: var(--muted); max-width: 520px; margin: 0 auto 40px;
      line-height: 1.7;
      animation: fadeUp 0.6s 0.2s ease both;
    }

    /* ── INPUT CARD ── */
    .input-card {
      background: var(--dark2);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: clamp(20px, 4vw, 36px);
      max-width: 680px; margin: 0 auto;
      box-shadow: var(--card-shadow);
      animation: fadeUp 0.6s 0.3s ease both;
      position: relative; overflow: hidden;
    }
    .input-card::before {
      content: '';
      position: absolute; top: 0; left: 0; right: 0; height: 2px;
      background: var(--grad);
    }

    .input-row {
      display: flex; gap: 12px;
      flex-wrap: wrap;
    }
    .input-wrap {
      flex: 1; min-width: 0;
      position: relative;
    }
    .input-wrap .paste-icon {
      position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
      color: var(--muted); font-size: 1.1rem; pointer-events: none;
    }
    .url-input {
      width: 100%; padding: 14px 14px 14px 42px;
      background: var(--dark3); border: 1.5px solid var(--border);
      border-radius: 12px; color: var(--text);
      font-family: 'DM Sans', sans-serif; font-size: 0.95rem;
      transition: border-color 0.2s, box-shadow 0.2s;
      outline: none;
    }
    .url-input::placeholder { color: var(--muted); }
    .url-input:focus {
      border-color: var(--ig-pink);
      box-shadow: 0 0 0 3px rgba(225,48,108,0.12);
    }

    .btn-download {
      padding: 14px 28px;
      background: var(--grad);
      border: none; border-radius: 12px;
      color: white; font-family: 'Syne', sans-serif;
      font-weight: 700; font-size: 0.95rem;
      cursor: pointer; white-space: nowrap;
      box-shadow: 0 6px 20px rgba(225,48,108,0.4);
      transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
      display: flex; align-items: center; gap: 8px;
    }
    .btn-download:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(225,48,108,0.5);
    }
    .btn-download:disabled { opacity: 0.6; cursor: not-allowed; }

    .btn-clear {
      padding: 10px 18px;
      background: var(--dark3); border: 1px solid var(--border);
      border-radius: 10px; color: var(--muted);
      font-family: 'DM Sans', sans-serif; font-size: 0.85rem;
      cursor: pointer; transition: all 0.2s;
      margin-top: 10px;
    }
    .btn-clear:hover { color: var(--text); border-color: rgba(255,255,255,0.2); }

    /* ── ERROR / SUCCESS ── */
    .error-msg {
      display: flex; align-items: center; gap: 8px;
      margin-top: 14px; padding: 12px 16px;
      background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3);
      border-radius: 10px; color: #F87171; font-size: 0.88rem;
    }

    /* ── VIDEO PREVIEW ── */
    .video-preview {
      margin-top: 24px;
      background: var(--dark3); border: 1px solid var(--border);
      border-radius: 16px; overflow: hidden;
      animation: fadeUp 0.4s ease both;
    }
    .video-preview video {
      width: 100%; display: block; max-height: 380px; object-fit: contain;
      background: #000;
    }
    .video-actions {
      padding: 16px; display: flex; gap: 10px; flex-wrap: wrap;
    }
    .btn-save {
      flex: 1; padding: 12px;
      background: var(--grad); border: none; border-radius: 10px;
      color: white; font-family: 'Syne', sans-serif; font-weight: 700;
      font-size: 0.9rem; cursor: pointer;
      box-shadow: 0 4px 15px rgba(225,48,108,0.35);
      transition: all 0.2s; display: flex; align-items: center;
      justify-content: center; gap: 8px; text-decoration: none;
    }
    .btn-save:hover { transform: translateY(-1px); box-shadow: 0 8px 25px rgba(225,48,108,0.45); }

    .btn-reset {
      padding: 12px 18px;
      background: none; border: 1.5px solid rgba(239,68,68,0.5);
      border-radius: 10px; color: #F87171;
      font-family: 'DM Sans', sans-serif; font-size: 0.88rem;
      cursor: pointer; transition: all 0.2s;
      display: flex; align-items: center; gap: 6px;
    }
    .btn-reset:hover { background: rgba(239,68,68,0.1); }

    /* ── LOADER ── */
    .loader {
      display: inline-block; width: 18px; height: 18px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white; border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }

    /* ── STATS STRIP ── */
    .stats-strip {
      display: flex; justify-content: center; gap: clamp(24px, 5vw, 60px);
      flex-wrap: wrap;
      padding: 40px clamp(16px, 5vw, 80px);
      border-top: 1px solid var(--border);
      border-bottom: 1px solid var(--border);
    }
    .stat { text-align: center; }
    .stat-num {
      font-family: 'Syne', sans-serif; font-size: 2rem; font-weight: 800;
      background: var(--grad);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .stat-label { font-size: 0.82rem; color: var(--muted); margin-top: 2px; }

    /* ── HOW IT WORKS PAGE ── */
    .page { padding: clamp(50px, 8vw, 100px) clamp(16px, 5vw, 80px); }
    .page-title {
      font-family: 'Syne', sans-serif; font-size: clamp(2rem, 4vw, 3.2rem);
      font-weight: 800; letter-spacing: -0.02em; margin-bottom: 12px;
    }
    .page-sub { color: var(--muted); font-size: 1.05rem; margin-bottom: 56px; }

    .steps-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px; max-width: 1000px; margin: 0 auto;
    }
    .step-card {
      background: var(--dark2); border: 1px solid var(--border);
      border-radius: 18px; padding: 30px;
      position: relative; overflow: hidden;
      transition: transform 0.3s, border-color 0.3s;
    }
    .step-card:hover { transform: translateY(-4px); border-color: rgba(225,48,108,0.4); }
    .step-num {
      font-family: 'Syne', sans-serif; font-size: 3.5rem;
      font-weight: 800; color: var(--dark3); line-height: 1;
      position: absolute; top: 16px; right: 20px;
    }
    .step-icon {
      font-size: 2rem; margin-bottom: 16px;
      width: 52px; height: 52px; background: var(--grad-soft);
      border: 1px solid rgba(225,48,108,0.2);
      border-radius: 14px; display: flex; align-items: center; justify-content: center;
    }
    .step-card h3 {
      font-family: 'Syne', sans-serif; font-size: 1.1rem;
      font-weight: 700; margin-bottom: 8px;
    }
    .step-card p { font-size: 0.9rem; color: var(--muted); line-height: 1.65; }

    /* ── FEATURES PAGE ── */
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 16px; max-width: 1100px; margin: 0 auto;
    }
    .feature-card {
      background: var(--dark2); border: 1px solid var(--border);
      border-radius: 16px; padding: 26px;
      transition: transform 0.3s, border-color 0.3s;
    }
    .feature-card:hover { transform: translateY(-3px); border-color: rgba(131,58,180,0.4); }
    .feature-icon {
      font-size: 1.6rem; margin-bottom: 14px;
      width: 46px; height: 46px;
      background: var(--grad-soft); border: 1px solid rgba(131,58,180,0.25);
      border-radius: 12px; display: flex; align-items: center; justify-content: center;
    }
    .feature-card h3 {
      font-family: 'Syne', sans-serif; font-size: 1rem;
      font-weight: 700; margin-bottom: 6px;
    }
    .feature-card p { font-size: 0.87rem; color: var(--muted); line-height: 1.6; }

    /* ── FAQ ── */
    .faq-list { max-width: 700px; margin: 0 auto; }
    .faq-item {
      background: var(--dark2); border: 1px solid var(--border);
      border-radius: 14px; margin-bottom: 10px; overflow: hidden;
    }
    .faq-q {
      width: 100%; background: none; border: none;
      padding: 18px 22px; text-align: left; cursor: pointer;
      display: flex; justify-content: space-between; align-items: center;
      font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 500;
      color: var(--text); transition: color 0.2s;
    }
    .faq-q:hover { color: var(--ig-pink); }
    .faq-chevron { transition: transform 0.3s; color: var(--muted); }
    .faq-chevron.open { transform: rotate(180deg); }
    .faq-a {
      max-height: 0; overflow: hidden;
      transition: max-height 0.35s ease, padding 0.3s;
      font-size: 0.88rem; color: var(--muted); line-height: 1.7;
    }
    .faq-a.open { max-height: 200px; padding: 0 22px 18px; }

    /* ── BIG BANNER ── */
    .big-banner {
      margin: 0 clamp(16px, 5vw, 80px) 60px;
      background: var(--dark2); border: 1px solid var(--border);
      border-radius: 24px; padding: clamp(36px, 6vw, 70px);
      text-align: center; position: relative; overflow: hidden;
    }
    .big-banner::before {
      content: ''; position: absolute;
      width: 500px; height: 500px;
      background: radial-gradient(circle, rgba(225,48,108,0.12) 0%, transparent 70%);
      top: 50%; left: 50%; transform: translate(-50%,-50%);
      pointer-events: none;
    }
    .big-banner h2 {
      font-family: 'Syne', sans-serif;
      font-size: clamp(1.8rem, 4vw, 3rem); font-weight: 800;
      letter-spacing: -0.02em; margin-bottom: 14px; position: relative;
    }
    .big-banner p {
      color: var(--muted); font-size: 1rem; margin-bottom: 28px;
      max-width: 480px; margin-left: auto; margin-right: auto; position: relative;
    }
    .btn-banner {
      padding: 14px 36px; background: var(--grad);
      border: none; border-radius: 12px; color: white;
      font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1rem;
      cursor: pointer; box-shadow: 0 8px 25px rgba(225,48,108,0.4);
      transition: all 0.2s; position: relative;
    }
    .btn-banner:hover { transform: translateY(-2px); box-shadow: 0 12px 35px rgba(225,48,108,0.5); }

    /* ── FOOTER ── */
    footer {
      border-top: 1px solid var(--border);
      padding: 40px clamp(16px, 5vw, 80px) 24px;
    }
    .footer-top {
      display: flex; justify-content: space-between;
      align-items: flex-start; flex-wrap: wrap; gap: 30px;
      margin-bottom: 32px;
    }
    .footer-brand p { color: var(--muted); font-size: 0.85rem; margin-top: 8px; max-width: 240px; line-height: 1.6; }
    .footer-links h4 { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.9rem; margin-bottom: 12px; }
    .footer-links ul { list-style: none; }
    .footer-links ul li { margin-bottom: 8px; }
    .footer-links ul li button {
      background: none; border: none; color: var(--muted);
      font-family: 'DM Sans', sans-serif; font-size: 0.85rem;
      cursor: pointer; padding: 0; transition: color 0.2s;
    }
    .footer-links ul li button:hover { color: var(--ig-pink); }

    .footer-bottom {
      border-top: 1px solid var(--border); padding-top: 20px;
      display: flex; justify-content: space-between; align-items: center;
      flex-wrap: wrap; gap: 10px;
    }
    .footer-bottom p { font-size: 0.82rem; color: var(--muted); }
    .footer-bottom .made-by { font-size: 0.82rem; color: var(--muted); }
    .footer-bottom .made-by span { color: var(--ig-pink); font-weight: 500; }

    /* ── ANIMATIONS ── */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(18px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .pulse { animation: pulse 1.5s ease infinite; }

    /* Supported types pills */
    .type-pills {
      display: flex; gap: 8px; flex-wrap: wrap;
      justify-content: center; margin-top: 20px;
    }
    .pill {
      display: inline-flex; align-items: center; gap: 6px;
      background: var(--dark3); border: 1px solid var(--border);
      border-radius: 100px; padding: 5px 14px;
      font-size: 0.78rem; color: var(--muted);
    }
    .pill .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--ig-pink); }
  `}</style>
);

/* ─────────────────────────────────────────────
   COMPONENTS
───────────────────────────────────────────── */

function Logo({ onClick }) {
  return (
    <a className="logo" onClick={onClick} href="#">
      <div className="logo-icon">📲</div>
      <span>ReelDown</span>
    </a>
  );
}

function Navbar({ page, setPage, menuOpen, setMenuOpen }) {
  const links = [
    { id: "home", label: "Downloader" },
    { id: "how", label: "How It Works" },
    { id: "features", label: "Features" },
  ];
  return (
    <nav>
      <Logo onClick={() => setPage("home")} />
      <div className={`nav-links${menuOpen ? " open" : ""}`}>
        {links.map((l) => (
          <button
            key={l.id}
            className={page === l.id ? "active" : ""}
            onClick={() => { setPage(l.id); setMenuOpen(false); }}
          >{l.label}</button>
        ))}
        <button className="nav-cta" onClick={() => { setPage("home"); setMenuOpen(false); }}>
          Download Now
        </button>
      </div>
      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <span /><span /><span />
      </button>
    </nav>
  );
}

/* ── HOME PAGE ── */
function HomePage() {
  const [url, setUrl] = useState("");
  const [video, setVideo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const videoRef = useRef(null);

  const handleDownload = async () => {
    if (!url.trim()) { setError("Please paste an Instagram URL first."); return; }
    try {
      setLoading(true); setError(""); setVideo("");
      const cleanUrl = url.split("?")[0];
      const res = await axios.post("http://localhost:5000/download", { url: cleanUrl });
      if (res.data.success) {
        setVideo(res.data.downloadUrl);
        setTimeout(() => videoRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 200);
      } else { setError(res.data.message); }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch Instagram video. Check the URL and try again.");
    } finally { setLoading(false); }
  };

  const handleClear = () => { setUrl(""); setVideo(""); setError(""); };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleDownload(); };

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-badge">
          <span>✦</span> Free · No login · No watermark
        </div>
        <h1>
          Download Instagram<br />
          <span className="gradient-text">Reels & Videos</span>
        </h1>
        <p>
          Paste any Instagram Reel, Post, or Video link — get a high-quality
          download in seconds. Works on mobile & desktop.
        </p>

        {/* INPUT CARD */}
        <div className="input-card">
          <div className="input-row">
            <div className="input-wrap">
              <span className="paste-icon">🔗</span>
              <input
                className="url-input"
                type="text"
                placeholder="https://www.instagram.com/reel/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <button className="btn-download" onClick={handleDownload} disabled={loading}>
              {loading ? <><div className="loader" /> Fetching...</> : <>⬇ Download</>}
            </button>
          </div>

          {(url || video) && (
            <button className="btn-clear" onClick={handleClear}>✕ Clear</button>
          )}

          {error && (
            <div className="error-msg">⚠ {error}</div>
          )}

          {video && (
            <div className="video-preview" ref={videoRef}>
              <video src={video} controls playsInline />
              <div className="video-actions">
                <a
                  className="btn-save"
                  href={video}
                  download="instagram-reel.mp4"
                  target="_blank"
                  rel="noreferrer"
                >
                  ⬇ Save to Device
                </a>
                <button className="btn-reset" onClick={handleClear}>
                  ✕ Clear Preview
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Supported types */}
        <div className="type-pills">
          {["/p/ Posts", "/reel/ Reels", "/reels/ Reels Feed"].map((t) => (
            <span className="pill" key={t}>
              <span className="dot" /> {t}
            </span>
          ))}
        </div>
      </section>

      {/* STATS */}
      <div className="stats-strip">
        {[
          { num: "100K+", label: "Videos Downloaded" },
          { num: "3", label: "URL Types Supported" },
          { num: "0", label: "Login Required" },
          { num: "HD", label: "Quality Output" },
        ].map((s) => (
          <div className="stat" key={s.label}>
            <div className="stat-num">{s.num}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ── HOW IT WORKS PAGE ── */
function HowPage() {
  const steps = [
    { icon: "📋", title: "Copy the Instagram Link", desc: "Open Instagram, find the Reel or Post you want, tap the 3-dot menu → Copy Link." },
    { icon: "📌", title: "Paste the URL", desc: "Paste the link into the input box on our downloader page. All URL formats are supported." },
    { icon: "⬇", title: "Click Download", desc: "Hit the Download button. Our server fetches the media directly from Instagram's servers." },
    { icon: "▶", title: "Preview the Video", desc: "A video player appears so you can preview the content before saving to your device." },
    { icon: "💾", title: "Save to Device", desc: "Click 'Save to Device' to download the full-quality MP4 file directly to your phone or PC." },
    { icon: "✕", title: "Clear & Go Again", desc: "Use the Clear button to reset everything and download another video instantly." },
  ];

  const faqs = [
    { q: "Is this free to use?", a: "Yes, completely free. No registration, no subscription, no hidden fees." },
    { q: "What types of Instagram URLs are supported?", a: "We support /p/ (posts), /reel/ (reels), and /reels/ (reels feed) URL formats." },
    { q: "Does the video quality change?", a: "No. We fetch the highest-quality version available from Instagram's CDN directly." },
    { q: "Do I need to log in to Instagram?", a: "No login required. Just paste the URL of any public post or reel." },
    { q: "Why is my URL not working?", a: "Make sure the post is public and the URL is copied directly from Instagram. Private accounts are not supported." },
  ];

  const [openFaq, setOpenFaq] = useState(null);

  return (
    <>
      <section className="page" style={{ textAlign: "center" }}>
        <div className="page-title">
          How to Download <span style={{ background: "var(--grad)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Instagram Reels</span>
        </div>
        <p className="page-sub">Three simple steps. No app. No sign-in. Works instantly.</p>

        <div className="steps-grid">
          {steps.map((s, i) => (
            <div className="step-card" key={i}>
              <div className="step-num">{String(i + 1).padStart(2, "0")}</div>
              <div className="step-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="page" style={{ paddingTop: 0 }}>
        <div className="page-title" style={{ textAlign: "center" }}>Frequently Asked Questions</div>
        <p className="page-sub" style={{ textAlign: "center" }}>Everything you need to know.</p>

        <div className="faq-list">
          {faqs.map((f, i) => (
            <div className="faq-item" key={i}>
              <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                {f.q}
                <span className={`faq-chevron${openFaq === i ? " open" : ""}`}>▾</span>
              </button>
              <div className={`faq-a${openFaq === i ? " open" : ""}`}>{f.a}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

/* ── FEATURES PAGE ── */
function FeaturesPage() {
  const features = [
    { icon: "⚡", title: "Lightning Fast", desc: "Our backend fetches the video URL in under 2 seconds — no waiting, no buffering." },
    { icon: "📱", title: "Mobile Friendly", desc: "Fully responsive design. Works perfectly on iPhone, Android, tablet, or desktop." },
    { icon: "🎬", title: "HD Quality", desc: "Downloads the highest resolution version available. No compression. No re-encoding." },
    { icon: "🔒", title: "Private & Secure", desc: "We don't store your downloaded videos. URLs are saved only for analytics." },
    { icon: "🧹", title: "Clear Button", desc: "One-click reset. Clear the input, preview, and state — ready for the next download." },
    { icon: "🗂", title: "Multi-Format Support", desc: "Handles /p/, /reel/, and /reels/ Instagram URL formats automatically." },
    { icon: "🌐", title: "No App Needed", desc: "Works directly in your browser. iOS, Android, Windows, macOS — all supported." },
    { icon: "📦", title: "MongoDB History", desc: "Every download is logged with the original URL, type, and timestamp." },
    { icon: "🎛", title: "Video Preview", desc: "Watch the video in-browser before saving, so you know exactly what you're downloading." },
  ];

  return (
    <>
      <section className="page" style={{ textAlign: "center" }}>
        <div className="page-title">
          Built for <span style={{ background: "var(--grad)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Speed & Simplicity</span>
        </div>
        <p className="page-sub">Everything you need. Nothing you don't.</p>

        <div className="features-grid">
          {features.map((f, i) => (
            <div className="feature-card" key={i}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech stack banner */}
      <div className="big-banner">
        <h2>Built with the <span style={{ background: "var(--grad)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>MERN Stack</span></h2>
        <p>React frontend · Express backend · MongoDB storage · Node.js runtime</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          {["React", "Express", "MongoDB", "Node.js", "Axios", "instagram-url-direct"].map((t) => (
            <span className="pill" key={t} style={{ background: "var(--dark3)" }}>
              <span className="dot" /> {t}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

/* ── FOOTER ── */
function Footer({ setPage }) {
  return (
    <footer>
      <div className="footer-top">
        <div className="footer-brand">
          <Logo />
          <p style={{ marginTop: 10 }}>
            The fastest way to download Instagram Reels and videos — free, no login, HD quality.
          </p>
        </div>
        <div className="footer-links">
          <h4>Navigation</h4>
          <ul>
            {[["home", "Downloader"], ["how", "How It Works"], ["features", "Features"]].map(([id, label]) => (
              <li key={id}><button onClick={() => setPage(id)}>{label}</button></li>
            ))}
          </ul>
        </div>
        <div className="footer-links">
          <h4>Supported</h4>
          <ul>
            {["Instagram Reels", "Instagram Posts", "Video Downloads", "Mobile Browsers", "Desktop Browsers"].map((item) => (
              <li key={item}><button>{item}</button></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 ReelDown · For educational purposes only</p>
        <p className="made-by">Made with ❤ by <span>Zohaib</span></p>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────
   ROOT APP
───────────────────────────────────────────── */
export default function App() {
  const [page, setPage] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [page]);

  return (
    <>
      <GlobalStyles />
      <Navbar page={page} setPage={setPage} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {page === "home" && <HomePage />}
      {page === "how" && <HowPage />}
      {page === "features" && <FeaturesPage />}

      {/* CTA banner above footer on non-home pages */}
      {page !== "home" && (
        <div className="big-banner" style={{ margin: "0 clamp(16px,5vw,80px) 60px" }}>
          <h2>Ready to <span style={{ background: "var(--grad)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Download?</span></h2>
          <p>Paste your Instagram URL and get your video in seconds — free, every time.</p>
          <button className="btn-banner" onClick={() => setPage("home")}>⬇ Start Downloading</button>
        </div>
      )}

      <Footer setPage={setPage} />
    </>
  );
}