import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/national-logo.png";
import WaterDrops from "../Components/WaterDrops";

const PIPES_PRODUCTS = [
    { emoji: "🚰", name: "PVC Pipes",               desc: "Pressure & drainage pipes",     url: "https://nationalpvc.com/?product=upvc-pressure-pipes-pe-2" },
    { emoji: "🔧", name: "Fittings",                desc: "Elbows, tees, couplings",        url: "https://nationalpvc.com/?product=national-pvc-upvc-fittings" },
    { emoji: "🔵", name: "HDPE Pipes",              desc: "High-density polyethylene",      url: "https://nationalpvc.com/?product=upvc-pressure-pipes-pe" },
    { emoji: "💧", name: "PE Tanks",                desc: "Storage & overhead tanks",       url: "https://nationalpvc.com/?product=pe-tanks" },
    { emoji: "🏗️", name: "Conduit Pipes",          desc: "Electrical conduit systems",     url: "https://nationalpvc.com/?product=conduits" },
    { emoji: "🌧️", name: "Rain Water Management", desc: "Rainwater collection systems",   url: "https://nationalpvc.com/?post_type=product&wpf_fbv=1&wpf_filter_cat_0=49" },
];

const ELECTRIC_PRODUCTS = [
    { emoji: "💡", name: "Gang Switches",        desc: "Multi-gang switch units",        url: "http://kryptonelectric.com/p-search-cat.php?q=Gang%20Switches" },
    { emoji: "🔌", name: "Switch Sockets",       desc: "Combined switch & socket units", url: "http://kryptonelectric.com/p-search-cat.php?q=Switch%20Sockets" },
    { emoji: "🔀", name: "Other Switches",       desc: "Specialty switching solutions",  url: "http://kryptonelectric.com/p-search-cat.php?q=Other%20Switches" },
    { emoji: "⚡", name: "Switch Gears",         desc: "Industrial switchgear systems",  url: "http://kryptonelectric.com/p-search-cat.php?q=Switch%20Gears" },
    { emoji: "🔧", name: "Accessories",          desc: "Electrical accessories & parts", url: "http://kryptonelectric.com/p-search-cat.php?q=accessories" },
    { emoji: "🏷️", name: "Onesto",             desc: "Onesto brand products",           url: "http://kryptonelectric.com/p-search-cat.php?q=Onesto" },
    { emoji: "⬜", name: "Pioneer Series White", desc: "Pioneer white series range",     url: "http://kryptonelectric.com/p-search-cat.php?q=Pioneer%20Series%20White" },
    { emoji: "🩶", name: "Pioneer Series Gray",  desc: "Pioneer gray series range",      url: "http://kryptonelectric.com/p-search-cat.php?q=Pioneer%20Series%20Gray" },
];

const TABS = ["Contact", "Location", "Products", "Hours"];

const CompanyInfo = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("Contact");
    const [productCategory, setProductCategory] = useState("pipes");

    const activeBtnStyle = {
        flex: 1, padding: "1.1vh 0", border: "none", cursor: "pointer",
        fontSize: "clamp(0.78rem, 1.6vw, 0.95rem)", fontWeight: 700,
        letterSpacing: "0.04em", transition: "all 0.2s",
        background: "hsl(190 100% 60%)", color: "#001a20",
    };
    const inactiveBtnStyle = {
        flex: 1, padding: "1.1vh 0", border: "none", cursor: "pointer",
        fontSize: "clamp(0.78rem, 1.6vw, 0.95rem)", fontWeight: 700,
        letterSpacing: "0.04em", transition: "all 0.2s",
        background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.45)",
    };

    const currentProducts = productCategory === "pipes" ? PIPES_PRODUCTS : ELECTRIC_PRODUCTS;

    return (
        <div style={{
            position: "relative", width: "100vw", height: "100vh",
            overflow: "hidden", display: "flex", flexDirection: "column",
            background: "linear-gradient(180deg, hsl(235 85% 20%) 0%, hsl(220 80% 10%) 100%)",
        }}>
            <style>{`
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes float-logo {
                    0%,100% { transform: translateY(0); }
                    50%     { transform: translateY(-6px); }
                }
                .info-tab {
                    flex: 1; padding: 1.2vh 0; border: none;
                    background: transparent; cursor: pointer;
                    font-size: clamp(0.75rem, 1.6vw, 1rem); font-weight: 700;
                    color: rgba(255,255,255,0.4); border-bottom: 3px solid transparent;
                    transition: all 0.2s; text-transform: uppercase;
                    letter-spacing: 0.06em; white-space: nowrap;
                }
                .info-tab.active { color: hsl(190 100% 60%); border-bottom-color: hsl(190 100% 60%); }
                .info-tab:hover  { color: rgba(255,255,255,0.75); }

                .detail-row {
                    display: flex; align-items: flex-start; gap: 3vw;
                    padding: 2vh 3vw; border-radius: 1rem;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.09);
                    animation: slide-up 0.35s ease forwards;
                }
                .product-card {
                    display: flex; align-items: center; gap: 2.5vw;
                    padding: 1.6vh 3vw; border-radius: 1rem;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.09);
                    animation: slide-up 0.35s ease forwards;
                    transition: background 0.2s; text-decoration: none; cursor: pointer;
                }
                .product-card:hover  { background: rgba(255,255,255,0.12); }
                .product-card:active { background: rgba(255,255,255,0.18); transform: scale(0.99); }

                .site-btn {
                    display: flex; align-items: center; justify-content: center; gap: 1.5vw;
                    width: 100%; padding: 1.8vh 0; border-radius: 1rem;
                    font-size: clamp(1rem, 2.2vw, 1.3rem); font-weight: 800;
                    cursor: pointer; transition: all 0.2s; text-decoration: none;
                    border: none; letter-spacing: 0.03em;
                }
                .site-btn-pipes {
                    background: linear-gradient(135deg, hsl(190 100% 35%), hsl(210 80% 28%));
                    color: #fff;
                    box-shadow: 0 4px 20px hsla(190,100%,40%,0.35);
                }
                .site-btn-pipes:hover { background: linear-gradient(135deg, hsl(190 100% 42%), hsl(210 80% 34%)); }
                .site-btn-electric {
                    background: linear-gradient(135deg, hsl(45 100% 46%), hsl(35 100% 38%));
                    color: #1a1000;
                    box-shadow: 0 4px 20px hsla(45,100%,46%,0.35);
                }
                .site-btn-electric:hover { background: linear-gradient(135deg, hsl(45 100% 54%), hsl(35 100% 44%)); }

                .map-btn {
                    display: flex; align-items: center; justify-content: center; gap: 1.5vw;
                    width: 100%; padding: 1.8vh 0; border-radius: 1rem;
                    border: 2px solid hsl(190 100% 60%); background: hsla(190,100%,60%,0.1);
                    color: hsl(190 100% 65%); font-size: clamp(1rem, 2.2vw, 1.3rem);
                    font-weight: 700; cursor: pointer; transition: all 0.2s; text-decoration: none;
                }
                .map-btn:hover { background: hsla(190,100%,60%,0.22); }

                .call-btn {
                    display: flex; align-items: center; justify-content: center; gap: 1.5vw;
                    width: 100%; padding: 1.8vh 0; border-radius: 1rem; border: none;
                    background: linear-gradient(135deg, hsl(140 70% 40%), hsl(160 70% 30%));
                    color: #fff; font-size: clamp(1.1rem, 2.5vw, 1.5rem); font-weight: 800;
                    cursor: pointer; transition: transform 0.15s; text-decoration: none;
                    box-shadow: 0 4px 20px hsla(140,70%,40%,0.4);
                }
                .call-btn:active { transform: scale(0.97); }

                .hour-row {
                    display: flex; justify-content: space-between; align-items: center;
                    padding: 1.4vh 3vw; border-radius: 0.8rem;
                    animation: slide-up 0.35s ease forwards;
                }
                .hour-row.open   { background: hsla(140,70%,40%,0.15); border: 1px solid hsla(140,70%,50%,0.25); }
                .hour-row.closed { background: rgba(255,255,255,0.04);  border: 1px solid rgba(255,255,255,0.08); }
            `}</style>

            {/* ── HEADER ── */}
            <div style={{
                flex: "0 0 auto", display: "flex", flexDirection: "column",
                alignItems: "center", padding: "3.5vh 5vw 0", gap: "1.5vh",
                background: "linear-gradient(180deg, hsl(235 85% 26%) 0%, transparent 100%)",
            }}>
                <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <button
                        onClick={() => navigate("/")}
                        style={{
                            display: "flex", alignItems: "center", gap: "0.6vw",
                            background: "rgba(255,255,255,0.1)", border: "1.5px solid rgba(255,255,255,0.18)",
                            borderRadius: "0.7rem", padding: "0.8vh 2.5vw",
                            color: "rgba(255,255,255,0.8)", fontSize: "clamp(0.8rem,1.7vw,1.05rem)",
                            fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
                        onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                    >
                        ← Back
                    </button>
                    <button
                        onClick={() => navigate("/register")}
                        style={{
                            display: "flex", alignItems: "center", gap: "0.6vw",
                            background: "linear-gradient(135deg, hsl(45 100% 52%), hsl(35 100% 46%))",
                            border: "none", borderRadius: "0.7rem", padding: "0.8vh 2.5vw",
                            color: "#1a1000", fontSize: "clamp(0.8rem,1.7vw,1.05rem)",
                            fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap",
                        }}
                    >
                        👆 Register Now
                    </button>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "3vw", width: "100%" }}>
                    <img src={logo} alt="National" style={{
                        width: "clamp(52px,11vw,80px)", height: "clamp(52px,11vw,80px)",
                        objectFit: "contain", borderRadius: "0.9rem",
                        background: "rgba(255,255,255,0.93)", padding: "0.4rem",
                        flexShrink: 0, animation: "float-logo 3s ease-in-out infinite",
                    }} />
                    <div>
                        <h1 style={{ fontSize: "clamp(1.3rem,3.2vw,2.1rem)", fontWeight: 900, color: "#fff", margin: 0, lineHeight: 1.1 }}>
                            Central Industries PLC
                        </h1>
                        <p style={{ fontSize: "clamp(0.75rem,1.5vw,0.95rem)", color: "hsl(190 100% 60%)", margin: "0.2rem 0 0", fontWeight: 600 }}>
                            National Pipes &amp; Fittings · Est. 1985
                        </p>
                        <p style={{ fontSize: "clamp(0.65rem,1.2vw,0.78rem)", color: "rgba(255,255,255,0.35)", margin: "0.1rem 0 0" }}>
                            40 Years of Manufacturing Excellence
                        </p>
                    </div>
                </div>

                <div style={{ display: "flex", width: "100%", borderBottom: "1px solid rgba(255,255,255,0.1)", marginTop: "0.5vh" }}>
                    {TABS.map(tab => (
                        <button key={tab} className={`info-tab ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>
                            {tab === "Contact" ? "📞 Contact" : tab === "Location" ? "📍 Location" : tab === "Products" ? "🛍️ Products" : "🕐 Hours"}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── TAB CONTENT ── */}
            <div style={{ flex: 1, overflowY: "auto", padding: "2.5vh 5vw", display: "flex", flexDirection: "column", gap: "1.8vh" }}>

                {/* ── CONTACT TAB ── */}
                {activeTab === "Contact" && (
                    <>
                        <a className="call-btn" href="tel:+94117421421">
                            <span style={{ fontSize: "clamp(1.2rem,2.5vw,1.6rem)" }}>📞</span>
                            Call Us: +94 11 742 1421
                        </a>

                        {/* ── Visit Our Sites ── */}
                        <p style={{ fontSize: "clamp(0.7rem,1.4vw,0.85rem)", color: "rgba(255,255,255,0.4)", margin: "0.5vh 0 0", textAlign: "center", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>
                            🌐 Visit Our Websites
                        </p>
                        <a className="site-btn site-btn-pipes" href="https://nationalpvc.com/" target="_blank" rel="noreferrer">
                            <span style={{ fontSize: "clamp(1.1rem,2.3vw,1.5rem)" }}>🚰</span>
                            Pipes &amp; Fittings — nationalpvc.com ↗
                        </a>
                        <a className="site-btn site-btn-electric" href="http://kryptonelectric.com/index.php" target="_blank" rel="noreferrer">
                            <span style={{ fontSize: "clamp(1.1rem,2.3vw,1.5rem)" }}>⚡</span>
                            Electric Products — kryptonelectric.com ↗
                        </a>

                        {[
                            { icon: "✉️", label: "Email",      value: "info@nationalpvc.com", href: null },
                            { icon: "📱", label: "WhatsApp",   value: "+94 70 761 3650",       href: null },
                            { icon: "📘", label: "Facebook",   value: "fb.com/nationalpvc",    href: null },
                        ].map(({ icon, label, value, href }, i) => (
                            <div key={label} className="detail-row" style={{ animationDelay: `${i * 0.06}s` }}>
                                <span style={{ fontSize: "clamp(1.4rem,3vw,2rem)", flexShrink: 0 }}>{icon}</span>
                                <div>
                                    <p style={{ fontSize: "clamp(0.65rem,1.3vw,0.82rem)", color: "rgba(255,255,255,0.38)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, margin: 0 }}>{label}</p>
                                    <p style={{ fontSize: "clamp(0.95rem,2vw,1.25rem)", color: "#fff", fontWeight: 600, margin: "0.2rem 0 0", wordBreak: "break-all" }}>{value}</p>
                                </div>
                            </div>
                        ))}

                        <div style={{ padding: "1.5vh 3vw", borderRadius: "1rem", background: "hsla(190,100%,55%,0.1)", border: "1px solid hsla(190,100%,60%,0.25)", textAlign: "center" }}>
                            <p style={{ fontSize: "clamp(0.85rem,1.8vw,1.1rem)", color: "hsl(190 100% 70%)", margin: 0, fontWeight: 700 }}>
                                🎁 Register &amp; get 10% OFF your next purchase!
                            </p>
                        </div>
                    </>
                )}

                {/* ── LOCATION TAB ── */}
                {activeTab === "Location" && (
                    <>
                        {[
                            { icon: "🏢", label: "Head Office", value: "No: 312 B470, Sri Jayawardenepura Kotte" },
                            { icon: "🏭", label: "Factory",     value: "Yakkala, Wattala" },
                        ].map(({ icon, label, value }, i) => (
                            <div key={label} className="detail-row" style={{ animationDelay: `${i * 0.07}s` }}>
                                <span style={{ fontSize: "clamp(1.5rem,3.2vw,2.2rem)", flexShrink: 0 }}>{icon}</span>
                                <div>
                                    <p style={{ fontSize: "clamp(0.65rem,1.3vw,0.82rem)", color: "rgba(255,255,255,0.38)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, margin: 0 }}>{label}</p>
                                    <p style={{ fontSize: "clamp(0.9rem,1.9vw,1.18rem)", color: "#fff", fontWeight: 600, margin: "0.2rem 0 0", lineHeight: 1.4 }}>{value}</p>
                                </div>
                            </div>
                        ))}
                        <a className="map-btn" href="https://maps.google.com/?q=Sri+Jayawardenepura+Kotte" target="_blank" rel="noreferrer">
                            <span style={{ fontSize: "clamp(1.2rem,2.5vw,1.6rem)" }}>🗺️</span>
                            Open in Google Maps
                        </a>
                        <div style={{
                            borderRadius: "1.2rem", background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.1)", padding: "3vh",
                            textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "1vh",
                        }}>
                            <span style={{ fontSize: "clamp(2rem,5vw,3.5rem)" }}>📌</span>
                            <p style={{ fontSize: "clamp(0.85rem,1.8vw,1.1rem)", color: "rgba(255,255,255,0.55)", margin: 0 }}>
                                Sri Jayawardenepura Kotte · Factory at Yakkala, Wattala
                            </p>
                            <p style={{ fontSize: "clamp(0.75rem,1.5vw,0.9rem)", color: "rgba(255,255,255,0.3)", margin: 0 }}>
                                Easy highway access · Free parking available
                            </p>
                        </div>
                    </>
                )}

                {/* ── PRODUCTS TAB ── */}
                {activeTab === "Products" && (
                    <>
                        {/* ── Category toggle ── */}
                        <div style={{ display: "flex", borderRadius: "0.8rem", overflow: "hidden", border: "1.5px solid rgba(255,255,255,0.15)" }}>
                            <button
                                style={productCategory === "pipes" ? activeBtnStyle : inactiveBtnStyle}
                                onClick={(e) => { e.stopPropagation(); setProductCategory("pipes"); }}
                            >
                                🚰 Pipes &amp; Fittings
                            </button>
                            <button
                                style={productCategory === "electric" ? activeBtnStyle : inactiveBtnStyle}
                                onClick={(e) => { e.stopPropagation(); setProductCategory("electric"); }}
                            >
                                ⚡ Electric Products
                            </button>
                        </div>

                        {/* Visit full site button */}
                        {productCategory === "pipes" ? (
                            <a className="site-btn site-btn-pipes" href="https://nationalpvc.com/" target="_blank" rel="noreferrer">
                                <span style={{ fontSize: "clamp(1rem,2vw,1.3rem)" }}>🌐</span>
                                Visit Full Site — nationalpvc.com ↗
                            </a>
                        ) : (
                            <a className="site-btn site-btn-electric" href="http://kryptonelectric.com/index.php" target="_blank" rel="noreferrer">
                                <span style={{ fontSize: "clamp(1rem,2vw,1.3rem)" }}>🌐</span>
                                Visit Full Site — kryptonelectric.com ↗
                            </a>
                        )}

                        <p style={{ fontSize: "clamp(0.8rem,1.7vw,1.05rem)", color: "rgba(255,255,255,0.45)", margin: 0, textAlign: "center" }}>
                            Tap a product to view details
                        </p>

                        {/* Product cards — open in same window so back button works */}
                        {currentProducts.map(({ emoji, name, desc, url }, i) => (
                            <div
                                key={name}
                                className="product-card"
                                style={{ animationDelay: `${i * 0.06}s` }}
                                onClick={() => window.open(url, "_blank")}
                            >
                                <span style={{ fontSize: "clamp(1.6rem,3.5vw,2.4rem)", flexShrink: 0 }}>{emoji}</span>
                                <div>
                                    <p style={{ fontSize: "clamp(0.95rem,2vw,1.25rem)", color: "#fff", fontWeight: 700, margin: 0 }}>{name}</p>
                                    <p style={{ fontSize: "clamp(0.72rem,1.4vw,0.88rem)", color: "rgba(255,255,255,0.45)", margin: "0.15rem 0 0" }}>{desc}</p>
                                </div>
                                <span style={{ marginLeft: "auto", color: "hsl(190 100% 60%)", fontSize: "1.3rem", fontWeight: 700 }}>↗</span>
                            </div>
                        ))}
                    </>
                )}

                {/* ── HOURS TAB ── */}
                {activeTab === "Hours" && (
                    <>
                        {[
                            { day: "Monday",    hours: "9:00 AM – 5:30 PM", open: true  },
                            { day: "Tuesday",   hours: "9:00 AM – 5:30 PM", open: true  },
                            { day: "Wednesday", hours: "9:00 AM – 5:30 PM", open: true  },
                            { day: "Thursday",  hours: "9:00 AM – 5:30 PM", open: true  },
                            { day: "Friday",    hours: "9:00 AM – 5:30 PM", open: true  },
                            { day: "Saturday",  hours: "9:00 AM – 4:30 PM", open: true  },
                            { day: "Sunday",    hours: "Closed",             open: false },
                        ].map(({ day, hours, open }, i) => (
                            <div key={day} className={`hour-row ${open ? "open" : "closed"}`} style={{ animationDelay: `${i * 0.05}s` }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "2vw" }}>
                                    <span style={{ fontSize: "clamp(0.9rem,1.9vw,1.2rem)", color: "rgba(255,255,255,0.3)", width: "2.5em", flexShrink: 0 }}>
                                        {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i]}
                                    </span>
                                    <span style={{ fontSize: "clamp(0.95rem,2vw,1.25rem)", color: "#fff", fontWeight: 600 }}>{day}</span>
                                </div>
                                <span style={{ fontSize: "clamp(0.9rem,1.9vw,1.15rem)", fontWeight: 700, color: open ? "hsl(140 70% 60%)" : "rgba(255,255,255,0.3)" }}>
                                    {hours}
                                </span>
                            </div>
                        ))}
                        <div style={{
                            padding: "1.8vh 3vw", borderRadius: "1rem",
                            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
                            display: "flex", alignItems: "flex-start", gap: "2.5vw",
                        }}>
                            <span style={{ fontSize: "clamp(1.2rem,2.5vw,1.6rem)", flexShrink: 0 }}>🗓️</span>
                            <div>
                                <p style={{ fontSize: "clamp(0.85rem,1.8vw,1.05rem)", color: "rgba(255,255,255,0.7)", fontWeight: 600, margin: 0 }}>Public Holidays</p>
                                <p style={{ fontSize: "clamp(0.75rem,1.5vw,0.9rem)", color: "rgba(255,255,255,0.38)", margin: "0.2rem 0 0" }}>
                                    Hours may vary on public holidays. Call ahead to confirm.
                                </p>
                            </div>
                        </div>
                    </>
                )}

            </div>

            {/* ── Bottom CTA strip ── */}
            <div style={{
                flex: "0 0 auto", padding: "2vh 5vw",
                borderTop: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(0,0,0,0.3)",
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: "3vw",
            }}>
                <p style={{ fontSize: "clamp(0.8rem,1.7vw,1rem)", color: "rgba(255,255,255,0.5)", margin: 0 }}>
                    Don't miss your <span style={{ color: "hsl(45 100% 58%)", fontWeight: 700 }}>10% discount!</span>
                </p>
                <button
                    onClick={() => navigate("/register")}
                    style={{
                        flexShrink: 0, padding: "1.2vh 4vw", borderRadius: "0.8rem", border: "none",
                        background: "linear-gradient(135deg, hsl(45 100% 52%), hsl(35 100% 46%))",
                        color: "#1a1000", fontSize: "clamp(0.85rem,1.8vw,1.1rem)",
                        fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap",
                    }}
                >
                    Register Now →
                </button>
            </div>

        </div>
    );
};

export default CompanyInfo;