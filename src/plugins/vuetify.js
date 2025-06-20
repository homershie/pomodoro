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
    surface: '#fff1e9',
    primary: '#e8c251', // 黃色
    secondary: '#e74c3c', // 番茄紅
    accent: '#f1c40f',
    error: '#e74c3c',
    info: '#3498db',
    success: '#2ecc71',
    warning: '#fbc02d',
  },
  variables: {
    'font-family': 'Noto Sans TC, Roboto, sans-serif',
    'font-size-root': '16px',
    'font-weight-light': '300',
    'font-weight-regular': '400',
    'font-weight-medium': '500',
    'font-weight-bold': '700',
  },
}

const pomodoroDarkTheme = {
  dark: true,
  colors: {
    background: '#1a1a1a',
    surface: '#232323',
    primary: '#e8c251', // 黃色
    secondary: '#e74c3c', // 番茄紅
    accent: '#ffd600',
    error: '#e74c3c',
    info: '#90caf9',
    success: '#81c784',
    warning: '#ffe082',
  },
  variables: {
    'font-family': 'Noto Sans TC, Roboto, sans-serif',
    'font-size-root': '16px',
    'font-weight-light': '300',
    'font-weight-regular': '400',
    'font-weight-medium': '500',
    'font-weight-bold': '700',
  },
}

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'pomodoroDarkTheme',
    themes: {
      pomodoroTheme,
      pomodoroDarkTheme,
    },
  },
  defaults: {
    VBtn: {
      style: {
        fontFamily: 'Noto Sans TC, Roboto, sans-serif',
        fontSize: '1rem',
        fontWeight: '700',
      },
    },
    VAppBar: {
      style: {
        fontFamily: 'Noto Sans TC, Roboto, sans-serif',
      },
    },
  },
})
