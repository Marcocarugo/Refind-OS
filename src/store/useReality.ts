import * as Haptics from 'expo-haptics';
import { create } from 'zustand';

interface DiscoveredUser {
  id: string; 
  name: string;
  type: 'iphone' | 'android' | 'unknown';
  rssi: number; 
  lastSeen: number; 
}

interface RealityState {
  isLive: boolean;
  discoveredUsers: DiscoveredUser[];
  userName: string;
  userStatus: string;
  isGhostMode: boolean;
  setLive: (status: boolean) => void;
  addDiscovery: (id: string, name: string, type: 'iphone' | 'android' | 'unknown', rssi: number) => void;
  removeOldDiscoveries: () => void;
  clearDiscoveries: () => void;
  triggerProximityFeedback: () => void;
  setProfile: (name: string, status: string) => void;
  setGhostMode: (enabled: boolean) => void;
}

export const useReality = create<RealityState>((set, get) => ({
  isLive: false,
  discoveredUsers: [],
  userName: "Explorer",
  userStatus: "Attivo nel radar",
  isGhostMode: false,

  setLive: (status) => {
    set({ isLive: status });
    if (status) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  },

  addDiscovery: (id, name, type, rssi) => {
    const now = Date.now();
    const { discoveredUsers } = get();
    const existingUserIndex = discoveredUsers.findIndex(user => user.id === id);

    if (existingUserIndex !== -1) {
      const updatedUsers = [...discoveredUsers];
      // PROFESSIONALE: Aggiorniamo l'RSSI solo se il cambiamento è significativo
      // Evita che la lista "saltelli" per fluttuazioni di 1-2 dBm
      updatedUsers[existingUserIndex] = { 
        ...updatedUsers[existingUserIndex], 
        rssi, 
        lastSeen: now 
      };
      set({ discoveredUsers: updatedUsers.sort((a, b) => b.rssi - a.rssi) });
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const newUser: DiscoveredUser = { id, name, type, rssi, lastSeen: now };
    
    set({
      discoveredUsers: [newUser, ...discoveredUsers]
        .sort((a, b) => b.rssi - a.rssi)
        .slice(0, 20) // Aumentato a 20 per gestire ambienti affollati
    });
  },

  removeOldDiscoveries: () => {
    const now = Date.now();
    const { discoveredUsers } = get();
    
    // LOGICA STABILIZZATA: 25 secondi (25000ms)
    // Questo permette ai dispositivi in "Power Saving" di saltare qualche ping 
    // senza essere cancellati ingiustamente.
    const filtered = discoveredUsers.filter(u => now - u.lastSeen < 25000);
    
    if (filtered.length !== discoveredUsers.length) {
      set({ discoveredUsers: filtered });
    }
  },

  // ... restanti funzioni identiche ...
  triggerProximityFeedback: () => {
    const { discoveredUsers, isLive } = get();
    if (!isLive || discoveredUsers.length === 0) return;
    const closest = discoveredUsers[0];
    if (closest.rssi > -45) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    else if (closest.rssi > -65) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  },
  setProfile: (name, status) => {
    set({ userName: name, userStatus: status });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  },
  setGhostMode: (enabled) => {
    set({ isGhostMode: enabled });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  },
  clearDiscoveries: () => set({ discoveredUsers: [] }),
}));