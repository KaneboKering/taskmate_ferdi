
import { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import uuid from 'react-native-uuid';
import { loadTasks, saveTasks } from '../src/storage/taskStorage';
import { Picker } from '@react-native-picker/picker';
import { PRIORITIES } from '../src/constants/priorities'; 

const categories = ['Mobile', 'RPL', 'IoT', 'General'];

export default function AddTaskScreen() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [category, setCategory] = useState('Mobile');
    const [deadline, setDeadline] = useState(''); 
    const [priority, setPriority] = useState('Low'); 

    const handleAdd = async () => {
        if (!title.trim()) {
            Alert.alert('Error', 'Judul tidak boleh kosong.');
            return;
        }
        const tasks = await loadTasks() || [];
        const newTask = {
            id: uuid.v4(),
            title,
            description: desc,
            category: category, 
            deadline: deadline, 
            priority: priority, 
            status: 'pending',
        };
        await saveTasks(newTask);
        router.replace('/');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Judul Tugas</Text>
            <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Contoh: Belajar Prioritas" />
            
            <Text style={styles.label}>Deskripsi</Text>
            <TextInput style={styles.input} value={desc} onChangeText={setDesc} placeholder="Deskripsi singkat (opsional)" multiline />
            
            <Text style={styles.label}>Deadline (YYYY-MM-DD)</Text>
            <TextInput style={styles.input} value={deadline} onChangeText={setDeadline} placeholder="Contoh: 2025-10-26" />

            <Text style={styles.label}>Kategori</Text>
            <View style={styles.pickerWrap}>
              <Picker selectedValue={category} onValueChange={(itemValue) => setCategory(itemValue)}>
                {categories.map((cat) => <Picker.Item key={cat} label={cat} value={cat} />)}
              </Picker>
            </View>

            <Text style={styles.label}>Prioritas</Text>
            <View style={styles.pickerWrap}>
              <Picker selectedValue={priority} onValueChange={(itemValue) => setPriority(itemValue)}>
                {PRIORITIES.map((p) => <Picker.Item key={p} label={p} value={p} />)}
              </Picker>
            </View>
            
            <View style={{marginTop: 20}}>
              <Button title="Simpan Tugas" onPress={handleAdd} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f8fafc' },
    label: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#334155' },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, paddingVertical: Platform.OS === 'ios' ? 12 : 8, fontSize: 16, marginBottom: 16, backgroundColor: '#fff' },
    pickerWrap: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 16, backgroundColor: '#fff' },
});