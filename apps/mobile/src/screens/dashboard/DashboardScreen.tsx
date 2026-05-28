import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchFleets } from '../../redux/slices/fleet.slice';

export default function DashboardScreen() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { fleets, isLoading } = useAppSelector((state) => state.fleet);

  useEffect(() => {
    if (user?.organizationId) {
      dispatch(fetchFleets(user.organizationId));
    }
  }, [dispatch, user]);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={() => user?.organizationId && dispatch(fetchFleets(user.organizationId))}
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome, {user?.firstName}!</Text>
        <Text style={styles.subtitle}>Fleet Dashboard</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{fleets.length}</Text>
          <Text style={styles.statLabel}>Active Fleets</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Incidents Today</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Pending Tasks</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fleet Status</Text>
        {fleets.map((fleet: any) => (
          <View key={fleet.id} style={styles.fleetCard}>
            <Text style={styles.fleetName}>{fleet.name}</Text>
            <Text style={styles.fleetStatus}>Status: {fleet.status}</Text>
            <Text style={styles.fleetMachines}>Machines: {fleet.machineCount}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    backgroundColor: '#1f2937',
    padding: 20,
    paddingTop: 40,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 14,
    color: '#d1d5db',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1f2937',
  },
  fleetCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  fleetName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  fleetStatus: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  fleetMachines: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
});
