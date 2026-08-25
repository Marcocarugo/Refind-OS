import { FontAwesome6 } from '@expo/vector-icons';
import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Nearby, useRefind } from '../../src/useRefind';

function Bubble({ person, position }: { person: Nearby; position: object }) {
  const { sendLiveSignal } = useRefind();
  const send = () => {
    if (person.signalSent) return;
    sendLiveSignal(person.id);
    Alert.alert('Aura lanciata', `Il tuo segnale per ${person.name} rimane anonimo finché non viene ricambiato.`);
  };
  return <Pressable onPress={send} style={[styles.bubbleWrap, position]}>
    <View style={[styles.bubble, { backgroundColor: person.color }, person.signalSent && styles.bubbleSent]}><Text style={styles.initials}>{person.signalSent ? '✓' : person.initials}</Text></View>
    <Text style={styles.personName}>{person.name}</Text><Text style={styles.distance}>{person.signalSent ? 'In attesa' : person.distance}</Text>
  </Pressable>;
}

export default function LiveScreen() {
  const { live, setLive, invisible, nearby } = useRefind();
  return <SafeAreaView style={styles.screen} edges={['top']}>
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}><View><Text style={styles.kicker}>PROXIMITY BUBBLE</Text><Text style={styles.heading}>Qui, adesso</Text></View><View style={styles.livePill}><View style={[styles.liveDot, !live && styles.off]} /><Text style={styles.livePillText}>{live ? 'LIVE' : 'PAUSA'}</Text></View></View>
      <View style={styles.radar}>
        <View style={styles.ringOne} /><View style={styles.ringTwo} /><View style={styles.ringThree} />
        <Bubble person={nearby[0]} position={{ left: '13%', top: '17%' }} />
        <Bubble person={nearby[1]} position={{ right: '7%', top: '30%' }} />
        <Bubble person={nearby[2]} position={{ left: '18%', bottom: '12%' }} />
        <Bubble person={nearby[3]} position={{ right: '17%', bottom: '9%' }} />
        <View style={styles.you}><View style={styles.youInner}><Text style={styles.youText}>TU</Text></View></View>
      </View>
      <View style={styles.hint}><FontAwesome6 name="hand-pointer" size={14} color="#4938E8" /><Text style={styles.hintText}>Tocca una bolla per lanciare un segnale silenzioso.</Text></View>
      <View style={styles.location}><View style={styles.locationIcon}><FontAwesome6 name="location-dot" size={16} color="#4938E8" /></View><View style={{ flex: 1 }}><Text style={styles.locationTitle}>Bar Magenta · Brera</Text><Text style={styles.locationSub}>4 ReFinders compatibili entro 20 metri</Text></View><FontAwesome6 name="chevron-right" size={12} color="#A6A5B7" /></View>
      <View style={styles.control}><View><Text style={styles.controlTitle}>Renditi Live</Text><Text style={styles.controlSub}>{live ? 'Sei visibile solo con il tuo alias' : 'Attiva per vedere le persone qui'}</Text></View><Switch value={live} onValueChange={setLive} trackColor={{ false: '#DDDAE7', true: '#AFA8FF' }} thumbColor={live ? '#4938E8' : '#FFF'} /></View>
      {invisible && <Text style={styles.invisible}>La modalità invisibile è attiva: il radar resta spento.</Text>}
      <View style={styles.safety}><FontAwesome6 name="shield-heart" size={17} color="#427B6C" /><Text style={styles.safetyText}>Le distanze sono approssimate. Nessuno vede la tua posizione esatta, il tuo cognome o i tuoi contatti.</Text></View>
    </ScrollView>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F7FB' }, content: { padding: 20, paddingBottom: 30 }, header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6, marginBottom: 22 }, kicker: { color: '#858598', fontSize: 10, fontWeight: '800', letterSpacing: 1.3 }, heading: { fontSize: 31, fontWeight: '800', color: '#21212E', letterSpacing: -1.3, marginTop: 2 }, livePill: { backgroundColor: '#E2F7EE', paddingHorizontal: 11, height: 29, borderRadius: 15, alignItems: 'center', flexDirection: 'row', gap: 6 }, liveDot: { width: 7, height: 7, borderRadius: 7, backgroundColor: '#27B67A' }, off: { backgroundColor: '#A6A5B7' }, livePillText: { color: '#197453', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  radar: { height: 370, borderRadius: 32, backgroundColor: '#EDEBFF', overflow: 'hidden', position: 'relative', alignItems: 'center', justifyContent: 'center' }, ringOne: { position: 'absolute', width: 330, height: 330, borderRadius: 180, borderWidth: 1, borderColor: '#D5D0FF' }, ringTwo: { position: 'absolute', width: 220, height: 220, borderRadius: 120, borderWidth: 1, borderColor: '#D5D0FF' }, ringThree: { position: 'absolute', width: 112, height: 112, borderRadius: 60, borderWidth: 1, borderColor: '#D5D0FF' }, you: { height: 75, width: 75, borderRadius: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(73,56,232,.14)' }, youInner: { height: 57, width: 57, borderRadius: 30, backgroundColor: '#4938E8', justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: '#FFF' }, youText: { fontWeight: '900', fontSize: 11, color: '#FFF', letterSpacing: .8 }, bubbleWrap: { position: 'absolute', alignItems: 'center' }, bubble: { width: 58, height: 58, borderRadius: 30, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#FFF', shadowColor: '#3C3672', shadowOpacity: .2, shadowRadius: 7, elevation: 3 }, bubbleSent: { backgroundColor: '#87DDBE' }, initials: { fontSize: 21, color: '#252537', fontWeight: '800' }, personName: { fontSize: 12, fontWeight: '800', color: '#393949', marginTop: 5 }, distance: { color: '#7C7B90', fontWeight: '600', fontSize: 10, marginTop: 1 },
  hint: { alignSelf: 'center', backgroundColor: '#EFEEFF', borderRadius: 17, paddingHorizontal: 13, paddingVertical: 9, marginTop: -17, flexDirection: 'row', gap: 8, alignItems: 'center', zIndex: 2 }, hintText: { color: '#5D5893', fontSize: 11, fontWeight: '700' }, location: { backgroundColor: '#FFF', borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 20 }, locationIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#F0EEFF', alignItems: 'center', justifyContent: 'center' }, locationTitle: { color: '#2B2B3B', fontSize: 14, fontWeight: '800' }, locationSub: { color: '#888799', fontSize: 11, marginTop: 3 }, control: { backgroundColor: '#FFF', borderRadius: 20, marginTop: 12, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, controlTitle: { color: '#2B2B3B', fontWeight: '800', fontSize: 14 }, controlSub: { color: '#888799', fontSize: 11, marginTop: 3 }, invisible: { fontSize: 11, color: '#9D5F1E', textAlign: 'center', marginTop: 10 }, safety: { marginTop: 16, backgroundColor: '#E9F7F2', padding: 15, borderRadius: 17, flexDirection: 'row', gap: 10 }, safetyText: { flex: 1, color: '#427B6C', fontSize: 11, fontWeight: '600', lineHeight: 16 },
});
