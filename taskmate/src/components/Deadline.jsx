
import React from 'react';
import { Text, StyleSheet } from 'react-native';

const dayDiff = (date1, date2) => {
  const diffTime = date2.getTime() - date1.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export default function Deadline({ date }) {
  if (!date) {
    return null; 
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0); 

  const deadlineDate = new Date(date);
  deadlineDate.setHours(0, 0, 0, 0); 

  const diff = dayDiff(today, deadlineDate);

  if (diff < 0) {
    return <Text style={[styles.deadline, styles.overdue]}>Overdue</Text>;
  }
  if (diff === 0) {
    return <Text style={[styles.deadline, styles.dueToday]}>Hari ini</Text>;
  }
  
  return <Text style={styles.deadline}>Sisa {diff} hari</Text>;
}

const styles = StyleSheet.create({
  deadline: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  overdue: {
    color: '#ef4444',
    fontWeight: 'bold',
  },
  dueToday: {
    color: '#f59e0b',
    fontWeight: 'bold',
  }
});