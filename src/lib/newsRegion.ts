import type { NewsRegion } from '../store/types'

export function resolveNewsRegion(item: { region?: string }): NewsRegion {
  if (item.region === 'foreign') return 'foreign'
  if (item.region === 'kpop') return 'kpop'
  if (item.region === 'yellow') return 'yellow'
  return 'domestic'
}

export function newsRegionLabel(region?: string) {
  if (region === 'foreign') return 'Гадаад'
  if (region === 'kpop') return 'K-pop'
  if (region === 'yellow') return 'Шар'
  return 'Дотоод'
}

export function parseNewsRegion(value: unknown): NewsRegion {
  const v = String(value || '')
  if (v === 'foreign' || v === 'kpop' || v === 'yellow') return v
  return 'domestic'
}
