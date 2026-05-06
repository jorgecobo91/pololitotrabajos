import React from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator, RefreshControl, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../../lib/supabase';

export function FeedScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const { data: publicaciones, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['publicaciones-feed'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('publicaciones')
        .select('*, users!inner(nombre, foto_url)')
        .eq('estado', 'abierta')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <View className="flex-1 bg-pt-bg" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 18, paddingTop: 14, paddingBottom: 8 }}>
        <Text
          className="font-jakarta-extrabold text-pt-ink"
          style={{ fontSize: 22, letterSpacing: -0.5 }}
        >
          Feed de pegas
        </Text>
        <Text
          className="font-jakarta-regular"
          style={{ fontSize: 12.5, color: '#8B857A', marginTop: 4, lineHeight: 17.5 }}
        >
          Solicitudes cerca tuyo. Postúlate al tiro.
        </Text>
      </View>

      {/* FAB — Publicar nueva solicitud */}
      <Pressable
        onPress={() => navigation.navigate('PublishForm')}
        style={{
          position: 'absolute',
          bottom: 96,
          right: 18,
          borderRadius: 28,
          overflow: 'hidden',
          ...(Platform.OS === 'web' ? { position: 'fixed' as any, zIndex: 99990 } : {}),
        }}
      >
        <LinearGradient
          colors={['#FF6B35', '#7C3AED']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            paddingHorizontal: 20,
            paddingVertical: 14,
            borderRadius: 28,
          }}
        >
          <Text style={{ fontSize: 16, color: '#fff' }}>✏️</Text>
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#fff' }}>Publicar</Text>
        </LinearGradient>
      </Pressable>

      {isLoading ? (
        <ActivityIndicator size="large" color="#9333EA" style={{ marginTop: 32 }} />
      ) : (
        <FlatList
          data={publicaciones}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 100 }}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#9333EA" />}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', paddingVertical: 48 }}>
              <Text style={{ fontSize: 40, marginBottom: 12 }}>🔍</Text>
              <Text className="font-jakarta-semibold" style={{ fontSize: 14, color: '#8B857A', textAlign: 'center' }}>
                No hay solicitudes disponibles aún
              </Text>
            </View>
          }
          renderItem={({ item }) => <PublicationCard item={item} />}
        />
      )}
    </View>
  );
}

function PublicationCard({ item }: { item: any }) {
  const nombre = item.users?.nombre ?? 'Anónimo';
  const inicial = nombre.charAt(0).toUpperCase();
  const timeAgo = getTimeAgo(item.created_at);

  return (
    <View
      style={{
        backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E8E4DC',
        borderRadius: 18, padding: 14,
      }}
    >
      {/* Author row */}
      <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: 10 }}>
        <View
          style={{
            width: 38, height: 38, borderRadius: 19,
            backgroundColor: '#F5F3EF', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Text className="font-jakarta-bold" style={{ fontSize: 14, color: '#6B665D' }}>{inicial}</Text>
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text className="font-jakarta-bold text-pt-ink" style={{ fontSize: 13, letterSpacing: -0.1 }}>
            {nombre}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={{ fontSize: 10, color: '#8B857A' }}>🕐</Text>
            <Text className="font-jakarta-regular" style={{ fontSize: 11, color: '#8B857A' }}>
              {timeAgo}
            </Text>
            <Text style={{ fontSize: 11, color: '#8B857A', opacity: 0.5 }}>·</Text>
            <Text style={{ fontSize: 10, color: '#8B857A' }}>📍</Text>
            <Text className="font-jakarta-regular" style={{ fontSize: 11, color: '#8B857A' }}>
              {item.ubicacion}
            </Text>
          </View>
        </View>
        {item.urgente && (
          <View
            style={{
              flexDirection: 'row', alignItems: 'center', gap: 3,
              backgroundColor: '#FEF2F2', paddingHorizontal: 8, paddingVertical: 3,
              borderRadius: 999,
            }}
          >
            <Text style={{ fontSize: 10 }}>⚡</Text>
            <Text className="font-jakarta-bold" style={{ fontSize: 10, color: '#EF4444', letterSpacing: 0.4 }}>
              URGENTE
            </Text>
          </View>
        )}
      </View>

      {/* Title */}
      <Text
        className="font-jakarta-extrabold text-pt-ink"
        style={{ fontSize: 15, letterSpacing: -0.2, lineHeight: 18.75 }}
      >
        {item.titulo}
      </Text>

      {/* Description */}
      <Text
        className="font-jakarta-regular"
        style={{ fontSize: 12.5, color: '#6B665D', lineHeight: 18, marginTop: 6, marginBottom: 10 }}
        numberOfLines={3}
      >
        {item.descripcion}
      </Text>

      {/* Footer */}
      <View
        style={{
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          paddingTop: 10, borderTopWidth: 1, borderTopColor: '#E8E4DC',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View style={{ backgroundColor: '#F5F3EF', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 }}>
            <Text className="font-jakarta-semibold" style={{ fontSize: 11, color: '#8B857A' }}>
              {item.especialidad}
            </Text>
          </View>
          <Text className="font-jakarta-regular" style={{ fontSize: 11, color: '#8B857A' }}>
            {item.contact_count ?? 0} contactos
          </Text>
        </View>
        <Pressable style={{ borderRadius: 10, overflow: 'hidden' }}>
          <LinearGradient
            colors={['#FF6B35', '#7C3AED']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              paddingHorizontal: 14, paddingVertical: 8,
              flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 10,
            }}
          >
            <Text style={{ fontSize: 11, color: '#fff' }}>✈️</Text>
            <Text className="font-jakarta-bold" style={{ fontSize: 12, color: '#fff' }}>Postular</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  return `hace ${days}d`;
}
