import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import {
    Alert,
    Animated,
    Easing,
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Nearby, useRefind } from '../../src/store/useRefind';

const COLORS = {
  bg: '#F7F7FB',
  white: '#FFFFFF',

  ink: '#17172B',
  text: '#29283D',
  muted: '#858599',
  soft: '#A5A4B4',

  violet: '#5B45F5',
  violetDark: '#17124E',
  violetSoft: '#EEECFF',
  lavender: '#A995FF',

  mint: '#5AE0B5',
  mintDark: '#197453',

  coral: '#FF687B',
};

/* -------------------------------------------------------------------------- */
/*                           LIVE STATUS PILL                                 */
/* -------------------------------------------------------------------------- */

function LivePill({ live }: { live: boolean }) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!live) {
      pulse.setValue(1);
      return;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.25,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, [live, pulse]);

  return (
    <View
      style={[
        styles.statusPill,
        !live && styles.statusPillOff,
      ]}
    >
      <Animated.View
        style={[
          styles.statusDot,
          !live && styles.statusDotOff,
          {
            transform: [{ scale: pulse }],
          },
        ]}
      />

      <Text
        style={[
          styles.statusText,
          !live && styles.statusTextOff,
        ]}
      >
        {live ? 'LIVE' : 'PAUSA'}
      </Text>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                              RADAR                                         */
/* -------------------------------------------------------------------------- */

function Radar() {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 2600,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, [pulse]);

  const scale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.55, 1.25],
  });

  const opacity = pulse.interpolate({
    inputRange: [0, 0.35, 1],
    outputRange: [0.55, 0.2, 0],
  });

  return (
    <View style={styles.radar}>
      {/* ambient glow */}
      <View style={styles.radarGlow} />

      {/* animated field */}
      <Animated.View
        style={[
          styles.radarPulse,
          {
            transform: [{ scale }],
            opacity,
          },
        ]}
      />

      {/* radar rings */}
      <View style={[styles.radarRing, styles.radarOuter]} />
      <View style={[styles.radarRing, styles.radarMiddle]} />
      <View style={[styles.radarRing, styles.radarInner]} />

      {/* crosshair */}
      <View style={styles.crossHorizontal} />
      <View style={styles.crossVertical} />

      {/* center */}
      <View style={styles.youOuter}>
        <View style={styles.you}>
          <Text style={styles.youText}>
            TU
          </Text>
        </View>
      </View>

      {/* tiny center signal */}
      <View style={styles.centerGlow} />
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                              PERSON BUBBLE                                  */
/* -------------------------------------------------------------------------- */

function Bubble({
  person,
  style,
}: {
  person: Nearby;
  style: object;
}) {
  const { sendLiveSignal } = useRefind();

  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.86,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 4,
        tension: 150,
        useNativeDriver: true,
      }),
    ]).start();

    if (!person.signalSent) {
      sendLiveSignal(person.id);

      Alert.alert(
        'Segnale lanciato ✦',
        `Il segnale per ${person.name} resta anonimo finché non viene ricambiato.`,
      );
    }
  };

  return (
    <Animated.View
      style={[
        styles.bubbleWrap,
        style,
        {
          transform: [{ scale }],
        },
      ]}
    >
      <Pressable
        onPress={handlePress}
        style={styles.bubblePressable}
      >
        <View
          style={[
            styles.bubbleHalo,
            {
              backgroundColor: person.color,
            },
          ]}
        />

        <View
          style={[
            styles.bubble,
            {
              backgroundColor: person.color,
            },
            person.signalSent && styles.bubbleSent,
          ]}
        >
          <Text style={styles.initials}>
            {person.signalSent
              ? '✓'
              : person.initials}
          </Text>
        </View>

        <View style={styles.personInfo}>
          <Text style={styles.person}>
            {person.name}
          </Text>

          <Text style={styles.distance}>
            {person.signalSent
              ? 'Segnale inviato'
              : person.distance}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

/* -------------------------------------------------------------------------- */
/*                              MAIN SCREEN                                   */
/* -------------------------------------------------------------------------- */

export default function Live() {
  const {
    live,
    setLive,
    invisible,
    nearby,
  } = useRefind();

  const positions = [
    {
      left: '12%',
      top: '14%',
    },
    {
      right: '8%',
      top: '27%',
    },
    {
      left: '16%',
      bottom: '10%',
    },
    {
      right: '16%',
      bottom: '8%',
    },
  ];

  return (
    <SafeAreaView
      style={styles.screen}
      edges={['top']}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ================================================================== */}
        {/* HEADER                                                             */}
        {/* ================================================================== */}

        <View style={styles.header}>
          <View>
            <Text style={styles.kicker}>
              PROXIMITY FIELD
            </Text>

            <Text style={styles.heading}>
              Qui, adesso
            </Text>

            <Text style={styles.subtitle}>
              Scopri le possibilità che ti stanno sfiorando.
            </Text>
          </View>

          <LivePill live={live} />
        </View>

        {/* ================================================================== */}
        {/* RADAR FIELD                                                        */}
        {/* ================================================================== */}

        <View style={styles.radarContainer}>
          <Radar />

          {nearby
            .slice(0, 4)
            .map((person, index) => (
              <Bubble
                key={person.id}
                person={person}
                style={positions[index]}
              />
            ))}

          {/* radar label */}
          <View style={styles.radarLabel}>
            <View style={styles.radarLabelDot} />

            <Text style={styles.radarLabelText}>
              {nearby.length} echi nel tuo campo
            </Text>
          </View>
        </View>

        {/* ================================================================== */}
        {/* INTERACTION HINT                                                   */}
        {/* ================================================================== */}

        <View style={styles.hint}>
          <View style={styles.hintIcon}>
            <FontAwesome6
              name="hand-pointer"
              size={12}
              color={COLORS.violet}
            />
          </View>

          <View style={styles.hintContent}>
            <Text style={styles.hintTitle}>
              Un gesto, non un messaggio.
            </Text>

            <Text style={styles.hintText}>
              Tocca un'onda per inviare un segnale
              completamente silenzioso.
            </Text>
          </View>
        </View>

        {/* ================================================================== */}
        {/* LOCATION                                                           */}
        {/* ================================================================== */}

        <View style={styles.locationCard}>
          <View style={styles.locationIcon}>
            <FontAwesome6
              name="location-dot"
              size={15}
              color={COLORS.violet}
            />
          </View>

          <View style={styles.locationContent}>
            <Text style={styles.locationTitle}>
              Bar Magenta · Brera
            </Text>

            <Text style={styles.locationSub}>
              {nearby.length} ReFinders compatibili
              nel tuo raggio
            </Text>
          </View>

          <View style={styles.locationArrow}>
            <FontAwesome6
              name="chevron-right"
              size={11}
              color="#A6A5B7"
            />
          </View>
        </View>

        {/* ================================================================== */}
        {/* LIVE CONTROL                                                       */}
        {/* ================================================================== */}

        <View style={styles.controlCard}>
          <View style={styles.controlIcon}>
            <FontAwesome6
              name={live ? 'eye' : 'eye-slash'}
              size={14}
              color={COLORS.violet}
            />
          </View>

          <View style={styles.controlContent}>
            <Text style={styles.controlTitle}>
              Renditi Live
            </Text>

            <Text style={styles.controlSub}>
              {live
                ? 'Sei visibile solo con il tuo alias.'
                : 'Attiva per vedere le persone qui.'}
            </Text>
          </View>

          <Switch
            value={live}
            onValueChange={setLive}
            trackColor={{
              false: '#DEDCE8',
              true: '#ADA5FF',
            }}
            thumbColor={
              live
                ? COLORS.violet
                : '#FFFFFF'
            }
            ios_backgroundColor="#DEDCE8"
          />
        </View>

        {/* ================================================================== */}
        {/* INVISIBLE STATE                                                    */}
        {/* ================================================================== */}

        {invisible && (
          <View style={styles.invisible}>
            <FontAwesome6
              name="eye-slash"
              size={11}
              color="#9D5F1E"
            />

            <Text style={styles.invisibleText}>
              Modalità invisibile attiva
            </Text>
          </View>
        )}

        {/* ================================================================== */}
        {/* SAFETY                                                             */}
        {/* ================================================================== */}

        <View style={styles.safety}>
          <LinearGradient
            colors={[
              '#EAF8F3',
              '#E2F4EE',
            ]}
            style={StyleSheet.absoluteFillObject}
          />

          <View style={styles.safetyIcon}>
            <FontAwesome6
              name="shield-heart"
              size={16}
              color="#427B6C"
            />
          </View>

          <View style={styles.safetyContent}>
            <Text style={styles.safetyTitle}>
              Il tuo spazio resta privato.
            </Text>

            <Text style={styles.safetyText}>
              Le distanze sono approssimate. Nessuno vede
              la tua posizione esatta né il tuo cognome.
            </Text>
          </View>

          <FontAwesome6
            name="lock"
            size={12}
            color="#6FA18F"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  STYLES                                    */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 42,
  },

  /* ---------------------------------------------------------------------- */
  /* HEADER                                                                 */
  /* ---------------------------------------------------------------------- */

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },

  kicker: {
    color: COLORS.violet,
    fontSize: 10,
    letterSpacing: 1.45,
    fontWeight: '900',
  },

  heading: {
    color: COLORS.ink,
    fontSize: 34,
    lineHeight: 39,
    letterSpacing: -1.7,
    fontWeight: '900',
    marginTop: 2,
  },

  subtitle: {
    color: COLORS.muted,
    fontSize: 11.5,
    lineHeight: 17,
    marginTop: 4,
    maxWidth: 245,
  },

  /* ---------------------------------------------------------------------- */
  /* STATUS                                                                 */
  /* ---------------------------------------------------------------------- */

  statusPill: {
    height: 31,
    paddingHorizontal: 11,
    borderRadius: 16,
    backgroundColor: '#E2F7EE',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  statusPillOff: {
    backgroundColor: '#EEEEF3',
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.mint,
  },

  statusDotOff: {
    backgroundColor: '#A6A5B7',
  },

  statusText: {
    color: COLORS.mintDark,
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 1,
  },

  statusTextOff: {
    color: '#77768A',
  },

  /* ---------------------------------------------------------------------- */
  /* RADAR CONTAINER                                                        */
  /* ---------------------------------------------------------------------- */

  radarContainer: {
    height: 390,
    borderRadius: 32,
    overflow: 'hidden',
    position: 'relative',

    backgroundColor: '#EDEBFF',

    shadowColor: '#4A3ED1',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 3,
  },

  radar: {
    position: 'absolute',
    width: 360,
    height: 360,
    left: '50%',
    top: '50%',
    marginLeft: -180,
    marginTop: -180,
    alignItems: 'center',
    justifyContent: 'center',
  },

  radarGlow: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#A99CFF',
    opacity: 0.13,
  },

  radarPulse: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    borderWidth: 2,
    borderColor: '#BBAEFF',
  },

  radarRing: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#D4CFFF',
  },

  radarOuter: {
    width: 340,
    height: 340,
  },

  radarMiddle: {
    width: 235,
    height: 235,
  },

  radarInner: {
    width: 125,
    height: 125,
  },

  crossHorizontal: {
    position: 'absolute',
    width: 340,
    height: 1,
    backgroundColor: 'rgba(111,99,207,0.08)',
  },

  crossVertical: {
    position: 'absolute',
    width: 1,
    height: 340,
    backgroundColor: 'rgba(111,99,207,0.08)',
  },

  centerGlow: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#8F7EFF',
    opacity: 0.12,
  },

  youOuter: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: 'rgba(255,255,255,0.42)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  you: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: COLORS.violet,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: COLORS.white,

    shadowColor: COLORS.violet,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 4,
  },

  youText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },

  /* ---------------------------------------------------------------------- */
  /* BUBBLES                                                                */
  /* ---------------------------------------------------------------------- */

  bubbleWrap: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 5,
  },

  bubblePressable: {
    alignItems: 'center',
  },

  bubbleHalo: {
    position: 'absolute',
    width: 78,
    height: 78,
    borderRadius: 39,
    opacity: 0.12,
  },

  bubble: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,

    shadowColor: '#4C3BD0',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 9,
    elevation: 3,
  },

  bubbleSent: {
    backgroundColor: '#87DDBE',
  },

  initials: {
    color: '#252537',
    fontSize: 19,
    fontWeight: '900',
  },

  personInfo: {
    alignItems: 'center',
  },

  person: {
    color: '#393949',
    fontSize: 11,
    fontWeight: '900',
    marginTop: 5,
  },

  distance: {
    color: '#7C7B90',
    fontSize: 9.5,
    fontWeight: '600',
    marginTop: 1,
  },

  /* ---------------------------------------------------------------------- */
  /* RADAR LABEL                                                            */
  /* ---------------------------------------------------------------------- */

  radarLabel: {
    position: 'absolute',
    top: 15,
    left: 15,
    height: 29,
    paddingHorizontal: 10,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.68)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  radarLabelDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.violet,
  },

  radarLabelText: {
    color: '#625A9E',
    fontSize: 9.5,
    fontWeight: '800',
  },

  /* ---------------------------------------------------------------------- */
  /* HINT                                                                   */
  /* ---------------------------------------------------------------------- */

  hint: {
    marginTop: -18,
    marginHorizontal: 18,
    minHeight: 58,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 10,

    flexDirection: 'row',
    alignItems: 'center',

    zIndex: 10,

    shadowColor: '#332A82',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.08,
    shadowRadius: 13,
    elevation: 3,
  },

  hintIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.violetSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },

  hintContent: {
    flex: 1,
  },

  hintTitle: {
    color: COLORS.text,
    fontSize: 10.5,
    fontWeight: '900',
  },

  hintText: {
    color: COLORS.muted,
    fontSize: 9.5,
    lineHeight: 14,
    marginTop: 2,
  },

  /* ---------------------------------------------------------------------- */
  /* LOCATION                                                               */
  /* ---------------------------------------------------------------------- */

  locationCard: {
    marginTop: 20,
    minHeight: 72,
    backgroundColor: COLORS.white,
    borderRadius: 21,
    padding: 14,

    flexDirection: 'row',
    alignItems: 'center',

    shadowColor: '#30296B',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.045,
    shadowRadius: 14,
    elevation: 2,
  },

  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: COLORS.violetSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  locationContent: {
    flex: 1,
  },

  locationTitle: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '900',
  },

  locationSub: {
    color: COLORS.muted,
    fontSize: 10,
    marginTop: 3,
    fontWeight: '600',
  },

  locationArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F7F6FB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* ---------------------------------------------------------------------- */
  /* CONTROL                                                                */
  /* ---------------------------------------------------------------------- */

  controlCard: {
    marginTop: 11,
    minHeight: 76,
    backgroundColor: COLORS.white,
    borderRadius: 21,
    padding: 14,

    flexDirection: 'row',
    alignItems: 'center',

    shadowColor: '#30296B',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.045,
    shadowRadius: 14,
    elevation: 2,
  },

  controlIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: COLORS.violetSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  controlContent: {
    flex: 1,
  },

  controlTitle: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '900',
  },

  controlSub: {
    color: COLORS.muted,
    fontSize: 10,
    lineHeight: 14,
    marginTop: 3,
    paddingRight: 5,
  },

  /* ---------------------------------------------------------------------- */
  /* INVISIBLE                                                              */
  /* ---------------------------------------------------------------------- */

  invisible: {
    alignSelf: 'center',
    marginTop: 10,
    paddingHorizontal: 11,
    height: 27,
    borderRadius: 14,
    backgroundColor: '#FFF3E1',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  invisibleText: {
    color: '#9D5F1E',
    fontSize: 9.5,
    fontWeight: '800',
  },

  /* ---------------------------------------------------------------------- */
  /* SAFETY                                                                 */
  /* ---------------------------------------------------------------------- */

  safety: {
    minHeight: 79,
    marginTop: 16,
    borderRadius: 21,
    padding: 14,

    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,

    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#D6EDE4',
  },

  safetyIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  safetyContent: {
    flex: 1,
  },

  safetyTitle: {
    color: '#3E7465',
    fontSize: 10.5,
    fontWeight: '900',
    marginBottom: 3,
  },

  safetyText: {
    color: '#548575',
    fontSize: 9.5,
    lineHeight: 14,
    fontWeight: '600',
  },
});