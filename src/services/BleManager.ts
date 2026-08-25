import Constants, { ExecutionEnvironment } from 'expo-constants';
import type { BleManager as BleManagerInstance, Device } from 'react-native-ble-plx';
import { PermissionsAndroid, Platform } from 'react-native';

export type ScannerStatus = 'idle' | 'scanning' | 'unsupported' | 'unavailable' | 'denied' | 'error';

export type ScanResult = {
  status: ScannerStatus;
  message?: string;
};

// Expo Go non contiene il modulo nativo di react-native-ble-plx. Il require
// resta quindi fuori da quel runtime: l'anteprima può aprirsi senza crash.
const canUseNativeBle = Platform.OS !== 'web' && Constants.executionEnvironment !== ExecutionEnvironment.StoreClient;
const BleModule: typeof import('react-native-ble-plx') | null = canUseNativeBle
  ? require('react-native-ble-plx')
  : null;

class BleScannerManager {
  private manager: BleManagerInstance | null = BleModule ? new BleModule.BleManager() : null;
  private isScanning: boolean = false;

  private async requestAndroidPermissions() {
    if (Platform.OS !== 'android') return true;

    const permissions = Number(Platform.Version) >= 31
      ? [PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN, PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT]
      : [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION];
    const result = await PermissionsAndroid.requestMultiple(permissions);
    return permissions.every((permission) => result[permission] === PermissionsAndroid.RESULTS.GRANTED);
  }

  async startScanning(onDeviceFound: (device: Device) => void, onScanError?: (message: string) => void): Promise<ScanResult> {
    if (!this.manager) {
      const message = Constants.executionEnvironment === ExecutionEnvironment.StoreClient
        ? 'Anteprima Expo Go: per usare il radar Bluetooth serve una development build.'
        : 'La scansione Bluetooth è disponibile solo nell’app installata su un telefono.';
      return { status: 'unsupported', message };
    }
    if (this.isScanning) return { status: 'scanning' };

    try {
      if (!await this.requestAndroidPermissions()) {
        return { status: 'denied', message: 'Consenti Bluetooth e posizione per cercare segnali vicini.' };
      }
      if (await this.manager.state() !== BleModule?.State.PoweredOn) {
        return { status: 'unavailable', message: 'Attiva il Bluetooth sul dispositivo e riprova.' };
      }
      this.isScanning = true;
      this.manager.startDeviceScan(null, { allowDuplicates: true }, (error, device) => {
        if (error) {
          this.stopScanning();
          onScanError?.('La scansione si è interrotta. Controlla il Bluetooth e riprova.');
          return;
        }
        if (device) onDeviceFound(device);
      });
      return { status: 'scanning' };
    } catch {
      this.stopScanning();
      return { status: 'error', message: 'Non è stato possibile avviare la scansione. Riprova tra poco.' };
    }
  }

  stopScanning() {
    this.manager?.stopDeviceScan();
    this.isScanning = false;
  }
}

export const BleScanner = new BleScannerManager();
