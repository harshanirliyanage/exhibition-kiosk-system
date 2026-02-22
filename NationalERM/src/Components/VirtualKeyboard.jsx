import React from "react";

/**
 * VirtualKeyboard — touch-safe
 *
 * Touch fix: hold-to-repeat keys (⌫ ◀ ▶) use ONLY pointer events.
 * - onPointerDown  → start hold timer + fire once
 * - onPointerUp / onPointerLeave / onPointerCancel → stop timer
 * - onClick is NOT used for hold keys (avoids double-fire on touch)
 * - Regular keys use onClick only (reliable single-fire on both touch & mouse)
 */
const VirtualKeyboard = ({
    onKeyPress,
    onBackspace,
    onClear,
    onCursorLeft,
    onCursorRight,
    isNumeric = false,
    showAt = false,
}) => {
    const [mode, setMode] = React.useState(isNumeric ? "numeric" : "alpha");

    const holdTimer    = React.useRef(null);
    const holdInterval = React.useRef(null);
    const isHolding    = React.useRef(false);

    const stopHold = () => {
        clearTimeout(holdTimer.current);
        clearInterval(holdInterval.current);
        isHolding.current = false;
    };

    const startHold = (action) => {
        stopHold();
        isHolding.current = true;
        action(); // fire immediately on press
        holdTimer.current = setTimeout(() => {
            if (!isHolding.current) return;
            holdInterval.current = setInterval(() => {
                if (!isHolding.current) { clearInterval(holdInterval.current); return; }
                action();
            }, 80);
        }, 380);
    };

    React.useEffect(() => {
        setMode(isNumeric ? "numeric" : "alpha");
    }, [isNumeric]);

    React.useEffect(() => () => stopHold(), []);

    // ── Layouts ──────────────────────────────────────────────────
    const numericRows = [
        ["1", "2", "3"],
        ["4", "5", "6"],
        ["7", "8", "9"],
        ["◀", "0", "▶"],
        ["Clear", "⌫"],
    ];

    const alphaRows = [
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
        ["⇧", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
        showAt
            ? ["123", "✉", "◀", "Space", "▶", "@", ".", "Clear"]
            : ["123", "✉", "◀", "Space", "▶", ".", "Clear"],
    ];

    const alphaLowerRows = [
        ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
        ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
        ["⇧", "z", "x", "c", "v", "b", "n", "m", "⌫"],
        showAt
            ? ["123", "✉", "◀", "Space", "▶", "@", ".", "Clear"]
            : ["123", "✉", "◀", "Space", "▶", ".", "Clear"],
    ];

    const symbolRows = [
        ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
        ["@", ".", "_", "-", "+", "#", "!", "?", "/", "⌫"],
        ["ABC", "◀", "Space", "▶", "Clear"],
    ];

    const emailRows = [
        ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
        ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
        ["z", "x", "c", "v", "b", "n", "m", "_", "-", "⌫"],
        ["@", ".com", ".net", ".org", ".", "◀", "▶", "ABC", "Clear"],
    ];

    const rows = mode === "numeric" ? numericRows
        : mode === "symbol"  ? symbolRows
        : mode === "email"   ? emailRows
        : mode === "lower"   ? alphaLowerRows
        : alphaRows;

    // ── Key action (no side-effects, pure dispatch) ──────────────
    const fireKey = (key) => {
        switch (key) {
            case "⌫":    return onBackspace?.();
            case "Clear": return onClear?.();
            case "Space": return onKeyPress?.(" ");
            case "◀":    return onCursorLeft?.();
            case "▶":    return onCursorRight?.();
            case "123":  return setMode("symbol");
            case "ABC":  return setMode("alpha");
            case "✉":   return setMode("email");
            case "⇧":   return setMode(p => p === "lower" ? "alpha" : "lower");
            default:     return onKeyPress?.(key);
        }
    };

    const HOLD_KEYS = ["⌫", "◀", "▶"];

    // ── Styles ───────────────────────────────────────────────────
    const containerStyle = {
        width: "100%", padding: "0.6vh 1vw", boxSizing: "border-box",
        display: "flex", flexDirection: "column", gap: "0.6vh",
    };
    const rowStyle = { display: "flex", gap: "0.5vw", justifyContent: "center" };

    const getKeyStyle = (key) => {
        const base = {
            height: "clamp(44px, 7vh, 72px)",
            borderRadius: "0.6rem", border: "none", cursor: "pointer",
            fontWeight: 700, fontSize: "clamp(0.85rem, 2vw, 1.35rem)",
            transition: "transform 0.08s ease, opacity 0.08s ease",
            display: "flex", alignItems: "center", justifyContent: "center",
            userSelect: "none", WebkitUserSelect: "none",
            touchAction: "none",          // ← prevents scroll hijack on touch
            letterSpacing: "0.03em", boxSizing: "border-box", flexShrink: 0,
        };

        if (key === "Space") return {
            ...base, flex: "1", maxWidth: "38vw", minWidth: "18vw",
            background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.55)",
            fontSize: "clamp(0.75rem, 1.5vw, 1rem)",
            border: "1px solid rgba(255,255,255,0.15)",
        };
        if (key === "⌫") return {
            ...base, minWidth: "clamp(52px, 9vw, 90px)", padding: "0 1.5vw",
            background: "hsla(0,70%,45%,0.75)", color: "#fff",
            fontSize: "clamp(1rem, 2.2vw, 1.5rem)",
        };
        if (key === "Clear") return {
            ...base, minWidth: "clamp(52px, 9vw, 90px)", padding: "0 1.2vw",
            background: "hsla(220,60%,35%,0.85)", color: "rgba(255,255,255,0.8)",
            fontSize: "clamp(0.7rem, 1.4vw, 0.95rem)",
        };
        if (key === "◀" || key === "▶") return {
            ...base, minWidth: "clamp(44px, 7vw, 72px)", padding: "0 1vw",
            background: "hsla(200,80%,30%,0.85)", color: "hsl(200 100% 80%)",
            fontSize: "clamp(1rem, 2vw, 1.4rem)",
            border: "1px solid hsla(200,100%,60%,0.35)",
        };
        if (key === "⇧") return {
            ...base, minWidth: "clamp(44px, 7vw, 70px)", padding: "0 1vw",
            background: mode === "alpha" ? "hsla(50,90%,45%,0.85)" : "hsla(0,0%,30%,0.7)",
            color: mode === "alpha" ? "hsl(50 100% 90%)" : "rgba(255,255,255,0.45)",
            fontSize: "clamp(1rem, 2vw, 1.4rem)",
            border: "1px solid hsla(50,100%,55%,0.3)",
        };
        if (["123", "ABC", "#$%"].includes(key)) return {
            ...base, minWidth: "clamp(52px, 9vw, 90px)", padding: "0 1.2vw",
            background: "hsla(190,80%,30%,0.85)", color: "hsl(190 100% 75%)",
            fontSize: "clamp(0.7rem, 1.4vw, 0.95rem)",
            border: "1px solid hsla(190,100%,60%,0.3)",
        };
        if (key === "✉") return {
            ...base, minWidth: "clamp(44px, 7vw, 70px)", padding: "0 1vw",
            background: mode === "email" ? "hsla(270,80%,45%,0.9)" : "hsla(270,70%,30%,0.85)",
            color: "hsl(270 100% 85%)", fontSize: "clamp(0.85rem, 1.8vw, 1.2rem)",
            border: "1px solid hsla(270,100%,65%,0.4)",
        };
        if (key === "@") return {
            ...base, flex: "1", maxWidth: "clamp(44px, 7vw, 70px)",
            background: "hsla(45,100%,52%,0.25)", color: "hsl(45 100% 70%)",
            border: "1px solid hsla(45,100%,55%,0.5)",
        };
        if ([".com", ".net", ".org"].includes(key)) return {
            ...base, flex: "1", maxWidth: "clamp(60px, 9vw, 95px)", padding: "0 0.4vw",
            background: "hsla(160,60%,25%,0.85)", color: "hsl(160 100% 75%)",
            fontSize: "clamp(0.62rem, 1.25vw, 0.85rem)",
            border: "1px solid hsla(160,100%,50%,0.3)",
        };
        return {
            ...base, flex: "1",
            maxWidth: mode === "numeric" ? "28vw" : "clamp(32px, 8.5vw, 80px)",
            background: "rgba(255,255,255,0.1)", color: "#ffffff",
            border: "1px solid rgba(255,255,255,0.1)",
        };
    };

    // ── Press feedback (opacity only — avoids background color fighting) ──
    const onPressStart = (e) => {
        e.currentTarget.style.opacity = "0.6";
        e.currentTarget.style.transform = "scale(0.93)";
    };
    const onPressEnd = (e) => {
        e.currentTarget.style.opacity = "1";
        e.currentTarget.style.transform = "scale(1)";
    };

    const modeLabel = {
        numeric: "— Number Pad —",
        symbol:  "— Symbols & Numbers —",
        email:   "— Email Address —",
        lower:   "— Keyboard (lowercase) —",
        alpha:   "— Keyboard —",
    }[mode];

    return (
        <div style={containerStyle}>
            <div style={{
                textAlign: "center", fontSize: "clamp(0.6rem, 1.1vw, 0.75rem)",
                color: "rgba(255,255,255,0.3)", textTransform: "uppercase",
                letterSpacing: "0.15em", marginBottom: "0.2vh",
            }}>
                {modeLabel}
            </div>

            {rows.map((row, rowIndex) => (
                <div key={rowIndex} style={rowStyle}>
                    {row.map((key) => {
                        const isHoldKey = HOLD_KEYS.includes(key);

                        return (
                            <button
                                key={key}
                                style={getKeyStyle(key)}

                                // ── Regular keys: use onClick (fires once, touch-safe) ──
                                onClick={isHoldKey ? undefined : () => fireKey(key)}

                                // ── Hold keys: driven entirely by pointer events ──
                                onPointerDown={isHoldKey ? (e) => {
                                    e.currentTarget.setPointerCapture(e.pointerId); // keep events on this el
                                    onPressStart(e);
                                    startHold(() => fireKey(key));
                                } : onPressStart}

                                onPointerUp={(e) => {
                                    onPressEnd(e);
                                    if (isHoldKey) stopHold();
                                }}
                                onPointerLeave={(e) => {
                                    onPressEnd(e);
                                    if (isHoldKey) stopHold();
                                }}
                                onPointerCancel={(e) => {
                                    onPressEnd(e);
                                    if (isHoldKey) stopHold();
                                }}
                            >
                                {key === "Space" ? "SPACE" : key}
                            </button>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default VirtualKeyboard;