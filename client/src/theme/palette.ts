export const primaryScale = {
  50: '#eef2ff',
  100: '#e0e7ff',
  200: '#c7d2fe',
  300: '#a5b4fc',
  400: '#818cf8',
  500: '#6366f1',
  600: '#4f46e5',
  700: '#4338ca',
  800: '#3730a3',
  900: '#312e81',
  950: '#1e1b4b',
} as const

export const surfaceLight = {
  0: '#ffffff',
  50: '#f8fafc',
  100: '#f1f5f9',
  200: '#e2e8f0',
  300: '#cbd5e1',
  400: '#94a3b8',
  500: '#64748b',
  600: '#475569',
  700: '#334155',
  800: '#1e293b',
  900: '#0f172a',
  950: '#020617',
} as const

export const auraLightSemantic = {
  primary: {
    color: primaryScale[500],
    contrastColor: surfaceLight[0],
    hoverColor: primaryScale[600],
    activeColor: primaryScale[700],
  },
  highlight: {
    background: primaryScale[100],
    focusBackground: primaryScale[200],
    color: primaryScale[800],
    focusColor: primaryScale[900],
  },
  text: {
    color: surfaceLight[900],
    hoverColor: surfaceLight[950],
    mutedColor: surfaceLight[500],
    hoverMutedColor: surfaceLight[600],
  },
  formField: {
    borderColor: surfaceLight[200],
    hoverBorderColor: surfaceLight[300],
    focusBorderColor: primaryScale[500],
  },
  content: {
    borderColor: surfaceLight[200],
  },
  overlay: {
    select: {
      borderColor: surfaceLight[200],
    },
    popover: {
      borderColor: surfaceLight[200],
    },
    modal: {
      borderColor: surfaceLight[200],
    },
  },
} as const

export const appChrome = {
  accent: '#fde68a',
  approveBg: '#dcefe4',
  approveBgHover: '#d2e8db',
  approveText: '#2f6b4f',
  approveBorder: '#c5e3d2',
  rejectBg: '#f3e1e1',
  rejectBgHover: '#edd6d6',
  rejectText: '#8a4d4d',
  rejectBorder: '#e7cccc',
  pendingPillBg: '#fffbeb',
  pendingPillText: '#b45309',
  pendingPillBorder: '#fcd34d',
  approvedPillBg: '#e8f2ec',
  approvedPillText: '#3f6b52',
  approvedPillBorder: '#c5e3d2',
  rejectedPillBg: '#f7ecec',
  rejectedPillText: '#8f4d4d',
  rejectedPillBorder: '#e8cfcf',
} as const

export const rootCssVariables: Record<string, string> = {
  '--color-primary': primaryScale[500],
  '--color-primary-hover': primaryScale[600],
  '--color-primary-active': primaryScale[700],
  '--color-navy': surfaceLight[900],
  '--color-tint': primaryScale[100],
  '--color-tint-strong': primaryScale[200],
  '--color-page-bg': surfaceLight[50],
  '--color-accent': appChrome.accent,
  '--color-white': surfaceLight[0],
  '--color-text': surfaceLight[900],
  '--color-text-muted': surfaceLight[500],
  '--color-border': surfaceLight[200],
  '--color-background': 'var(--color-page-bg)',
  '--color-background-soft': 'var(--color-tint)',
  '--color-background-mute': surfaceLight[100],
  '--color-border-hover': surfaceLight[300],
  '--color-heading': surfaceLight[900],
  '--color-approve-bg': appChrome.approveBg,
  '--color-approve-bg-hover': appChrome.approveBgHover,
  '--color-approve-text': appChrome.approveText,
  '--color-approve-border': appChrome.approveBorder,
  '--color-reject-bg': appChrome.rejectBg,
  '--color-reject-bg-hover': appChrome.rejectBgHover,
  '--color-reject-text': appChrome.rejectText,
  '--color-reject-border': appChrome.rejectBorder,
  '--color-pending-pill-bg': appChrome.pendingPillBg,
  '--color-pending-pill-text': appChrome.pendingPillText,
  '--color-pending-pill-border': appChrome.pendingPillBorder,
  '--color-approved-pill-bg': appChrome.approvedPillBg,
  '--color-approved-pill-text': appChrome.approvedPillText,
  '--color-approved-pill-border': appChrome.approvedPillBorder,
  '--color-rejected-pill-bg': appChrome.rejectedPillBg,
  '--color-rejected-pill-text': appChrome.rejectedPillText,
  '--color-rejected-pill-border': appChrome.rejectedPillBorder,
}

export const menubarPreset = {
  root: {
    background: surfaceLight[900],
    borderColor: surfaceLight[900],
    color: surfaceLight[50],
  },
  item: {
    focusBackground: 'color-mix(in srgb, #ffffff 10%, transparent)',
    activeBackground: primaryScale[100],
    color: surfaceLight[100],
    focusColor: surfaceLight[0],
    activeColor: primaryScale[900],
    icon: {
      color: 'color-mix(in srgb, #f8fafc 85%, transparent)',
      focusColor: surfaceLight[0],
      activeColor: primaryScale[700],
    },
  },
  mobileButton: {
    color: surfaceLight[50],
    hoverColor: surfaceLight[0],
    hoverBackground: 'color-mix(in srgb, #ffffff 10%, transparent)',
  },
} as const
