import React from 'react';
import { View, Text, ScrollView, Pressable, Switch, ActivityIndicator, Linking, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';

const TERMS_URL = 'https://pololitotrabajos.vercel.app/legal/terminos';
const CURRENT_TERMS_VERSION = '1.0';

export function ProfileMaestroScreen() {
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['my-maestro-profile'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maestro_profiles')
        .select('*, portfolio_items(*)')
        .eq('user_id', user?.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ field, value }: { field: string; value: boolean }) => {
      await supabase
        .from('maestro_profiles')
        .update({ [field]: value })
        .eq('user_id', user?.id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-maestro-profile'] }),
  });

  const acceptTermsMutation = useMutation({
    mutationFn: async () => {
      await supabase
        .from('maestro_profiles')
        .update({
          accepted_terms: true,
          accepted_terms_at: new Date().toISOString(),
          terms_version: CURRENT_TERMS_VERSION,
        })
        .eq('user_id', user?.id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-maestro-profile'] }),
  });

  const openTerms = () => {
    Linking.openURL(TERMS_URL);
  };

  if (isLoading || !profile) {
    return (
      <View className="flex-1 bg-pt-bg items-center justify-center">
        <ActivityIndicator size="large" color="#9333EA" />
      </View>
    );
  }

  const nombre = user?.nombre ?? 'Maestro';
  const inicial = nombre.charAt(0).toUpperCase();
  const rating = profile.rating_promedio?.toFixed(1) ?? '4.9';
  const totalReviews = profile.total_trabajos ?? 0;

  return (
    <View className="flex-1 bg-pt-bg">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header Gradient */}
        <LinearGradient
          colors={['#FF6B35', '#7C3AED']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingTop: insets.top + 16, paddingBottom: 76,
            paddingHorizontal: 18, position: 'relative', overflow: 'hidden',
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text className="font-jakarta-extrabold" style={{ fontSize: 18, color: '#fff', letterSpacing: -0.3 }}>
              Mi perfil
            </Text>
            <Pressable
              style={{
                width: 36, height: 36, borderRadius: 12,
                backgroundColor: 'rgba(255,255,255,0.22)',
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 16, color: '#fff' }}>⚙️</Text>
            </Pressable>
          </View>
          <View
            style={{
              position: 'absolute', right: -30, bottom: -30,
              width: 140, height: 140, borderRadius: 70,
              backgroundColor: 'rgba(255,255,255,0.08)',
            }}
          />
        </LinearGradient>

        {/* Overlap Card */}
        <View style={{ marginHorizontal: 18, marginTop: -56 }}>
          <View
            style={{
              backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E8E4DC',
              borderRadius: 22, padding: 16,
            }}
          >
            {/* Avatar + Edit */}
            <View style={{ flexDirection: 'row', gap: 14, alignItems: 'flex-end', marginTop: -42 }}>
              <View
                style={{
                  width: 84, height: 84, borderRadius: 42,
                  backgroundColor: '#F3ECFF',
                  alignItems: 'center', justifyContent: 'center',
                  borderWidth: 4, borderColor: '#FFFFFF',
                }}
              >
                <Text className="font-jakarta-extrabold" style={{ fontSize: 28, color: '#7C3AED' }}>
                  {inicial}
                </Text>
              </View>
              <View style={{ flex: 1, paddingBottom: 4, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Pressable
                  style={{
                    flexDirection: 'row', alignItems: 'center', gap: 4,
                    backgroundColor: '#F5F3EF', paddingHorizontal: 12, paddingVertical: 7,
                    borderRadius: 999,
                  }}
                >
                  <Text style={{ fontSize: 11 }}>✏️</Text>
                  <Text className="font-jakarta-bold text-pt-ink" style={{ fontSize: 11.5 }}>Editar</Text>
                </Pressable>
              </View>
            </View>

            {/* Name + Oficio + Rating */}
            <View style={{ marginTop: 12 }}>
              <Text
                className="font-jakarta-bold"
                style={{ fontSize: 11, color: '#9333EA', textTransform: 'uppercase', letterSpacing: 0.4 }}
              >
                {profile.oficio}
              </Text>
              <Text className="font-jakarta-extrabold text-pt-ink" style={{ fontSize: 22, letterSpacing: -0.5, marginTop: 2 }}>
                {nombre}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <Text style={{ fontSize: 12, color: '#F59E0B' }}>★★★★★</Text>
                <Text className="font-jakarta-bold text-pt-ink" style={{ fontSize: 12.5 }}>{rating}</Text>
                <Text className="font-jakarta-regular" style={{ fontSize: 12.5, color: '#6B665D', opacity: 0.7 }}>
                  · {totalReviews} reseñas
                </Text>
              </View>
            </View>

            {/* Toggles */}
            <View style={{ marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#E8E4DC', gap: 12 }}>
              {/* Disponible */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View
                  style={{
                    width: 36, height: 36, borderRadius: 10,
                    backgroundColor: '#F5F3EF', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontSize: 15 }}>🔔</Text>
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text className="font-jakarta-bold text-pt-ink" style={{ fontSize: 13 }}>Estoy disponible</Text>
                  <Text className="font-jakarta-regular" style={{ fontSize: 11.5, color: '#6B665D' }}>
                    Maestros recibirán solicitudes
                  </Text>
                </View>
                <Switch
                  value={profile.disponible}
                  onValueChange={(v) => toggleMutation.mutate({ field: 'disponible', value: v })}
                  trackColor={{ false: '#F5F3EF', true: '#10B981' }}
                  thumbColor="#FFFFFF"
                />
              </View>

              {/* Teléfono público */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View
                  style={{
                    width: 36, height: 36, borderRadius: 10,
                    backgroundColor: '#F5F3EF', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontSize: 15 }}>📞</Text>
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text className="font-jakarta-bold text-pt-ink" style={{ fontSize: 13 }}>Mostrar teléfono público</Text>
                  <Text className="font-jakarta-regular" style={{ fontSize: 11.5, color: '#6B665D' }} numberOfLines={1}>
                    {profile.telefono_publico ? (user?.telefono ?? 'No definido') : 'No público'}
                  </Text>
                </View>
                <Switch
                  value={profile.telefono_publico}
                  onValueChange={(v) => toggleMutation.mutate({ field: 'telefono_publico', value: v })}
                  trackColor={{ false: '#F5F3EF', true: '#9333EA' }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>
          </View>
        </View>

        {/* Terms Acceptance Banner */}
        {!profile.accepted_terms && (
          <View style={{ marginHorizontal: 18, marginTop: 14 }}>
            <View
              style={{
                backgroundColor: '#FFFBEB', borderWidth: 1, borderColor: '#F59E0B',
                borderRadius: 16, padding: 14, gap: 10,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ fontSize: 18 }}>⚠️</Text>
                <Text className="font-jakarta-bold text-pt-ink" style={{ fontSize: 13.5 }}>
                  Acepta los Términos y Condiciones
                </Text>
              </View>
              <Text className="font-jakarta-regular" style={{ fontSize: 12, color: '#6B665D', lineHeight: 17 }}>
                Para aparecer en el catálogo y recibir solicitudes, debes aceptar nuestros términos de uso.
              </Text>
              <Pressable onPress={openTerms}>
                <Text className="font-jakarta-bold" style={{ fontSize: 12, color: '#7C3AED', textDecorationLine: 'underline' }}>
                  Leer Términos y Condiciones
                </Text>
              </Pressable>
              <Pressable
                onPress={() => acceptTermsMutation.mutate()}
                disabled={acceptTermsMutation.isPending}
                style={{ borderRadius: 12, overflow: 'hidden', marginTop: 2 }}
              >
                <LinearGradient
                  colors={['#FF6B35', '#7C3AED']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    paddingVertical: 12, alignItems: 'center', borderRadius: 12,
                    flexDirection: 'row', justifyContent: 'center', gap: 6,
                  }}
                >
                  <Text style={{ fontSize: 13 }}>✅</Text>
                  <Text className="font-jakarta-bold" style={{ fontSize: 13, color: '#fff' }}>
                    {acceptTermsMutation.isPending ? 'Guardando...' : 'Acepto los Términos y Condiciones'}
                  </Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        )}

        {/* Especialidades */}
        <View style={{ paddingHorizontal: 18, paddingTop: 18 }}>
          <Text className="font-jakarta-extrabold text-pt-ink" style={{ fontSize: 13, letterSpacing: -0.2, textTransform: 'uppercase', opacity: 0.9 }}>
            Especialidades
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
            {(profile.especialidades ?? []).map((esp: string) => (
              <View
                key={esp}
                style={{
                  backgroundColor: '#F3ECFF', paddingHorizontal: 14, paddingVertical: 7,
                  borderRadius: 999,
                }}
              >
                <Text className="font-jakarta-semibold" style={{ fontSize: 12.5, color: '#7C3AED' }}>{esp}</Text>
              </View>
            ))}
            <Pressable
              style={{
                paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999,
                borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#C4BFB6',
              }}
            >
              <Text className="font-jakarta-semibold" style={{ fontSize: 12.5, color: '#6B665D' }}>+ agregar</Text>
            </Pressable>
          </View>
        </View>

        {/* Zona de cobertura */}
        <View style={{ paddingHorizontal: 18, paddingTop: 16 }}>
          <Text className="font-jakarta-extrabold text-pt-ink" style={{ fontSize: 13, letterSpacing: -0.2, textTransform: 'uppercase', opacity: 0.9 }}>
            Zona de cobertura
          </Text>
          <View
            style={{
              flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, marginTop: 10,
              backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E8E4DC', borderRadius: 14,
            }}
          >
            <View
              style={{
                width: 36, height: 36, borderRadius: 10,
                backgroundColor: '#F3ECFF', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 16, color: '#7C3AED' }}>🗺️</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text className="font-jakarta-bold text-pt-ink" style={{ fontSize: 13 }}>
                {profile.zona_cobertura ?? 'No definida'}
              </Text>
              <Text className="font-jakarta-regular" style={{ fontSize: 11, color: '#8B857A' }}>
                Hasta 30 km a la redonda
              </Text>
            </View>
            <Text style={{ fontSize: 14, color: '#8B857A' }}>›</Text>
          </View>
        </View>

        {/* Calificaciones */}
        <View style={{ paddingHorizontal: 18, paddingTop: 20 }}>
          <Text className="font-jakarta-extrabold text-pt-ink" style={{ fontSize: 13, letterSpacing: -0.2, textTransform: 'uppercase', opacity: 0.9 }}>
            Mis calificaciones
          </Text>
          <View
            style={{
              backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E8E4DC',
              borderRadius: 18, padding: 14, marginTop: 10,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 10 }}>
              <LinearGradient
                colors={['#FF6B35', '#7C3AED']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: 64, height: 64, borderRadius: 16,
                  alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Text className="font-jakarta-extrabold" style={{ fontSize: 22, color: '#fff', letterSpacing: -0.5 }}>
                  {rating}
                </Text>
                <Text className="font-jakarta-semibold" style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.9)' }}>
                  de 5.0
                </Text>
              </LinearGradient>
              <View style={{ flex: 1 }}>
                {[
                  { label: 'Calidad', value: profile.ratingSummary?.calidad_avg ?? 4.8 },
                  { label: 'Puntualidad', value: profile.ratingSummary?.puntualidad_avg ?? 4.7 },
                  { label: 'Comunicación', value: profile.ratingSummary?.comunicacion_avg ?? 4.9 },
                  { label: 'Precio', value: profile.ratingSummary?.precio_avg ?? 4.6 },
                ].map((item) => (
                  <View key={item.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <Text className="font-jakarta-regular" style={{ flex: 1, fontSize: 11.5, color: '#6B665D' }}>{item.label}</Text>
                    <View style={{ width: 70, height: 4, backgroundColor: '#F5F3EF', borderRadius: 2, overflow: 'hidden' }}>
                      <View style={{ width: `${(item.value / 5) * 100}%`, height: '100%', backgroundColor: '#9333EA', borderRadius: 2 }} />
                    </View>
                    <Text className="font-jakarta-bold text-pt-ink" style={{ fontSize: 11, width: 22, textAlign: 'right' }}>
                      {item.value.toFixed(1)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Portfolio */}
        <View style={{ paddingHorizontal: 18, paddingTop: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text className="font-jakarta-extrabold text-pt-ink" style={{ fontSize: 13, letterSpacing: -0.2, textTransform: 'uppercase', opacity: 0.9 }}>
              Mi portafolio
            </Text>
            <Pressable>
              <Text className="font-jakarta-bold" style={{ fontSize: 12.5, color: '#7C3AED' }}>Editar</Text>
            </Pressable>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {(profile.portfolio_items ?? []).slice(0, 6).map((item: any, i: number) => (
              <View
                key={item.id ?? i}
                style={{
                  width: '31.5%', aspectRatio: 1, borderRadius: 10,
                  backgroundColor: '#F5F3EF', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 9, color: '#8B857A' }}>📷</Text>
              </View>
            ))}
            <Pressable
              style={{
                width: '31.5%', aspectRatio: 1, borderRadius: 10,
                borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#C4BFB6',
                alignItems: 'center', justifyContent: 'center', gap: 4,
              }}
            >
              <Text style={{ fontSize: 18, color: '#6B665D' }}>+</Text>
              <Text className="font-jakarta-semibold" style={{ fontSize: 10, color: '#6B665D' }}>Agregar</Text>
            </Pressable>
          </View>
        </View>

        {/* Logout */}
        <Pressable onPress={signOut} style={{ marginHorizontal: 18, marginTop: 24, paddingVertical: 14, alignItems: 'center' }}>
          <Text className="font-jakarta-bold" style={{ fontSize: 13, color: '#EF4444' }}>Cerrar sesión</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
