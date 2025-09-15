// app/add.jsx

import { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { loadTasks, saveTasks } from '../src/storage/taskStorage';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'expo-router';

// BARU: Definisikan kategori yang tersedia di satu tempat
const categories = ['Mobile', 'RPL', 'IoT'];

export default function AddTaskScreen() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    // BARU: State untuk menyimpan kategori yang dipilih, default-nya 'Mobile'
    const [category, setCategory] = useState('Mobile');

    const handleAdd = async () => {
        if (!title.trim() || !desc.trim()) {
            Alert.alert('Error', 'Judul dan Deskripsi tidak boleh kosong.');
            return;
        }
        const tasks = await loadTasks() || [];
        const newTask = {
            id: uuidv4(),
            title,
            description: desc,
            // DIUBAH: Menggunakan state 'category' dinamis
            category: category, 
            deadline: '2025-12-31',
            status: 'pending'
        };
        const updated = [...tasks, newTask];
        await saveTasks(updated);

        Alert.alert('Sukses', 'Tugas baru berhasil ditambahkan!');
        router.replace('/');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Judul Tugas</Text>
            <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Contoh: Belajar React Native"
            />

            <Text style={styles.label}>Deskripsi</Text>
            <TextInput
                style={styles.input}
                value={desc}
                onChangeText={setDesc}
                placeholder="Contoh: Menyelesaikan modul 1 sampai 5"
                multiline
            />

            {/* BARU: Tampilan untuk memilih kategori */}
            <Text style={styles.label}>Kategori</Text>
            <View style={styles.categoryContainer}>
                {categories.map((cat) => (
                    <TouchableOpacity
                        key={cat}
                        style={[
                            styles.categoryButton,
                            category === cat && styles.categoryButtonActive
                        ]}
                        onPress={() => setCategory(cat)}
                    >
                        <Text style={[
                            styles.categoryText,
                            category === cat && styles.categoryTextActive
                        ]}>{cat}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            
            <Button title="Tambah Tugas" onPress={handleAdd} />
        </View>
    );
}

// DIUBAH: Menambahkan style untuk pilihan kategori
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: Platform.OS === 'ios' ? 12 : 8,
        fontSize: 16,
        marginBottom: 20,
    },
    // BARU: Styles untuk container, tombol, dan teks kategori
    categoryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    categoryButton: {
        flex: 1,
        paddingVertical: 12,
        marginHorizontal: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#0ea5e9',
        alignItems: 'center',
    },
    categoryButtonActive: {
        backgroundColor: '#0ea5e9',
    },
    categoryText: {
        color: '#0ea5e9',
        fontWeight: '600',
    },
    categoryTextActive: {
        color: '#fff',
    }
});