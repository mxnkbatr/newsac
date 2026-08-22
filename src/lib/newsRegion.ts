import type { NewsRegion } from '../store/types'

export function resolveNewsRegion(item: { region?: string }): NewsRegion {
  if (item.region === 'foreign') return 'foreign'
  return 'domestic'
}

export function newsRegionLabel(region?: string) {
  if (region === 'foreign') return 'Гадаад'
  return 'Дотоод'
}

export function parseNewsRegion(value: unknown): NewsRegion {
  return String(value || '') === 'foreign' ? 'foreign' : 'domestic'
}
