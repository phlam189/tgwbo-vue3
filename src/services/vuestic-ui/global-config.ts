import VaIcon from './components/va-icon'
import iconsConfig from './icons-config/icons-config'
// import { COLOR_THEMES } from './themes'

export default {
  colors: {
    primary: '#1C78DD',
    secondary: '#788B9A',
    info: '#20CDE5',
    danger: '#BC0909',
    light: '#E4E4E4',
    //   presets: {
    //     original: {
    //       ...COLOR_THEMES[3].colors,
    //     },
    //   },
  },
  icons: iconsConfig,
  breakpoint: {
    enabled: true,
    bodyClass: true,
    thresholds: {
      xs: 0,
      sm: 320,
      md: 640,
      lg: 1024,
      xl: 1440,
    },
  },
  components: {
    VaIcon,
    VaButton: {
      // round: true,
    },
    presets: {
      VaButton: {
        outline: {
          // backgroundOpacity: 0,
          // hoverBehaviour: 'opacity',
          // hoverOpacity: 0.07,
          // pressedBehaviour: 'opacity',
          // pressedOpacity: 0.13,
        },
        plain: {
          // round: false,
          // plain: true,
          // hoverBehaviour: 'mask',
          // hoverOpacity: 0.15,
          // pressedBehaviour: 'mask',
          // pressedOpacity: 0.13,
        },
      },
    },
  },
}
