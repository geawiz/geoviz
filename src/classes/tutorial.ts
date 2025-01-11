export type Tutorials = Tutorial[]

export interface Tutorial {
  title: string
  subtitle: string
  mapType: string
  maps: Map[]
}

export interface Map {
  protocol: string
  protocolData?: string
  centerLng?: number
  centerLat?: number
  zoom?: number
  source?: Source
  layer?: Layer
}

export interface Source {
  name: string
  type: string
  url: string
  tileSize?: number
  minzoom?: number
  maxzoom?: number
}

export interface Layer {
  id: string
  source: string
  sourceLayer: string
  type: string
  paint?: Paint
}

export interface Paint {
  fillColor: string
  fillCutlineColor: string
  fillOpacity: number
}
