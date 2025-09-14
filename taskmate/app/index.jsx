// app/index.jsx

import { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, FlatList, View, TouchableOpacity } from 'react-native';
import TaskItem from '../src/components/TaskItem';
import { dummyTasks } from '../src/data/dummyTask';
export default function HomeScreen() {
  const [tasks, setTasks] = useState(dummyTasks);
  const [activeFilter, setActiveFilter] = useState('all'); // State untuk filter aktif

  const handleToggle = (task) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === task.id
          ? { ...t, status: t.status === 'done' ? 'pending' : 'done' }
          : t
      )
    );
  };

  // Logika untuk memfilter tugas berdasarkan state 'activeFilter'
  const filteredTasks = tasks.filter(task => {
    if (activeFilter === 'all') {
      return true;
    }
    if (activeFilter === 'todo') {
      return task.status === 'pending';
    }
    if (activeFilter === 'done') {
      return task.status === 'done';
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>TaskMate - Daftar Tugas</Text>
      
      {/* Container untuk Tombol Filter */}
      <View style={styles.filterContainer}>
        <TouchableOpacity 
            style={[styles.filterButton, activeFilter === 'all' && styles.activeFilter]} 
            onPress={() => setActiveFilter('all')}>
          <Text style={styles.filterText}>All</Text>
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

      <FlatList
        data={filteredTasks} // Gunakan data yang sudah difilter
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        renderItem={({ item }) => <TaskItem task={item} onToggle={handleToggle} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' }, // sedikit penyesuaian warna background
  header: { fontSize: 20, fontWeight: '700', padding: 16 },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#e2e8f0',
  },
  activeFilter: {
    backgroundColor: '#0ea5e9', // warna biru untuk filter aktif
  },
  filterText: {
    fontWeight: '600',
    color: '#0f172a',
  }
});