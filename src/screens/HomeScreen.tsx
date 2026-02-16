import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen() {
  const { profile, signOut, refreshProfile, loading } = useAuth();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshProfile();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Home</Text>
        <TouchableOpacity style={styles.logout} onPress={() => signOut()}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text style={styles.muted}>Cargando perfil...</Text>
      ) : (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tu perfil</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Nombre</Text>
            <Text style={styles.value}>{profile?.fullname ?? '—'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{profile?.email ?? '—'}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 24,
    paddingTop: 56,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  logout: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  logoutText: {
    color: '#2563eb',
    fontSize: 15,
    fontWeight: '600',
  },
  muted: {
    color: '#666',
    fontSize: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  row: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    color: '#1a1a1a',
  },
});
