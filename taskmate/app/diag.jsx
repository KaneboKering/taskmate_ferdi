// app/diag.jsx

import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { loadTasks } from '../src/storage/taskStorage';
import { PieChart } from 'react-native-gifted-charts';

export default function DiagScreen() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fungsi untuk memuat dan memproses data
    const fetchData = async () => {
        setLoading(true);
        const loadedTasks = await loadTasks();
        setTasks(loadedTasks);
        setLoading(false);
    };

    // Gunakan useFocusEffect untuk memanggil fetchData setiap kali layar ini aktif/fokus
    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1 }} />;
    }

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const pendingTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const pieData = [
        { value: pendingTasks, color: '#f59e0b', text: `${pendingTasks}` },
        { value: completedTasks, color: '#10b981', text: `${completedTasks}` }
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Statistik Tugas</Text>

            <View style={styles.kpiContainer}>
                <View style={styles.kpiBox}>
                    <Text style={styles.kpiValue}>{totalTasks}</Text>
                    <Text style={styles.kpiLabel}>Total Tugas</Text>
                </View>
                <View style={styles.kpiBox}>
                    <Text style={styles.kpiValue}>{completionRate.toFixed(1)}%</Text>
                    <Text style={styles.kpiLabel}>Selesai</Text>
                </View>
            </View>

            <View style={{ alignItems: 'center', marginTop: 30 }}>
                <Text style={styles.chartTitle}>Komposisi Tugas</Text>
                {totalTasks > 0 ? (
                    <PieChart
                        data={pieData}
                        donut
                        showText
                        textColor="black"
                        radius={120}
                        innerRadius={60}
                        textSize={20}
                        focusOnPress
                    />
                ) : (
                    <Text style={styles.noDataText}>Belum ada tugas.</Text>
                )}
                 <View style={styles.legendContainer}>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: '#10b981' }]} />
                        <Text>Selesai</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: '#f59e0b' }]} />
                        <Text>Tertunda</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f8fafc' },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#1e293b', textAlign: 'center' },
    kpiContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
    kpiBox: { backgroundColor: 'white', padding: 20, borderRadius: 10, alignItems: 'center', width: '45%', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
    kpiValue: { fontSize: 28, fontWeight: 'bold', color: '#0f172a' },
    kpiLabel: { fontSize: 16, color: '#64748b', marginTop: 5 },
    chartTitle: { fontSize: 20, fontWeight: '600', marginBottom: 20, color: '#334155' },
    noDataText: { marginTop: 20, fontSize: 16, color: '#64748b' },
    legendContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20, gap: 20 },
    legendItem: { flexDirection: 'row', alignItems: 'center' },
    legendColor: { width: 20, height: 20, borderRadius: 10, marginRight: 8 },
});