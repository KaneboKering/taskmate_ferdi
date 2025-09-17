
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colorOfPriority } from '../constants/priorities';
import Deadline from './Deadline'; 

const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
        case 'mobile': return '#818cf8';
        case 'rpl': return '#fb923c';
        case 'iot': return '#4ade80';
        default: return '#a1a1aa';
    }
};

const getPriorityBackgroundColor = (priority) => {
  switch (priority) {
    case 'High':
      return '#fee2e2';
    case 'Medium':
      return '#fef9c3';
    default:
      return '#f1f5f9';
  }
};

export default function TaskItem({ task, onToggle, onDelete }) {
    const isDone = task.status === 'done';
    const catColor = getCategoryColor(task.category);
    const prioColor = colorOfPriority(task.priority);
    
    const cardBackgroundColor = isDone ? '#f8fafc' : getPriorityBackgroundColor(task.priority);

    return (
        <View style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
            <TouchableOpacity onPress={() => onToggle?.(task)} style={{ flex: 1, marginRight: 10 }}>
                <Text style={[styles.title, isDone && styles.strike]}>{task.title}</Text>
                {!!task.description && <Text style={styles.desc}>{task.description}</Text>}
                
                <View style={styles.metaContainer}>
                    <View style={[styles.categoryBadge, { backgroundColor: catColor }]}>
                        <Text style={styles.categoryText}>{task.category || 'General'}</Text>
                    </View>
                    <View style={[styles.priorityBadge, { borderColor: prioColor, backgroundColor: `${prioColor}20` }]}>
                        <Text style={[styles.priorityText, { color: prioColor }]}>{task.priority || 'Low'}</Text>
                    </View>
                </View>

                <Deadline date={task.deadline} />

            </TouchableOpacity>
            
            <View style={styles.actionsContainer}>
                <TouchableOpacity onPress={() => onDelete?.(task)} style={styles.deleteButton}>
                    <Ionicons name="trash-outline" size={20} color="#ef4444" />
                </TouchableOpacity>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    card: { padding: 14, borderRadius: 12, backgroundColor: '#fff', marginBottom: 10, flexDirection: 'row', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
    cardDone: { backgroundColor: '#f1f5f9' },
    title: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
    strike: { textDecorationLine: 'line-through', color: '#64748b' },
    desc: { color: '#475569', marginBottom: 8, fontSize: 14 },
    metaContainer: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
    categoryBadge: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6, },
    categoryText: { fontSize: 10, fontWeight: '700', color: '#fff', },
    priorityBadge: { paddingVertical: 3, paddingHorizontal: 8, borderRadius: 6, borderWidth: 1 },
    priorityText: { fontSize: 10, fontWeight: '700' },
    deadlineText: { fontSize: 12, color: '#64748b' },
    actionsContainer: { alignItems: 'center', gap: 8 },
    badge: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, },
    badgePending: { backgroundColor: '#fee2e2' },
    badgeTodo: { backgroundColor: '#fef9c3' },
    badgeDone: { backgroundColor: '#dcfce7' },
    badgeText: { fontWeight: '700', fontSize: 12, color: '#3f3f46' },
    deleteButton: { paddingTop: 4 },
});