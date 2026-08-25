import * as Haptics from 'expo-haptics';
import { Zap } from 'lucide-react-native';
import React, { useCallback, useEffect, useRef } from 'react';
import { Animated, Easing, InteractionManager, Pressable, StyleSheet, View } from 'react-native';
import { useReality } from '../store/useReality';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const RadarOrb = () => {
  const { isLive, setLive, discoveredUsers, clearDiscoveries } = useReality();
  
  // Riferimenti per le animazioni
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const scalePress = useRef(new Animated.Value(1)).current;
  
  // Ref per evitare click multipli frenetici (Debounce hardware)
  const isTransitioning = useRef(false);

  useEffect(() => {
    // Reset pulito
    rotationAnim.setValue(0);
    pulseAnim.setValue(0);

    if (isLive) {
      const rotationLoop = Animated.loop(
        Animated.timing(rotationAnim, { 
          toValue: 1, 
          duration: 3000, 
          easing: Easing.linear, 
          useNativeDriver: true 
        })
      );
      
      const pulseLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1, duration: 1800, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
        ])
      );

      rotationLoop.start();
      pulseLoop.start();

      return () => {
        rotationLoop.stop();
        pulseLoop.stop();
      };
    }
  }, [isLive]);

  const handlePressIn = useCallback(() => {
    Animated.spring(scalePress, { 
      toValue: 0.85, 
      tension: 200, 
      friction: 5,
      useNativeDriver: true 
    }).start();
  }, []);

  const handlePressOut = useCallback(() => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;

    // 1. Feedback fisico immediato (Vibrazione)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    // 2. Ritorno elastico dell'Orb
    Animated.spring(scalePress, { 
      toValue: 1, 
      friction: 3, 
      tension: 120, 
      useNativeDriver: true 
    }).start();

    // 3. IL FIX DEFINITIVO: InteractionManager
    // Aspetta che le animazioni grafiche siano pianificate prima di cambiare lo stato globale
    InteractionManager.runAfterInteractions(() => {
      if (isLive) {
        clearDiscoveries();
        setLive(false);
      } else {
        setLive(true);
      }
      
      // Sblocca il tasto dopo un micro-ritardo
      setTimeout(() => {
        isTransitioning.current = false;
      }, 300);
    });
  }, [isLive, setLive, clearDiscoveries]);

  const rotate = rotationAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const pulseScale = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 3] });
  const pulseOpacity = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 0] });

  return (
    <View style={styles.container} pointerEvents="box-none">
      {/* ONDE DI ESPANSIONE */}
      {isLive && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <View style={styles.centerAlign}>
            <Animated.View style={[styles.pulse, { transform: [{ scale: pulseScale }], opacity: pulseOpacity }]} />
            <Animated.View style={[styles.sonarBorder, { transform: [{ rotate }] }]} />
          </View>
        </View>
      )}

      {/* CORE ORB */}
      <AnimatedPressable 
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.orbWrapper,
          { transform: [{ scale: scalePress }] }
        ]}
      >
        <View style={[styles.orb, isLive && styles.orbActive]}>
          <Zap 
            size={42} 
            color={isLive ? "#FF6B6B" : "#121212"} 
            fill={isLive ? "#FF6B6B" : "none"} 
          />
        </View>
      </AnimatedPressable>

      {/* PUNTINI RADAR */}
      {isLive && discoveredUsers?.map((user, index) => {
        const distance = Math.min(Math.max((Math.abs(user.rssi || -90) - 35) * 2.5, 75), 155);
        const angle = (index * (360 / Math.max(discoveredUsers.length, 1))) * (Math.PI / 180);
        const translateX = Math.cos(angle) * distance;
        const translateY = Math.sin(angle) * distance;

        return (
          <View
            key={user.id || `dot-${index}`}
            pointerEvents="none"
            style={[
              styles.dot,
              {
                backgroundColor: user.type === 'iphone' ? '#007AFF' : '#34C759',
                transform: [{ translateX }, { translateY }],
              }
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    height: 420, 
    width: '100%', 
    justifyContent: 'center', 
    alignItems: 'center',
    zIndex: 999,
  },
  centerAlign: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  orbWrapper: { zIndex: 1000, elevation: 20 }, 
  orb: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 15,
  },
  orbActive: {
    backgroundColor: '#121212',
    shadowColor: '#FF6B6B',
    shadowOpacity: 0.6,
    shadowRadius: 30,
  },
  pulse: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FF6B6B',
  },
  sonarBorder: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    borderWidth: 2,
    borderColor: 'rgba(255, 107, 107, 0.08)',
    borderTopColor: '#FF6B6B',
  },
  dot: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 4,
  }
});