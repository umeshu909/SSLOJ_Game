/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
      "./app/**/*.{js,ts,jsx,tsx}", // utile si tu utilises App Router
      "./styles/**/*.{css}"
    ],
    theme: {
      extend: {
        backgroundSize: {
          '200': '200% 200%',
        },
        animation: {
          'gradient-x': 'gradientX 3s ease infinite',
        },
        keyframes: {
          gradientX: {
            '0%, 100%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
          },
        },
      },
    },
    plugins: [
      require('@tailwindcss/typography'),
    ]

  };