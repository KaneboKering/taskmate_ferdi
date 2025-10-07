import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ComponentProps } from 'react';

export default function Layout() {
  return (
    <Tabs 
      screenOptions={({ route }) => ({
        headerTitleAlign: 'center',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: ComponentProps<typeof Ionicons>['name'];

          if (route.name === 'index') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'add') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'progress') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'diag') {
            iconName = focused ? 'build' : 'build-outline';
          } else {
            // [FIX] Beri nilai default untuk menghindari undefined
            iconName = 'help-circle'; 
          }

          // Sekarang TypeScript tahu bahwa iconName adalah nama ikon yang valid
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="add" options={{ title: 'Add' }} />
      <Tabs.Screen name="progress" options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="diag" options={{ title: 'Diag' }} />
      
      <Tabs.Screen name="edit/[id]" options={{ href: null, title: 'Edit Task' }} />
    </Tabs>
  );
}

