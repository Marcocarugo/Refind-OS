import { Monitor, Smartphone, UserCheck } from 'lucide-react-native';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useReality } from '../store/useReality';

export const DiscoveryList = () => {
  const { discoveredUsers, isLive } = useReality();

  if (!isLive || discoveredUsers.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {isLive ? "In attesa di segnali..." : "Accendi il radar per iniziare"}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionTitle}>IDENTITÀ RILEVATE</Text>
      <FlatList
        data={discoveredUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            activeOpacity={0.7}
            style={styles.card}
          >
            <View style={[styles.iconContainer, { backgroundColor: item.type === 'iphone' ? '#007AFF15' : '#34C75915' }]}>
              {item.type === 'iphone' ? (
                <Smartphone size={20} color="#007AFF" />
              ) : (
                <Monitor size={20} color="#34C759" />
              )}
            </View>

            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.distanza}>
                Potenza segnale: {item.rssi} dBm • {Math.abs(item.rssi) < 50 ? 'Vicinissimo' : 'Nelle vicinanze'}
              </Text>
            </View>

            <UserCheck size={18} color="#C7C7CC" />
          </TouchableOpacity>
        )}
        scrollEnabled={false} // Usiamo lo scroll della HomeScreen
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { width: '90%', marginTop: 20 },
  sectionTitle: { fontSize: 12, fontWeight: '800', color: '#8E8E93', letterSpacing: 1.5, marginBottom: 15, textAlign: 'center' },
  listContent: { gap: 12 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F2F2F7'
  },
  iconContainer: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  info: { flex: 1, marginLeft: 15 },
  name: { fontSize: 16, fontWeight: '700', color: '#121212' },
  distanza: { fontSize: 12, color: '#8E8E93', marginTop: 2 },
  emptyContainer: { padding: 40, alignItems: 'center' },
  emptyText: { color: '#C7C7CC', fontWeight: '600' }
});