import { Tabs, useRouter } from 'expo-router';
import { Feather } from "@expo/vector-icons";
import { TouchableOpacity } from 'react-native';
import { logout } from '../../src/storage/authStorage';

export default function TabLayout() {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <Tabs
      screenOptions={{
        headerRight: () => (
          <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
            <Feather name="log-out" size={24} color="red" />
          </TouchableOpacity>
        ),
      }}
    >
      <Tabs.Screen name='index' options={{
        title: "Daftar Tugas",
        tabBarIcon: ({ color, size }) => <Feather name='list' size={size} color={color} />
      }} />
      <Tabs.Screen name='add' options={{
        title: "Tambah Tugas",
        tabBarIcon: ({ color, size }) => <Feather name='plus-square' size={size} color={color} />
      }} />
      <Tabs.Screen name='progress' options={{
        title: "Progress",
        tabBarIcon: ({ color, size }) => <Feather name='check-circle' size={size} color={color} />
      }} />
      <Tabs.Screen name='diag' options={{
        title: "Diagram",
        tabBarIcon: ({ color, size }) => <Feather name='pie-chart' size={size} color={color} />
      }} />
      
      {/* ✅ PERBAIKAN: Sembunyikan halaman edit dari tab bar */}
      <Tabs.Screen
        name="edit/[id]"
        options={{
          href: null, // Ini akan menyembunyikan tab
          title: "Edit Tugas",
        }}
      />
    </Tabs>
  )
}