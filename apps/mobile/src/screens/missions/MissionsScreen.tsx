import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchMissions } from '../../redux/slices/mission.slice';

export default function MissionsScreen() {
  const dispatch = useAppDispatch();
  const { missions, isLoading } = useAppSelector((state) => state.mission);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user?.organizationId) {
      dispatch(fetchMissions(user.organizationId));
    }
  }, [dispatch, user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#6b7280';
      case 'in_progress':
        return '#3b82f6';
      case 'completed':
        return '#10b981';
      case 'failed':
        return '#ef4444';
      case 'aborted':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const getOperationModeColor = (mode: string) => {
    switch (mode) {
      case 'autonomous':
        return '#10b981';
      case 'semi_autonomous':
        return '#3b82f6';
      case 'manual':
        return '#f59e0b';
      case 'remote':
        return '#8b5cf6';
      default:
        return '#6b7280';
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={missions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.titleSection}>
                <Text style={styles.missionName}>{item.name}</Text>
                <Text style={styles.missionId}>ID: {item.id}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>

            <View style={styles.modeSection}>
              <View style={[styles.modeBadge, { backgroundColor: getOperationModeColor(item.operationMode) }]}>
                <Text style={styles.modeText}>{item.operationMode}</Text>
              </View>
            </View>

            <View style={styles.detailsContainer}>
              <View style={styles.detail}>
                <Text style={styles.label}>Waypoints</Text>
                <Text style={styles.value}>{item.waypointCount}</Text>
              </View>
              <View style={styles.detail}>
                <Text style={styles.label}>Progress</Text>
                <Text style={styles.value}>{item.progress}%</Text>
              </View>
              <View style={styles.detail}>
                <Text style={styles.label}>Duration</Text>
                <Text style={styles.value}>{item.estimatedDuration}m</Text>
              </View>
            </View>
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => user?.organizationId && dispatch(fetchMissions(user.organizationId))}
          />
        }
        ListEmptyComponent={<Text style={styles.empty}>No missions found</Text>}
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
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleSection: {
    flex: 1,
    marginRight: 8,
  },
  missionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  missionId: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
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
  modeSection: {
    marginBottom: 12,
  },
  modeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  modeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  detail: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: '#6b7280',
  },
  value: {
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
