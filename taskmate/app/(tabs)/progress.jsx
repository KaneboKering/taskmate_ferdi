import { useEffect, useState, useMemo } from 'react';
import { ScrollView, View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { loadTasks } from '../../src/storage/taskStorage';
import { loadCategories } from '../../src/storage/categoryStorage';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { colorOfPriority } from '../../src/constants/priorities';

const screenWidth = Dimensions.get('window').width;

export default function ProgressScreen() {
    const [tasks, setTasks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const [fetchedTasks, fetchedCategories] = await Promise.all([loadTasks(), loadCategories()]);
            setTasks(fetchedTasks);
            setCategories(fetchedCategories);
            setLoading(false);
        })();
    }, []);

    const { doneCount, todoCount, avgProgress } = useMemo(() => {
        if (tasks.length === 0) return { doneCount: 0, todoCount: 0, avgProgress: 0 };
        const d = tasks.filter(t => t.status === 'done').length;
        const total = tasks.length;
        const avg = Math.round(
            tasks.reduce((acc, t) => acc + (typeof t.progress === 'number' ? t.progress : 0), 0) / total
        );
        return { doneCount: d, todoCount: total - d, avgProgress: avg };
    }, [tasks]);

    const pieDataByCategory = useMemo(() => {
        const counts = new Map();
        for (const t of tasks) {
            const key = t.category ?? 'Umum';
            counts.set(key, (counts.get(key) || 0) + 1);
        }
        const colorOf = (key) => categories.find(c => c.key === key)?.color || '#64748b';
        const arr = [...counts.entries()].map(([name, value]) => ({
            name,
            population: value,
            color: colorOf(name),
            legendFontColor: '#1e293b',
            legendFontSize: 12
        }));
        return arr.length > 0 ? arr : [{ name: 'No Data', population: 1, color: '#e2e8f0' }];
    }, [tasks, categories]);

    // [UTS] Chart baru untuk distribusi prioritas
    const pieDataByPriority = useMemo(() => {
        const counts = { High: 0, Medium: 0, Low: 0 };
        for (const task of tasks) {
            counts[task.priority || 'Low']++;
        }
        const data = Object.entries(counts).map(([name, value]) => ({
            name,
            population: value,
            color: colorOfPriority(name),
            legendFontColor: '#1e293b',
            legendFontSize: 12,
        }));
        return data.some(d => d.population > 0) ? data : [{ name: 'No Data', population: 1, color: '#e2e8f0' }];
    }, [tasks]);

    const chartConfig = {
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#ffffff',
        color: (opacity = 1) => `rgba(15, 23, 42, ${opacity})`,
        barPercentage: 0.8,
    };

    if (loading) {
        return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, gap: 20 }}>
            <Text style={styles.header}>Dashboard Statistik</Text>

            <View style={styles.kpiContainer}>
                <View style={styles.kpiCard}>
                    <Text style={styles.kpiValue}>{avgProgress}%</Text>
                    <Text style={styles.kpiLabel}>Rata-rata Progress</Text>
                </View>
                 <View style={styles.kpiCard}>
                    <Text style={styles.kpiValue}>{doneCount} / {tasks.length}</Text>
                    <Text style={styles.kpiLabel}>Tugas Selesai</Text>
                </View>
            </View>

            <View style={styles.chartCard}>
                <Text style={styles.chartTitle}>Distribusi per Prioritas</Text>
                <PieChart
                    data={pieDataByPriority}
                    width={screenWidth - 64} // Adjusted for padding
                    height={220}
                    chartConfig={chartConfig}
                    accessor={"population"}
                    backgroundColor={"transparent"}
                    paddingLeft={"15"}
                />
            </View>
            
            <View style={styles.chartCard}>
                <Text style={styles.chartTitle}>Distribusi per Kategori</Text>
                <PieChart
                    data={pieDataByCategory}
                    width={screenWidth - 64}
                    height={220}
                    chartConfig={chartConfig}
                    accessor={"population"}
                    backgroundColor={"transparent"}
                    paddingLeft={"15"}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center'},
    header: { fontSize: 24, fontWeight: '800', color: '#0f172a', marginBottom: 8 },
    kpiContainer: {
        flexDirection: 'row',
        gap: 16,
    },
    kpiCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    kpiValue: {
        fontSize: 28,
        fontWeight: '900',
        color: '#1e293b',
    },
    kpiLabel: {
        fontSize: 14,
        color: '#475569',
        marginTop: 4,
    },
    chartCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        alignItems: 'center',
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0f172a',
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
});
