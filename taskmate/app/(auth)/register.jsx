import { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { register } from '../../src/storage/authStorage';
import { validateEmail, validatePassword } from '../../src/utils/validation';

export default function RegisterScreen() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async () => {
        if (!name.trim() || !email.trim() || !password.trim()) {
            Alert.alert('Error', 'Semua field harus diisi.');
            return;
        }
        if (!validateEmail(email)) {
            Alert.alert('Error', 'Format email tidak valid.');
            return;
        }
        if (!validatePassword(password)) {
            Alert.alert('Error', 'Password minimal harus 6 karakter.');
            return;
        }

        setIsLoading(true);
        const { success, error } = await register(name, email, password);
        setIsLoading(false);

        if (success) {
            Alert.alert('Sukses', 'Registrasi berhasil! Silakan login.', [
                { text: 'OK', onPress: () => router.push('/login') }
            ]);
        } else {
            Alert.alert('Registrasi Gagal', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Buat Akun Baru</Text>

            <Text style={styles.label}>Nama Lengkap</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Masukkan nama lengkap"
            />
            
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
                placeholder="Minimal 6 karakter"
                secureTextEntry
            />

            {isLoading ? (
                <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
            ) : (
                <View style={{ marginTop: 20 }}>
                    <Button title="Daftar" onPress={handleRegister} disabled={isLoading} />
                </View>
            )}

            <View style={styles.footer}>
                <Text>Sudah punya akun? </Text>
                <Link href="/login" asChild>
                    <TouchableOpacity>
                        <Text style={styles.link}>Login di sini</Text>
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