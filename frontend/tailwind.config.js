/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
    theme: {
        extend: {
            colors: {
                sakura: {
                    bg: "#FFF5F8",
                    bgAlt: "#FAFAFA",
                    ink: "#1A0F15",
                    inkSoft: "#5A3D4A",
                    pink: "#FF4785",
                    pinkSoft: "#FF7EB3",
                    peach: "#FFB997",
                    rose: "#E8B4B8",
                },
            },
            fontFamily: {
                display: ['"Bricolage Grotesque"', "Manrope", "sans-serif"],
                body: ["Manrope", "ui-sans-serif", "system-ui"],
                serif: ['"Instrument Serif"', "serif"],
            },
            borderRadius: {
                "4xl": "2rem",
                "5xl": "2.5rem",
            },
            boxShadow: {
                glow: "0 20px 80px -20px rgba(255,71,133,0.55)",
                "glow-soft": "0 30px 100px -30px rgba(255,126,179,0.45)",
            },
        },
    },
    plugins: [],
};
