// Design tokens — import from here instead of repeating values inline
export const colors = {
  primary:       '#FC3276',
  primaryDark:   '#db2777',
  primaryLight:  '#fff5f9',
  primaryBorder: '#fce7f3',

  secondary:     '#FD7751',

  dark:          '#0f172a',
  darkMid:       '#1e293b',
  darkLight:     '#334155',

  text:          '#1e293b',
  textMid:       '#475569',
  textLight:     '#64748b',
  textMuted:     '#94a3b8',

  border:        '#e2e8f0',
  surface:       '#f8fafc',
  white:         '#ffffff',

  success:       '#10b981',
  error:         '#ef4444',

  grayMid:       '#64748b',
  grayDark:      '#475569',
};

export const gradients = {
  primary: 'linear-gradient(135deg, #FC3276 0%, #db2777 100%)',
  gray:    'linear-gradient(135deg, #64748b 0%, #475569 100%)',
  header:  'linear-gradient(90deg, #be123c 0%, #7e22ce 100%)',
  bar:     'linear-gradient(to right, #FC3276, #FD7751)',
};

export const shadows = {
  primary: '0 4px 18px rgba(252,50,118,0.35)',
  gray:    '0 4px 18px rgba(100,116,139,0.25)',
  card:    '0 2px 10px rgba(0,0,0,0.05)',
  sm:      '0 1px 3px rgba(0,0,0,0.1)',
};

export const radii = {
  sm:   '8px',
  md:   '12px',
  lg:   '16px',
  full: '9999px',
};

// Reusable button style factories
export const btnIA = (state = 'default') => ({
  background:    state === 'loading'  ? '#cbd5e0'
               : state === 'active'   ? gradients.gray
               : gradients.primary,
  color:         '#ffffff',
  border:        'none',
  borderRadius:  radii.md,
  fontWeight:    '700',
  fontSize:      '14px',
  letterSpacing: '0.5px',
  cursor:        state === 'loading' ? 'not-allowed' : 'pointer',
  boxShadow:     state === 'loading' ? 'none'
               : state === 'active'  ? shadows.gray
               : shadows.primary,
  padding:       '15px',
  width:         '100%',
});

export const card = {
  backgroundColor: colors.white,
  borderRadius:    radii.lg,
  border:          `1px solid ${colors.border}`,
  boxShadow:       shadows.card,
  padding:         '24px',
};
