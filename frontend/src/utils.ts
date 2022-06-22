import { computed } from 'vue'

export function useModelWrapper(props: any, emit: Function, name="modelValue") {
  return computed({
    get: () => props[name],
    set: (value) => emit(`update:${name}`, value)
  })
}