import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchIncidents } from '../../redux/slices/incident.slice';

export default function IncidentsScreen() {
  const dispatch = useAppDispatch();
  const { incidents, isLoading } = useAppSelector((state) => state.incident);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user?.organizationId) {
      dispatch(fetchIncidents(user.organizationId));
    }
  }, [dispatch, user]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return '#10b981';
      case 'medium':
        return '#f59e0b';
      case 'high':
        return '#f97316';
      case 'critical':
        return '#ef4444';
      case 'catastrophic':
        return '#991b1b';
      default:
        return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return '#ef4444';
      case 'investigating':
        return '#f59e0b';
      case 'resolved':
        return '#10b981';
      case 'closed':
        return '#6b7280';
      case 'pending_review':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={incidents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.titleSection}>
                <Text style={styles.incidentTitle}>{item.title}</Text>
                <Text style={styles.incidentType}>{item.type}</Text>
              </View>
              <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(item.severity) }]}>
                <Text style={styles.severityText}>{item.severity}</Text>
              </View>
            </View>

            <Text style={styles.description}>{item.description}</Text>

            <View style={styles.footerSection}>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
              <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
            </View>

            {item.rootCause && (
              <View style={styles.rootCauseSection}>
                <Text style={styles.rootCauseLabel}>Root Cause</Text>
                <Text style={styles.rootCauseText}>{item.rootCause}</Text>
              </View>
            )}
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => user?.organizationId && dispatch(fetchIncidents(user.organizationId))}
          />
        }
        ListEmptyComponent={<Text style={styles.empty}>No incidents found</Text>}
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
  incidentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  incidentType: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  severityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  severityText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 12,
    lineHeight: 20,
  },
  footerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 12,
    color: '#6b7280',
  },
  rootCauseSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  rootCauseLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 4,
  },
  rootCauseText: {
    fontSize: 13,
    color: '#1f2937',
    lineHeight: 18,
  },
  empty: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 20,
  },
});
