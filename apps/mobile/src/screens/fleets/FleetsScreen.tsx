import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useAppSelector } from '../../redux/hooks';

export default function FleetsScreen() {
  const { fleets } = useAppSelector((state) => state.fleet);

  return (
    <View style={styles.container}>
      <FlatList
        data={fleets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.subtitle}>{item.status}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No fleets found</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  empty: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 20,
  },
});
