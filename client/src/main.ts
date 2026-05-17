import '@/theme/applyRootPalette'
import '@/assets/main.css'

import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import { definePreset } from '@primeuix/themes'

import 'primeicons/primeicons.css'

import { auraLightSemantic, menubarPreset, primaryScale, surfaceLight } from '@/theme/palette'

const faviconBase = import.meta.env.BASE_URL
document.getElementById('favicon')?.setAttribute('href', `${faviconBase}favicon.svg`)

const AppTheme = definePreset(Aura, {
  primitive: {
    borderRadius: {
      none: '0',
      xs: '4px',
      sm: '4px',
      md: '4px',
      lg: '4px',
      xl: '4px',
    },
  },
  semantic: {
    primary: primaryScale,
    colorScheme: {
      light: {
        surface: surfaceLight,
        ...auraLightSemantic,
      },
    },
  },
  components: {
    button: {
      root: {
        borderRadius: '4px',
        roundedBorderRadius: '4px',
      },
    },
    dialog: {
      root: {
        borderRadius: '4px',
      },
    },
    select: {
      root: {
        paddingX: '16px',
        paddingY: 'calc(4px + 1.91px)',
      },
    },
    menubar: menubarPreset,
  },
})

const app = createApp(App)

app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: AppTheme,
  },
})

app.mount('#app')
