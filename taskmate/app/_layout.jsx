import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { getItemAsync } from 'expo-secure-store';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getItemAsync('authToken');
      const inAuthGroup = segments[0] === '(auth)';

      if (token && inAuthGroup) {
        // Pengguna sudah login tapi masih di halaman auth, arahkan ke halaman utama.
        // Cukup arahkan ke '/' karena (tabs) adalah root dari grup tersebut.
        router.replace('/'); 
      } else if (!token && !inAuthGroup) {
        // Pengguna belum login dan tidak di halaman auth, arahkan ke login.
        router.replace('/login');
      }
    };

    checkAuth();
  }, [segments]);

  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}