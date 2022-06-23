import { computed } from 'vue'
import { useDisplay } from 'vuetify/lib/framework.mjs'

export function useModelWrapper(props: any, emit: Function, name="modelValue") {
  return computed({
    get: () => props[name],
    set: (value) => emit(`update:${name}`, value)
  })
}

export function breakpoint() {
  const display = useDisplay()
  return display.name.value
}