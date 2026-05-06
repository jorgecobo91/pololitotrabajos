import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, Switch, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';
import { publicacionSchema, PublicacionInput, OFICIOS, COMUNAS_POR_REGION, REGIONES } from '@pololitotrabajos/shared';

const APP_URL =
  (Constants.expoConfig?.extra as any)?.APP_URL ||
  process.env.EXPO_PUBLIC_APP_URL ||
  'https://web-lac-six-99.vercel.app';

/**
 * Formulario de publicación para CLIENTE ANÓNIMO (sin auth).
 * Llama a /api/publicar (web) que valida con Zod y crea el row con service role.
 * El cliente recibe un email con token para acceder a su publicación.
 */
export function PublishFormScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [submitError, setSubmitError] = useState('');
  const [success, setSuccess] = useState(false);

  const { control, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<PublicacionInput>({
    resolver: zodResolver(publicacionSchema),
    defaultValues: {
      titulo: '',
      descripcion: '',
      especialidad: '',
      region: '',
      comuna: '',
      ubicacion: '',
      nombre_cliente: '',
      email_cliente: '',
      telefono_cliente: '',
      urgente: false,
      presupuesto: '',
      fotos: [],
      mostrar_email: false,
      mostrar_telefono: true,
      accepted_terms: false as any,
    } as any,
  });

  const descripcion = watch('descripcion') || '';
  const selectedEspecialidad = watch('especialidad');
  const selectedRegion = watch('region');
  const selectedComuna = watch('comuna');
  const acceptedTerms = watch('accepted_terms' as any);
  const mostrarEmail = watch('mostrar_email' as any);
  const mostrarTelefono = watch('mostrar_telefono' as any);

  const onSubmit = async (data: PublicacionInput) => {
    setSubmitError('');
    try {
      const res = await fetch(`${APP_URL}/api/publicar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'No se pudo publicar');
      }
      setSuccess(true);
    } catch (e: any) {
      setSubmitError(e?.message || 'Error de conexión');
    }
  };

  if (success) {
    return (
      <View className="flex-1 bg-pt-bg" style={{ paddingTop: insets.top, paddingHorizontal: 18, justifyContent: 'center' }}>
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <View style={{ width: 64, height: 64, borderRadius: 16, backgroundColor: '#D1FAE5', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <Text style={{ fontSize: 28 }}>✓</Text>
          </View>
          <Text className="font-jakarta-extrabold" style={{ fontSize: 22, color: '#1C170D', letterSpacing: -0.5, marginBottom: 8 }}>
            ¡Publicación creada!
          </Text>
          <Text className="font-jakarta-regular" style={{ fontSize: 13, color: '#6B665D', textAlign: 'center', lineHeight: 20, paddingHorizontal: 16 }}>
            Te enviamos un correo con el enlace para seguir tu publicación y ver las propuestas que recibas.
          </Text>
        </View>

        <Pressable
          onPress={() => navigation.goBack()}
          style={{ borderRadius: 14, overflow: 'hidden' }}
        >
          <LinearGradient
            colors={['#FF6B35', '#7C3AED']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={{ paddingVertical: 16, alignItems: 'center' }}
          >
            <Text className="font-jakarta-bold" style={{ fontSize: 14, color: '#fff' }}>
              Volver
            </Text>
          </LinearGradient>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-pt-bg" style={{ paddingTop: insets.top }}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Header */}
        <View style={{ paddingHorizontal: 18, paddingTop: 14, paddingBottom: 8 }}>
          <Pressable onPress={() => navigation.goBack()} style={{ marginBottom: 8 }}>
            <Text style={{ fontSize: 14, color: '#7C3AED', fontWeight: '700' }}>← Volver</Text>
          </Pressable>
          <Text className="font-jakarta-extrabold text-pt-ink" style={{ fontSize: 22, letterSpacing: -0.5 }}>
            Publica tu pololito
          </Text>
          <Text className="font-jakarta-regular" style={{ fontSize: 12.5, color: '#8B857A', marginTop: 4, lineHeight: 17.5 }}>
            Cuéntanos qué necesitas y los maestros te contactarán por correo.
          </Text>
        </View>

        <View style={{ paddingHorizontal: 18, paddingTop: 8, gap: 14 }}>
          {/* Título */}
          <FormField label="Título" hint="Mínimo 8 caracteres">
            <Controller
              control={control}
              name="titulo"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={fieldStyle}
                  className="font-jakarta-regular"
                  placeholder="Ej: Necesito gásfiter al tiro"
                  placeholderTextColor="#8B857A"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            {errors.titulo && <ErrorMsg msg={errors.titulo.message!} />}
          </FormField>

          {/* Descripción */}
          <FormField label="Descripción" hint={`${descripcion.length}/300`}>
            <Controller
              control={control}
              name="descripcion"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[fieldStyle, { minHeight: 88, textAlignVertical: 'top', paddingTop: 12 }]}
                  className="font-jakarta-regular"
                  placeholder="Describe tu problema con detalle..."
                  placeholderTextColor="#8B857A"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  multiline
                  maxLength={300}
                />
              )}
            />
            {errors.descripcion && <ErrorMsg msg={errors.descripcion.message!} />}
          </FormField>

          {/* Especialidad */}
          <FormField label="Categoría">
            <Controller
              control={control}
              name="especialidad"
              render={({ field: { onChange } }) => (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                  {OFICIOS.map((nombre) => (
                    <Pressable
                      key={nombre}
                      onPress={() => onChange(nombre)}
                      style={{
                        paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999,
                        backgroundColor: selectedEspecialidad === nombre ? '#7C3AED' : '#F5F3EF',
                      }}
                    >
                      <Text className="font-jakarta-semibold" style={{ fontSize: 12.5, color: selectedEspecialidad === nombre ? '#fff' : '#6B665D' }}>
                        {nombre}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
            />
            {errors.especialidad && <ErrorMsg msg={errors.especialidad.message!} />}
          </FormField>

          {/* Región */}
          <FormField label="Región">
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {REGIONES.map((r) => (
                <Pressable
                  key={r}
                  onPress={() => { setValue('region', r); setValue('comuna', ''); }}
                  style={{
                    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999,
                    backgroundColor: selectedRegion === r ? '#7C3AED' : '#F5F3EF',
                  }}
                >
                  <Text className="font-jakarta-semibold" style={{ fontSize: 12.5, color: selectedRegion === r ? '#fff' : '#6B665D' }}>
                    {r}
                  </Text>
                </Pressable>
              ))}
            </View>
            {errors.region && <ErrorMsg msg={(errors as any).region.message!} />}
          </FormField>

          {/* Comuna */}
          {selectedRegion ? (
            <FormField label="Comuna">
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                {(COMUNAS_POR_REGION[selectedRegion] || []).map((c) => (
                  <Pressable
                    key={c}
                    onPress={() => setValue('comuna', c)}
                    style={{
                      paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999,
                      backgroundColor: selectedComuna === c ? '#7C3AED' : '#F5F3EF',
                    }}
                  >
                    <Text className="font-jakarta-semibold" style={{ fontSize: 12.5, color: selectedComuna === c ? '#fff' : '#6B665D' }}>
                      {c}
                    </Text>
                  </Pressable>
                ))}
              </View>
              {errors.comuna && <ErrorMsg msg={(errors as any).comuna.message!} />}
            </FormField>
          ) : null}

          {/* Referencia / Calle */}
          <FormField label="Referencia" hint="Sector o calle">
            <Controller
              control={control}
              name="ubicacion"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, height: 44, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E8E4DC', backgroundColor: '#FFFFFF' }}>
                  <Text style={{ fontSize: 14, color: '#9333EA' }}>📍</Text>
                  <TextInput
                    style={{ flex: 1, fontSize: 13.5, color: '#1C170D' }}
                    className="font-jakarta-regular"
                    placeholder="Av. Argentina, sector centro"
                    placeholderTextColor="#8B857A"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                </View>
              )}
            />
            {errors.ubicacion && <ErrorMsg msg={errors.ubicacion.message!} />}
          </FormField>

          {/* Nombre cliente */}
          <FormField label="Tu nombre">
            <Controller
              control={control}
              name="nombre_cliente"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, height: 44, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E8E4DC', backgroundColor: '#FFFFFF' }}>
                  <Text style={{ fontSize: 14, color: '#9333EA' }}>👤</Text>
                  <TextInput
                    style={{ flex: 1, fontSize: 13.5, color: '#1C170D' }}
                    className="font-jakarta-regular"
                    placeholder="Ej: Juan Pérez"
                    placeholderTextColor="#8B857A"
                    value={value || ''}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    maxLength={60}
                  />
                </View>
              )}
            />
            {(errors as any).nombre_cliente && <ErrorMsg msg={(errors as any).nombre_cliente.message!} />}
          </FormField>

          {/* Email cliente */}
          <FormField label="Tu correo" hint="Para recibir propuestas">
            <Controller
              control={control}
              name="email_cliente"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, height: 44, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E8E4DC', backgroundColor: '#FFFFFF' }}>
                  <Text style={{ fontSize: 14, color: '#9333EA' }}>✉️</Text>
                  <TextInput
                    style={{ flex: 1, fontSize: 13.5, color: '#1C170D' }}
                    className="font-jakarta-regular"
                    placeholder="tu@correo.cl"
                    placeholderTextColor="#8B857A"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              )}
            />
            {errors.email_cliente && <ErrorMsg msg={errors.email_cliente.message!} />}
            <Text className="font-jakarta-regular" style={{ fontSize: 10.5, color: '#8B857A', marginTop: 4 }}>
              Te enviaremos el enlace de tu publicación a este correo.
            </Text>
          </FormField>

          {/* Teléfono */}
          <FormField label="WhatsApp / Teléfono" hint="Para que el maestro te contacte">
            <Controller
              control={control}
              name="telefono_cliente"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, height: 44, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E8E4DC', backgroundColor: '#FFFFFF' }}>
                  <Text style={{ fontSize: 14, color: '#9333EA' }}>📞</Text>
                  <Text style={{ fontSize: 13, color: '#6B665D', fontWeight: '500' }}>+56</Text>
                  <TextInput
                    style={{ flex: 1, fontSize: 13.5, color: '#1C170D' }}
                    className="font-jakarta-regular"
                    placeholder="9 1234 5678"
                    placeholderTextColor="#8B857A"
                    value={value || ''}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="phone-pad"
                  />
                </View>
              )}
            />
            {(errors as any).telefono_cliente && <ErrorMsg msg={(errors as any).telefono_cliente.message!} />}
          </FormField>

          {/* Visibilidad de contacto */}
          <View style={{ backgroundColor: '#F5F3EF', borderRadius: 12, padding: 12, gap: 8 }}>
            <Text className="font-jakarta-bold" style={{ fontSize: 11.5, color: '#1C170D', textTransform: 'uppercase', letterSpacing: 0.4 }}>
              ¿Qué pueden ver los maestros?
            </Text>
            <Text className="font-jakarta-regular" style={{ fontSize: 10.5, color: '#6B665D', lineHeight: 14.5 }}>
              Si lo activas, podrán contactarte directamente.
            </Text>

            <Pressable
              onPress={() => setValue('mostrar_telefono' as any, !mostrarTelefono as any)}
              style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 6 }}
            >
              <Text className="font-jakarta-semibold" style={{ fontSize: 12.5, color: '#1C170D' }}>📞 Mostrar mi teléfono</Text>
              <View style={{ width: 36, height: 20, borderRadius: 10, backgroundColor: mostrarTelefono ? '#7C3AED' : '#D4CFC4', justifyContent: 'center', paddingHorizontal: 2 }}>
                <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: '#fff', alignSelf: mostrarTelefono ? 'flex-end' : 'flex-start' }} />
              </View>
            </Pressable>

            <Pressable
              onPress={() => setValue('mostrar_email' as any, !mostrarEmail as any)}
              style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 6 }}
            >
              <Text className="font-jakarta-semibold" style={{ fontSize: 12.5, color: '#1C170D' }}>✉️ Mostrar mi correo</Text>
              <View style={{ width: 36, height: 20, borderRadius: 10, backgroundColor: mostrarEmail ? '#7C3AED' : '#D4CFC4', justifyContent: 'center', paddingHorizontal: 2 }}>
                <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: '#fff', alignSelf: mostrarEmail ? 'flex-end' : 'flex-start' }} />
              </View>
            </Pressable>
          </View>

          {/* Aceptar términos */}
          <Pressable
            onPress={() => setValue('accepted_terms' as any, !acceptedTerms as any)}
            style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: acceptedTerms ? '#7C3AED' : '#E8E4DC', backgroundColor: acceptedTerms ? '#F3E8FF' : '#FFFFFF' }}
          >
            <View style={{ width: 18, height: 18, borderRadius: 4, borderWidth: 2, borderColor: acceptedTerms ? '#7C3AED' : '#8B857A', backgroundColor: acceptedTerms ? '#7C3AED' : 'transparent', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
              {acceptedTerms ? <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>✓</Text> : null}
            </View>
            <Text className="font-jakarta-regular" style={{ flex: 1, fontSize: 11.5, color: '#3D3229', lineHeight: 16.5 }}>
              Acepto los términos y la política de privacidad. Mi correo y teléfono se compartirán solo con los maestros que respondan mi publicación.
            </Text>
          </Pressable>
          {(errors as any).accepted_terms && <ErrorMsg msg={(errors as any).accepted_terms.message!} />}

          {/* Urgente toggle */}
          <Controller
            control={control}
            name="urgente"
            render={({ field: { onChange, value } }) => (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 18, borderWidth: 1, backgroundColor: value ? '#FEF2F2' : '#FFFFFF', borderColor: value ? '#EF4444' : '#E8E4DC' }}>
                <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: value ? '#EF4444' : '#F5F3EF', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 18 }}>⚡</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text className="font-jakarta-bold text-pt-ink" style={{ fontSize: 13.5 }}>¿Es urgente?</Text>
                  <Text className="font-jakarta-regular" style={{ fontSize: 11.5, color: '#6B665D' }}>Recibe respuestas más rápido</Text>
                </View>
                <Switch value={value} onValueChange={onChange} trackColor={{ false: '#F5F3EF', true: '#EF4444' }} thumbColor="#FFFFFF" />
              </View>
            )}
          />

          {/* Submit */}
          <View style={{ marginTop: 4 }}>
            {submitError ? (
              <View style={{ backgroundColor: '#FEF2F2', borderRadius: 12, padding: 12, marginBottom: 10 }}>
                <Text className="font-jakarta-medium" style={{ fontSize: 12, color: '#EF4444' }}>{submitError}</Text>
              </View>
            ) : null}
            <Pressable onPress={handleSubmit(onSubmit)} disabled={isSubmitting} style={{ borderRadius: 14, overflow: 'hidden', opacity: isSubmitting ? 0.6 : 1 }}>
              <LinearGradient
                colors={['#FF6B35', '#7C3AED']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={{ paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}
              >
                {isSubmitting && <ActivityIndicator size="small" color="#fff" />}
                <Text className="font-jakarta-bold" style={{ fontSize: 14, color: '#fff' }}>
                  {isSubmitting ? 'Publicando...' : 'Publicar solicitud'}
                </Text>
              </LinearGradient>
            </Pressable>
            <Text className="font-jakarta-regular" style={{ textAlign: 'center', fontSize: 11, color: '#8B857A', marginTop: 10, lineHeight: 15.4 }}>
              Los maestros de tu zona verán tu publicación.{'\n'}Es gratis, sin compromiso.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// ====== Helpers ======
function FormField({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 7 }}>
        <Text className="font-jakarta-bold" style={{ fontSize: 11.5, color: '#1C170D', textTransform: 'uppercase', letterSpacing: 0.4 }}>
          {label}
        </Text>
        {hint ? <Text className="font-jakarta-regular" style={{ fontSize: 11, color: '#8B857A' }}>{hint}</Text> : null}
      </View>
      {children}
    </View>
  );
}

function ErrorMsg({ msg }: { msg: string }) {
  return <Text className="font-jakarta-medium" style={{ fontSize: 11, color: '#EF4444', marginTop: 4 }}>{msg}</Text>;
}

const fieldStyle = {
  height: 44, paddingHorizontal: 14, borderRadius: 12,
  borderWidth: 1, borderColor: '#E8E4DC', backgroundColor: '#FFFFFF',
  fontSize: 13.5, color: '#1C170D',
} as const;
