import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator, Alert } from 'react-native';
import { API_BASE } from '../src/config/api';
import { loadTasks } from '../src/storage/taskStorage';
import { loadCategories } from '../src/storage/categoryStorage';

export default function Diagnostics() {
    const [status, setStatus] = useState({ api: false, tasks: 0, cats: 0, base: API_BASE, err: '' });
    const [loading, setLoading] = useState(false);

    const ping = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/health`);
            const ok = res.ok;
            const [tasks, cats] = await Promise.all([loadTasks(), loadCategories()]);
            setStatus({ api: ok, tasks: tasks.length, cats: cats.length, base: API_BASE, err: '' });
        } catch (e) {
            const errorString = String(e);
            setStatus(s => ({ ...s, err: errorString }));
            Alert.alert('Network Error', errorString);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        ping();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.h}>Diagnostics</Text>
            <Text style={styles.kv}>API_BASE: <Text style={styles.mono}>{status.base}</Text></Text>
            <Text style={styles.kv}>API /health: <Text style={{ color: status.api ? '#16a34a' : '#dc2626' }}>{String(status.api)}</Text></Text>
            <Text style={styles.kv}>Tasks fetched: {status.tasks}</Text>
            <Text style={styles.kv}>Categories fetched: {status.cats}</Text>
            {status.err ? <Text style={[styles.kv, { color: '#dc2626' }]}>Error: {status.err}</Text> : null}
            <View style={{ height: 12 }} />
            {loading ? <ActivityIndicator /> : <Button title="Re-run Checks" onPress={ping} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 16 },
    h: { fontSize: 20, fontWeight: '800', marginBottom: 8, color: '#0f172a' },
    kv: { fontSize: 14, color: '#334155', marginTop: 6 },
    mono: { fontFamily: 'monospace' }
});