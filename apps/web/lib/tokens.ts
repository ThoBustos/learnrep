import type { CSSProperties } from 'react'

export const brandColors = {
  yellow: '#FDC229',
  black:  '#0F0E0D',
}

export const colors = {
  ink:       '#151515',
  cream:     '#fafaf8',
  white:     '#ffffff',
  yellow:    '#ffd426',
  green:     '#d9ff69',
  red:       '#ff6b62',
  blue:      '#7bd8ef',
  purple:    '#b995ff',
  greenDark: '#1e6f38',
  redDark:   '#9c231d',
}

export const landingColorVars = {
  '--lr-ink': colors.ink,
  '--lr-cream': colors.cream,
  '--lr-white': colors.white,
  '--lr-yellow': colors.yellow,
  '--lr-green': colors.green,
  '--lr-red': colors.red,
  '--lr-blue': colors.blue,
  '--lr-purple': colors.purple,
  '--lr-green-dark': colors.greenDark,
  '--lr-red-dark': colors.redDark,
} as CSSProperties
