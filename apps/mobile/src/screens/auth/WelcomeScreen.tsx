import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import type { AuthStackParamList } from '../../navigation/AuthStack';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;

export function WelcomeScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 18, paddingVertical: 32 }}
      className="bg-pt-bg"
    >
      {/* Logo + tagline */}
      <View style={{ alignItems: 'center', marginBottom: 40 }}>
        <View style={{ flexDirection: 'row', marginBottom: 12 }}>
          <Text className="font-jakarta-extrabold" style={{ fontSize: 32, letterSpacing: -1, color: '#FF6B35' }}>
            pololito
          </Text>
          <Text className="font-jakarta-extrabold" style={{ fontSize: 32, letterSpacing: -1, color: '#1C170D' }}>
            trabajos
          </Text>
        </View>
        <Text className="font-jakarta-medium" style={{ fontSize: 14, color: '#6B665D', textAlign: 'center', lineHeight: 20 }}>
          Encuentra al maestro ideal para tu pololito
        </Text>
      </View>

      {/* Cliente: sin auth */}
      <View style={{ marginBottom: 28 }}>
        <Text className="font-jakarta-bold" style={{ fontSize: 11.5, color: '#8B857A', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
          Necesitas un trabajo
        </Text>

        <Pressable
          onPress={() => navigation.navigate('ClienteEntry')}
          style={{ borderRadius: 14, overflow: 'hidden' }}
        >
          <LinearGradient
            colors={['#FF6B35', '#7C3AED']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ paddingVertical: 16, alignItems: 'center', borderRadius: 14 }}
          >
            <Text className="font-jakarta-bold" style={{ fontSize: 14, color: '#fff' }}>
              Buscar maestros o publicar trabajo
            </Text>
          </LinearGradient>
        </Pressable>

        <Text className="font-jakarta-regular" style={{ fontSize: 11.5, color: '#8B857A', textAlign: 'center', marginTop: 8 }}>
          Sin registro · Recibes propuestas por correo
        </Text>
      </View>

      {/* Divider */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 28 }}>
        <View style={{ flex: 1, height: 1, backgroundColor: '#E8E4DC' }} />
        <Text className="font-jakarta-medium" style={{ marginHorizontal: 12, fontSize: 11, color: '#8B857A' }}>
          o
        </Text>
        <View style={{ flex: 1, height: 1, backgroundColor: '#E8E4DC' }} />
      </View>

      {/* Maestro: registra/login */}
      <View>
        <Text className="font-jakarta-bold" style={{ fontSize: 11.5, color: '#8B857A', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
          Soy maestro y ofrezco servicios
        </Text>

        <Pressable
          onPress={() => navigation.navigate('MaestroLogin', { mode: 'login' })}
          style={{ paddingVertical: 16, alignItems: 'center', borderRadius: 14, borderWidth: 2, borderColor: '#7C3AED', marginBottom: 10 }}
        >
          <Text className="font-jakarta-bold" style={{ fontSize: 14, color: '#7C3AED' }}>
            Iniciar sesión
          </Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('MaestroLogin', { mode: 'register' })}
          style={{ paddingVertical: 16, alignItems: 'center', borderRadius: 14, backgroundColor: '#F5F3EF' }}
        >
          <Text className="font-jakarta-bold" style={{ fontSize: 14, color: '#1C170D' }}>
            Crear cuenta de maestro
          </Text>
        </Pressable>
      </View>

      <Text className="font-jakarta-regular" style={{ fontSize: 11, color: '#8B857A', textAlign: 'center', marginTop: 32, paddingHorizontal: 16, lineHeight: 15.4 }}>
        Al continuar aceptas nuestros Términos y Política de Privacidad
      </Text>
    </ScrollView>
  );
}
