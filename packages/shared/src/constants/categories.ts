/**
 * Catálogo canónico de oficios y especialidades.
 * Fuente de verdad para web y mobile.
 */

export const OFICIOS = [
  'Electricista',
  'Gasfitería',
  'Construcción',
  'Carpintería',
  'Pintura',
  'Techumbre',
  'Cerrajería',
  'Jardinería',
  'Mueblería',
  'Plomería',
  'Albañilería',
  'Herrería',
  'Soldadura',
  'Instalación de equipos',
  'Reparación de electrodomésticos',
  'Vidriería',
  'Ventilación y aire acondicionado',
  'Calefacción',
  'Insulación térmica',
  'Tapicería',
  'Limpieza especializada',
  'Desinfección',
  'Mantenimiento de piscinas',
  'Riego y sistemas de riego',
  'Arboricultura',
  'Diseño de interiores',
  'Arquitectura',
] as const;

export type Oficio = typeof OFICIOS[number];

export const ESPECIALIDADES_POR_OFICIO: Record<string, string[]> = {
  Electricista: [
    'Instalación SEC', 'Tableros eléctricos', 'Domótica', 'Paneles solares',
    'Iluminación LED', 'Emergencias 24/7', 'Cableado estructurado', 'Mantención preventiva',
  ],
  Gasfitería: [
    'Instalación de gasfitería', 'Reparación de tuberías', 'Instalación de calefactores', 'Reparación de llaves',
    'Desagüe y alcantarillado', 'Gas natural', 'Emergencias', 'Mantención',
  ],
  Construcción: [
    'Obra nueva', 'Ampliaciones', 'Remodelaciones', 'Estructuras',
    'Hormigón armado', 'Albañilería', 'Instalaciones',
  ],
  Carpintería: [
    'Muebles a medida', 'Puertas y marcos', 'Pisos de madera', 'Reparación de muebles',
    'Diseño interior', 'Acabados', 'Construcción en madera',
  ],
  Pintura: [
    'Pintura interior', 'Pintura exterior', 'Papel mural', 'Impermeabilización',
    'Restauración', 'Acabados especiales', 'Murales',
  ],
  Techumbre: [
    'Reparación de techos', 'Impermeabilización', 'Cambio de cubierta',
    'Limpieza de canaletas', 'Instalación de tragaluces',
  ],
  Cerrajería: [
    'Cerraduras de seguridad', 'Aberturas forzadas', 'Reparación de cerraduras',
    'Instalación de puertas', 'Rejas de seguridad',
  ],
  Jardinería: [
    'Diseño de jardines', 'Mantención de jardines', 'Poda de árboles',
    'Riego automático', 'Paisajismo', 'Control de plagas',
  ],
  Mueblería: [
    'Fabricación de muebles', 'Reparación de muebles', 'Tapizado',
    'Restauración', 'Diseño personalizado',
  ],
  Plomería: [
    'Instalación de tuberías', 'Reparación de cañerías', 'Limpieza de tuberías',
    'Emergencias', 'Cisternas', 'Desagües',
  ],
  Albañilería: [
    'Muros', 'Enchapes', 'Alisados', 'Demoliciones', 'Remodelaciones',
  ],
  Herrería: [
    'Rejas', 'Puertas de hierro', 'Estructuras metálicas',
    'Barandas', 'Trabajos a medida',
  ],
  Soldadura: [
    'Soldadura en general', 'Acero inoxidable', 'Aluminio', 'Estructuras metálicas',
  ],
  'Instalación de equipos': [
    'Aire acondicionado', 'Calefacción', 'Sistemas de riego',
    'Antenas', 'Paneles solares',
  ],
  'Reparación de electrodomésticos': [
    'Refrigeradores', 'Lavadoras', 'Hornos', 'Microondas', 'Secadoras',
  ],
  Vidriería: [
    'Cristales', 'Espejos', 'Ventanas', 'Puertas de vidrio', 'Templado',
  ],
  'Ventilación y aire acondicionado': [
    'Instalación de equipos', 'Mantenimiento', 'Limpieza de filtros',
    'Reparación', 'Diseño de sistemas',
  ],
  Calefacción: [
    'Instalación de calefactores', 'Reparación de radiadores',
    'Mantenimiento', 'Sistemas de calefacción central',
  ],
  'Insulación térmica': [
    'Aislamiento de techos', 'Aislamiento de muros', 'Aislamiento de tuberías',
  ],
  Tapicería: [
    'Sofás', 'Sillas', 'Almohadas', 'Reparación de muebles',
  ],
  'Limpieza especializada': [
    'Limpieza profunda', 'Alfombras', 'Tapizados', 'Cristales de altura',
  ],
  Desinfección: [
    'Fumigación', 'Control de plagas', 'Desinfección COVID', 'Sanitización',
  ],
  'Mantenimiento de piscinas': [
    'Limpieza', 'Tratamiento químico', 'Reparación de bombas', 'Mantenimiento de filtros',
  ],
  'Riego y sistemas de riego': [
    'Instalación de sistemas', 'Mantenimiento', 'Riego automático', 'Reparación de tuberías',
  ],
  Arboricultura: [
    'Poda de árboles', 'Eliminación de árboles', 'Tratamiento de plagas', 'Injertos',
  ],
  'Diseño de interiores': [
    'Asesoramiento', 'Diseño 3D', 'Decoración', 'Espacios comerciales',
  ],
  Arquitectura: [
    'Proyectos residenciales', 'Proyectos comerciales', 'Diseño estructural', 'Asesoramiento',
  ],
};

export const EXPERIENCIA_OPTIONS = [
  { label: '< 1 año', value: '0' },
  { label: '1-3 años', value: '2' },
  { label: '3-5 años', value: '4' },
  { label: '5-10 años', value: '7' },
  { label: '10-20 años', value: '15' },
  { label: '> 20 años', value: '25' },
] as const;

// Legacy alias — for any code still using CATEGORIAS
export interface Categoria {
  id: string;
  nombre: string;
  icon: string;
}

export const CATEGORIAS: Categoria[] = OFICIOS.map((nombre) => ({
  id: nombre.toLowerCase().replace(/\s+/g, '-').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/é/g, 'e').replace(/á/g, 'a'),
  nombre,
  icon: 'wrench',
}));
