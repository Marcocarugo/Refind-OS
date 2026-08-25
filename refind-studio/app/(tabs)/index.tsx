import { FontAwesome6 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Moment, useRefind } from '../../src/useRefind';

function MomentCard({ item }: { item: Moment }) {
  const { toggleSaved, sendMomentSignal } = useRefind();
  const signal = () => {
    if (item.signalled) return;
    sendMomentSignal(item.id);
    Alert.alert('Segnale inviato', 'Resterà invisibile finché l’altra persona non invierà lo stesso segnale.');
  };
  return (
    <View style={styles.momentCard}>
      <View style={[styles.cardArt, { backgroundColor: item.palette }]}>
        <View style={styles.rippleOne} /><View style={styles.rippleTwo} /><View style={styles.rippleDot} />
        <Text style={styles.cardPeople}>{item.people} echi</Text>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.cardTop}><Text style={styles.cardTime}>{item.time}</Text><Text style={styles.expire}>{item.expires}</Text></View>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.context}><FontAwesome6 name="location-dot" size={11} color="#77778A" />  {item.context}</Text>
        <Text style={styles.duration}>{item.duration}</Text>
        <View style={styles.actions}>
          <Pressable onPress={() => toggleSaved(item.id)} style={styles.roundAction} accessibilityLabel="Salva incontro">
            <FontAwesome6 name={item.saved ? 'bookmark' : 'bookmark'} solid={item.saved} size={16} color={item.saved ? '#4938E8' : '#77778A'} />
          </Pressable>
          <Pressable onPress={signal} style={[styles.signal, item.signalled && styles.signalSent]}>
            <FontAwesome6 name={item.signalled ? 'check' : 'sparkles'} size={13} color={item.signalled ? '#1B7454' : '#FFF'} />
            <Text style={[styles.signalText, item.signalled && styles.signalTextSent]}>{item.signalled ? 'Segnale inviato' : 'Invia un segnale'}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default function EchoesScreen() {
  const { moments, matches } = useRefind();
  const router = useRouter();
  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View><Text style={styles.kicker}>MARTEDÌ, 25 AGOSTO</Text><Text style={styles.heading}>I tuoi echi</Text></View>
          <Pressable style={styles.bell} onPress={() => Alert.alert('I tuoi match', `Hai ${matches} conversazioni pronte per iniziare.`)}>
            <FontAwesome6 name="bell" size={18} color="#242433" />
            <View style={styles.badge}><Text style={styles.badgeText}>{matches}</Text></View>
          </Pressable>
        </View>

        <View style={styles.hero}>
          <View style={styles.heroGlow} /><Text style={styles.heroEyebrow}>IL TUO DIGEST</Text>
          <Text style={styles.heroTitle}>Oggi hai sfiorato{`\n`}12 possibilità.</Text>
          <Text style={styles.heroText}>Gli incontri restano privati e spariscono se non li scegli.</Text>
          <Pressable onPress={() => router.push('/live')} style={styles.liveLink}><View style={styles.liveDot} /><Text style={styles.liveText}>Apri il mondo Live</Text><FontAwesome6 name="arrow-right" size={13} color="#FFF" /></Pressable>
        </View>

        <View style={styles.sectionHead}><Text style={styles.sectionTitle}>MOMENTI CONDIVISI</Text><Text style={styles.count}>{moments.length} disponibili</Text></View>
        {moments.map((item) => <MomentCard item={item} key={item.id} />)}
        <View style={styles.privacy}><FontAwesome6 name="shield-heart" size={17} color="#4938E8" /><Text style={styles.privacyText}>Double-blind by design. Nessuno saprà mai del tuo segnale senza un interesse reciproco.</Text></View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F7FB' }, content: { padding: 20, paddingBottom: 30 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6, marginBottom: 23 },
  kicker: { fontSize: 10, letterSpacing: 1.4, color: '#858598', fontWeight: '800' }, heading: { fontSize: 32, letterSpacing: -1.3, color: '#21212E', fontWeight: '800', marginTop: 2 },
  bell: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#3D3D56', shadowOpacity: .09, shadowRadius: 12, elevation: 2 }, badge: { position: 'absolute', top: -2, right: -2, minWidth: 17, height: 17, borderRadius: 9, backgroundColor: '#FF5C6C', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#F7F7FB' }, badgeText: { color: '#FFF', fontSize: 9, fontWeight: '800' },
  hero: { backgroundColor: '#4938E8', minHeight: 220, borderRadius: 28, padding: 23, overflow: 'hidden', marginBottom: 29 }, heroGlow: { position: 'absolute', height: 190, width: 190, borderRadius: 95, backgroundColor: '#786CFF', right: -42, top: -47, opacity: .72 },
  heroEyebrow: { color: '#C9C5FF', fontSize: 10, letterSpacing: 1.4, fontWeight: '800' }, heroTitle: { color: '#FFF', fontSize: 27, fontWeight: '800', lineHeight: 31, letterSpacing: -1, marginTop: 10 }, heroText: { color: '#D7D4FF', fontSize: 13, lineHeight: 18, marginTop: 9, maxWidth: '86%' },
  liveLink: { backgroundColor: '#262052', alignSelf: 'flex-start', paddingHorizontal: 14, height: 38, borderRadius: 19, flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 17 }, liveDot: { width: 7, height: 7, backgroundColor: '#5AE0B5', borderRadius: 9 }, liveText: { color: '#FFF', fontWeight: '800', fontSize: 12 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }, sectionTitle: { color: '#5D5D70', fontSize: 10, fontWeight: '800', letterSpacing: 1.2 }, count: { color: '#9797A6', fontSize: 11, fontWeight: '600' },
  momentCard: { backgroundColor: '#FFF', borderRadius: 24, marginBottom: 15, overflow: 'hidden', shadowColor: '#302F49', shadowOpacity: .055, shadowRadius: 15, elevation: 2 }, cardArt: { height: 95, overflow: 'hidden', justifyContent: 'flex-end', padding: 13 }, rippleOne: { width: 140, height: 140, borderRadius: 70, borderWidth: 1, borderColor: 'rgba(73,56,232,.18)', position: 'absolute', right: -18, top: -65 }, rippleTwo: { width: 95, height: 95, borderRadius: 50, borderWidth: 1, borderColor: 'rgba(73,56,232,.22)', position: 'absolute', right: 6, top: -42 }, rippleDot: { width: 11, height: 11, borderRadius: 6, backgroundColor: '#4938E8', position: 'absolute', right: 49, top: 19 }, cardPeople: { fontSize: 11, fontWeight: '800', color: '#4938E8', letterSpacing: .4 },
  cardBody: { padding: 16 }, cardTop: { flexDirection: 'row', justifyContent: 'space-between' }, cardTime: { color: '#818193', fontSize: 11, fontWeight: '700' }, expire: { color: '#AD6070', fontSize: 10, fontWeight: '700' }, cardTitle: { fontSize: 20, color: '#282839', letterSpacing: -.5, fontWeight: '800', marginTop: 6 }, context: { color: '#77778A', fontSize: 12, marginTop: 4 }, duration: { color: '#9B9BAD', fontSize: 11, marginTop: 5 },
  actions: { flexDirection: 'row', alignItems: 'center', marginTop: 15, gap: 10 }, roundAction: { width: 39, height: 39, borderRadius: 20, backgroundColor: '#F4F3FF', alignItems: 'center', justifyContent: 'center' }, signal: { height: 39, borderRadius: 20, paddingHorizontal: 15, backgroundColor: '#4938E8', flexDirection: 'row', alignItems: 'center', gap: 7 }, signalSent: { backgroundColor: '#E3F8EE' }, signalText: { color: '#FFF', fontWeight: '800', fontSize: 12 }, signalTextSent: { color: '#1B7454' },
  privacy: { borderRadius: 18, backgroundColor: '#EFEEFF', padding: 16, flexDirection: 'row', gap: 11, marginTop: 4 }, privacyText: { flex: 1, color: '#5D5893', lineHeight: 17, fontSize: 11, fontWeight: '600' },
});
