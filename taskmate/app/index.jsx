import { useEffect, useState, useMemo, useCallback } from 'react';
import { SafeAreaView, Text, SectionList, StyleSheet, View, Button, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import TaskItem from '../src/components/TaskItem';
import FilterToolbarFancy from '../src/components/FilterToolbarFancy';
import AddCategoryModal from '../src/components/AddCategoryModal';
import { loadTasks, updateTask, deleteTask, clearTasks as clearAllTasks } from '../src/storage/taskStorage';
import { loadCategories, createCategory } from '../src/storage/categoryStorage';
import { pickColor } from '../src/constants/categories';
import { weightOfPriority } from '../src/constants/priorities';

export default function Home() {
  // STATE MANAGEMENT
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showCatModal, setShowCatModal] = useState(false);

  // DATA FETCHING
  const refreshData = async () => {
    const [fetchedTasks, fetchedCategories] = await Promise.all([loadTasks(), loadCategories()]);
    setTasks(fetchedTasks);
    setCategories(fetchedCategories);
  };

  // Menggunakan useFocusEffect agar data diperbarui setiap kali layar ini menjadi fokus
  useFocusEffect(
    useCallback(() => {
      refreshData();
    }, [])
  );

  // CRUD HANDLERS (Interaksi dengan API)
  const handleToggle = async (task) => {
    const nextStatus = task.status === 'done' ? 'pending' : 'done';
    const ok = await updateTask(task.id, { status: nextStatus });
    if (ok) {
      setTasks(prev => prev.map(t => (t.id === task.id ? { ...t, status: nextStatus } : t)));
    } else {
      Alert.alert('Error', 'Gagal memperbarui status di server.');
    }
  };

  const handleDelete = (task) => {
    Alert.alert('Konfirmasi Hapus', `Yakin ingin menghapus tugas "${task.title}"?`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          const ok = await deleteTask(task.id);
          if (ok) {
            setTasks(prev => prev.filter(t => t.id !== task.id));
          } else {
            Alert.alert('Error', 'Gagal menghapus tugas di server.');
          }
        },
      },
    ]);
  };

  const handleSubmitCategory = async (cat) => {
    if (categories.some(c => c.key.toLowerCase() === cat.key.toLowerCase())) {
      Alert.alert('Info', 'Nama kategori sudah ada.');
      setShowCatModal(false);
      return;
    }
    const newCategory = { key: cat.key, color: cat.color || pickColor(categories.length) };
    const ok = await createCategory(newCategory);
    if (ok) {
      const updatedCategories = await loadCategories(); // Ambil ulang dari server untuk sinkronisasi
      setCategories(updatedCategories);
      setCategoryFilter(cat.key);
    } else {
      Alert.alert('Error', 'Gagal menyimpan kategori baru ke server.');
    }
    setShowCatModal(false);
  };


  // MEMOIZED COMPUTATIONS (Untuk Performa)
  const { doneCount, overdueCount } = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return {
      doneCount: tasks.filter(t => t.status === 'done').length,
      overdueCount: tasks.filter(t => t.deadline && t.deadline < today && t.status !== 'done').length,
    };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const byStatus = statusFilter === 'all' || (statusFilter === 'todo' ? t.status === 'pending' : t.status === statusFilter);
      const byCategory = categoryFilter === 'all' || (t.category ?? 'Umum') === categoryFilter;
      const byPriority = priorityFilter === 'all' || (t.priority ?? 'Low') === priorityFilter;
      return byStatus && byCategory && byPriority;
    });
  }, [tasks, statusFilter, categoryFilter, priorityFilter]);

  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      const priorityA = weightOfPriority(a.priority ?? 'Low');
      const priorityB = weightOfPriority(b.priority ?? 'Low');
      if (priorityA !== priorityB) return priorityB - priorityA;
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline) - new Date(b.deadline);
    });
  }, [filteredTasks]);

  const sections = useMemo(() => {
    if (categoryFilter !== 'all') {
        const filteredData = sortedTasks.filter(t => (t.category ?? 'Umum') === categoryFilter);
        return filteredData.length > 0 ? [{ title: categoryFilter, data: filteredData }] : [];
    }
    const grouped = new Map();
    sortedTasks.forEach(task => {
      const categoryKey = task.category ?? 'Umum';
      if (!grouped.has(categoryKey)) {
        grouped.set(categoryKey, []);
      }
      grouped.get(categoryKey).push(task);
    });
    return Array.from(grouped, ([title, data]) => ({ title, data }));
  }, [sortedTasks, categoryFilter]);


  // ACTION HANDLERS (Tombol Clear)
  const handleClearDone = () => {
    if (!doneCount) return;
    Alert.alert('Konfirmasi', `Yakin hapus ${doneCount} tugas yang selesai?`, [
      { text: 'Batal' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          const doneTasks = tasks.filter(t => t.status === 'done');
          await Promise.all(doneTasks.map(t => deleteTask(t.id)));
          refreshData(); // Refresh data dari server
        },
      },
    ]);
  };

  const handleClearAll = () => {
    if (tasks.length === 0) return;
    Alert.alert('Konfirmasi', `Yakin hapus SEMUA (${tasks.length}) tugas?`, [
      { text: 'Batal' },
      {
        text: 'Hapus Semua',
        style: 'destructive',
        onPress: async () => {
          await clearAllTasks();
          setTasks([]);
        },
      },
    ]);
  };

  // RENDER COMPONENT
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>TaskMate - Daftar Tugas</Text>

      <View style={styles.controlsContainer}>
        <FilterToolbarFancy
          categories={categories}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
        />
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText}>Selesai: {doneCount} / {tasks.length}</Text>
          <Text style={[styles.summaryText, { color: overdueCount > 0 ? '#dc2626' : '#334155' }]}>
            Overdue: {overdueCount}
          </Text>
          <View style={styles.buttonGroup}>
            <Button title="Clear Done" onPress={handleClearDone} disabled={!doneCount} />
            <Button title="Clear All" color="#b91c1c" onPress={handleClearAll} disabled={tasks.length === 0}/>
          </View>
        </View>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderSectionHeader={({ section: { title } }) => <Text style={styles.sectionHeader}>{title}</Text>}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            categories={categories}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Tidak ada tugas yang sesuai.</Text>}
      />

      <AddCategoryModal
        visible={showCatModal}
        onClose={() => setShowCatModal(false)}
        onSubmit={handleSubmitCategory}
        suggestedColor={pickColor(categories.length)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    padding: 16,
    color: '#0f172a',
  },
  controlsContainer: {
    paddingHorizontal: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 12,
  },
  summaryContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 8,
  },
  summaryText: {
    fontWeight: '600',
    color: '#334155',
    fontSize: 14,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
    justifyContent: 'flex-end',
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#64748b',
  },
});
