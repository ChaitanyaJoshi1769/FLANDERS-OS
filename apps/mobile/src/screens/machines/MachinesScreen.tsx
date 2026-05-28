import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchMachines } from '../../redux/slices/machine.slice';

export default function MachinesScreen() {
  const dispatch = useAppDispatch();
  const { machines, isLoading } = useAppSelector((state) => state.machine);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user?.organizationId) {
      dispatch(fetchMachines(user.organizationId));
    }
  }, [dispatch, user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#10b981';
      case 'inactive':
        return '#6b7280';
      case 'maintenance':
        return '#f59e0b';
      case 'decommissioned':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={machines}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.machineId}>{item.machineId}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
            <Text style={styles.description}>{item.description}</Text>
            <View style={styles.metricsContainer}>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Health</Text>
                <Text style={styles.metricValue}>{item.health}%</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Uptime</Text>
                <Text style={styles.metricValue}>{item.uptime}h</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Temp</Text>
                <Text style={styles.metricValue}>{item.temperature}°C</Text>
              </View>
            </View>
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => user?.organizationId && dispatch(fetchMachines(user.organizationId))}
          />
        }
        ListEmptyComponent={<Text style={styles.empty}>No machines found</Text>}
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  machineId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  metric: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 4,
  },
  empty: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 20,
  },
});
