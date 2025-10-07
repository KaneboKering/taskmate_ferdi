import { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getTaskById, updateTask } from '../../src/storage/taskStorage';
import { loadCategories } from '../../src/storage/categoryStorage';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import { PRIORITIES } from '../../src/constants/priorities';

export default function EditTask() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const [task, setTask] = useState(null);
    const [categories, setCategories] = useState([]);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [deadline, setDeadline] = useState('');
    const [category, setCategory] = useState('Umum');
    const [priority, setPriority] = useState('Low');
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        (async () => {
            const [cats, t] = await Promise.all([loadCategories(), getTaskById(id)]);
            setCategories(cats);
            if (!t) {
                Alert.alert('Error', 'Task tidak ditemukan');
                router.back();
                return;
            }
            setTask(t);
            setTitle(t.title || '');
            setDesc(t.description || '');
            setDeadline(t.deadline || '');
            setCategory(t.category || 'Umum');
            setPriority(t.priority || 'Low');
            setProgress(typeof t.progress === 'number' ? t.progress : 0);
        })();
    }, [id]);

    const handleSave = async () => {
        if (!title.trim()) {
            Alert.alert('Error', 'Judul wajib diisi!');
            return;
        }
        const patch = {
            title,
            description: desc,
            deadline,
            category,
            priority,
            progress: Math.round(progress),
        };
        const ok = await updateTask(id, patch);
        if (!ok) {
            Alert.alert('Error', 'Gagal menyimpan perubahan');
            return;
        }
        Alert.alert('Sukses', 'Perubahan disimpan.');
        router.replace('/');
    };

    if (!task) return <View><Text>Loading...</Text></View>;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Edit Tugas</Text>
            {/* ... Form input untuk title, desc, deadline, category, priority ... */}
            <Text style={styles.label}>Progress: {Math.round(progress)}%</Text>
            <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={0}
                maximumValue={100}
                step={1}
                value={progress}
                onValueChange={setProgress}
            />
            <Button title="Simpan Perubahan" onPress={handleSave} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
    label: { marginTop: 12, fontWeight: '600' },
    input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 10, marginTop: 6 },
    // ... (style lain yang relevan)
});