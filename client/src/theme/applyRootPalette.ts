import { rootCssVariables } from '@/theme/palette'

const root = document.documentElement

for (const [name, value] of Object.entries(rootCssVariables)) {
  root.style.setProperty(name, value)
}
