import type { NewsRegion } from '../store/types'

export function resolveNewsRegion(item: { region?: string }): NewsRegion {
  if (item.region === 'foreign') return 'foreign'
  if (item.region === 'yellow') return 'yellow'
  return 'domestic'
}

export function newsRegionLabel(region?: string) {
  if (region === 'foreign') return 'Гадаад'
  if (region === 'yellow') return 'Шар'
  return 'Дотоод'
}

export function parseNewsRegion(value: unknown): NewsRegion {
  const v = String(value || '')
  if (v === 'foreign' || v === 'yellow') return v
  return 'domestic'
}
