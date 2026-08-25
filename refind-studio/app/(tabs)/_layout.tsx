import { FontAwesome6 } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

const icon = (name: React.ComponentProps<typeof FontAwesome6>['name']) =>
  ({ color }: { color: string }) => <FontAwesome6 name={name} size={19} color={color} />;

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#4938E8',
      tabBarInactiveTintColor: '#9B9BAD',
      tabBarStyle: { height: 72, paddingTop: 9, backgroundColor: '#FFFFFF', borderTopColor: '#ECECF4' },
      tabBarLabelStyle: { fontSize: 10, fontWeight: '700' },
    }}>
      <Tabs.Screen name="index" options={{ title: 'Echi', tabBarIcon: icon('wave-square') }} />
      <Tabs.Screen name="live" options={{ title: 'Live', tabBarIcon: icon('circle-dot') }} />
      <Tabs.Screen name="profile" options={{ title: 'Tu', tabBarIcon: icon('user') }} />
    </Tabs>
  );
}
