import type { Config } from "tailwindcss";

export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#f8b1b1",
                    hover: "#f59a9a",
                },
                background: "#fbfbfb",
                sidebar: "#f2f7f6",
                main: "#5d5d5d",
                muted: "#9aa5a3",
                accent: "#b8dad1",
                danger: "#f2a6a6",
            },
            borderRadius: {
                '2xl': '1rem',
                '3xl': '1.5rem',
            },
            boxShadow: {
                'glass': '0 8px 20px 0 rgba(0, 0, 0, 0.05)',
            }
        },
    },
    plugins: [],
} satisfies Config;
