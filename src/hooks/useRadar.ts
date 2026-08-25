import { useEffect, useState } from 'react';
import { Device } from 'react-native-ble-plx';
import { BleScanner } from '../services/BleManager';

export function useRadar() {
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    BleScanner.startScanning((newDevice) => {
      setDevices((currentDevices) => {
        // Evitiamo duplicati: se il dispositivo c'è già, lo aggiorniamo
        const exists = currentDevices.find(d => d.id === newDevice.id);
        if (exists) return currentDevices;
        return [...currentDevices, newDevice];
      });
    });

    return () => BleScanner.stopScanning();
  }, []);

  return { devices };
}