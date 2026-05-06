# Platforms — POLOLITOTRABAJOS

Adaptaciones específicas iOS / Android / Web. El stack recomendado (Expo + RN + RN Web) cubre los 3 con un solo codebase, pero hay matices.

## iOS

### Configuración Expo (`app.config.ts`)
```ts
ios: {
  bundleIdentifier: 'cl.pololitotrabajos.app',
  buildNumber: '1.0.0',
  supportsTablet: false, // V1 solo iPhone
  infoPlist: {
    NSCameraUsageDescription: 'Sube fotos de tus pololitos para que los maestros entiendan mejor.',
    NSPhotoLibraryUsageDescription: 'Selecciona fotos para tus publicaciones.',
    NSLocationWhenInUseUsageDescription: 'Te mostramos maestros cerca tuyo.',
    UIBackgroundModes: ['remote-notification'],
  },
  associatedDomains: ['applinks:pololitotrabajos.cl'],
},
```

### Detalles UX
- **Safe areas:** usar `useSafeAreaInsets()` para bottom (notch / home indicator) y top.
- **Haptics:** `expo-haptics` en acciones críticas (Atender contacto, publicar, calificar). Estilo: `light` para taps, `success` para confirmaciones.
- **SF Symbols:** alternativa a lucide para sentirse más nativo (`@expo/vector-icons` SF Symbols pack), pero **mantener lucide** para consistencia cross-platform.
- **Keyboard:** `KeyboardAvoidingView behavior="padding"` en form de publicar y chat.
- **Status bar:** `StatusBar style="dark"` en pantallas claras, `light` en hero gradient.
- **Navegación gestures:** swipe-to-go-back nativo gratis con Expo Router.

### Push (APNS)
- Expo gestiona automáticamente con `expo-notifications`.
- Categories nativas con acciones para `CONTACT_REQUEST`:
  ```ts
  Notifications.setNotificationCategoryAsync('CONTACT_REQUEST', [
    { identifier: 'ACCEPT', buttonTitle: 'Atender', options: { opensAppToForeground: true } },
    { identifier: 'REJECT', buttonTitle: 'Rechazar', options: { opensAppToForeground: false } },
  ]);
  ```

### App Store assets
- 6.7" + 6.1" + 5.5" screenshots (5 c/u)
- Descripción español Chile
- Categoría: **Negocios** o **Estilo de vida**
- Privacy nutrition labels: contacto, ubicación, identificadores → uso

## Android

### Configuración Expo
```ts
android: {
  package: 'cl.pololitotrabajos.app',
  versionCode: 1,
  permissions: [
    'CAMERA',
    'READ_MEDIA_IMAGES',
    'ACCESS_FINE_LOCATION',
    'ACCESS_COARSE_LOCATION',
    'POST_NOTIFICATIONS',
  ],
  adaptiveIcon: {
    foregroundImage: './assets/icon-fg.png',
    backgroundColor: '#9333EA',
  },
  intentFilters: [
    { action: 'VIEW', autoVerify: true, data: [{ scheme: 'https', host: 'pololitotrabajos.cl' }], category: ['BROWSABLE', 'DEFAULT'] },
  ],
},
```

### Detalles UX
- **Edge-to-edge:** habilitar `edgeToEdge: true`, manejar status bar con `expo-status-bar`.
- **Back button hardware:** `useFocusEffect` + `BackHandler` para confirmar salir de form con cambios sin guardar.
- **Material You:** **NO** dynamic colors — mantener nuestra paleta.
- **Ripple:** usar `Pressable` con `android_ripple={{ color }}` en items tappables grandes.
- **Soft keyboard:** `softwareKeyboardLayoutMode: 'pan'` en chat (no resize).
- **Notification channel:**
  ```ts
  Notifications.setNotificationChannelAsync('contact_requests', {
    name: 'Solicitudes de contacto',
    importance: Notifications.AndroidImportance.HIGH,
    sound: 'default',
    vibrationPattern: [0, 250, 250, 250],
  });
  ```
- Otros canales: `messages`, `nearby_requests`, `general`.

### Play Store
- Screenshots phone + tablet (V2)
- Categoría: **Negocios** o **Estilo de vida**
- Data safety form: explicar recolección teléfono, ubicación, fotos

## Web (PC)

### Estrategia
**RN Web** vía `expo export --platform web`. Mantiene un solo codebase. Verificar:
- Layout responsive: contenedor max-width 480px centrado en desktop, con un panel lateral al lado mostrando "Conoce POLOLITOTRABAJOS" o ilustraciones (V2). En mobile-web es full-width.
- Cursor pointer en interactivos (RN Web no lo aplica por defecto): usar `Pressable` con `style={({ hovered }) => [...]}` y aplicar cursor en `web` via Platform.select.
- Hover states: añadir hover en cards (sutil shadow elevation, scale 1.01).
- Scroll: usar `<ScrollView>` que mapea a contenido con scroll nativo del browser.

### Adaptaciones
- **Auth:** OTP por SMS funciona igual; agregar fallback de email + magic link en V2.
- **Push web:** Web Push API (Service Worker) — diferir a V2.
- **Imagen upload:** drag & drop además del file picker.
- **Maps:** MapLibre GL JS en web, react-native-maps en mobile.
- **Routing:** Expo Router maneja URLs limpias en web (`/maestro/123`, `/chat/abc`).

### Build & deploy
```bash
pnpm --filter mobile web:export
# Output en dist/. Deploy a Vercel:
vercel deploy dist --prod
```

Configurar headers de CSP/CORS en `vercel.json`. Service worker para offline básico (V2).

### Diferencias visuales web vs mobile
- En web ≥ 768px: mantener mobile width pero con paneles laterales decorativos.
- En web ≥ 1024px (V2): considerar layout split — lista a la izquierda, detalle a la derecha (estilo email).

## Stack alternativo: nativo separado

Solo si hay razón fuerte (performance crítico, integraciones específicas):

| Plataforma | Stack | Pros | Contras |
|---|---|---|---|
| iOS | SwiftUI + Combine + Swift Package Manager | UX 100% nativa, mejor perf | 3x trabajo, share solo backend |
| Android | Jetpack Compose + Kotlin Coroutines | Idem | Idem |
| Web | Next.js 14 + Tailwind + tRPC | SSR, SEO, mejor en desktop | Sincronizar diseño manualmente |

**No recomendado para MVP.** Empieza con Expo, mide, considera cambiar solo donde haya bottleneck real.

## Testing en dispositivos

- iOS: Expo Go en dev, EAS Build para preview/producción.
- Android: Expo Go + EAS Build, signed APK para testers internos.
- Web: Vercel preview deploys por PR.

## CI/CD recomendado

- GitHub Actions:
  - PR: lint + typecheck + tests
  - Merge main: deploy api + deploy web preview
  - Tag `v*`: EAS Build (mobile) + EAS Submit a stores
- Branches: `main` (prod), `develop` (staging), feature/*
