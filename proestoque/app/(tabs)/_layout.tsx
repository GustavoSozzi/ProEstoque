import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/src/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary[500],
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: { backgroundColor: Colors.surface, borderTopColor: Colors.border },
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="produtos"
        options={{
          title: 'Produtos',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="shippingbox.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
