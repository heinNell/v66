/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#1e3a8a', // Added deeper blue
        },
        secondary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        sidebar: {
          DEFAULT: '#1e3a8a',
          hover: '#2563eb',
          active: '#3b82f6',
        }
      },
      boxShadow: {
        card: '0 2px 5px 0 rgba(0,0,0,0.05)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'sidebar-gradient': 'linear-gradient(to bottom, #1e3a8a, #1e4b8a)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
  safelist: [
    'bg-white',
    'text-white',
    'text-gray-300',
    'text-gray-400',
    'text-gray-500',
    'text-gray-600',
    'text-gray-700',
    'text-gray-800',
    'text-gray-900',
    'bg-gray-50',
    'bg-gray-100',
    'bg-gray-200',
    'bg-gray-300',
    'bg-gray-400',
    'bg-gray-500',
    'bg-gray-600',
    'bg-gray-700',
    'bg-gray-800',
    'bg-gray-900',
    'border-gray-100',
    'border-gray-200',
    'border-gray-300',
    'border-gray-400',
    'border-gray-500',
    'border-gray-600',
    'border-gray-700',
    'border-gray-800',
    'border-gray-900',
    'hover:bg-gray-50',
    'hover:bg-gray-100',
    'hover:bg-gray-200',
    'hover:bg-gray-800',
    'hover:text-gray-700',
    'hover:text-white',
    'focus:border-blue-500',
    'focus:ring-blue-500',
    'focus:outline-none',
    'focus:ring-1',
    'focus:ring-2',
    'focus:ring-offset-2',
    'rounded',
    'rounded-md',
    'rounded-lg',
    'rounded-full',
    'bg-blue-50',
    'bg-blue-100',
    'bg-blue-500',
    'bg-blue-600',
    'bg-blue-700',
    'bg-blue-800',
    'text-blue-500',
    'text-blue-600',
    'text-blue-700',
    'text-blue-800',
    'border-blue-200',
    'border-blue-300',
    'border-blue-400',
    'border-blue-500',
    'bg-green-50',
    'bg-green-100',
    'bg-green-500',
    'bg-green-600',
    'text-green-500',
    'text-green-600',
    'text-green-700',
    'text-green-800',
    'bg-red-50',
    'bg-red-100',
    'bg-red-500',
    'bg-red-600',
    'text-red-500',
    'text-red-600',
    'text-red-700',
    'text-red-800',
    'bg-yellow-50',
    'bg-yellow-100',
    'bg-yellow-500',
    'text-yellow-500',
    'text-yellow-600',
    'text-yellow-700',
    'text-yellow-800',
    'bg-amber-50',
    'bg-amber-100',
    'bg-amber-500',
    'text-amber-500',
    'text-amber-600',
    'text-amber-700',
    'text-amber-800',
    'bg-orange-50',
    'bg-orange-100',
    'bg-orange-500',
    'text-orange-500',
    'text-orange-600',
    'text-orange-700',
    'text-orange-800',
    'bg-purple-50',
    'bg-purple-100',
    'bg-purple-500',
    'text-purple-500',
    'text-purple-600',
    'text-purple-700',
    'text-purple-800',
    'hover:shadow',
    'hover:shadow-md',
    'shadow-sm',
    'shadow',
    'shadow-md'
  ]
}