import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // [UTS] Import Ikon
import { colorOfName } from '../constants/categories';
import { colorOfPriority } from '../constants/priorities';
import Deadline from './Deadline';

export default function TaskItem({ task, categories, onToggle, onDelete }) {
    const router = useRouter();
    const isDone = task.status === 'done';

    // [UTS] Mendapatkan warna untuk badge dan border
    const catColor = colorOfName(task.category ?? 'Umum', categories);
    const prioColor = colorOfPriority(task.priority ?? 'Low');

    const pct = Math.max(0, Math.min(100, typeof task.progress === 'number' ? task.progress : 0));

    return (
        // [UTS] Layout Kartu (Card) yang diperbarui dengan shadow dan border
        <View style={[styles.card, { borderColor: isDone ? '#e2e8f0' : prioColor }]}>
            {/* [UTS] Tambahan view untuk border prioritas di sisi kiri */}
            <View style={[styles.priorityStripe, { backgroundColor: isDone ? '#94a3b8' : prioColor }]} />

            <TouchableOpacity onPress={() => onToggle?.(task)} style={styles.contentContainer}>
                <Text style={[styles.title, isDone && styles.strike]}>{task.title}</Text>
                {!!task.description && <Text style={styles.desc}>{task.description}</Text>}

                <View style={styles.metaContainer}>
                    <View style={[styles.badge, { backgroundColor: catColor }]}>
                        <Ionicons name="pricetag-outline" size={12} color="#fff" />
                        <Text style={styles.badgeText}>{task.category || 'General'}</Text>
                    </View>
                    <View style={[styles.badge, { backgroundColor: `${prioColor}40` }]}>
                         <Ionicons name="flame-outline" size={12} color={prioColor} />
                        <Text style={[styles.badgeText, { color: prioColor }]}>{task.priority || 'Low'}</Text>
                    </View>
                </View>

                <Deadline date={task.deadline} />

                {/* Progress Bar */}
                <View style={styles.progressWrap}>
                    <View style={[styles.progressBar, { width: `${pct}%`, backgroundColor: prioColor }]} />
                </View>
                 <Text style={styles.progressText}>{pct}% Selesai</Text>
            </TouchableOpacity>
            
            {/* [UTS] Tombol diubah menjadi ikon untuk tampilan yang lebih bersih */}
            <View style={styles.actionsContainer}>
                <TouchableOpacity onPress={() => router.push(`/edit/${task.id}`)} style={styles.actionButton}>
                    <Ionicons name="create-outline" size={24} color="#475569" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onDelete?.(task)} style={styles.actionButton}>
                    <Ionicons name="trash-outline" size={24} color="#ef4444" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 12,
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1.5,
        overflow: 'hidden', // [UTS] Penting agar priorityStripe tidak keluar dari border radius
    },
    priorityStripe: {
        width: 8,
    },
    contentContainer: {
        flex: 1,
        padding: 14,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 4,
    },
    strike: {
        textDecorationLine: 'line-through',
        color: '#64748b',
    },
    desc: {
        color: '#475569',
        fontSize: 14,
        marginBottom: 10,
    },
    metaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 6,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 20,
        gap: 4,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#fff',
    },
    progressWrap: {
        height: 8,
        backgroundColor: '#e2e8f0',
        borderRadius: 20,
        marginTop: 12,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
    },
    progressText: {
        fontSize: 12,
        color: '#64748b',
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    actionsContainer: {
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 12,
        borderLeftWidth: 1,
        borderLeftColor: '#f1f5f9',
    },
    actionButton: {
        padding: 8,
    },
});