// app/index.jsx

import { useState, useCallback } from 'react';
import { SafeAreaView, StyleSheet, Text, FlatList, View, TouchableOpacity } from 'react-native';
import { useFocusEffect } from 'expo-router';
import Picker from 'react-native-picker-select';
import TaskItem from '../src/components/TaskItem';
import { loadTasks, saveTasks } from '../src/storage/taskStorage';

const categoryItems = [
  { label: 'Semua Kategori', value: 'All' },
  { label: 'Mobile', value: 'Mobile' },
  { label: 'RPL', value: 'RPL' },
  { label: 'IoT', value: 'IoT' },
];

export default function HomeScreen() {
  const [tasks, setTasks] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeCategory, setActiveCategory] = useState('All');

  useFocusEffect(
    useCallback(() => {
      const fetchTasks = async () => {
        const data = await loadTasks();
        setTasks(data || []);
      };
      fetchTasks();
      return () => {};
    }, [])
  );

  // DIUBAH: handleToggle sekarang mengikuti siklus 3 tahap
  const handleToggle = async (task) => {
    const getNextStatus = (currentStatus) => {
      switch (currentStatus) {
        case 'pending':
          return 'todo'; // Dari Pending menjadi Todo
        case 'todo':
          return 'done'; // Dari Todo menjadi Done
        case 'done':
          return 'pending'; // Dari Done kembali ke Pending
        default:
          return 'pending';
      }
    };

    const updated = tasks.map((t) =>
      t.id === task.id ? { ...t, status: getNextStatus(t.status) } : t
    );
    setTasks(updated);
    await saveTasks(updated);
  };


  const handleDelete = async (taskToDelete) => {
    const updated = tasks.filter((t) => t.id !== taskToDelete.id);
    setTasks(updated);
    await saveTasks(updated);
  };

  const filteredTasks = tasks
    .filter(task => { // DIUBAH: Logika filter status disesuaikan
      if (activeFilter === 'all') return true;
      if (activeFilter === 'pending') return task.status === 'pending';
      if (activeFilter === 'todo') return task.status === 'todo';
      if (activeFilter === 'done') return task.status === 'done';
      return true;
    })
    .filter(task => {
      if (activeCategory === 'All') return true;
      return task.category === activeCategory;
    });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>TaskMate - Daftar Tugas</Text>
      
      {/* DIUBAH: Filter status dengan tambahan tombol "Pending" */}
      <View style={styles.filterContainer}>
        <TouchableOpacity 
            style={[styles.filterButton, activeFilter === 'all' && styles.activeFilter]} 
            onPress={() => setActiveFilter('all')}>
          <Text style={styles.filterText}>All</Text>
        </TouchableOpacity>
        {/* BARU: Tombol filter untuk status 'Pending' */}
        <TouchableOpacity 
            style={[styles.filterButton, activeFilter === 'pending' && styles.activeFilter]} 
            onPress={() => setActiveFilter('pending')}>
          <Text style={styles.filterText}>Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity 
            style={[styles.filterButton, activeFilter === 'todo' && styles.activeFilter]} 
            onPress={() => setActiveFilter('todo')}>
          <Text style={styles.filterText}>Todo</Text>
        </TouchableOpacity>
        <TouchableOpacity 
            style={[styles.filterButton, activeFilter === 'done' && styles.activeFilter]} 
            onPress={() => setActiveFilter('done')}>
          <Text style={styles.filterText}>Done</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.pickerContainer}>
        <Picker
          value={activeCategory}
          onValueChange={(value) => setActiveCategory(value)}
          items={categoryItems}
          style={pickerSelectStyles}
          placeholder={{ label: "Pilih kategori...", value: null }}
        />
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        renderItem={({ item }) => <TaskItem task={item} onToggle={handleToggle} onDelete={handleDelete}/>}
        extraData={tasks} 
      />
    </SafeAreaView>
  );
}

// Styles tidak berubah, kecuali jika Anda ingin menyesuaikan ukuran tombol filter
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { fontSize: 20, fontWeight: '700', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12, // Sedikit dikecilkan agar muat
    borderRadius: 20,
    backgroundColor: '#e2e8f0',
  },
  activeFilter: {
    backgroundColor: '#0ea5e9',
  },
  filterText: {
    fontWeight: '600',
    fontSize: 12, // Sedikit dikecilkan agar muat
    color: '#0f172a',
  },
  pickerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
  },
});