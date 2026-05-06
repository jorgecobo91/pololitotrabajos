import React, { useState } from 'react';
import { View, Text, Pressable, useWindowDimensions, Platform, Animated, ScrollView } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { DesktopShell } from '../components/DesktopShell';
import { CatalogScreen } from '../screens/catalog/CatalogScreen';
import { MaestroDetailScreen } from '../screens/catalog/MaestroDetailScreen';
import { PublishFormScreen } from '../screens/publish/PublishFormScreen';
import { FeedScreen } from '../screens/publish/FeedScreen';
import { ProfileMaestroScreen } from '../screens/profile/ProfileMaestroScreen';
import { useAuthStore } from '../store/authStore';

const Tab = createBottomTabNavigator();
const CatalogStack = createNativeStackNavigator();
const PublishStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

function CatalogNavigator() {
  return (
    <CatalogStack.Navigator screenOptions={{ headerShown: false }}>
      <CatalogStack.Screen name="CatalogHome" component={CatalogScreen} />
      <CatalogStack.Screen name="MaestroDetail" component={MaestroDetailScreen} />
    </CatalogStack.Navigator>
  );
}

function PublishNavigator() {
  return (
    <PublishStack.Navigator screenOptions={{ headerShown: false }}>
      <PublishStack.Screen name="Feed" component={FeedScreen} />
      <PublishStack.Screen name="PublishForm" component={PublishFormScreen} />
    </PublishStack.Navigator>
  );
}

function ProfileNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileHome" component={ProfileMaestroScreen} />
    </ProfileStack.Navigator>
  );
}

const TABS = [
  { key: 'maestros' as const, label: 'Maestros', icon: '👥' },
  { key: 'publicar' as const, label: 'Publicar', icon: '📝' },
  { key: 'perfil' as const, label: 'Perfil', icon: '👤' },
];

const TAB_TO_NAVIGATOR = {
  maestros: CatalogNavigator,
  publicar: PublishNavigator,
  perfil: ProfileNavigator,
} as const;

type TabKey = keyof typeof TAB_TO_NAVIGATOR;

function DesktopMainTabs() {
  const [activeTab, setActiveTab] = useState<TabKey>('maestros');
  const ActiveNavigator = TAB_TO_NAVIGATOR[activeTab];

  return (
    <DesktopShell activeTab={activeTab} onTabChange={setActiveTab}>
      <ActiveNavigator />
    </DesktopShell>
  );
}

function TabIcon({ icon, focused }: { icon: string; focused: boolean }) {
  return <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.6 }}>{icon}</Text>;
}

function MobileMainTabs() {
  if (Platform.OS === 'web') {
    return <WebMobileMainTabs />;
  }

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#7C3AED',
        tabBarInactiveTintColor: '#8B857A',
        tabBarStyle: {
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E8E4DC',
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontFamily: 'PlusJakartaSans_600SemiBold',
          fontSize: 11,
        },
      }}
    >
      <Tab.Screen
        name="Maestros"
        component={CatalogNavigator}
        options={{
          tabBarLabel: 'Maestros',
          tabBarIcon: ({ focused }) => <TabIcon icon="👥" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Publicar"
        component={PublishNavigator}
        options={{
          tabBarLabel: 'Publicar',
          tabBarIcon: ({ focused }) => <TabIcon icon="📝" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={ProfileNavigator}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ focused }) => <TabIcon icon="👤" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

function WebMobileMainTabs() {
  const [activeTab, setActiveTab] = useState<TabKey>('maestros');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const ActiveNavigator = TAB_TO_NAVIGATOR[activeTab];
  const { user, signOut } = useAuthStore();

  const selectTab = (key: TabKey) => {
    setActiveTab(key);
    setDrawerOpen(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFDF7' }}>
      <ActiveNavigator />

      {/* Floating hamburger button — position:fixed so mobile browser chrome can't hide it (RN-web only) */}
      <Pressable
        onPress={() => setDrawerOpen(true)}
        style={{
          position: 'fixed' as any,
          bottom: 24,
          right: 18,
          width: 56,
          height: 56,
          borderRadius: 28,
          overflow: 'hidden',
          zIndex: 99998,
          boxShadow: '0 4px 20px rgba(124,58,237,0.35)',
        } as any}
      >
        <LinearGradient
          colors={['#FF6B35', '#7C3AED']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 56,
            height: 56,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontSize: 26 }}>☰</Text>
        </LinearGradient>
      </Pressable>

      {/* Drawer overlay */}
      {drawerOpen && (
        <Pressable
          onPress={() => setDrawerOpen(false)}
          style={{
            position: 'fixed' as any,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.45)',
            zIndex: 99999,
            flexDirection: 'row',
          } as any}
        >
          {/* Drawer panel */}
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              width: 280,
              height: '100%',
              backgroundColor: '#FFFFFF',
              // @ts-expect-error web-only
              boxShadow: '4px 0 24px rgba(0,0,0,0.12)',
            }}
          >
            <ScrollView contentContainerStyle={{ padding: 18, paddingTop: 48 }}>
              {/* Logo */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 28 }}>
                <LinearGradient
                  colors={['#FF6B35', '#7C3AED']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}
                >
                  <Text style={{ fontSize: 16, color: '#fff', fontWeight: '800' }}>P</Text>
                </LinearGradient>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ fontSize: 15, fontWeight: '800', letterSpacing: -0.3, color: '#FF6B35' }}>
                    pololito
                  </Text>
                  <Text style={{ fontSize: 15, fontWeight: '800', letterSpacing: -0.3, color: '#1C170D' }}>
                    trabajos
                  </Text>
                </View>
              </View>

              {/* User card */}
              <View
                style={{
                  backgroundColor: '#F5F3EF',
                  borderRadius: 16,
                  padding: 14,
                  marginBottom: 24,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: '#F3ECFF',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}
                >
                  <Text style={{ fontSize: 16, color: '#7C3AED', fontWeight: '800' }}>
                    {user?.nombre?.charAt(0) ?? '?'}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: '#1C170D' }} numberOfLines={1}>
                    {user?.nombre ?? 'Invitado'}
                  </Text>
                  <Text style={{ fontSize: 11, color: '#8B857A' }} numberOfLines={1}>
                    {user?.email ?? 'Modo demo'}
                  </Text>
                </View>
              </View>

              {/* Navigation */}
              <View style={{ gap: 4 }}>
                {TABS.map((tab) => {
                  const active = activeTab === tab.key;
                  return (
                    <Pressable
                      key={tab.key}
                      onPress={() => selectTab(tab.key)}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 12,
                        paddingHorizontal: 14,
                        paddingVertical: 13,
                        borderRadius: 12,
                        backgroundColor: active ? '#F3ECFF' : 'transparent',
                      }}
                    >
                      <Text style={{ fontSize: 18 }}>{tab.icon}</Text>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: '700',
                          color: active ? '#7C3AED' : '#1C170D',
                        }}
                      >
                        {tab.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* Footer */}
              <View style={{ marginTop: 32, gap: 4 }}>
                <Pressable
                  onPress={() => { signOut(); setDrawerOpen(false); }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    borderRadius: 12,
                  }}
                >
                  <Text style={{ fontSize: 16 }}>🚪</Text>
                  <Text style={{ fontSize: 13, fontWeight: '500', color: '#EF4444' }}>
                    Cerrar sesión
                  </Text>
                </Pressable>
              </View>

              <View style={{ marginTop: 32, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#E8E4DC' }}>
                <Text style={{ fontSize: 10.5, color: '#8B857A', lineHeight: 14.7 }}>
                  POLOLITOTRABAJOS es solo intermediaria. No garantizamos calidad ni respondemos por incumplimientos.
                </Text>
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      )}
    </View>
  );
}

export function MainTabs() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  return isDesktop ? <DesktopMainTabs /> : <MobileMainTabs />;
}
