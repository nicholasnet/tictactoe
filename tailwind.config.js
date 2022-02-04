module.exports = {
    content: ['./index.html', './public/index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        extend: {
            spacing: { 88: '22rem', 128: '32rem', 132: '34rem', 136: '38rem' }
        }
    },
    plugins: [require('@tailwindcss/forms')]
}
