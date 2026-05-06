import React from 'react';
import { View, Text, Pressable, useWindowDimensions, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../store/authStore';

interface Props {
  children: React.ReactNode;
  activeTab: 'maestros' | 'publicar' | 'perfil';
  onTabChange: (tab: 'maestros' | 'publicar' | 'perfil') => void;
}

const TABS = [
  { key: 'maestros' as const, label: 'Maestros', icon: '👥' },
  { key: 'publicar' as const, label: 'Publicar', icon: '📝' },
  { key: 'perfil' as const, label: 'Perfil', icon: '👤' },
];

export function DesktopShell({ children, activeTab, onTabChange }: Props) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const showRightPanel = width >= 1360;
  const { user, signOut } = useAuthStore();

  if (!isDesktop) {
    return <>{children}</>;
  }

  return (
    <View className="flex-1 flex-row bg-pt-bg-alt">
      {/* SIDEBAR LEFT */}
      <View style={{ width: 280, backgroundColor: '#FFFFFF', borderRightWidth: 1, borderRightColor: '#E8E4DC', height: '100%' }}>
        <ScrollView contentContainerStyle={{ padding: 18 }}>
          {/* Logo */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 32, marginTop: 8 }}>
            <LinearGradient
              colors={['#FF6B35', '#7C3AED']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}
            >
              <Text className="font-jakarta-extrabold" style={{ fontSize: 16, color: '#fff' }}>P</Text>
            </LinearGradient>
            <View style={{ flexDirection: 'row' }}>
              <Text className="font-jakarta-extrabold" style={{ fontSize: 14, letterSpacing: -0.3, color: '#FF6B35' }}>
                pololito
              </Text>
              <Text className="font-jakarta-extrabold" style={{ fontSize: 14, letterSpacing: -0.3, color: '#1C170D' }}>
                trabajos
              </Text>
            </View>
          </View>

          {/* User card */}
          <View
            style={{
              backgroundColor: '#F5F3EF', borderRadius: 16, padding: 14,
              marginBottom: 24, flexDirection: 'row', alignItems: 'center',
            }}
          >
            <View
              style={{
                width: 44, height: 44, borderRadius: 22,
                backgroundColor: '#F3ECFF', alignItems: 'center', justifyContent: 'center',
                marginRight: 12,
              }}
            >
              <Text className="font-jakarta-extrabold" style={{ fontSize: 16, color: '#7C3AED' }}>
                {user?.nombre?.charAt(0) ?? '?'}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text className="font-jakarta-bold text-pt-ink" style={{ fontSize: 13 }} numberOfLines={1}>
                {user?.nombre ?? 'Usuario'}
              </Text>
              <Text className="font-jakarta-regular" style={{ fontSize: 11, color: '#8B857A' }} numberOfLines={1}>
                {user?.email ?? ''}
              </Text>
            </View>
          </View>

          {/* Nav */}
          <View style={{ gap: 4 }}>
            {TABS.map((tab) => {
              const active = activeTab === tab.key;
              return (
                <Pressable
                  key={tab.key}
                  onPress={() => onTabChange(tab.key)}
                  style={{
                    flexDirection: 'row', alignItems: 'center', gap: 12,
                    paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12,
                    backgroundColor: active ? '#F3ECFF' : 'transparent',
                  }}
                >
                  <Text style={{ fontSize: 18 }}>{tab.icon}</Text>
                  <Text
                    className="font-jakarta-bold"
                    style={{ fontSize: 13.5, color: active ? '#7C3AED' : '#1C170D' }}
                  >
                    {tab.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Footer actions */}
          <View style={{ marginTop: 32, gap: 4 }}>
            <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12 }}>
              <Text style={{ fontSize: 16 }}>⚙️</Text>
              <Text className="font-jakarta-medium" style={{ fontSize: 13, color: '#6B665D' }}>Configuración</Text>
            </Pressable>
            <Pressable onPress={signOut} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12 }}>
              <Text style={{ fontSize: 16 }}>🚪</Text>
              <Text className="font-jakarta-medium" style={{ fontSize: 13, color: '#EF4444' }}>Cerrar sesión</Text>
            </Pressable>
          </View>

          {/* Disclaimer */}
          <View style={{ marginTop: 32, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#E8E4DC' }}>
            <Text className="font-jakarta-regular" style={{ fontSize: 10.5, color: '#8B857A', lineHeight: 14.7 }}>
              POLOLITOTRABAJOS es solo intermediaria. No garantizamos calidad ni respondemos por incumplimientos.
            </Text>
          </View>
        </ScrollView>
      </View>

      {/* CENTER CONTENT */}
      <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#F5F3EF' }}>
        <View
          style={{
            width: '100%', maxWidth: 480, height: '100%',
            backgroundColor: '#FFFDF7',
            // @ts-expect-error web-only shadow
            boxShadow: '0 0 40px rgba(0,0,0,0.05)',
          }}
        >
          {children}
        </View>
      </View>

      {/* RIGHT PANEL - only on wide screens */}
      {showRightPanel && (
        <View style={{ width: 300, backgroundColor: '#F5F3EF', borderLeftWidth: 1, borderLeftColor: '#E8E4DC', height: '100%' }}>
          <ScrollView contentContainerStyle={{ padding: 18 }}>
            <Text className="font-jakarta-extrabold text-pt-ink" style={{ fontSize: 13, letterSpacing: -0.2, textTransform: 'uppercase', opacity: 0.9, marginBottom: 12 }}>
              Tu actividad
            </Text>

            <View
              style={{
                backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E8E4DC',
                borderRadius: 16, padding: 16, marginBottom: 16,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981' }} />
                <Text className="font-jakarta-semibold text-pt-ink" style={{ fontSize: 12 }}>Conectado</Text>
              </View>
              <Text className="font-jakarta-regular" style={{ fontSize: 12, color: '#6B665D' }}>
                Maestros pueden contactarte ahora.
              </Text>
            </View>

            <Text className="font-jakarta-extrabold text-pt-ink" style={{ fontSize: 13, letterSpacing: -0.2, textTransform: 'uppercase', opacity: 0.9, marginBottom: 12 }}>
              Tips para tu pega
            </Text>

            <View style={{ gap: 10 }}>
              {[
                { icon: '📸', text: 'Sube fotos del trabajo para que el maestro lo cotice mejor' },
                { icon: '⭐', text: 'Revisa las calificaciones antes de elegir' },
                { icon: '📞', text: 'Acuerda todo por WhatsApp o llamada antes de pagar' },
                { icon: '📍', text: 'Indica bien la dirección y comuna' },
              ].map((tip) => (
                <View
                  key={tip.text}
                  style={{
                    backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E8E4DC',
                    borderRadius: 12, padding: 12, flexDirection: 'row', gap: 10,
                  }}
                >
                  <Text style={{ fontSize: 14 }}>{tip.icon}</Text>
                  <Text className="font-jakarta-regular" style={{ fontSize: 11.5, color: '#6B665D', flex: 1, lineHeight: 16.1 }}>
                    {tip.text}
                  </Text>
                </View>
              ))}
            </View>

            <View style={{ marginTop: 24, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#E8E4DC' }}>
              <Text className="font-jakarta-regular" style={{ fontSize: 10.5, color: '#8B857A', textAlign: 'center' }}>
                POLOLITOTRABAJOS · Hecho en Chile 🇨🇱
              </Text>
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
}
