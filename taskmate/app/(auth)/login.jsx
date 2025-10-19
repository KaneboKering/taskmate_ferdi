import { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { login } from '../../src/storage/authStorage';
import { validateEmail } from '../../src/utils/validation';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Error', 'Email dan password tidak boleh kosong.');
            return;
        }
        if (!validateEmail(email)) {
            Alert.alert('Error', 'Format email tidak valid.');
            return;
        }

        setIsLoading(true);
        const { success, error } = await login(email, password);
        setIsLoading(false);

        if (success) {
            router.replace('/');
        } else {
            Alert.alert('Login Gagal', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Selamat Datang!</Text>
            
            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Masukkan email Anda"
                keyboardType="email-address"
                autoCapitalize="none"
            />
            
            <Text style={styles.label}>Password</Text>
            <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Masukkan password Anda"
                secureTextEntry
            />
            
            {isLoading ? (
                <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }}/>
            ) : (
                <View style={{ marginTop: 20 }}>
                    <Button title="Login" onPress={handleLogin} disabled={isLoading} />
                </View>
            )}

            <View style={styles.footer}>
                <Text>Belum punya akun? </Text>
                <Link href="/register" asChild>
                    <TouchableOpacity>
                        <Text style={styles.link}>Daftar di sini</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f8fafc', justifyContent: 'center' },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center', color: '#334155' },
    label: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#334155' },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, fontSize: 16, marginBottom: 16, backgroundColor: '#fff' },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
    link: { color: '#007bff', fontWeight: 'bold' },
});