// src/components/TaskItem.jsx

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const getCategoryColor = (category) => {
  switch (category.toLowerCase()) {
    case 'mobile':
      return '#818cf8'; // Indigo
    case 'rpl':
      return '#fb923c'; // Orange
    case 'iot':
      return '#4ade80'; // Green
    default:
      return '#a1a1aa'; // Zinc
  }
};

export default function TaskItem({ task, onToggle, onDelete }) {
  const isDone = task.status === 'done';

  // DIUBAH: Logika untuk mendapatkan teks dan style badge berdasarkan 3 status
  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return { text: 'Pending', style: styles.badgePending };
      case 'todo':
        return { text: 'Todo', style: styles.badgeTodo };
      case 'done':
        return { text: 'Done', style: styles.badgeDone };
      default:
        return { text: 'Pending', style: styles.badgePending };
    }
  };

  const statusInfo = getStatusInfo(task.status);

  return (
    <TouchableOpacity onPress={() => onToggle?.(task)} onLongPress={() => onDelete?.(task)} activeOpacity={0.7}>
      <View style={[styles.card, isDone && styles.cardDone]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, isDone && styles.strike]}>{task.title}</Text>
          <Text style={styles.desc}>{task.description}</Text>
          
          <View style={styles.metaContainer}>
            <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(task.category) }]}>
              <Text style={styles.categoryText}>{task.category}</Text>
            </View>
            <Text style={styles.meta}>• Due {task.deadline}</Text>
          </View>
        </View>
        
        {/* Menggunakan info status dinamis */}
        <View style={[styles.badge, statusInfo.style]}>
          <Text style={styles.badgeText}>{statusInfo.text}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  cardDone: { backgroundColor: '#f1f5f9' },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  strike: { textDecorationLine: 'line-through', color: '#64748b' },
  desc: { color: '#475569', marginBottom: 8 },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  meta: { fontSize: 12, color: '#64748b', marginLeft: 6 },
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginLeft: 12,
  },
  badgePending: { backgroundColor: '#fee2e2' }, // Merah muda untuk Pending
  badgeTodo: { backgroundColor: '#fef9c3' },   // BARU: Kuning untuk Todo (in progress)
  badgeDone: { backgroundColor: '#dcfce7' },   // Hijau untuk Done
  badgeText: { fontWeight: '700', fontSize: 12, color: '#3f3f46'}, // Warna teks disamakan
});