import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import type { AuthStackParamList } from '../../navigation/AuthStack';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'ClienteEntry'>;

/**
 * Pantalla de entrada para cliente anónimo.
 * NO crea sesión. Ofrece tres acciones rápidas y vuelve.
 */
export function ClienteEntryScreen() {
  const navigation = useNavigation<Nav>();

  const actions = [
    { emoji: '🔎', label: 'Buscar maestros', sub: 'Explora el catálogo y contacta directo', to: 'ClienteCatalog' as const, bg: '#EDE9FE' },
    { emoji: '📝', label: 'Publicar trabajo', sub: 'Cuéntanos qué necesitas y recibe propuestas', to: 'ClientePublish' as const, bg: '#FFF4ED' },
    { emoji: '📧', label: 'Mis publicaciones', sub: 'Recupera tus publicaciones por correo', to: 'ClienteRecover' as const, bg: '#F5F3EF' },
  ];

  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 56, paddingBottom: 40 }} className="bg-pt-bg">
      <Pressable onPress={() => navigation.goBack()} style={{ marginBottom: 20 }}>
        <Text className="font-jakarta-bold" style={{ fontSize: 14, color: '#7C3AED' }}>← Volver</Text>
      </Pressable>

      <Text className="font-jakarta-extrabold" style={{ fontSize: 26, color: '#1C170D', letterSpacing: -0.7, marginBottom: 6 }}>
        ¿Qué necesitas{'\n'}arreglar hoy?
      </Text>
      <Text className="font-jakarta-regular" style={{ fontSize: 13.5, color: '#6B665D', marginBottom: 28, lineHeight: 19 }}>
        Sin registro. Sin instalar nada. Recibes propuestas en tu correo.
      </Text>

      <View style={{ gap: 10 }}>
        {actions.map((a) => (
          <Pressable
            key={a.label}
            onPress={() => navigation.navigate(a.to as any)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
              padding: 16,
              backgroundColor: '#fff',
              borderRadius: 16,
              borderWidth: 1,
              borderColor: '#E8E4DC',
            }}
          >
            <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: a.bg, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 20 }}>{a.emoji}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text className="font-jakarta-bold" style={{ fontSize: 14, color: '#1C170D' }}>
                {a.label}
              </Text>
              <Text className="font-jakarta-regular" style={{ fontSize: 11.5, color: '#6B665D', marginTop: 2 }}>
                {a.sub}
              </Text>
            </View>
            <Text style={{ fontSize: 16, color: '#8B857A' }}>›</Text>
          </Pressable>
        ))}
      </View>

      <View style={{ marginTop: 32, padding: 16, backgroundColor: '#F5F3EF', borderRadius: 14 }}>
        <Text className="font-jakarta-bold" style={{ fontSize: 12, color: '#1C170D', marginBottom: 4 }}>
          ¿Eres maestro?
        </Text>
        <Text className="font-jakarta-regular" style={{ fontSize: 11.5, color: '#6B665D', lineHeight: 16 }}>
          Crea tu cuenta gratis para recibir trabajos cerca tuyo.{' '}
          <Text
            className="font-jakarta-bold"
            style={{ color: '#7C3AED' }}
            onPress={() => navigation.navigate('MaestroLogin', { mode: 'register' })}
          >
            Soy maestro →
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
}
