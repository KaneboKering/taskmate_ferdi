// src/components/TaskItem.jsx

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// Fungsi untuk mendapatkan warna badge berdasarkan kategori
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

export default function TaskItem({ task, onToggle }) {
  const isDone = task.status === 'done';

  return (
    <TouchableOpacity onPress={() => onToggle?.(task)} activeOpacity={0.7}>
      <View style={[styles.card, isDone && styles.cardDone]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, isDone && styles.strike]}>{task.title}</Text>
          <Text style={styles.desc}>{task.description}</Text>
          
          {/* Baris meta dengan badge kategori */}
          <View style={styles.metaContainer}>
            <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(task.category) }]}>
              <Text style={styles.categoryText}>{task.category}</Text>
            </View>
            <Text style={styles.meta}>• Due {task.deadline}</Text>
          </View>

        </View>
        <View style={[styles.badge, isDone ? styles.badgeDone : styles.badgePending]}>
          <Text style={styles.badgeText}>{isDone ? 'Done' : 'Todo'}</Text>
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
    elevation: 2, // Memberi sedikit bayangan
  },
  cardDone: { backgroundColor: '#f1f5f9' },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  strike: { textDecorationLine: 'line-through', color: '#64748b' },
  desc: { color: '#475569', marginBottom: 8 }, // Margin bottom disesuaikan
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
  badgePending: { backgroundColor: '#fee2e2' },
  badgeDone: { backgroundColor: '#dcfce7' },
  badgeText: { fontWeight: '700', fontSize: 12 },
});