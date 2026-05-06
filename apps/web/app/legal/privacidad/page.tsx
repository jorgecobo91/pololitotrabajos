import Link from 'next/link';

export const metadata = {
  title: 'Política de Privacidad — POLOLITOTRABAJOS',
  description: 'Política de Privacidad y Protección de Datos Personales de POLOLITOTRABAJOS.',
};

export default function PrivacidadPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto py-12 px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="text-violet-600 hover:underline">Inicio</Link>
          <span>/</span>
          <span>Legal</span>
          <span>/</span>
          <span className="text-gray-900 font-medium">Política de Privacidad</span>
        </nav>

        <h1 className="text-3xl font-bold mb-2 text-gray-900">
          Política de Privacidad y Protección de Datos Personales
        </h1>
        <p className="text-lg font-semibold text-gray-700 mb-6">POLOLITOTRABAJOS</p>
        <p className="text-sm text-gray-500 mb-10">Última actualización: 04 de mayo de 2026</p>

        {/* Intro */}
        <p className="text-gray-700 leading-7 mb-10">
          Esta Política de Privacidad describe la forma en que POLOLITOTRABAJOS recopila, utiliza, almacena, comunica, protege y elimina datos personales de los usuarios de la Plataforma, conforme a la Ley N° 19.628 sobre Protección de la Vida Privada, a la Ley N° 21.719 y demás normativa chilena aplicable.
        </p>

        {/* Tabla de contenidos */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-10">
          <p className="font-semibold text-gray-900 mb-3">Tabla de contenidos</p>
          <ol className="ml-6 space-y-1 text-sm text-violet-600 list-decimal">
            <li><a href="#responsable" className="hover:underline">Responsable del tratamiento</a></li>
            <li><a href="#datos-recopilados" className="hover:underline">Datos personales que podemos recopilar</a></li>
            <li><a href="#finalidades" className="hover:underline">Finalidades del tratamiento</a></li>
            <li><a href="#bases" className="hover:underline">Bases de licitud</a></li>
            <li><a href="#obligatorios" className="hover:underline">Datos obligatorios y voluntarios</a></li>
            <li><a href="#comunicacion" className="hover:underline">Comunicación y acceso por terceros</a></li>
            <li><a href="#transferencias" className="hover:underline">Transferencias y tratamiento internacional</a></li>
            <li><a href="#conservacion" className="hover:underline">Conservación de los datos</a></li>
            <li><a href="#derechos" className="hover:underline">Derechos del titular</a></li>
            <li><a href="#seguridad-info" className="hover:underline">Seguridad de la información</a></li>
            <li><a href="#incidentes" className="hover:underline">Incidentes o vulneraciones de seguridad</a></li>
            <li><a href="#menores" className="hover:underline">Menores de edad</a></li>
            <li><a href="#cookies" className="hover:underline">Cookies y tecnologías similares</a></li>
            <li><a href="#cambios" className="hover:underline">Cambios a esta Política</a></li>
          </ol>
        </div>

        {/* Secciones */}
        <div className="space-y-8">
          <section id="responsable">
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900">1. Responsable del tratamiento</h2>
            <p className="text-gray-700 leading-7 mb-4">
              El responsable del tratamiento de los datos personales es POLOLITOTRABAJOS, ubicada en Calama, Antofagasta, Chile. Para consultas relativas a privacidad y datos personales, el usuario podrá contactar a{' '}
              <a href="mailto:privacidad@pololitotrabajos.cl" className="text-violet-600 hover:underline">privacidad@pololitotrabajos.cl</a>.
            </p>
          </section>

          <section id="datos-recopilados">
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900">2. Datos personales que podemos recopilar</h2>
            <p className="text-gray-700 leading-7 mb-4">
              POLOLITOTRABAJOS podrá recopilar y tratar, según corresponda al uso del servicio, las siguientes categorías de datos:
            </p>
            <ul className="ml-6 space-y-2 text-gray-700 list-disc leading-7 mb-4">
              <li>Datos de identificación, como nombre, apellido, correo electrónico y teléfono.</li>
              <li>Datos de cuenta, autenticación y sesión.</li>
              <li>Datos de perfil, como oficio, especialidades, experiencia, comuna, región, zona de cobertura, disponibilidad y descripción profesional.</li>
              <li>Fotografías de perfil, portafolio, imágenes de trabajos y contenido asociado a publicaciones.</li>
              <li>Datos de geolocalización o ubicación, cuando el usuario los entregue o autorice.</li>
              <li>Mensajes, solicitudes de contacto, valoraciones, reportes y comunicaciones realizadas dentro de la Plataforma.</li>
              <li>Datos técnicos, como dirección IP, identificadores del dispositivo, tipo de navegador, sistema operativo, fecha y hora de acceso, logs y eventos de uso.</li>
              <li>Información derivada del soporte, reclamos, validaciones y medidas antifraude.</li>
            </ul>
          </section>

          <section id="finalidades">
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900">3. Finalidades del tratamiento</h2>
            <p className="text-gray-700 leading-7 mb-4">Los datos personales podrán ser tratados para las siguientes finalidades:</p>
            <ul className="ml-6 space-y-2 text-gray-700 list-disc leading-7 mb-4">
              <li>Crear, autenticar y administrar cuentas de usuario.</li>
              <li>Permitir la operación del marketplace y la conexión entre Clientes y Maestros.</li>
              <li>Publicar perfiles, solicitudes y contenidos cargados por los usuarios.</li>
              <li>Facilitar comunicaciones internas, solicitudes de contacto y funciones de chat.</li>
              <li>Gestionar soporte, denuncias, moderación y prevención de fraude o abuso.</li>
              <li>Mejorar la experiencia del usuario, la estabilidad, seguridad y rendimiento de la Plataforma.</li>
              <li>Enviar comunicaciones operativas, alertas de seguridad y notificaciones relacionadas con el servicio.</li>
              <li>Cumplir obligaciones legales, contractuales, regulatorias o requerimientos de autoridad competente.</li>
            </ul>
          </section>

          <section id="bases">
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900">4. Bases de licitud</h2>
            <p className="text-gray-700 leading-7 mb-4">
              POLOLITOTRABAJOS tratará datos personales con base en una o más de las siguientes circunstancias, según corresponda:
            </p>
            <ul className="ml-6 space-y-2 text-gray-700 list-disc leading-7 mb-4">
              <li>El consentimiento del titular cuando sea exigible.</li>
              <li>La necesidad del tratamiento para prestar los servicios solicitados por el usuario.</li>
              <li>El cumplimiento de obligaciones legales.</li>
              <li>El interés legítimo del responsable en resguardar la seguridad, prevenir fraude, mantener la continuidad operativa y mejorar el servicio, dentro de los límites legales aplicables.</li>
            </ul>
          </section>

          <section id="obligatorios">
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900">5. Datos obligatorios y voluntarios</h2>
            <p className="text-gray-700 leading-7 mb-4">
              Algunos datos son necesarios para crear una cuenta, autenticar al usuario, operar la Plataforma o habilitar ciertas funcionalidades. Si el usuario no entrega esos datos, POLOLITOTRABAJOS podrá no estar en condiciones de prestar total o parcialmente el servicio solicitado.
            </p>
            <p className="text-gray-700 leading-7 mb-4">
              Otros datos podrán ser opcionales y su entrega dependerá de la configuración del perfil, del uso de funcionalidades específicas o del consentimiento del usuario.
            </p>
          </section>

          <section id="comunicacion">
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900">6. Comunicación y acceso por terceros</h2>
            <p className="text-gray-700 leading-7 mb-4">
              POLOLITOTRABAJOS podrá comunicar o permitir acceso a datos personales a proveedores tecnológicos y prestadores de servicios que colaboren en la operación de la Plataforma, tales como servicios de autenticación, alojamiento, almacenamiento, base de datos, notificaciones, analítica, soporte, monitoreo o seguridad. Dichos terceros deberán actuar bajo deberes de confidencialidad y conforme a instrucciones y medidas de seguridad razonables.
            </p>
            <p className="text-gray-700 leading-7 mb-4">
              Asimismo, POLOLITOTRABAJOS podrá comunicar datos cuando exista obligación legal, requerimiento fundado de autoridad competente, necesidad de prevenir fraude o de proteger derechos, seguridad o integridad de la Plataforma, de sus usuarios o de terceros.
            </p>
          </section>

          <section id="transferencias">
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900">7. Transferencias y tratamiento internacional</h2>
            <p className="text-gray-700 leading-7 mb-4">
              Cuando, por razones tecnológicas u operativas, los datos sean almacenados o tratados mediante proveedores con infraestructura fuera de Chile, POLOLITOTRABAJOS adoptará medidas razonables para resguardar que dicho tratamiento mantenga estándares adecuados de seguridad, confidencialidad y protección de datos, conforme a la normativa aplicable y a las condiciones contractuales con sus proveedores.
            </p>
          </section>

          <section id="conservacion">
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900">8. Conservación de los datos</h2>
            <p className="text-gray-700 leading-7 mb-4">
              Los datos personales serán conservados durante el tiempo necesario para cumplir las finalidades para las cuales fueron recolectados, mantener la relación con el usuario, cumplir obligaciones legales, resolver controversias, ejercer defensas, prevenir fraude y mantener registros mínimos de trazabilidad y seguridad.
            </p>
            <p className="text-gray-700 leading-7 mb-4">
              Cuando proceda, los datos serán eliminados, anonimizados, cancelados o bloqueados conforme a la normativa aplicable, especialmente cuando su almacenamiento carezca de fundamento legal o hayan dejado de ser necesarios para la finalidad correspondiente.
            </p>
          </section>

          <section id="derechos">
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900">9. Derechos del titular</h2>
            <p className="text-gray-700 leading-7 mb-4">
              El titular de los datos podrá ejercer los derechos que le reconozca la legislación chilena vigente, incluyendo, según corresponda, derecho de acceso, rectificación, supresión, oposición, portabilidad, bloqueo y demás derechos legalmente procedentes.
            </p>
            <p className="text-gray-700 leading-7 mb-4">
              Para ejercer estos derechos, el usuario podrá escribir a{' '}
              <a href="mailto:privacidad@pololitotrabajos.cl" className="text-violet-600 hover:underline">privacidad@pololitotrabajos.cl</a>, indicando al menos su nombre, medio de contacto y el derecho que desea ejercer, junto con antecedentes que permitan verificar razonablemente su identidad.
            </p>
          </section>

          <section id="seguridad-info">
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900">10. Seguridad de la información</h2>
            <p className="text-gray-700 leading-7 mb-4">
              POLOLITOTRABAJOS adopta medidas técnicas y organizativas razonables y apropiadas para proteger los datos personales frente a pérdida, acceso no autorizado, alteración, filtración, divulgación o destrucción indebida. Estas medidas pueden incluir control de acceso, autenticación, cifrado en tránsito, seudonimización cuando corresponda, respaldos, monitoreo, segmentación de permisos, registro de actividad y procedimientos de respuesta ante incidentes.
            </p>
          </section>

          <section id="incidentes">
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900">11. Incidentes o vulneraciones de seguridad</h2>
            <p className="text-gray-700 leading-7 mb-4">
              En caso de incidentes de seguridad que puedan afectar significativamente los derechos de los titulares o la integridad de la información, POLOLITOTRABAJOS adoptará medidas de contención, investigación, mitigación y, cuando corresponda legalmente, notificará a las autoridades y/o a los titulares afectados en conformidad a la normativa vigente.
            </p>
          </section>

          <section id="menores">
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900">12. Menores de edad</h2>
            <p className="text-gray-700 leading-7 mb-4">
              La Plataforma no está dirigida a menores de 18 años. POLOLITOTRABAJOS no busca recopilar deliberadamente datos personales de menores. Si se detecta una cuenta o contenido asociado a una persona menor de edad, podremos adoptar medidas de restricción, suspensión o eliminación de la información correspondiente.
            </p>
          </section>

          <section id="cookies">
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900">13. Cookies y tecnologías similares</h2>
            <p className="text-gray-700 leading-7 mb-4">
              POLOLITOTRABAJOS podrá utilizar cookies, identificadores, SDKs y tecnologías similares para autenticar sesiones, recordar preferencias, mejorar funcionalidades, medir uso, reforzar seguridad y obtener métricas operativas. Cuando la normativa aplicable lo exija, se solicitarán los consentimientos correspondientes.
            </p>
          </section>

          <section id="cambios">
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900">14. Cambios a esta Política</h2>
            <p className="text-gray-700 leading-7 mb-4">
              POLOLITOTRABAJOS podrá modificar esta Política de Privacidad en cualquier momento para adaptarla a cambios legales, regulatorios, tecnológicos u operativos. La versión vigente será la publicada en la Plataforma con su fecha de actualización.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Última actualización: 04 de mayo de 2026</p>
          <div className="flex flex-wrap gap-4 text-sm mb-6">
            <Link href="/legal/terminos" className="text-violet-600 hover:underline">Términos y Condiciones</Link>
            <Link href="/legal/seguridad" className="text-violet-600 hover:underline">Política de Seguridad</Link>
          </div>
          <Link href="/" className="inline-flex items-center gap-1 text-violet-600 font-bold text-sm hover:underline">
            &larr; Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
