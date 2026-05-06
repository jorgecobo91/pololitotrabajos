import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../../lib/supabase';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function RecoverPasswordScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleRecover = async () => {
    setError('');
    if (!EMAIL_RE.test(email)) { setError('Email inválido'); return; }
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.resetPasswordForEmail(email);
      if (err) {
        setError(err.message);
      } else {
        setSent(true);
      }
    } catch (e: any) {
      setError(e?.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 18 }} className="bg-pt-bg">
        <View style={{ alignItems: 'center' }}>
          <View style={{ width: 64, height: 64, borderRadius: 16, backgroundColor: '#EDE9FE', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <Text style={{ fontSize: 28 }}>✓</Text>
          </View>
          <Text className="font-jakarta-extrabold" style={{ fontSize: 22, color: '#1C170D', letterSpacing: -0.5, marginBottom: 8 }}>
            Enlace enviado
          </Text>
          <Text className="font-jakarta-regular" style={{ fontSize: 13, color: '#6B665D', textAlign: 'center', lineHeight: 20, paddingHorizontal: 16, marginBottom: 24 }}>
            Si <Text className="font-jakarta-bold" style={{ color: '#1C170D' }}>{email}</Text> está registrado,
            recibirás un enlace para restablecer tu contraseña.
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
              Volver a iniciar sesión
            </Text>
          </LinearGradient>
        </Pressable>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 18, paddingVertical: 32 }} className="bg-pt-bg">
      <Pressable onPress={() => navigation.goBack()} style={{ position: 'absolute', top: 56, left: 18 }}>
        <Text className="font-jakarta-bold" style={{ fontSize: 14, color: '#7C3AED' }}>← Volver</Text>
      </Pressable>

      <Text className="font-jakarta-extrabold" style={{ fontSize: 22, color: '#1C170D', letterSpacing: -0.5, marginBottom: 8 }}>
        Recuperar contraseña
      </Text>
      <Text className="font-jakarta-regular" style={{ fontSize: 13, color: '#6B665D', marginBottom: 24, lineHeight: 18 }}>
        Ingresa tu correo y te enviaremos un enlace seguro para restablecer tu contraseña.
      </Text>

      <Text className="font-jakarta-bold" style={{ fontSize: 11.5, color: '#1C170D', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 7 }}>
        Correo electrónico
      </Text>
      <TextInput
        style={{
          backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E8E4DC',
          borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14,
          fontSize: 13.5, color: '#1C170D',
        }}
        className="font-jakarta-regular"
        placeholder="tu@correo.cl"
        placeholderTextColor="#8B857A"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {error ? (
        <View style={{ backgroundColor: '#FEF2F2', borderRadius: 12, padding: 12, marginTop: 12 }}>
          <Text className="font-jakarta-medium" style={{ fontSize: 12, color: '#EF4444' }}>{error}</Text>
        </View>
      ) : null}

      <Pressable
        onPress={handleRecover}
        disabled={loading || !email}
        style={{ marginTop: 16, borderRadius: 14, overflow: 'hidden', opacity: loading || !email ? 0.6 : 1 }}
      >
        <LinearGradient
          colors={['#FF6B35', '#7C3AED']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={{ paddingVertical: 16, alignItems: 'center' }}
        >
          <Text className="font-jakarta-bold" style={{ fontSize: 14, color: '#fff' }}>
            {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
          </Text>
        </LinearGradient>
      </Pressable>
    </ScrollView>
  );
}
