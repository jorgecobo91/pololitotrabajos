import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../../lib/supabase';
import type { AuthStackParamList } from '../../navigation/AuthStack';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'MaestroLogin'>;
type Route = RouteProp<AuthStackParamList, 'MaestroLogin'>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function MaestroLoginScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const initialMode = route.params?.mode || 'login';

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);

  const switchMode = (m: 'login' | 'register') => { setMode(m); setError(''); };

  const handleLogin = async () => {
    setError('');
    if (!EMAIL_RE.test(email)) { setError('Email inválido'); return; }
    if (!password) { setError('Ingresa tu contraseña'); return; }

    setLoading(true);
    try {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) {
        if (err.message === 'Invalid login credentials') {
          setError('Email o contraseña incorrectos');
        } else if (err.message === 'Email not confirmed') {
          setError('Debes verificar tu correo antes de iniciar sesión');
        } else {
          setError(err.message);
        }
      }
      // On success, RootNavigator detects session change and navigates to MainTabs
    } catch (e: any) {
      setError(e?.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setError('');
    if (!EMAIL_RE.test(email)) { setError('Email inválido'); return; }
    if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return; }
    if (password !== confirmPassword) { setError('Las contraseñas no coinciden'); return; }
    if (!acceptedTerms) { setError('Debes aceptar los Términos y Condiciones'); return; }

    setLoading(true);
    try {
      const { data, error: err } = await supabase.auth.signUp({ email, password });
      if (err) {
        if (err.message?.includes('already registered')) {
          setError('Este correo ya está registrado. Intenta iniciar sesión.');
        } else {
          setError(err.message);
        }
        return;
      }

      if (data.user) {
        await supabase.from('users').upsert({
          id: data.user.id,
          email: data.user.email,
          nombre: email.split('@')[0],
          roles: ['maestro'],
        }, { onConflict: 'id' });

        await supabase.from('maestro_profiles').upsert({
          user_id: data.user.id,
          oficio: 'Maestro general',
          especialidades: [],
          disponible: true,
        }, { onConflict: 'user_id' });
      }

      setVerificationSent(true);
    } catch (e: any) {
      setError(e?.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  // ============== Verification sent screen ==============
  if (verificationSent) {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 18 }} className="bg-pt-bg">
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <View style={{ width: 64, height: 64, borderRadius: 16, backgroundColor: '#D1FAE5', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <Text style={{ fontSize: 28 }}>📧</Text>
          </View>
          <Text className="font-jakarta-extrabold" style={{ fontSize: 22, color: '#1C170D', letterSpacing: -0.5, marginBottom: 8 }}>
            Revisa tu correo
          </Text>
          <Text className="font-jakarta-regular" style={{ fontSize: 13, color: '#6B665D', textAlign: 'center', lineHeight: 20, paddingHorizontal: 16 }}>
            Enviamos un enlace de verificación a{'\n'}
            <Text className="font-jakarta-bold" style={{ color: '#1C170D' }}>{email}</Text>
            {'\n'}Haz clic en el enlace para activar tu cuenta.
          </Text>
        </View>

        <Pressable
          onPress={() => { setVerificationSent(false); switchMode('login'); }}
          style={{ borderRadius: 14, overflow: 'hidden' }}
        >
          <LinearGradient
            colors={['#FF6B35', '#7C3AED']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={{ paddingVertical: 16, alignItems: 'center' }}
          >
            <Text className="font-jakarta-bold" style={{ fontSize: 14, color: '#fff' }}>
              Ya verifiqué, iniciar sesión
            </Text>
          </LinearGradient>
        </Pressable>
      </ScrollView>
    );
  }

  // ============== Login / Register form ==============
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 18, paddingVertical: 32 }} className="bg-pt-bg">
      <Pressable onPress={() => navigation.goBack()} style={{ position: 'absolute', top: 56, left: 18 }}>
        <Text className="font-jakarta-bold" style={{ fontSize: 14, color: '#7C3AED' }}>← Volver</Text>
      </Pressable>

      <View style={{ alignItems: 'center', marginBottom: 24 }}>
        <View style={{ width: 56, height: 56, borderRadius: 14, backgroundColor: '#EDE9FE', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
          <Text style={{ fontSize: 24 }}>🛠️</Text>
        </View>
        <Text className="font-jakarta-extrabold" style={{ fontSize: 22, color: '#1C170D', letterSpacing: -0.5 }}>
          Portal Maestros
        </Text>
        <Text className="font-jakarta-regular" style={{ fontSize: 12.5, color: '#6B665D', marginTop: 4 }}>
          Ofrece tus servicios y encuentra clientes
        </Text>
      </View>

      {/* Mode tabs */}
      <View style={{ flexDirection: 'row', backgroundColor: '#F5F3EF', borderRadius: 12, padding: 4, marginBottom: 20 }}>
        <Pressable onPress={() => switchMode('login')} style={{ flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10, backgroundColor: mode === 'login' ? '#fff' : 'transparent' }}>
          <Text className="font-jakarta-bold" style={{ fontSize: 13, color: mode === 'login' ? '#1C170D' : '#8B857A' }}>
            Iniciar sesión
          </Text>
        </Pressable>
        <Pressable onPress={() => switchMode('register')} style={{ flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10, backgroundColor: mode === 'register' ? '#fff' : 'transparent' }}>
          <Text className="font-jakarta-bold" style={{ fontSize: 13, color: mode === 'register' ? '#1C170D' : '#8B857A' }}>
            Registrarse
          </Text>
        </Pressable>
      </View>

      {/* Email */}
      <View style={{ marginBottom: 14 }}>
        <Text className="font-jakarta-bold" style={{ fontSize: 11.5, color: '#1C170D', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 7 }}>
          Correo electrónico
        </Text>
        <TextInput
          style={fieldStyle}
          className="font-jakarta-regular"
          placeholder="tu@correo.cl"
          placeholderTextColor="#8B857A"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
      </View>

      {/* Password */}
      <View style={{ marginBottom: 14 }}>
        <Text className="font-jakarta-bold" style={{ fontSize: 11.5, color: '#1C170D', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 7 }}>
          Contraseña
        </Text>
        <View style={{ position: 'relative' }}>
          <TextInput
            style={[fieldStyle, { paddingRight: 44 }]}
            className="font-jakarta-regular"
            placeholder="••••••••"
            placeholderTextColor="#8B857A"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPwd}
            autoCapitalize="none"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />
          <Pressable
            onPress={() => setShowPwd(!showPwd)}
            style={{ position: 'absolute', right: 14, top: 0, bottom: 0, justifyContent: 'center' }}
            hitSlop={8}
          >
            <Text style={{ fontSize: 14, color: '#8B857A' }}>{showPwd ? '🙈' : '👁'}</Text>
          </Pressable>
        </View>
      </View>

      {/* Confirm password (register only) */}
      {mode === 'register' && (
        <View style={{ marginBottom: 14 }}>
          <Text className="font-jakarta-bold" style={{ fontSize: 11.5, color: '#1C170D', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 7 }}>
            Confirmar contraseña
          </Text>
          <TextInput
            style={fieldStyle}
            className="font-jakarta-regular"
            placeholder="Repite tu contraseña"
            placeholderTextColor="#8B857A"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showPwd}
            autoCapitalize="none"
          />
        </View>
      )}

      {/* Terms checkbox (register only) */}
      {mode === 'register' && (
        <Pressable
          onPress={() => setAcceptedTerms(!acceptedTerms)}
          style={{ flexDirection: 'row', gap: 10, padding: 12, borderRadius: 12, backgroundColor: acceptedTerms ? '#EDE9FE' : '#F5F3EF', borderWidth: 1.5, borderColor: acceptedTerms ? '#7C3AED' : '#E8E4DC', marginBottom: 14 }}
        >
          <View style={{ width: 20, height: 20, borderRadius: 4, backgroundColor: acceptedTerms ? '#7C3AED' : 'transparent', borderWidth: 2, borderColor: acceptedTerms ? '#7C3AED' : '#C4BFB6', alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>
            {acceptedTerms && <Text style={{ color: '#fff', fontSize: 11, fontWeight: 'bold' }}>✓</Text>}
          </View>
          <Text className="font-jakarta-regular" style={{ flex: 1, fontSize: 12.5, color: '#1C170D', lineHeight: 18 }}>
            Acepto los Términos y Condiciones y la Política de Privacidad
          </Text>
        </Pressable>
      )}

      {error ? (
        <View style={{ backgroundColor: '#FEF2F2', borderRadius: 12, padding: 12, marginBottom: 14 }}>
          <Text className="font-jakarta-medium" style={{ fontSize: 12, color: '#EF4444' }}>{error}</Text>
        </View>
      ) : null}

      <Pressable
        onPress={mode === 'login' ? handleLogin : handleRegister}
        disabled={loading}
        style={{ borderRadius: 14, overflow: 'hidden', opacity: loading ? 0.6 : 1 }}
      >
        <LinearGradient
          colors={['#FF6B35', '#7C3AED']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={{ paddingVertical: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}
        >
          {loading && <ActivityIndicator color="#fff" size="small" />}
          <Text className="font-jakarta-bold" style={{ fontSize: 14, color: '#fff' }}>
            {loading ? (mode === 'login' ? 'Entrando...' : 'Creando cuenta...') : (mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta')}
          </Text>
        </LinearGradient>
      </Pressable>

      {mode === 'login' && (
        <Pressable onPress={() => navigation.navigate('RecoverPassword')} style={{ marginTop: 14, alignItems: 'center' }}>
          <Text className="font-jakarta-medium" style={{ fontSize: 12.5, color: '#7C3AED' }}>
            ¿Olvidaste tu contraseña?
          </Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

const fieldStyle = {
  backgroundColor: '#FFFFFF',
  borderWidth: 1,
  borderColor: '#E8E4DC',
  borderRadius: 14,
  paddingHorizontal: 16,
  paddingVertical: 14,
  fontSize: 13.5,
  color: '#1C170D',
};
