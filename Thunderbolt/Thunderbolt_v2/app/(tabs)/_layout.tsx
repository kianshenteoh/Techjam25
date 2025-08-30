// app/(tabs)/_layout.tsx
import React from 'react';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // Hide the built-in tab bar completely
        tabBarStyle: { display: 'none', height: 0 },
        tabBarItemStyle: { display: 'none' },
        tabBarButton: () => null,
      }}
    >
      {/* Keep the routes, just no bar */}
      <Tabs.Screen name="Home" />
      <Tabs.Screen name="Thunderbolt" />
    </Tabs>
  );
}
