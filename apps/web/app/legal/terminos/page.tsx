import Link from 'next/link';

export const metadata = {
  title: 'Términos y Condiciones — POLOLITOTRABAJOS',
  description: 'Términos y Condiciones de Uso de la plataforma POLOLITOTRABAJOS.',
};

export default function TerminosPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto py-12 px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="text-violet-600 hover:underline">Inicio</Link>
          <span>/</span>
          <span>Legal</span>
          <span>/</span>
          <span className="text-gray-900 font-medium">Términos y Condiciones</span>
        </nav>

        <h1 className="text-3xl font-bold mb-2 text-gray-900">
          Términos y Condiciones de Uso
        </h1>
        <p className="text-lg font-semibold text-gray-700 mb-6">POLOLITOTRABAJOS</p>
        <p className="text-sm text-gray-500 mb-10">Última actualización: 04 de mayo de 2026</p>

        {/* Tabla de contenidos */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-10">
          <p className="font-semibold text-gray-900 mb-3">Tabla de contenidos</p>
          <ol className="ml-6 space-y-1 text-sm text-violet-600 list-decimal">
            <li><a href="#naturaleza" className="hover:underline">Naturaleza del servicio</a></li>
            <li><a href="#intermediario" className="hover:underline">Calidad de intermediario</a></li>
            <li><a href="#requisitos" className="hover:underline">Requisitos de uso</a></li>
            <li><a href="#registro" className="hover:underline">Registro y cuenta</a></li>
            <li><a href="#usuarios" className="hover:underline">Tipos de usuarios</a></li>
            <li><a href="#publicaciones" className="hover:underline">Publicaciones, perfiles y contenido</a></li>
            <li><a href="#conducta" className="hover:underline">Conducta prohibida</a></li>
            <li><a href="#verificacion" className="hover:underline">Verificación y antecedentes</a></li>
            <li><a href="#pagos" className="hover:underline">Pagos y cobros</a></li>
            <li><a href="#limitacion" className="hover:underline">Limitación de responsabilidad</a></li>
            <li><a href="#disponibilidad" className="hover:underline">Disponibilidad, cambios y mantenimiento</a></li>
            <li><a href="#propiedad" className="hover:underline">Propiedad intelectual</a></li>
            <li><a href="#datos" className="hover:underline">Protección de datos personales</a></li>
            <li><a href="#denuncias" className="hover:underline">Denuncias y soporte</a></li>
            <li><a href="#modificaciones" className="hover:underline">Modificaciones a los Términos</a></li>
            <li><a href="#ley" className="hover:underline">Ley aplicable y jurisdicción</a></li>
          </ol>
        </div>

        {/* Intro */}
        <div className="text-gray-700 leading-7 mb-8 space-y-4">
          <p>
            Estos Términos y Condiciones de Uso regulan el acceso, navegación, registro y utilización de la plataforma digital POLOLITOTRABAJOS, disponible a través de su sitio web, aplicación móvil y/o cualquier otro canal digital habilitado por POLOLITOTRABAJOS, ubicada en Calama, Antofagasta, Chile, correo de contacto{' '}
            <a href="mailto:soporte@pololitotrabajos.cl" className="text-violet-600 hover:underline">soporte@pololitotrabajos.cl</a>, en adelante, &quot;POLOLITOTRABAJOS&quot;, &quot;la Plataforma&quot;, &quot;nosotros&quot; o &quot;nuestro&quot;.
          </p>
          <p>
            Al registrarse, acceder o utilizar la Plataforma, el usuario declara haber leído, entendido y aceptado íntegramente estos Términos y Condiciones, así como la Política de Privacidad y la Política de Seguridad y Uso Aceptable vigentes. Si el usuario no está de acuerdo con estos documentos, deberá abstenerse de utilizar la Plataforma.
          </p>
        </div>

        {/* Secciones */}
        <div className="space-y-8">
          <section id="naturaleza">
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900">1. Naturaleza del servicio</h2>
            <p className="text-gray-700 leading-7 mb-4">
              POLOLITOTRABAJOS es una plataforma tecnológica de intermediación digital que permite conectar a personas que buscan servicios de oficios, reparaciones, mantenciones o trabajos puntuales, en adelante &quot;Clientes&quot;, con personas naturales o jurídicas que ofrecen dichos servicios, en adelante &quot;Maestros&quot;.
            </p>
            <p className="text-gray-700 leading-7 mb-4">
              La Plataforma tiene por objeto facilitar la publicación de solicitudes, la exhibición de perfiles, la comunicación entre usuarios y, eventualmente, otras funcionalidades complementarias relacionadas con la coordinación de servicios. POLOLITOTRABAJOS no ejecuta trabajos, no presta servicios técnicos u oficios por cuenta propia, no supervisa obras, no reemplaza evaluación técnica profesional y no actúa como empleador, contratista, subcontratista, mandatario, asegurador ni representante de los usuarios.
            </p>
          </section>

          <section id="intermediario">
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900">2. Calidad de intermediario</h2>
            <p className="text-gray-700 leading-7 mb-4">
              POLOLITOTRABAJOS actúa exclusivamente como intermediario tecnológico. En consecuencia, no forma parte del acuerdo, contrato, trato, cotización, negociación o relación jurídica que se genere entre Clientes y Maestros.
            </p>
            <p className="text-gray-700 leading-7 mb-4">
              Toda contratación, coordinación, presupuesto, ejecución, pago, reembolso, garantía, posventa, reclamo técnico, incumplimiento o controversia derivada de un servicio ofrecido o contratado a través de la Plataforma será de responsabilidad exclusiva de los usuarios involucrados, salvo en aquellos casos en que la ley chilena imponga una responsabilidad irrenunciable al operador de la Plataforma.
            </p>
          </section>

          <section id="requisitos">
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900">3. Requisitos de uso</h2>
            <p className="text-gray-700 leading-7 mb-4">
              Solo podrán utilizar POLOLITOTRABAJOS personas mayores de 18 años con capacidad legal suficiente para contratar. El usuario declara y garantiza que la información proporcionada al registrarse y durante el uso de la Plataforma es veraz, completa, exacta y actualizada.
            </p>
            <p className="text-gray-700 leading-7 mb-4">
              POLOLITOTRABAJOS podrá solicitar antecedentes adicionales, verificaciones o confirmaciones de identidad cuando lo estime razonablemente necesario para proteger la seguridad, prevenir fraude o cumplir obligaciones legales.
            </p>
          </section>

          <section id="registro">
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900">4. Registro y cuenta</h2>
            <p className="text-gray-700 leading-7 mb-4">
              Para acceder a determinadas funcionalidades, el usuario deberá crear una cuenta y mantener la confidencialidad de sus credenciales de acceso. El usuario será responsable por toda actividad realizada desde su cuenta, salvo que haya informado oportunamente un uso no autorizado y POLOLITOTRABAJOS no haya adoptado medidas razonables dentro de sus posibilidades.
            </p>
            <p className="text-gray-700 leading-7 mb-4">
              Nos reservamos el derecho de suspender, restringir o cancelar cuentas en caso de incumplimiento de estos Términos, uso indebido de la Plataforma, sospecha de fraude, denuncias fundadas, entrega de información falsa o riesgo para otros usuarios o para la seguridad del servicio.
            </p>
          </section>

          <section id="usuarios">
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900">5. Tipos de usuarios</h2>
            <h3 className="text-lg font-semibold mt-6 mb-3 text-gray-900">5.1 Clientes</h3>
            <p className="text-gray-700 leading-7 mb-4">
              Los Clientes podrán buscar Maestros, revisar perfiles, publicar solicitudes de trabajo, enviar mensajes, coordinar servicios y utilizar las demás herramientas disponibles dentro de la Plataforma.
            </p>
            <h3 className="text-lg font-semibold mt-6 mb-3 text-gray-900">5.2 Maestros</h3>
            <p className="text-gray-700 leading-7 mb-4">
              Los Maestros podrán crear perfiles, publicar información sobre sus servicios, experiencia, especialidades, disponibilidad, zonas de cobertura, imágenes de trabajos, datos de contacto habilitados por la Plataforma y demás antecedentes permitidos por el sistema.
            </p>
            <p className="text-gray-700 leading-7 mb-4">
              Cada usuario será el único responsable de la información, manifestaciones, promesas, ofertas, imágenes, credenciales y datos que publique o comunique a través de la Plataforma.
            </p>
          </section>

          <section id="publicaciones">
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900">6. Publicaciones, perfiles y contenido</h2>
            <p className="text-gray-700 leading-7 mb-4">
              El usuario es exclusivamente responsable del contenido que publique, suba, comparta, almacene o transmita mediante la Plataforma, incluyendo textos, fotografías, imágenes, descripciones, documentos, antecedentes técnicos, referencias, valoraciones y mensajes.
            </p>
            <p className="text-gray-700 leading-7 mb-4">Al publicar contenido, el usuario declara que:</p>
            <ol className="ml-6 space-y-2 text-gray-700 list-decimal leading-7 mb-4">
              <li>Tiene derecho a usarlo y publicarlo.</li>
              <li>La información es verdadera y no induce a error.</li>
              <li>No infringe derechos de terceros, incluidos derechos de autor, marcas, imagen, honra, privacidad o datos personales.</li>
              <li>Cuenta con autorizaciones suficientes cuando el contenido incluye información o imágenes de terceros.</li>
            </ol>
            <p className="text-gray-700 leading-7 mb-4">
              POLOLITOTRABAJOS podrá, sin obligación de revisión previa general, eliminar, bloquear, ocultar, desindexar o restringir contenido cuando estime que infringe estos Términos, la ley, derechos de terceros, la seguridad de la Plataforma o la confianza del ecosistema.
            </p>
          </section>

          <section id="conducta">
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900">7. Conducta prohibida</h2>
            <p className="text-gray-700 leading-7 mb-4">Se prohíbe a los usuarios:</p>
            <ul className="ml-6 space-y-2 text-gray-700 list-disc leading-7 mb-4">
              <li>Publicar información falsa, engañosa, fraudulenta o suplantando identidad.</li>
              <li>Ofrecer servicios ilícitos o contrarios a la normativa aplicable.</li>
              <li>Publicar contenido ofensivo, difamatorio, discriminatorio, amenazante, obsceno o acosador.</li>
              <li>Solicitar pagos engañosos o anticipos fraudulentos.</li>
              <li>Intentar desviar usuarios para fines ilícitos.</li>
              <li>Compartir malware, código malicioso o realizar acciones que afecten la integridad de la Plataforma.</li>
              <li>Extraer datos masivamente, hacer scraping no autorizado o intentar vulnerar sistemas.</li>
              <li>Publicar datos personales de terceros sin base legal o consentimiento suficiente.</li>
              <li>Utilizar la Plataforma para lavado de activos, estafas, amenazas, hostigamiento o cualquier actividad ilegal.</li>
            </ul>
          </section>

          <section id="verificacion">
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900">8. Verificación y antecedentes</h2>
            <p className="text-gray-700 leading-7 mb-4">
              POLOLITOTRABAJOS podrá ofrecer mecanismos de verificación de identidad, correo electrónico, teléfono, perfil u otros antecedentes. Salvo que la Plataforma señale expresamente lo contrario, cualquier verificación disponible no constituye certificación técnica, licencia profesional, garantía de idoneidad, habilitación legal para ejercer un oficio, solvencia económica ni validación integral del usuario.
            </p>
            <p className="text-gray-700 leading-7 mb-4">
              El Cliente entiende y acepta que debe evaluar por sí mismo la conveniencia de contratar, solicitar cotización, revisar referencias, exigir boletas o facturas si corresponde, verificar permisos, licencias, certificaciones, seguros o cualquier otra condición técnica o legal del Maestro antes de contratar.
            </p>
          </section>

          <section id="pagos">
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900">9. Pagos y cobros</h2>
            <p className="text-gray-700 leading-7 mb-4">
              A la fecha de esta versión, POLOLITOTRABAJOS puede operar como plataforma gratuita o con funcionalidades gratuitas y/o pagadas, según se informe en la Plataforma. Cualquier cobro futuro por publicaciones destacadas, suscripciones, comisiones, verificación, servicios premium u otras prestaciones será informado previamente en forma clara, visible y accesible.
            </p>
            <p className="text-gray-700 leading-7 mb-4">
              Salvo que la Plataforma indique expresamente lo contrario en una funcionalidad específica, POLOLITOTRABAJOS no recauda, custodia ni garantiza pagos entre Clientes y Maestros. Los pagos pactados entre usuarios son de su exclusiva responsabilidad.
            </p>
          </section>

          <section id="limitacion">
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900">10. Limitación de responsabilidad</h2>
            <p className="text-gray-700 leading-7 mb-4">POLOLITOTRABAJOS no garantiza:</p>
            <ul className="ml-6 space-y-2 text-gray-700 list-disc leading-7 mb-4">
              <li>La disponibilidad de Maestros o Clientes.</li>
              <li>La celebración efectiva de acuerdos entre usuarios.</li>
              <li>La calidad, seguridad, legalidad, oportunidad o resultado de los trabajos.</li>
              <li>La exactitud absoluta de perfiles, valoraciones, descripciones o publicaciones.</li>
              <li>La continuidad ininterrumpida o libre de errores del servicio.</li>
            </ul>
            <p className="text-gray-700 leading-7 mb-4">
              En la máxima medida permitida por la legislación chilena, POLOLITOTRABAJOS no será responsable por daños directos o indirectos, lucro cesante, pérdida de oportunidad, daño emergente, daño moral, perjuicios por trabajos defectuosos, fallas técnicas, fraudes, incumplimientos, accidentes, lesiones, daños a la propiedad, controversias de pago o conflictos entre usuarios, salvo cuando dicha responsabilidad no pueda ser excluida legalmente.
            </p>
            <p className="text-gray-700 leading-7 mb-4">
              Nada de lo anterior limitará responsabilidades que por ley sean irrenunciables o no puedan excluirse conforme al ordenamiento jurídico chileno.
            </p>
          </section>

          <section id="disponibilidad">
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900">11. Disponibilidad, cambios y mantenimiento</h2>
            <p className="text-gray-700 leading-7 mb-4">
              POLOLITOTRABAJOS podrá modificar, suspender, actualizar o descontinuar funciones, secciones, integraciones, diseño, estructura o acceso a la Plataforma, total o parcialmente, por razones técnicas, operativas, comerciales, de seguridad o legales.
            </p>
            <p className="text-gray-700 leading-7 mb-4">
              La Plataforma puede experimentar interrupciones por mantención, incidentes técnicos, dependencia de terceros, eventos de fuerza mayor o medidas de seguridad.
            </p>
          </section>

          <section id="propiedad">
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900">12. Propiedad intelectual</h2>
            <p className="text-gray-700 leading-7 mb-4">
              Todos los derechos sobre el software, marca, nombre comercial, diseño, bases de datos, interfaces, códigos, logos, textos institucionales y demás elementos propios de POLOLITOTRABAJOS pertenecen a POLOLITOTRABAJOS o a sus licenciantes.
            </p>
            <p className="text-gray-700 leading-7 mb-4">
              El usuario no adquiere derecho alguno sobre dichos elementos, salvo una licencia limitada, revocable, no exclusiva e intransferible para usar la Plataforma conforme a estos Términos.
            </p>
          </section>

          <section id="datos">
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900">13. Protección de datos personales</h2>
            <p className="text-gray-700 leading-7 mb-4">
              El tratamiento de datos personales realizado en la Plataforma se rige por la{' '}
              <Link href="/legal/privacidad" className="text-violet-600 hover:underline">Política de Privacidad</Link>{' '}
              de POLOLITOTRABAJOS y por la normativa chilena aplicable sobre protección de datos personales.
            </p>
            <p className="text-gray-700 leading-7 mb-4">
              El usuario declara conocer que algunos datos serán tratados para fines de registro, autenticación, seguridad, contacto entre usuarios, funcionamiento del servicio, prevención de fraude, soporte y cumplimiento de obligaciones legales.
            </p>
          </section>

          <section id="denuncias">
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900">14. Denuncias y soporte</h2>
            <p className="text-gray-700 leading-7 mb-4">
              Los usuarios podrán denunciar perfiles, publicaciones, mensajes o conductas que estimen ilegales, fraudulentas, abusivas o contrarias a estos Términos a través de{' '}
              <a href="mailto:soporte@pololitotrabajos.cl" className="text-violet-600 hover:underline">soporte@pololitotrabajos.cl</a>.
            </p>
            <p className="text-gray-700 leading-7 mb-4">
              POLOLITOTRABAJOS podrá solicitar antecedentes adicionales, suspender preventivamente contenido o cuentas y conservar evidencia cuando ello resulte razonablemente necesario.
            </p>
          </section>

          <section id="modificaciones">
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900">15. Modificaciones a los Términos</h2>
            <p className="text-gray-700 leading-7 mb-4">
              POLOLITOTRABAJOS podrá modificar estos Términos y Condiciones en cualquier momento. La versión vigente será la publicada en la Plataforma con su respectiva fecha de actualización. El uso continuado del servicio tras la publicación de cambios constituirá aceptación de la nueva versión, salvo que la ley exija un mecanismo adicional.
            </p>
          </section>

          <section id="ley">
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900">16. Ley aplicable y jurisdicción</h2>
            <p className="text-gray-700 leading-7 mb-4">
              Estos Términos se regirán e interpretarán conforme a las leyes de la República de Chile. Toda controversia derivada de su existencia, validez, interpretación, ejecución o terminación será sometida a los tribunales ordinarios de justicia competentes en Chile, sin perjuicio de los derechos que la legislación de protección al consumidor pueda reconocer a los usuarios cuando corresponda.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Última actualización: 04 de mayo de 2026</p>
          <div className="flex flex-wrap gap-4 text-sm mb-6">
            <Link href="/legal/privacidad" className="text-violet-600 hover:underline">Política de Privacidad</Link>
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
