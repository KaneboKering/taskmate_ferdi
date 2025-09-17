

import { useState, useCallback, useMemo } from 'react';
import { SafeAreaView, StyleSheet, Text, FlatList, View, Alert, Button } from 'react-native';
import { useFocusEffect } from 'expo-router';
import TaskItem from '../src/components/TaskItem';
import FilterToolbarFancy from '../src/components/FilterToolbarFancy';
import { loadTasks, saveTasks } from '../src/storage/taskStorage';
import { loadCategories } from '../src/storage/categoryStorage';
import { weightOfPriority } from '../src/constants/priorities';

export default function HomeScreen() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);

  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        setTasks(await loadTasks());
        setCategories(await loadCategories());
      };
      loadData();
    }, [])
  );

  const handleToggle = async (task) => {
    const getNextStatus = (currentStatus) => {
      if (currentStatus === 'pending') return 'todo';
      if (currentStatus === 'todo') return 'done';
      return 'done';
    };
    const updated = tasks.map((t) =>
      t.id === task.id ? { ...t, status: getNextStatus(t.status) } : t
    );
    setTasks(updated);
    await saveTasks(updated);
  };

  const handleDelete = async (taskToDelete) => {
    Alert.alert("Konfirmasi Hapus", `Yakin ingin menghapus "${taskToDelete.title}"?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus", style: "destructive", onPress: async () => {
            const updated = tasks.filter((t) => t.id !== taskToDelete.id);
            setTasks(updated);
            await saveTasks(updated);
          },
        },
      ]
    );
  };


  const { doneCount, overdueCount } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return tasks.reduce((acc, task) => {
      if (task.status === 'done') acc.doneCount++;
      const deadlineDate = new Date(task.deadline);
      if (task.deadline && deadlineDate < today && task.status !== 'done') {
        acc.overdueCount++;
      }
      return acc;
    }, { doneCount: 0, overdueCount: 0 });
  }, [tasks]);


  const handleClearDone = () => {
    if (doneCount === 0) {
      Alert.alert("Info", "Tidak ada tugas yang selesai untuk dihapus.");
      return;
    }
    Alert.alert("Konfirmasi", `Yakin ingin menghapus ${doneCount} tugas yang sudah selesai?`, [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus", style: "destructive", onPress: async () => {
          const remainingTasks = tasks.filter(task => task.status !== 'done');
          setTasks(remainingTasks);
          await saveTasks(remainingTasks);
        }
      }
    ]);
  };


  const handleClearAll = () => {
    if (tasks.length === 0) {
      Alert.alert("Info", "Daftar tugas sudah kosong.");
      return;
    }
    Alert.alert("Konfirmasi", `Yakin ingin menghapus SEMUA (${tasks.length}) tugas?`, [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus Semua", style: "destructive", onPress: async () => {
          setTasks([]);
          await saveTasks([]);
        }
      }
    ]);
  };

  const filteredTasks = useMemo(() => {
    return tasks
      .filter(task => categoryFilter === 'all' || task.category === categoryFilter)
      .filter(task => statusFilter === 'all' || task.status === statusFilter)
      .filter(task => priorityFilter === 'all' || task.priority === priorityFilter);
  }, [tasks, categoryFilter, statusFilter, priorityFilter]);
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>TaskMate – Daftar Tugas</Text>

      <View style={styles.toolbarContainer}>
        <FilterToolbarFancy
          categories={categories}
          categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter}
          statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter} setPriorityFilter={setPriorityFilter}
        />
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Selesai</Text>
          <Text style={styles.summaryValue}>{doneCount} / {tasks.length}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Overdue</Text>
          <Text style={[styles.summaryValue, overdueCount > 0 && styles.overdueText]}>{overdueCount}</Text>
        </View>
      </View>

      {/* BARU: Area untuk tombol Clear */}
      <View style={styles.actionsContainer}>
        <Button title="Clear Done" onPress={handleClearDone} color="#426effff" disabled={doneCount === 0} />
        <Button title="Clear All" onPress={handleClearAll} color="#ef4444" disabled={tasks.length === 0} />
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            categories={categories}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 30 }}>Tidak ada tugas yang sesuai.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { fontSize: 22, fontWeight: '700', paddingHorizontal: 16, paddingTop: 16 },
  toolbarContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  summaryContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  summaryLabel: { fontSize: 13, color: '#64748b', marginBottom: 2 },
  summaryValue: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  overdueText: { color: '#ef4444' },

  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
});