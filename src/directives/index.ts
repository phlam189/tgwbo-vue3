/**
 * Directive click outside
 * ex <div v-click-outside="handleClickOutside" />
 */

export const clickOutside = {
  beforeMount: function (el: Element, binding: any) {
    binding.event = function (event: any) {
      const { width, height, top, bottom, left, right } = event.target.getBoundingClientRect()
      const outside = () => {
        if (width === 0 && height === 0) {
          return false
        }
        if (
          Number(top) < Number(el.getBoundingClientRect().bottom) ||
          Number(bottom) > Number(el.getBoundingClientRect().top) ||
          Number(right) < Number(el.getBoundingClientRect().left) ||
          Number(left) < Number(el.getBoundingClientRect().right)
        ) {
          return true
        }
        return false
      }

      if (!(el.parentElement === event.target || el.parentElement?.contains(event.target)) && outside()) {
        if (binding.value instanceof Function) {
          binding.value(event)
        }
      }
    }
    document.body.addEventListener('click', binding.event)
  },

  unmounted: function (el: Element, binding: any) {
    document.body.removeEventListener('click', binding.event)
  },
}

export const sliceName = {
  beforeMount: function (el: Element) {
    el.addEventListener('keydown', (e: any) => {
      const elInput = el.getElementsByTagName('input')

      if (
        elInput.length &&
        elInput[0].value &&
        elInput[0].value.length >= 20 &&
        e.keyCode !== 8 &&
        e.keyCode !== 37 &&
        e.keyCode !== 39
      ) {
        return e.preventDefault()
      } else {
        return true
      }
    })
  },
}

export const sliceMemo = {
  beforeMount: function (el: Element) {
    el.addEventListener('keydown', (e: any) => {
      const elInput = el.getElementsByTagName('input')

      if (
        elInput.length &&
        elInput[0].value &&
        elInput[0].value.length >= 150 &&
        e.keyCode !== 8 &&
        e.keyCode !== 37 &&
        e.keyCode !== 39
      ) {
        return e.preventDefault()
      } else {
        return true
      }
    })
  },
}

export const replaceNumTrans = {
  beforeMount: function (el: Element) {
    el.addEventListener('input', (e: any) => {
      e.target.value = e.target.value.replace(/[.-]/g, '')
    })
  },
}

export const replaceProfit = {
  beforeMount: function (el: Element) {
    el.addEventListener('input', (e: any) => {
      e.target.value = e.target.value.replace(/[.]/g, '')
    })

    el.addEventListener('keydown', (e: any) => {
      const elInput = el.getElementsByTagName('input')

      const findMinus = elInput[0].value.indexOf('-')
      const slitValue =
        findMinus !== -1
          ? elInput[0].value.length - 1
          : e.keyCode === 109
          ? elInput[0].value.length + 1
          : elInput[0].value.length

      if (
        elInput.length &&
        elInput[0].value &&
        slitValue >= (e.keyCode === 109 ? 12 : 11) &&
        e.keyCode !== 8 &&
        e.keyCode !== 37 &&
        e.keyCode !== 39 &&
        e.keyCode !== 109
      ) {
        return e.preventDefault()
      } else {
        return true
      }
    })
  },
}

export const replaceWM = {
  beforeMount: function (el: Element) {
    el.addEventListener('input', (e: any) => {
      e.target.value = e.target.value.replace(/[.-]/g, '')
    })

    el.addEventListener('keydown', (e: any) => {
      const elInput = el.getElementsByTagName('input')

      if (
        elInput.length &&
        elInput[0].value &&
        elInput[0].value.length >= 11 &&
        e.keyCode !== 8 &&
        e.keyCode !== 37 &&
        e.keyCode !== 39
      ) {
        return e.preventDefault()
      } else {
        return true
      }
    })
  },
}

export const replaceRate = {
  beforeMount: function (el: Element) {
    el.addEventListener('keydown', (e: any) => {
      const elInput = el.getElementsByTagName('input')
      const rex = /(?<=\.).{1}/g

      if (
        elInput.length &&
        elInput[0].value &&
        rex.test(elInput[0].value) &&
        e.keyCode !== 8 &&
        e.keyCode !== 37 &&
        e.keyCode !== 39
      ) {
        return e.preventDefault()
      } else {
        return true
      }
    })
  },
}
