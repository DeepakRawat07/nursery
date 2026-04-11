/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        moss: '#214b37',
        fern: '#2f6b4f',
        sage: '#8eb69b',
        seed: '#f5efe4',
        bark: '#5b4435',
        clay: '#d77f53'
      },
      boxShadow: {
        soft: '0 20px 60px rgba(33, 75, 55, 0.12)'
      },
      backgroundImage: {
        'hero-texture':
          'radial-gradient(circle at 20% 20%, rgba(142, 182, 155, 0.45), transparent 35%), radial-gradient(circle at 80% 10%, rgba(215, 127, 83, 0.20), transparent 30%), linear-gradient(135deg, #f6f3ea 0%, #edf6ef 50%, #f8f5ee 100%)'
      }
    }
  },
  plugins: []
};
