import React from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useMaestroDetail } from '../../hooks/useMaestros';

export function MaestroDetailScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { userId } = route.params;
  const { data: maestro, isLoading } = useMaestroDetail(userId);

  if (isLoading || !maestro) {
    return (
      <View className="flex-1 bg-pt-bg items-center justify-center">
        <ActivityIndicator size="large" color="#9333EA" />
      </View>
    );
  }

  const nombre = maestro.users?.nombre ?? 'Sin nombre';
  const inicial = nombre.charAt(0).toUpperCase();
  const rating = maestro.rating_promedio?.toFixed(1) ?? '–';
  const totalReviews = maestro.total_trabajos ?? 0;

  return (
    <View className="flex-1 bg-pt-bg">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Hero Gradient */}
        <LinearGradient
          colors={['#FF6B35', '#7C3AED']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ paddingTop: insets.top + 14, paddingBottom: 80, paddingHorizontal: 18 }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={{
                width: 38, height: 38, borderRadius: 12,
                backgroundColor: 'rgba(255,255,255,0.2)',
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 18, color: '#fff' }}>←</Text>
            </Pressable>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <View
                style={{
                  width: 38, height: 38, borderRadius: 12,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 16, color: '#fff' }}>🛡️</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Overlap Card */}
        <View style={{ marginHorizontal: 18, marginTop: -56 }}>
          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderWidth: 1, borderColor: '#E8E4DC',
              borderRadius: 22, padding: 16,
            }}
          >
            {/* Avatar + availability badge */}
            <View style={{ flexDirection: 'row', gap: 14, marginTop: -42, alignItems: 'flex-end' }}>
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
              <View style={{ flex: 1, paddingBottom: 4 }}>
                {maestro.disponible && (
                  <View
                    style={{
                      flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
                      backgroundColor: '#ECFDF5', paddingHorizontal: 8, paddingVertical: 3,
                      borderRadius: 999, gap: 4,
                    }}
                  >
                    <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981' }} />
                    <Text className="font-jakarta-bold" style={{ fontSize: 10.5, color: '#10B981' }}>
                      Disponible al tiro
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Name + oficio + rating */}
            <View style={{ marginTop: 10 }}>
              <Text
                className="font-jakarta-bold"
                style={{ fontSize: 11, color: '#9333EA', textTransform: 'uppercase', letterSpacing: 0.4 }}
              >
                {maestro.oficio}
              </Text>
              <Text
                className="font-jakarta-extrabold text-pt-ink"
                style={{ fontSize: 22, letterSpacing: -0.5, marginTop: 2 }}
              >
                {nombre}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 }}>
                <Text style={{ fontSize: 13, color: '#F59E0B' }}>★★★★★</Text>
                <Text className="font-jakarta-bold text-pt-ink" style={{ fontSize: 12.5 }}>{rating}</Text>
                <Text className="font-jakarta-regular" style={{ fontSize: 12.5, color: '#6B665D', opacity: 0.7 }}>
                  · {totalReviews} reseñas
                </Text>
              </View>
            </View>

            {/* Stats row */}
            <View
              style={{
                flexDirection: 'row', marginTop: 14,
                paddingTop: 12, paddingBottom: 4,
                borderTopWidth: 1, borderTopColor: '#E8E4DC',
              }}
            >
              {[
                { k: 'Años', v: maestro.experiencia_anios ?? '–' },
                { k: 'Trabajos', v: totalReviews },
                { k: 'En PT desde', v: new Date(maestro.created_at).getFullYear().toString() },
              ].map(s => (
                <View key={s.k} style={{ flex: 1, alignItems: 'center' }}>
                  <Text className="font-jakarta-extrabold text-pt-ink" style={{ fontSize: 18, letterSpacing: -0.3 }}>
                    {s.v}
                  </Text>
                  <Text className="font-jakarta-semibold" style={{ fontSize: 10.5, color: '#8B857A', marginTop: 2 }}>
                    {s.k}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Sobre mí */}
        <View style={{ paddingHorizontal: 18, paddingTop: 18 }}>
          <Text className="font-jakarta-extrabold text-pt-ink" style={{ fontSize: 13, letterSpacing: -0.2, textTransform: 'uppercase', opacity: 0.9 }}>
            Sobre mí
          </Text>
          <Text className="font-jakarta-regular" style={{ fontSize: 13, color: '#6B665D', lineHeight: 19.5, marginTop: 8 }}>
            {maestro.bio}
          </Text>
        </View>

        {/* Especialidades */}
        <View style={{ paddingHorizontal: 18, paddingTop: 16 }}>
          <Text className="font-jakarta-extrabold text-pt-ink" style={{ fontSize: 13, letterSpacing: -0.2, textTransform: 'uppercase', opacity: 0.9 }}>
            Especialidades
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
            {(maestro.especialidades ?? []).map((esp: string) => (
              <View
                key={esp}
                style={{
                  backgroundColor: '#F3ECFF', paddingHorizontal: 12, paddingVertical: 6,
                  borderRadius: 999,
                }}
              >
                <Text className="font-jakarta-semibold" style={{ fontSize: 12, color: '#7C3AED' }}>{esp}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Calificaciones */}
        <View style={{ paddingHorizontal: 18, paddingTop: 20 }}>
          <Text className="font-jakarta-extrabold text-pt-ink" style={{ fontSize: 13, letterSpacing: -0.2, textTransform: 'uppercase', opacity: 0.9 }}>
            Calificaciones
          </Text>
          <View
            style={{
              backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E8E4DC',
              borderRadius: 18, padding: 14, marginTop: 10,
            }}
          >
            {[
              { label: 'Calidad', value: maestro.ratingSummary?.calidad_avg ?? 4.8 },
              { label: 'Puntualidad', value: maestro.ratingSummary?.puntualidad_avg ?? 4.7 },
              { label: 'Comunicación', value: maestro.ratingSummary?.comunicacion_avg ?? 4.9 },
              { label: 'Precio justo', value: maestro.ratingSummary?.precio_avg ?? 4.6 },
            ].map((item) => (
              <View key={item.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <View style={{ flex: 1 }}>
                  <Text className="font-jakarta-semibold text-pt-ink" style={{ fontSize: 12.5, marginBottom: 4 }}>
                    {item.label}
                  </Text>
                  <View style={{ height: 5, backgroundColor: '#F5F3EF', borderRadius: 3, overflow: 'hidden' }}>
                    <LinearGradient
                      colors={['#FF6B35', '#7C3AED']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{ width: `${(item.value / 5) * 100}%`, height: '100%', borderRadius: 3 }}
                    />
                  </View>
                </View>
                <Text className="font-jakarta-bold text-pt-ink" style={{ fontSize: 12, width: 24, textAlign: 'right' }}>
                  {item.value.toFixed(1)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Portfolio */}
        {maestro.portfolio_items?.length > 0 && (
          <View style={{ paddingHorizontal: 18, paddingTop: 20 }}>
            <Text className="font-jakarta-extrabold text-pt-ink" style={{ fontSize: 13, letterSpacing: -0.2, textTransform: 'uppercase', opacity: 0.9 }}>
              Trabajos realizados
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
              {maestro.portfolio_items.slice(0, 6).map((item: any, i: number) => (
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
            </View>
          </View>
        )}
      </ScrollView>

      {/* Sticky Footer CTAs */}
      <View
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E8E4DC',
          paddingHorizontal: 18, paddingTop: 12,
          paddingBottom: insets.bottom + 12,
          flexDirection: 'row', gap: 10,
        }}
      >
        {maestro.telefono_publico && (
          <Pressable
            style={{
              flex: 1, paddingVertical: 14, borderRadius: 14,
              borderWidth: 1, borderColor: '#E8E4DC',
              alignItems: 'center', justifyContent: 'center',
              flexDirection: 'row', gap: 6,
            }}
          >
            <Text style={{ fontSize: 15 }}>📞</Text>
            <Text className="font-jakarta-bold text-pt-ink" style={{ fontSize: 13 }}>Llamar</Text>
          </Pressable>
        )}
        <Pressable style={{ flex: 2, borderRadius: 14, overflow: 'hidden' }}>
          <LinearGradient
            colors={['#FF6B35', '#7C3AED']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              paddingVertical: 14, alignItems: 'center', justifyContent: 'center',
              flexDirection: 'row', gap: 6, borderRadius: 14,
            }}
          >
            <Text style={{ fontSize: 15 }}>💬</Text>
            <Text className="font-jakarta-bold" style={{ fontSize: 13, color: '#fff' }}>Contactar</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}
