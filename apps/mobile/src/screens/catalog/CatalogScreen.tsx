import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, FlatList, Pressable, ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useMaestros } from '../../hooks/useMaestros';
import { useAuthStore } from '../../store/authStore';
import { CATEGORIAS, COPY } from '@pololitotrabajos/shared';

const FILTER_CHIPS = ['Todos', ...CATEGORIAS.map(c => c.nombre)];

export function CatalogScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Todos');

  const filters = {
    search: search || undefined,
    especialidad: selectedFilter === 'Todos' ? undefined : selectedFilter,
  };
  const { data: maestros, isLoading, isError, refetch, isRefetching } = useMaestros(filters);

  const firstName = user?.nombre?.split(' ')[0] ?? '';

  const renderCard = useCallback(({ item }: { item: any }) => (
    <MaestroCard item={item} navigation={navigation} />
  ), [navigation]);

  return (
    <View className="flex-1 bg-pt-bg" style={{ paddingTop: insets.top }}>
      {/* Header sticky */}
      <View className="bg-pt-bg" style={{ paddingTop: 16, paddingHorizontal: 18, paddingBottom: 12 }}>
        {/* Logo + Bell */}
        <View className="flex-row items-center justify-between" style={{ marginBottom: 14 }}>
          <View className="flex-row items-center">
            <Text className="font-jakarta-extrabold text-[20px] tracking-[-0.5px]" style={{ color: '#FF6B35' }}>
              pololito
            </Text>
            <Text className="font-jakarta-extrabold text-[20px] tracking-[-0.5px] text-pt-ink">
              trabajos
            </Text>
          </View>
          <Pressable
            className="items-center justify-center"
            style={{
              width: 36, height: 36, borderRadius: 12,
              borderWidth: 1, borderColor: '#E8E4DC',
              backgroundColor: '#FFFFFF',
            }}
          >
            <Text style={{ fontSize: 16 }}>🔔</Text>
            <View
              style={{
                position: 'absolute', top: 6, right: 7,
                width: 8, height: 8, borderRadius: 4,
                backgroundColor: '#9333EA',
                borderWidth: 1.5, borderColor: '#FFFFFF',
              }}
            />
          </Pressable>
        </View>

        {/* Greeting */}
        <View style={{ marginBottom: 14 }}>
          <Text className="font-jakarta-semibold" style={{ fontSize: 12, color: '#8B857A' }}>
            Hola {firstName} 👋
          </Text>
          <Text
            className="font-jakarta-extrabold text-pt-ink"
            style={{ fontSize: 24, letterSpacing: -0.7, lineHeight: 28, marginTop: 2 }}
          >
            ¿Qué necesitas{'\n'}arreglar hoy?
          </Text>
        </View>

        {/* Search bar */}
        <View
          className="flex-row items-center"
          style={{
            paddingVertical: 12, paddingHorizontal: 14,
            borderRadius: 14, backgroundColor: '#FFFFFF',
            borderWidth: 1, borderColor: '#E8E4DC',
            gap: 10,
          }}
        >
          <Text style={{ fontSize: 16, color: '#8B857A' }}>🔍</Text>
          <TextInput
            className="flex-1 font-jakarta-regular text-pt-ink"
            style={{ fontSize: 13.5 }}
            placeholder="Buscar maestro u oficio..."
            placeholderTextColor="#8B857A"
            value={search}
            onChangeText={setSearch}
          />
          <Pressable
            className="items-center justify-center"
            style={{
              width: 28, height: 28, borderRadius: 10,
              backgroundColor: '#F5F3EF',
            }}
          >
            <Text style={{ fontSize: 14 }}>⚙️</Text>
          </Pressable>
        </View>

        {/* Filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 12, marginHorizontal: -18 }}
          contentContainerStyle={{ paddingHorizontal: 18, gap: 8, paddingBottom: 4 }}
        >
          {FILTER_CHIPS.map(f => (
            <Pressable
              key={f}
              onPress={() => setSelectedFilter(f)}
              style={{
                paddingHorizontal: 14, paddingVertical: 8,
                borderRadius: 999,
                backgroundColor: selectedFilter === f ? '#F3ECFF' : '#F5F3EF',
              }}
            >
              <Text
                className="font-jakarta-semibold"
                style={{
                  fontSize: 12.5,
                  color: selectedFilter === f ? '#7C3AED' : '#8B857A',
                }}
              >
                {f}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#9333EA" style={{ marginTop: 32 }} />
      ) : isError ? (
        <View style={{ alignItems: 'center', paddingVertical: 48, paddingHorizontal: 24 }}>
          <Text style={{ fontSize: 32, marginBottom: 12 }}>⚠️</Text>
          <Text className="font-jakarta-semibold" style={{ fontSize: 14, color: '#8B857A', textAlign: 'center' }}>
            Error al cargar maestros
          </Text>
          <Pressable onPress={() => refetch()} style={{ marginTop: 12, backgroundColor: '#F3ECFF', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 }}>
            <Text className="font-jakarta-bold" style={{ fontSize: 13, color: '#7C3AED' }}>Reintentar</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={maestros}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#9333EA" />}
          ListHeaderComponent={
            <>
              {/* Featured banner */}
              <View style={{ paddingHorizontal: 18, paddingTop: 4, paddingBottom: 0 }}>
                <LinearGradient
                  colors={['#FF6B35', '#7C3AED']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    borderRadius: 18, padding: 14, paddingHorizontal: 16,
                    flexDirection: 'row', alignItems: 'center', gap: 12,
                    overflow: 'hidden',
                  }}
                >
                  {/* Icon tile */}
                  <View
                    style={{
                      width: 44, height: 44, borderRadius: 14,
                      backgroundColor: 'rgba(255,255,255,0.22)',
                      alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 20 }}>✨</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text className="font-jakarta-extrabold" style={{ fontSize: 13.5, color: '#fff', lineHeight: 16 }}>
                      Encuentra tu maestro
                    </Text>
                    <Text className="font-jakarta-regular" style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.92)', marginTop: 2 }}>
                      Para cualquier pololito al tiro
                    </Text>
                  </View>
                  {/* Decorative circle */}
                  <View
                    style={{
                      position: 'absolute', right: -20, top: -20,
                      width: 100, height: 100, borderRadius: 50,
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    }}
                  />
                </LinearGradient>
              </View>

              {/* Section title */}
              <View
                className="flex-row items-center justify-between"
                style={{ paddingHorizontal: 18, paddingTop: 18, paddingBottom: 8 }}
              >
                <Text className="font-jakarta-bold text-pt-ink" style={{ fontSize: 14 }}>
                  {maestros?.length ?? 0} maestros disponibles
                </Text>
                <Pressable>
                  <Text className="font-jakarta-semibold" style={{ fontSize: 13, color: '#7C3AED' }}>
                    Ordenar
                  </Text>
                </Pressable>
              </View>
            </>
          }
          ListEmptyComponent={
            <View className="items-center" style={{ paddingVertical: 48 }}>
              <Text className="font-jakarta-semibold text-pt-ink-muted" style={{ fontSize: 14 }}>
                {COPY.catalog.empty}
              </Text>
              <Pressable onPress={() => setSelectedFilter('Todos')} style={{ marginTop: 12 }}>
                <Text className="font-jakarta-bold" style={{ fontSize: 13, color: '#7C3AED' }}>
                  {COPY.catalog.empty_cta}
                </Text>
              </Pressable>
            </View>
          }
          renderItem={renderCard}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          style={{ paddingHorizontal: 18 }}
        />
      )}
    </View>
  );
}

const MaestroCard = React.memo(function MaestroCard({ item, navigation }: { item: any; navigation: any }) {
  const nombre = item.users?.nombre ?? 'Sin nombre';
  const inicial = nombre.charAt(0).toUpperCase();
  const comuna = item.users?.comuna ?? '';
  const rating = item.rating_promedio ? Number(item.rating_promedio).toFixed(1) : '0.0';
  const trabajos = item.total_trabajos ?? 0;

  return (
    <Pressable
      onPress={() => navigation.navigate('MaestroDetail', { userId: item.user_id })}
      style={({ pressed }) => ({
        backgroundColor: '#FFFFFF',
        borderWidth: 1, borderColor: '#E8E4DC',
        borderRadius: 18, overflow: 'hidden',
        opacity: pressed ? 0.7 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}
    >
      {/* Card content */}
      <View style={{ flexDirection: 'row', gap: 14, padding: 14 }}>
        {/* Avatar */}
        <View style={{ position: 'relative', flexShrink: 0 }}>
          <View
            style={{
              width: 68, height: 68, borderRadius: 34,
              backgroundColor: '#F3ECFF',
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Text className="font-jakarta-extrabold" style={{ fontSize: 24, color: '#7C3AED' }}>
              {inicial}
            </Text>
          </View>
          {item.disponible && (
            <View
              style={{
                position: 'absolute', bottom: 2, right: 2,
                width: 14, height: 14, borderRadius: 7,
                backgroundColor: '#10B981',
                borderWidth: 2.5, borderColor: '#FFFFFF',
              }}
            />
          )}
        </View>

        {/* Info */}
        <View style={{ flex: 1, minWidth: 0 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 6 }}>
            <View style={{ flex: 1, minWidth: 0 }}>
              {/* Oficio eyebrow */}
              <Text
                className="font-jakarta-bold"
                style={{
                  fontSize: 11, color: '#9333EA',
                  textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 1,
                }}
              >
                {item.oficio}
              </Text>
              {/* Nombre */}
              <Text
                className="font-jakarta-bold text-pt-ink"
                style={{ fontSize: 15.5, letterSpacing: -0.2 }}
                numberOfLines={1}
              >
                {nombre}
              </Text>
            </View>
            {/* Rating chip */}
            <View
              style={{
                flexDirection: 'row', alignItems: 'center', gap: 3,
                backgroundColor: '#F5F3EF', paddingHorizontal: 8, paddingVertical: 4,
                borderRadius: 8, flexShrink: 0,
              }}
            >
              <Text style={{ fontSize: 11, color: '#F59E0B' }}>★</Text>
              <Text className="font-jakarta-bold text-pt-ink" style={{ fontSize: 12 }}>
                {rating}
              </Text>
            </View>
          </View>

          {/* Zone + trabajos */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
            <Text style={{ fontSize: 11, color: '#8B857A' }}>📍</Text>
            <Text
              className="font-jakarta-regular"
              style={{ fontSize: 11.5, color: '#8B857A' }}
              numberOfLines={1}
            >
              {comuna}
            </Text>
            <Text style={{ fontSize: 11.5, color: '#8B857A', opacity: 0.5, marginHorizontal: 4 }}>·</Text>
            <Text className="font-jakarta-regular" style={{ fontSize: 11.5, color: '#8B857A' }}>
              {trabajos} trabajos
            </Text>
          </View>

          {/* Bio */}
          <Text
            className="font-jakarta-regular"
            style={{ fontSize: 12.5, color: '#6B665D', lineHeight: 17.5, marginTop: 8 }}
            numberOfLines={2}
          >
            {item.bio}
          </Text>
        </View>
      </View>

      {/* CTA: solo "Ver perfil" — el contacto sale recién dentro del perfil del maestro */}
      <View style={{ paddingHorizontal: 14, paddingBottom: 14 }}>
        <View style={{ borderRadius: 12, overflow: 'hidden' }}>
          <LinearGradient
            colors={['#FF6B35', '#7C3AED']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              paddingVertical: 10, alignItems: 'center', justifyContent: 'center',
              flexDirection: 'row', gap: 6, borderRadius: 12,
            }}
          >
            <Text className="font-jakarta-semibold" style={{ fontSize: 12.5, color: '#fff' }}>
              Ver perfil
            </Text>
          </LinearGradient>
        </View>
      </View>
    </Pressable>
  );
});
