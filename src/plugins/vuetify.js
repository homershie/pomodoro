/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

const pomodoroTheme = {
  dark: false,
  colors: {
    background: '#fff8f0',
    surface: '#fff8f0',
    primary: '#e8c251', // 黃色
    secondary: '#e74c3c', // 番茄紅
    accent: '#f1c40f', // 黃色
    error: '#e57373',
    info: '#3498db',
    success: '#2ecc71',
    warning: '#fbc02d',
  },
}

const pomodoroDarkTheme = {
  dark: true,
  colors: {
    background: '#1a1a1a',
    surface: '#232323',
    primary: '#e8c251', // 深番茄紅
    secondary: '#e74c3c',
    accent: '#ffd600',
    error: '#ef9a9a',
    info: '#90caf9',
    success: '#81c784',
    warning: '#ffe082',
  },
}

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'pomodoroTheme',
    themes: {
      pomodoroTheme,
      pomodoroDarkTheme,
    },
  },
})
