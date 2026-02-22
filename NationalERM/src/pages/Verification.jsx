import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import VirtualKeyboard from "@/Components/VirtualKeyboard";

const OTP_SERVER = "http://124.43.16.45:9696/CILWEB/Kiosk";           // Node.js OTP server
const PHP_SERVER = "http://124.43.16.45:9696/CILWEB/Kiosk/Save_registration.php"; // ← update this

const Verification = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const phone = location.state?.phone || "your phone";
    const userState = location.state || {};

    const [code, setCode] = useState("");
    const [resendTimer, setResendTimer] = useState(30);
    const [error, setError] = useState("");
    const [shake, setShake] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);

    useEffect(() => {
        if (resendTimer > 0) {
            const t = setTimeout(() => setResendTimer(p => p - 1), 1000);
            return () => clearTimeout(t);
        }
    }, [resendTimer]);

    const handleKeyPress = (key) => {
        if (code.length < 6) { setCode(p => p + key); setError(""); }
    };
    const handleBackspace = () => setCode(p => p.slice(0, -1));
    const handleClear = () => setCode("");

    const triggerShake = () => {
        setShake(true);
        setTimeout(() => setShake(false), 600);
    };

    // ── Resend OTP ───────────────────────────────────────────────
    const handleResend = async () => {
        if (resendTimer > 0 || resendLoading) return;

        setResendLoading(true);
        setError("");
        setCode("");

        try {
            const res = await fetch(`${OTP_SERVER}/send-otp.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to resend OTP");
            setResendTimer(30);
        } catch (err) {
            setError(err.message || "Failed to resend. Please try again.");
            triggerShake();
        } finally {
            setResendLoading(false);
        }
    };

    // ── Verify OTP then save to MySQL via PHP ────────────────────
    const handleConfirm = async () => {
        if (code.length < 6) {
            setError("Please enter the full 6-digit code");
            triggerShake();
            return;
        }

        setLoading(true);
        setError("");

        try {
            // STEP 1 — Verify OTP with Node.js
            const otpRes = await fetch(`${OTP_SERVER}/verify-otp.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone, code }),
            });
            const otpData = await otpRes.json();

            if (!otpRes.ok) throw new Error(otpData.error || "Verification failed");

            // STEP 2 — Save registration to MySQL via PHP
            const saveRes = await fetch(PHP_SERVER, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    phone: userState.phone || phone,
                    name: userState.name || "",
                    email: userState.email || "",
                    profession: userState.profession || "",
                    organization: userState.organization || "",
                    regLocation: "BMICH-KIOSK",
                }),
            });
            const saveData = await saveRes.json();

            if (!saveData.success) {
                if (saveData.error === "already_registered") {
                    setError("This number is already registered! Each number can only register once.");
                    triggerShake();
                    setLoading(false);
                    return;
                }
                throw new Error(saveData.error || "Failed to save registration");
            }

            // ✅ All done — navigate to success
            navigate("/success", { state: { ...userState } });

        } catch (err) {
            console.error("Error:", err.message);

            let msg = err.message || "Verification failed. Please try again.";
            if (msg.includes("Invalid") || msg.includes("incorrect")) {
                msg = "Wrong code. Please check and try again.";
            } else if (msg.includes("expired") || msg.includes("already used")) {
                msg = "Code expired. Tap Resend to get a new one.";
            } else if (msg.includes("too many") || msg.includes("Max")) {
                msg = "Too many attempts. Please wait a moment.";
            } else if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
                msg = "Network error. Please check your connection.";
            }

            setError(msg);
            triggerShake();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            background: "linear-gradient(180deg, hsl(235 85% 20%) 0%, hsl(220 80% 10%) 100%)",
        }}>
            <style>{`
                @keyframes float-icon    { 0%,100% { transform: translateY(0);    } 50% { transform: translateY(-8px); } }
                @keyframes pulse-ring    { 0% { box-shadow: 0 0 0 0   hsla(190,100%,55%,0.6); }
                                          70% { box-shadow: 0 0 0 20px hsla(190,100%,55%,0);  }
                                         100% { box-shadow: 0 0 0 0   hsla(190,100%,55%,0);  } }
                @keyframes shake         { 0%,100% { transform: translateX(0);   }
                                           20%     { transform: translateX(-8px); }
                                           40%     { transform: translateX(8px);  }
                                           60%     { transform: translateX(-6px); }
                                           80%     { transform: translateX(6px);  } }
                @keyframes blink-cursor  { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
                @keyframes confirm-glow  { 0%,100% { box-shadow: 0 0 30px hsla(45,100%,52%,0.5), 0 6px 24px rgba(0,0,0,0.4); }
                                           50%     { box-shadow: 0 0 70px hsla(45,100%,52%,0.9), 0 6px 28px rgba(0,0,0,0.5); } }
                @keyframes spin          { to { transform: rotate(360deg); } }

                .otp-box {
                    width: clamp(48px, 10vw, 72px); height: clamp(58px, 12vw, 84px);
                    border-radius: 0.9rem;
                    border: 2.5px solid rgba(255,255,255,0.12);
                    background: rgba(255,255,255,0.05);
                    display: flex; align-items: center; justify-content: center;
                    font-size: clamp(1.6rem, 4vw, 2.8rem); font-weight: 900; color: #fff;
                    transition: all 0.2s;
                }
                .otp-box.filled      { border-color: hsl(190 100% 60%); background: hsla(190,100%,60%,0.12); transform: scale(1.06); }
                .otp-box.active-next { border-color: hsl(45 100% 55%); animation: pulse-ring 1.5s ease-in-out infinite; }
                .otp-box .cursor     { width: 2px; height: 60%; background: hsl(45 100% 55%); border-radius: 2px; animation: blink-cursor 1s ease-in-out infinite; }

                .shake-anim { animation: shake 0.5s ease-in-out; }

                .confirm-btn {
                    font-size: clamp(1.2rem, 2.8vw, 1.8rem); font-weight: 900;
                    padding: 1.8vh 0; width: 100%;
                    border: none; border-radius: 1rem; cursor: pointer;
                    text-transform: uppercase; letter-spacing: 0.07em; white-space: nowrap;
                    background: linear-gradient(135deg, hsl(45 100% 52%), hsl(35 100% 46%));
                    color: #1a1000;
                    animation: confirm-glow 2s ease-in-out infinite;
                    transition: transform 0.15s, opacity 0.15s;
                    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
                }
                .confirm-btn:active   { transform: scale(0.97); }
                .confirm-btn:disabled { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.3); animation: none; box-shadow: none; cursor: not-allowed; }

                .spinner { width: 1.1em; height: 1.1em; border: 3px solid rgba(0,0,0,0.2); border-top-color: #1a1000; border-radius: 50%; animation: spin 0.7s linear infinite; }

                .resend-btn {
                    font-size: clamp(0.85rem, 1.8vw, 1.1rem); font-weight: 600;
                    padding: 1.4vh 0; width: 100%; border-radius: 0.9rem; cursor: pointer;
                    border: 2px solid rgba(255,255,255,0.15); background: transparent;
                    color: rgba(255,255,255,0.5); transition: all 0.2s; white-space: nowrap;
                }
                .resend-btn.active       { border-color: hsl(190 100% 60%); color: hsl(190 100% 60%); }
                .resend-btn.active:hover { background: hsla(190,100%,60%,0.1); }
            `}</style>

            {/* ═══ Header (~28vh) ═══ */}
            <div style={{
                flex: "0 0 28vh", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                padding: "2vh 5vw 1vh",
                background: "linear-gradient(180deg, hsl(235 85% 28%) 0%, hsl(235 85% 20%) 100%)",
                borderBottom: "1px solid rgba(255,255,255,0.08)", gap: "1.5vh",
            }}>
                {/* Progress steps */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: "clamp(28px,5vw,40px)", height: "clamp(28px,5vw,40px)", borderRadius: "50%", background: "hsl(190 100% 60%)", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "clamp(0.7rem,1.4vw,0.9rem)", fontWeight: 800 }}>✓</div>
                    <div style={{ width: "clamp(30px,6vw,60px)", height: "2px", background: "hsl(190 100% 60%)" }} />
                    <div style={{ width: "clamp(28px,5vw,40px)", height: "clamp(28px,5vw,40px)", borderRadius: "50%", background: "linear-gradient(135deg,hsl(45 100% 52%),hsl(35 100% 46%))", color: "#1a1000", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "clamp(0.7rem,1.4vw,0.9rem)", fontWeight: 800, boxShadow: "0 0 16px hsla(45,100%,52%,0.7)" }}>2</div>
                    <div style={{ width: "clamp(30px,6vw,60px)", height: "2px", background: "rgba(255,255,255,0.15)" }} />
                    <div style={{ width: "clamp(28px,5vw,40px)", height: "clamp(28px,5vw,40px)", borderRadius: "50%", background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.35)", border: "2px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "clamp(0.7rem,1.4vw,0.9rem)", fontWeight: 800 }}>3</div>
                </div>
                <div style={{ display: "flex", gap: "clamp(1.5rem,8vw,6rem)", marginTop: "-0.8vh" }}>
                    {["Details", "Verify", "Done!"].map((s, i) => (
                        <span key={s} style={{
                            fontSize: "clamp(0.6rem,1.2vw,0.78rem)",
                            fontWeight: i === 1 ? 800 : 500,
                            color: i === 0 ? "hsl(190 100% 60%)" : i === 1 ? "hsl(45 100% 60%)" : "rgba(255,255,255,0.3)",
                            textTransform: "uppercase", letterSpacing: "0.08em",
                        }}>{s}</span>
                    ))}
                </div>

                <div style={{
                    width: "clamp(60px,12vw,90px)", height: "clamp(60px,12vw,90px)",
                    borderRadius: "50%",
                    background: "radial-gradient(circle at 35% 35%, hsl(190 100% 40%), hsl(220 80% 20%))",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "clamp(1.8rem,4vw,2.8rem)",
                    animation: "float-icon 3s ease-in-out infinite",
                    boxShadow: "0 0 30px hsla(190,100%,50%,0.4), 0 8px 24px rgba(0,0,0,0.5)",
                }}>🔐</div>

                <div style={{ textAlign: "center" }}>
                    <h1 style={{ fontSize: "clamp(1.6rem,4vw,2.8rem)", fontWeight: 900, color: "#fff", margin: 0, lineHeight: 1.1 }}>
                        Almost There!
                    </h1>
                    <p style={{ fontSize: "clamp(0.85rem,1.8vw,1.15rem)", color: "rgba(255,255,255,0.6)", margin: "0.4vh 0 0" }}>
                        A 6-digit code was sent to{" "}
                        <span style={{ color: "hsl(190 100% 65%)", fontWeight: 700 }}>{phone}</span>
                    </p>
                </div>
            </div>

            {/* ═══ OTP Entry (~28vh) ═══ */}
            <div style={{
                flex: "0 0 28vh", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                padding: "2vh 5vw", gap: "2vh",
                background: "rgba(10,15,50,0.7)", backdropFilter: "blur(10px)",
            }}>
                {/* OTP boxes */}
                <div className={shake ? "shake-anim" : ""} style={{ display: "flex", gap: "clamp(0.5rem,1.5vw,1rem)", justifyContent: "center" }}>
                    {Array.from({ length: 6 }).map((_, i) => {
                        const isFilled = i < code.length;
                        const isActiveNext = i === code.length && code.length < 6;
                        return (
                            <div key={i} className={`otp-box ${isFilled ? "filled" : ""} ${isActiveNext ? "active-next" : ""}`}>
                                {isFilled ? code[i] : isActiveNext ? <span className="cursor" /> : ""}
                            </div>
                        );
                    })}
                </div>

                {error && (
                    <p style={{ color: "hsl(0 80% 70%)", fontSize: "clamp(0.8rem,1.6vw,1rem)", margin: 0, textAlign: "center" }}>
                        ⚠️ {error}
                    </p>
                )}

                {/* Progress bar */}
                <div style={{ width: "80%", height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "3px", overflow: "hidden" }}>
                    <div style={{
                        height: "100%",
                        width: `${(code.length / 6) * 100}%`,
                        background: code.length === 6
                            ? "linear-gradient(90deg, hsl(190 100% 55%), hsl(140 80% 50%))"
                            : "linear-gradient(90deg, hsl(190 100% 55%), hsl(45 100% 55%))",
                        borderRadius: "3px", transition: "width 0.2s ease",
                    }} />
                </div>
                <p style={{ fontSize: "clamp(0.75rem,1.4vw,0.9rem)", color: code.length === 6 ? "hsl(140 80% 60%)" : "rgba(255,255,255,0.4)", margin: 0, fontWeight: 600 }}>
                    {code.length === 6 ? "✅ Code complete — tap Confirm!" : `${code.length} of 6 digits entered`}
                </p>

                {/* Buttons */}
                <div style={{ display: "flex", gap: "2vw", width: "100%", maxWidth: "600px" }}>
                    <button
                        className={`resend-btn ${resendTimer === 0 && !resendLoading ? "active" : ""}`}
                        onClick={handleResend}
                        disabled={resendTimer > 0 || loading || resendLoading}
                        style={{ flex: "0 0 38%" }}
                    >
                        {resendLoading ? "Sending…" : resendTimer > 0 ? `⏱ Resend in ${resendTimer}s` : "🔄 Resend Code"}
                    </button>

                    <button
                        className="confirm-btn"
                        onClick={handleConfirm}
                        disabled={code.length < 6 || loading}
                        style={{ flex: 1 }}
                    >
                        {loading ? <><div className="spinner" /> Verifying…</> : <>✅ Confirm</>}
                    </button>
                </div>
            </div>

            {/* ═══ Numpad (remaining) ═══ */}
            <div style={{
                flex: 1, background: "hsl(220 40% 8%)",
                borderTop: "1px solid rgba(255,255,255,0.07)",
                display: "flex", flexDirection: "column", justifyContent: "center",
                padding: "1vh 2vw 2vh", boxSizing: "border-box",
            }}>
                <p style={{
                    textAlign: "center", fontSize: "clamp(0.7rem,1.3vw,0.85rem)",
                    color: "rgba(255,255,255,0.35)", margin: "0 0 0.8vh",
                    letterSpacing: "0.06em", textTransform: "uppercase",
                }}>
                    Tap numbers to enter your code
                </p>
                <VirtualKeyboard
                    onKeyPress={handleKeyPress}
                    onBackspace={handleBackspace}
                    onClear={handleClear}
                    isNumeric
                />
            </div>
        </div>
    );
};

export default Verification;