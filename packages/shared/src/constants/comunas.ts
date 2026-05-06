/**
 * Comunas chilenas agrupadas por región. Fuente de verdad para web y mobile.
 */

export const COMUNAS_POR_REGION: Record<string, string[]> = {
  'Antofagasta': [
    'Calama', 'Antofagasta', 'Tocopilla', 'Mejillones', 'Sierra Gorda',
    'María Elena', 'San Pedro de Atacama', 'Ollagüe', 'Taltal',
  ],
  'Metropolitana': [
    'Santiago Centro', 'Providencia', 'Las Condes', 'Ñuñoa', 'La Florida',
    'Maipú', 'Puente Alto', 'San Bernardo', 'Estación Central', 'Quinta Normal',
    'Recoleta', 'Independencia', 'Conchalí', 'Renca', 'Pudahuel',
    'Cerro Navia', 'Lo Prado', 'La Cisterna', 'La Granja', 'San Ramón',
    'Peñalolén', 'Macul', 'Huechuraba', 'Colina', 'Lampa',
    'Til Til', 'San José de Maipo', 'Pirque', 'Paine', 'Buin',
    'Calera de Tango', 'Isla de Maipo', 'El Monte', 'Talagante', 'Melipilla',
    'Curacaví', 'María Pinto', 'Alhué',
  ],
  'Valparaíso': [
    'Viña del Mar', 'Valparaíso', 'Villa Alemana', 'Quilpué', 'Concón',
    'Quintero', 'Casablanca', 'Limache', 'San Antonio', 'Quillota',
  ],
};

export const REGIONES = Object.keys(COMUNAS_POR_REGION);

// Legacy flat list (mobile may still consume this)
export interface Comuna {
  nombre: string;
  region: string;
}

export const COMUNAS: Comuna[] = Object.entries(COMUNAS_POR_REGION).flatMap(
  ([region, comunas]) => comunas.map((nombre) => ({ nombre, region }))
);
