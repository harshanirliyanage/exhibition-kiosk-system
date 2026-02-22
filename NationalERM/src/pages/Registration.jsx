import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import registrationBanner from "../assets/registration-banner.jpg";
import VirtualKeyboard from "@/Components/VirtualKeyboard";
import WaterDrops from "@/Components/WaterDrops";

const OTP_SERVER = "http://124.43.16.45:9696/CILWEB/Kiosk";

const professions = [
    "House Builder", "Electrician", "Plumber", "Contractor",
    "Architect", "Engineer", "Interior Designer", "Hardware Shop Owner", "Other",
];

const BENEFITS = [
    { emoji: "🎁", line1: "REGISTER NOW &", line2: "GET 35% OFF!" },
    { emoji: "🏪", line1: "VISIT OUR SHOWROOM", line2: "EXCLUSIVE DEALS AWAIT" },
    { emoji: "⚡", line1: "TAKES ONLY", line2: "60 SECONDS!" },
    { emoji: "🏆", line1: "40 YEARS OF", line2: "EXCELLENCE" },
];

const FIELDS = ["name", "phone", "email", "profession", "organization"];

const Registration = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", profession: "", organization: "", phone: "" });
    const [activeField, setActiveField] = useState("name");
    const [showDropdown, setShowDropdown] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [bannerIdx, setBannerIdx] = useState(0);

    // cursor position per field  { name: 0, phone: 0, ... }
    const [cursors, setCursors] = useState({ name: 0, email: 0, profession: 0, organization: 0, phone: 0 });
    // blink state
    const [cursorVisible, setCursorVisible] = useState(true);
    const blinkRef = useRef(null);

    // restart blink whenever active field changes or user types
    const resetBlink = () => {
        setCursorVisible(true);
        clearInterval(blinkRef.current);
        blinkRef.current = setInterval(() => setCursorVisible(v => !v), 530);
    };
    useEffect(() => { resetBlink(); return () => clearInterval(blinkRef.current); }, [activeField]);

    useEffect(() => {
        const t = setInterval(() => setBannerIdx(i => (i + 1) % BENEFITS.length), 2500);
        return () => clearInterval(t);
    }, []);

    // ── Helpers ──────────────────────────────────────────────────
    const cursorPos = cursors[activeField];
    const setCursorPos = (pos) => setCursors(prev => ({ ...prev, [activeField]: pos }));

    // ── Virtual keyboard handlers ────────────────────────────────
    const handleKeyPress = (key) => {
        if (activeField === "profession" && showDropdown) return;
        resetBlink();

        setForm(prev => {
            const val = prev[activeField];
            const pos = cursors[activeField];
            let newVal = val.slice(0, pos) + key + val.slice(pos);

            if (activeField === "name"  && !/^[a-zA-Z.\s]*$/.test(newVal)) return prev;
            if (activeField === "phone" && !/^[\d\s\-]*$/.test(newVal))     return prev;
            if (activeField === "email" && !/^[a-zA-Z0-9@._\-+]*$/.test(newVal)) return prev;

            // advance cursor after insert
            setCursors(c => ({ ...c, [activeField]: pos + key.length }));
            setErrors(e => ({ ...e, [activeField]: undefined }));
            return { ...prev, [activeField]: newVal };
        });
    };

    const handleBackspace = () => {
        if (activeField === "profession" && showDropdown) return;
        resetBlink();
        setForm(prev => {
            const val = prev[activeField];
            const pos = cursors[activeField];
            if (pos === 0) return prev;
            const newVal = val.slice(0, pos - 1) + val.slice(pos);
            setCursors(c => ({ ...c, [activeField]: pos - 1 }));
            return { ...prev, [activeField]: newVal };
        });
    };

    const handleClear = () => {
        setForm(prev => ({ ...prev, [activeField]: "" }));
        setCursorPos(0);
        resetBlink();
    };

    const handleCursorLeft  = () => { setCursorPos(Math.max(0, cursorPos - 1)); resetBlink(); };
    const handleCursorRight = () => { setCursorPos(Math.min(form[activeField].length, cursorPos + 1)); resetBlink(); };

    // When user taps a field, put cursor at end
    const focusField = (field) => {
        setActiveField(field);
        setShowDropdown(false);
        setCursors(prev => ({ ...prev, [field]: form[field].length }));
    };

    // ── Field display with blinking cursor ───────────────────────
    const FieldDisplay = ({ field, placeholder, isActive }) => {
        const val  = form[field];
        const pos  = cursors[field];
        const show = isActive && cursorVisible;

        return (
            <div
                onClick={() => focusField(field)}
                className={`kiosk-field ${isActive ? "active" : ""} ${errors[field] ? "error" : ""}`}
                style={{
                    display: "flex", alignItems: "center", overflow: "hidden",
                    whiteSpace: "nowrap", cursor: "pointer", minHeight: "2.6em",
                }}
            >
                {val.length === 0 && !isActive
                    ? <span style={{ color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>{placeholder}</span>
                    : <>
                        <span>{val.slice(0, pos)}</span>
                        {/* blinking cursor bar */}
                        <span style={{
                            display: "inline-block", width: "2px", height: "1.1em",
                            background: show ? "hsl(190 100% 60%)" : "transparent",
                            marginInline: "1px", verticalAlign: "text-bottom",
                            borderRadius: "1px", transition: "background 0.05s",
                            flexShrink: 0,
                        }} />
                        <span style={{ color: val.slice(pos).length ? "#fff" : "transparent" }}>
                            {val.slice(pos) || " "}
                        </span>
                    </>
                }
            </div>
        );
    };

    // ── Validation ───────────────────────────────────────────────
    const validate = () => {
        const errs = {};
        if (!form.name.trim()) errs.name = "Name with initials is required";
        if (!form.phone.trim() || form.phone.replace(/[\s\-]/g, "").length < 10)
            errs.phone = "Enter a valid 10-digit number (e.g. 077 123 4567)";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const toE164 = (raw) => {
        const c = raw.replace(/[\s\-\(\)]/g, "").trim();
        if (c.startsWith("+94")) return c;
        if (c.startsWith("94"))  return "+" + c;
        if (c.startsWith("0"))   return "+94" + c.slice(1);
        return "+94" + c;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setLoading(true); setErrors({});
        try {
            const e164Phone = toE164(form.phone);
            if (e164Phone.length !== 12) {
                setErrors({ phone: "Enter a valid 10-digit Sri Lankan number (e.g. 077 123 4567)" });
                setLoading(false); return;
            }
            const res  = await fetch(`http://124.43.16.45:9696/CILWEB/Kiosk/send-otp.php`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: e164Phone }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to send OTP");
            navigate("/verify", { state: { ...form, phone: e164Phone } });
        } catch (err) {
            let msg = err.message || "Failed to send OTP. Please try again.";
            if (msg.includes("not a valid phone number") || msg.includes("Invalid 'To'"))
                msg = "Invalid phone number. Use format: 07X XXX XXXX";
            else if (msg.includes("too many"))
                msg = "Too many attempts. Please wait a few minutes.";
            else if (msg.includes("Geographic"))
                msg = "SMS not available for this number. Contact support.";
            setErrors({ phone: msg });
        } finally { setLoading(false); }
    };

    const isNumericField = activeField === "phone";
    const isEmailField   = activeField === "email";
    const benefit = BENEFITS[bannerIdx];

    return (
        <div style={{
            position: "relative", width: "100vw", height: "100vh", overflow: "hidden",
            display: "flex", flexDirection: "column",
            background: "linear-gradient(180deg, hsl(235 85% 58%) 0%, hsl(220 80% 25%) 100%)",
        }}>
            <style>{`
                @keyframes slideUp {
                    0%   { opacity: 0; transform: translateY(18px); }
                    15%  { opacity: 1; transform: translateY(0);    }
                    80%  { opacity: 1; transform: translateY(0);    }
                    100% { opacity: 0; transform: translateY(-18px);}
                }
                @keyframes shimmer {
                    0%   { background-position: -200% center; }
                    100% { background-position:  200% center; }
                }
                @keyframes pulse-ring {
                    0%, 100% { box-shadow: 0 0 0 0 hsla(45,100%,55%,0.55); }
                    50%      { box-shadow: 0 0 0 16px hsla(45,100%,55%,0);  }
                }
                @keyframes bounce-arrow { 0%,100% { transform: translateY(0); } 50% { transform: translateY(6px); } }
                @keyframes float-badge  { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
                @keyframes spin { to { transform: rotate(360deg); } }

                .benefit-text { animation: slideUp 2.5s ease-in-out infinite; }
                .shimmer-text {
                    background: linear-gradient(90deg,
                        hsl(45 100% 55%), hsl(55 100% 75%),
                        hsl(45 100% 55%), hsl(35 100% 50%));
                    background-size: 200% auto;
                    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                    animation: shimmer 2s linear infinite;
                }
                .field-label {
                    font-size: clamp(0.7rem, 1.5vw, 0.9rem); font-weight: 700;
                    color: rgba(255,255,255,0.6); text-transform: uppercase;
                    letter-spacing: 0.12em; margin-bottom: 0.3rem; display: block;
                }
                .optional-tag {
                    font-size: clamp(0.55rem, 1.1vw, 0.7rem); color: rgba(255,255,255,0.35);
                    font-weight: 500; text-transform: none; letter-spacing: 0; margin-left: 0.4rem;
                }
                .required-tag {
                    font-size: clamp(0.55rem, 1.1vw, 0.7rem); color: hsl(45 100% 60%);
                    font-weight: 700; margin-left: 0.3rem;
                }
                .kiosk-field {
                    width: 100%; padding: 1.1vh 1.2vw;
                    font-size: clamp(0.95rem, 2vw, 1.3rem);
                    border-radius: 0.75rem; border: 2px solid rgba(255,255,255,0.15);
                    background: rgba(0,0,0,0.35); color: #fff; outline: none;
                    box-sizing: border-box; transition: border-color 0.2s, box-shadow 0.2s;
                    cursor: pointer;
                }
                .kiosk-field.active {
                    border-color: hsl(190 100% 60%);
                    box-shadow: 0 0 0 3px hsla(190,100%,60%,0.25);
                }
                .kiosk-field.error { border-color: hsl(0 80% 60%); }
                .error-msg { color: hsl(0 80% 70%); font-size: clamp(0.7rem,1.4vw,0.85rem); margin-top: 0.2rem; }
                .submit-btn {
                    width: 100%; padding: 1.6vh 0;
                    font-size: clamp(1.1rem, 2.5vw, 1.6rem); font-weight: 900;
                    text-transform: uppercase; letter-spacing: 0.08em; border: none;
                    border-radius: 0.9rem; cursor: pointer;
                    background: linear-gradient(135deg, hsl(45 100% 52%), hsl(35 100% 46%));
                    color: #1a1000; animation: pulse-ring 2s ease-in-out infinite;
                    transition: transform 0.15s, opacity 0.15s; white-space: nowrap;
                    display: flex; align-items: center; justify-content: center; gap: 0.6rem;
                }
                .submit-btn:active { transform: scale(0.97); }
                .submit-btn:disabled { opacity: 0.65; cursor: not-allowed; animation: none; }
                .spinner {
                    width: 1.2em; height: 1.2em; border: 3px solid rgba(0,0,0,0.25);
                    border-top-color: #1a1000; border-radius: 50%;
                    animation: spin 0.7s linear infinite; flex-shrink: 0;
                }
                .prof-dropdown {
                    position: absolute; left: 0; right: 0; top: calc(100% + 4px);
                    background: hsl(220 50% 18%); border: 1.5px solid rgba(255,255,255,0.15);
                    border-radius: 0.75rem; z-index: 999; max-height: 22vh;
                    overflow-y: auto; box-shadow: 0 12px 40px rgba(0,0,0,0.5);
                }
                .prof-option {
                    width: 100%; text-align: left; padding: 0.9vh 1.2vw;
                    font-size: clamp(0.9rem, 1.8vw, 1.2rem); color: #fff;
                    background: transparent; border: none;
                    border-bottom: 1px solid rgba(255,255,255,0.07);
                    cursor: pointer; transition: background 0.15s;
                }
                .prof-option:hover { background: rgba(255,255,255,0.1); }
                .prof-option:last-child { border-bottom: none; }
                .bounce-arrow { animation: bounce-arrow 1.2s ease-in-out infinite; display: inline-block; }
                .float-badge  { animation: float-badge 3s ease-in-out infinite; }
            `}</style>

            {/* ═══ SECTION 1 — Banner ═══ */}
            <div style={{
                position: "relative", flex: "0 0 28vh", overflow: "hidden",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            }}>
                <img src={registrationBanner} alt="Products" style={{
                    position: "absolute", inset: 0, width: "100%", height: "100%",
                    objectFit: "cover", opacity: 0.45,
                }} />
                <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(15,20,60,0.85) 100%)",
                }} />
                <WaterDrops count={12} />
                <div style={{ position: "relative", zIndex: 5, textAlign: "center", padding: "0 4vw" }}>
                    <div className="float-badge" style={{ fontSize: "clamp(2.5rem,6vw,4rem)", lineHeight: 1, marginBottom: "0.4rem" }}>
                        {benefit.emoji}
                    </div>
                    <div key={bannerIdx} className="benefit-text">
                        <p style={{ fontSize: "clamp(1rem,2.8vw,1.8rem)", fontWeight: 700, color: "rgba(255,255,255,0.85)", margin: 0, lineHeight: 1.2 }}>
                            {benefit.line1}
                        </p>
                        <p className="shimmer-text" style={{ fontSize: "clamp(1.6rem,4.5vw,3rem)", fontWeight: 900, margin: "0.1rem 0 0", lineHeight: 1.1 }}>
                            {benefit.line2}
                        </p>
                    </div>
                    <div className="bounce-arrow" style={{ marginTop: "0.6rem", color: "rgba(255,255,255,0.5)", fontSize: "1.4rem" }}>↓</div>
                </div>
                <div style={{ position: "absolute", bottom: "0.8rem", display: "flex", gap: "0.4rem", zIndex: 5 }}>
                    {BENEFITS.map((_, i) => (
                        <div key={i} style={{
                            width: i === bannerIdx ? "1.6rem" : "0.45rem", height: "0.45rem",
                            borderRadius: "1rem",
                            background: i === bannerIdx ? "hsl(45 100% 55%)" : "rgba(255,255,255,0.3)",
                            transition: "all 0.4s ease",
                        }} />
                    ))}
                </div>
            </div>

            {/* ═══ SECTION 2 — Form ═══ */}
            <div style={{
                flex: "0 0 37vh", display: "flex", flexDirection: "column",
                padding: "1.2vh 4vw 1vh", gap: "0.8vh", overflowY: "auto",
                background: "rgba(10,15,50,0.6)", backdropFilter: "blur(12px)",
                borderTop: "1px solid rgba(255,255,255,0.1)",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                boxSizing: "border-box",
            }}>
                <div style={{ textAlign: "center", marginBottom: "0.3vh" }}>
                    <h2 style={{ fontSize: "clamp(1rem,2.5vw,1.6rem)", fontWeight: 900, color: "#fff", margin: 0, letterSpacing: "0.05em" }}>
                        ✍️ Fill in your details below
                    </h2>
                    <p style={{ fontSize: "clamp(0.75rem,1.5vw,0.95rem)", color: "rgba(255,255,255,0.5)", margin: "0.2rem 0 0" }}>
                        Tap a field · use ◀▶ to move cursor · <span style={{ color: "hsl(45 100% 60%)", fontWeight: 700 }}>★ = Required</span>
                    </p>
                </div>

                {/* Row 1 — Name & Phone */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8vh 2vw" }}>
                    <div>
                        <label className="field-label">👤 Name with Initials<span className="required-tag">★ Required</span></label>
                        <FieldDisplay field="name" placeholder="e.g. A.B. Perera" isActive={activeField === "name"} />
                        {errors.name && <p className="error-msg">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="field-label">📱 Phone Number<span className="required-tag">★ Required</span></label>
                        <FieldDisplay field="phone" placeholder="07X XXX XXXX" isActive={activeField === "phone"} />
                        {errors.phone && <p className="error-msg">{errors.phone}</p>}
                    </div>
                </div>

                {/* Row 2 — Email & Profession */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8vh 2vw" }}>
                    <div>
                        <label className="field-label">✉️ Email Address<span className="optional-tag">(optional)</span></label>
                        <FieldDisplay field="email" placeholder="you@example.com" isActive={activeField === "email"} />
                    </div>
                    <div style={{ position: "relative" }}>
                        <label className="field-label">💼 Profession<span className="optional-tag">(optional)</span></label>
                        <div style={{ display: "flex", gap: "0.4vw" }}>
                            <div style={{ flex: 1 }}>
                                <FieldDisplay field="profession" placeholder="Type or pick ▾" isActive={activeField === "profession"} />
                            </div>
                            <button
                                onClick={() => { setShowDropdown(!showDropdown); setActiveField("profession"); }}
                                style={{
                                    flexShrink: 0, padding: "0 0.8vw",
                                    background: "rgba(255,255,255,0.1)", border: "2px solid rgba(255,255,255,0.15)",
                                    borderRadius: "0.75rem", color: "#fff", fontSize: "1rem",
                                    cursor: "pointer", transition: "background 0.15s",
                                }}>▾</button>
                        </div>
                        {showDropdown && (
                            <div className="prof-dropdown">
                                {professions.map(p => (
                                    <button key={p} className="prof-option"
                                        onClick={() => {
                                            setForm(prev => ({ ...prev, profession: p }));
                                            setCursors(prev => ({ ...prev, profession: p.length }));
                                            setShowDropdown(false);
                                            setActiveField("organization");
                                        }}>{p}</button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Row 3 — Organization */}
                <div>
                    <label className="field-label">🏢 Organization / Company<span className="optional-tag">(optional)</span></label>
                    <FieldDisplay field="organization" placeholder="Your company or organization name" isActive={activeField === "organization"} />
                </div>

                {/* Submit */}
                <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
                    {loading
                        ? <><div className="spinner" /> Sending OTP…</>
                        : <>👆 Continue &amp; Claim My 35% OFF →</>}
                </button>
            </div>

            {/* ═══ SECTION 3 — Keyboard ═══ */}
            <div style={{
                flex: "1", background: "rgba(5,10,40,0.85)", backdropFilter: "blur(16px)",
                borderTop: "1px solid rgba(255,255,255,0.08)",
                display: "flex", flexDirection: "column", justifyContent: "center",
                padding: "0.5vh 1vw", boxSizing: "border-box",
            }}>
                <div style={{
                    textAlign: "center", marginBottom: "0.5vh",
                    fontSize: "clamp(0.7rem,1.3vw,0.85rem)",
                    color: "hsl(190 100% 60%)", fontWeight: 600,
                    textTransform: "uppercase", letterSpacing: "0.1em",
                }}>
                    Typing into: {activeField.replace(/^\w/, c => c.toUpperCase())}
                    {form[activeField]
                        ? ` — cursor at position ${cursors[activeField]} / ${form[activeField].length}`
                        : ""}
                </div>
                <VirtualKeyboard
                    onKeyPress={handleKeyPress}
                    onBackspace={handleBackspace}
                    onClear={handleClear}
                    onCursorLeft={handleCursorLeft}
                    onCursorRight={handleCursorRight}
                    isNumeric={isNumericField}
                    showAt={isEmailField}
                />
            </div>
        </div>
    );
};

export default Registration;