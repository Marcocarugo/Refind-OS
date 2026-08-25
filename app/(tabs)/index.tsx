import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import {
  Alert,
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Moment, useRefind } from '../../src/store/useRefind';

const COLORS = {
  bg: '#F7F7FB',
  white: '#FFFFFF',
  ink: '#17172B',
  text: '#29283D',
  muted: '#858599',
  soft: '#A5A4B4',

  violet: '#5B45F5',
  violetDeep: '#17124E',
  violetSoft: '#EEECFF',
  lavender: '#A995FF',
  pink: '#D98AFF',

  mint: '#5AE0B5',
  coral: '#FF687B',

  line: '#ECEAF5',
};

/* -------------------------------------------------------------------------- */
/*                            ANIMATED ECHO ORBIT                             */
/* -------------------------------------------------------------------------- */

function EchoOrbit() {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 2400,
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

  const pulseScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.82, 1.18],
  });

  const pulseOpacity = pulse.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0.5, 0.18, 0],
  });

  return (
    <View style={styles.orbitWrapper}>
      {/* animated outer pulse */}
      <Animated.View
        style={[
          styles.pulseOrbit,
          {
            opacity: pulseOpacity,
            transform: [{ scale: pulseScale }],
          },
        ]}
      />

      {/* static orbits */}
      <View style={[styles.orbit, styles.orbit1]} />
      <View style={[styles.orbit, styles.orbit2]} />
      <View style={[styles.orbit, styles.orbit3]} />

      {/* central core */}
      <View style={styles.orbitCore}>
        <FontAwesome6
          name="heart"
          size={18}
          color="#FFFFFF"
          solid
        />
      </View>

      {/* echoes */}
      <View style={[styles.echo, styles.echoTop]} />
      <View style={[styles.echo, styles.echoRight]} />
      <View style={[styles.echo, styles.echoBottom]} />
      <View style={[styles.echo, styles.echoLeft]} />
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                              MOMENT ART                                    */
/* -------------------------------------------------------------------------- */

function MomentArtwork({
  palette,
  people,
}: {
  palette: string;
  people: number;
}) {
  return (
    <View
      style={[
        styles.momentArtwork,
        {
          backgroundColor: palette,
        },
      ]}
    >
      <LinearGradient
        colors={[
          'rgba(255,255,255,0.30)',
          'rgba(255,255,255,0)',
        ]}
        style={styles.artLight}
      />

      <View style={styles.artRingLarge} />
      <View style={styles.artRingMedium} />
      <View style={styles.artRingSmall} />

      <View style={styles.artDot} />

      <View style={styles.echoCount}>
        <FontAwesome6
          name="users"
          size={9}
          color={COLORS.violet}
        />

        <Text style={styles.echoCountText}>
          {people} echi
        </Text>
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                             SIGNAL BUTTON                                  */
/* -------------------------------------------------------------------------- */

function SignalButton({
  item,
  onPress,
}: {
  item: Moment;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.94,
        duration: 70,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 4,
        tension: 130,
        useNativeDriver: true,
      }),
    ]).start();

    onPress();
  };

  return (
    <Animated.View
      style={{
        flex: 1,
        transform: [{ scale }],
      }}
    >
      <Pressable
        onPress={handlePress}
        style={[
          styles.signalButton,
          item.signalled && styles.signalButtonSent,
        ]}
      >
        <FontAwesome6
          name={item.signalled ? 'check' : 'sparkles'}
          size={11}
          color={
            item.signalled
              ? COLORS.mint
              : '#FFFFFF'
          }
        />

        <Text
          numberOfLines={1}
          style={[
            styles.signalText,
            item.signalled && styles.signalTextSent,
          ]}
        >
          {item.signalled
            ? 'Segnale inviato'
            : 'Invia un segnale'}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

/* -------------------------------------------------------------------------- */
/*                              MOMENT CARD                                   */
/* -------------------------------------------------------------------------- */

function MomentCard({
  item,
}: {
  item: Moment;
}) {
  const {
    toggleSaved,
    sendMomentSignal,
  } = useRefind();

  const signal = () => {
    if (!item.signalled) {
      sendMomentSignal(item.id);

      Alert.alert(
        'Segnale inviato ✦',
        'Resterà invisibile finché una persona di questo momento non ricambia.',
      );
    }
  };

  return (
    <View style={styles.card}>
      {/* visual */}
      <MomentArtwork
        palette={item.palette}
        people={item.people}
      />

      {/* information */}
      <View style={styles.cardContent}>
        {/* time + expiry */}
        <View style={styles.metaRow}>
          <Text style={styles.time}>
            {item.time}
          </Text>

          <View style={styles.expiry}>
            <View style={styles.expiryDot} />

            <Text style={styles.expiryText}>
              {item.expires}
            </Text>
          </View>
        </View>

        {/* title */}
        <Text
          numberOfLines={2}
          style={styles.title}
        >
          {item.title}
        </Text>

        {/* context */}
        <View style={styles.infoRow}>
          <FontAwesome6
            name="location-dot"
            size={10}
            color={COLORS.muted}
          />

          <Text
            numberOfLines={1}
            style={styles.context}
          >
            {item.context}
          </Text>
        </View>

        {/* duration */}
        <View style={styles.infoRow}>
          <FontAwesome6
            name="clock"
            size={10}
            color={COLORS.soft}
          />

          <Text style={styles.duration}>
            {item.duration}
          </Text>
        </View>

        {/* actions */}
        <View style={styles.actions}>
          <Pressable
            accessibilityLabel="Salva momento"
            onPress={() =>
              toggleSaved(item.id)
            }
            style={[
              styles.bookmark,
              item.saved &&
                styles.bookmarkActive,
            ]}
          >
            <FontAwesome6
              name="bookmark"
              size={14}
              solid={item.saved}
              color={
                item.saved
                  ? COLORS.violet
                  : '#77778A'
              }
            />
          </Pressable>

          <SignalButton
            item={item}
            onPress={signal}
          />
        </View>
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                              MAIN SCREEN                                   */
/* -------------------------------------------------------------------------- */

export default function EchoesScreen() {
  const {
    moments,
    matches,
  } = useRefind();

  const router = useRouter();

  return (
    <SafeAreaView
      style={styles.screen}
      edges={['top']}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* ================================================================== */}
        {/* HEADER                                                             */}
        {/* ================================================================== */}

        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.kicker}>
              IL TUO DIGEST · OGGI
            </Text>

            <View style={styles.headingRow}>
              <Text style={styles.heading}>
                I tuoi echi
              </Text>

              <View style={styles.headingSparkle}>
                <FontAwesome6
                  name="sparkles"
                  size={12}
                  color={COLORS.violet}
                />
              </View>
            </View>

            <Text style={styles.subtitle}>
              Le connessioni che hai sfiorato oggi.
            </Text>
          </View>

          <Pressable
            onPress={() =>
              router.push('/matches')
            }
            style={styles.bell}
          >
            <FontAwesome6
              name="bell"
              size={17}
              color={COLORS.ink}
            />

            {matches.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {matches.length}
                </Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* ================================================================== */}
        {/* HERO                                                               */}
        {/* ================================================================== */}

        <LinearGradient
          colors={[
            '#17124E',
            '#30218B',
            '#6547EA',
          ]}
          start={{
            x: 0,
            y: 0,
          }}
          end={{
            x: 1,
            y: 1,
          }}
          style={styles.hero}
        >
          {/* ambient glow */}
          <View style={styles.heroGlow1} />
          <View style={styles.heroGlow2} />

          <View style={styles.heroTextContainer}>
            <View style={styles.heroKickerRow}>
              <View style={styles.liveDot} />

              <Text style={styles.heroKicker}>
                IL MONDO È PIÙ VICINO
              </Text>
            </View>

            <Text style={styles.heroTitle}>
              Oggi hai sfiorato
              {'\n'}
              <Text style={styles.heroNumber}>
                12
              </Text>{' '}
              possibilità.
            </Text>

            <Text style={styles.heroDescription}>
              Alcuni momenti sono passati vicino a te.
              Nessuna posizione o identità reale viene
              mostrata.
            </Text>

            <Pressable
              onPress={() =>
                router.push('/live')
              }
              style={styles.liveButton}
            >
              <View style={styles.liveButtonDot} />

              <Text style={styles.liveButtonText}>
                Guarda chi è qui
              </Text>

              <FontAwesome6
                name="arrow-right"
                size={11}
                color="#FFFFFF"
              />
            </Pressable>
          </View>

          <EchoOrbit />
        </LinearGradient>

        {/* ================================================================== */}
        {/* MOMENTS HEADER                                                      */}
        {/* ================================================================== */}

        <View style={styles.sectionHeader}>
          <View style={styles.sectionLeft}>
            <View style={styles.sectionIcon}>
              <FontAwesome6
                name="wave-square"
                size={14}
                color="#FFFFFF"
              />
            </View>

            <View>
              <Text style={styles.sectionTitle}>
                MOMENTI CONDIVISI
              </Text>

              <Text style={styles.sectionSubtitle}>
                Echi reali. Connessioni possibili.
              </Text>
            </View>
          </View>

          <View style={styles.countPill}>
            <Text style={styles.countNumber}>
              {moments.length}
            </Text>

            <Text style={styles.countLabel}>
              disponibili
            </Text>
          </View>
        </View>

        {/* ================================================================== */}
        {/* MOMENTS                                                             */}
        {/* ================================================================== */}

        {moments.map((item) => (
          <MomentCard
            key={item.id}
            item={item}
          />
        ))}

        {/* ================================================================== */}
        {/* PRIVACY                                                             */}
        {/* ================================================================== */}

        <View style={styles.privacy}>
          <LinearGradient
            colors={[
              '#F1EFFF',
              '#E9E5FF',
            ]}
            style={StyleSheet.absoluteFillObject}
          />

          <View style={styles.privacyShield}>
            <FontAwesome6
              name="shield-heart"
              size={17}
              color={COLORS.violet}
            />
          </View>

          <View style={styles.privacyTextContainer}>
            <Text style={styles.privacyTitle}>
              Double-blind by design.
            </Text>

            <Text style={styles.privacyDescription}>
              Nessuno scopre il tuo interesse senza
              una scelta reciproca.
            </Text>
          </View>

          <View style={styles.lock}>
            <FontAwesome6
              name="lock"
              size={13}
              color={COLORS.violet}
            />
          </View>
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
    marginBottom: 23,
  },

  headerLeft: {
    flex: 1,
  },

  kicker: {
    color: COLORS.violet,
    fontSize: 10,
    letterSpacing: 1.45,
    fontWeight: '900',
    marginBottom: 2,
  },

  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  heading: {
    color: COLORS.ink,
    fontSize: 34,
    lineHeight: 39,
    letterSpacing: -1.8,
    fontWeight: '900',
  },

  headingSparkle: {
    width: 27,
    height: 27,
    borderRadius: 14,
    marginLeft: 9,
    marginTop: 3,
    backgroundColor: COLORS.violetSoft,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [
      {
        rotate: '10deg',
      },
    ],
  },

  subtitle: {
    color: COLORS.muted,
    fontSize: 11.5,
    lineHeight: 17,
    marginTop: 4,
    fontWeight: '500',
  },

  bell: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#2B245F',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 3,
  },

  badge: {
    position: 'absolute',
    top: -3,
    right: -3,
    minWidth: 19,
    height: 19,
    paddingHorizontal: 4,
    borderRadius: 10,
    backgroundColor: COLORS.coral,
    borderWidth: 2,
    borderColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },

  badgeText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: '900',
  },

  /* ---------------------------------------------------------------------- */
  /* HERO                                                                   */
  /* ---------------------------------------------------------------------- */

  hero: {
    height: 238,
    borderRadius: 29,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 30,
  },

  heroTextContainer: {
    width: '67%',
    paddingTop: 22,
    paddingLeft: 22,
    zIndex: 10,
  },

  heroGlow1: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#8D73FF',
    opacity: 0.27,
    right: -80,
    top: -55,
  },

  heroGlow2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#FF93DB',
    opacity: 0.16,
    right: 30,
    bottom: -95,
  },

  heroKickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.mint,
    marginRight: 8,

    shadowColor: COLORS.mint,
    shadowOpacity: 0.9,
    shadowRadius: 9,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },

  heroKicker: {
    color: '#C9C5FF',
    fontSize: 9,
    letterSpacing: 1.3,
    fontWeight: '900',
  },

  heroTitle: {
    color: COLORS.white,
    fontSize: 25,
    lineHeight: 29,
    letterSpacing: -0.9,
    fontWeight: '900',
    marginTop: 12,
  },

  heroNumber: {
    color: '#D39CFF',
    fontSize: 31,
    fontWeight: '900',
  },

  heroDescription: {
    color: '#D7D4FF',
    fontSize: 11.5,
    lineHeight: 17,
    marginTop: 9,
    maxWidth: 235,
  },

  liveButton: {
    height: 38,
    alignSelf: 'flex-start',
    marginTop: 15,
    paddingHorizontal: 14,
    borderRadius: 20,

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: 'rgba(15, 10, 70, 0.62)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.20)',
    gap: 8,
  },

  liveButtonDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.mint,
  },

  liveButtonText: {
    color: COLORS.white,
    fontSize: 11.5,
    fontWeight: '900',
  },

  /* ---------------------------------------------------------------------- */
  /* ORBIT                                                                   */
  /* ---------------------------------------------------------------------- */

  orbitWrapper: {
    position: 'absolute',
    width: 190,
    height: 190,
    right: -23,
    top: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  orbit: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(230,220,255,0.30)',
  },

  orbit1: {
    width: 182,
    height: 182,
  },

  orbit2: {
    width: 138,
    height: 138,
  },

  orbit3: {
    width: 91,
    height: 91,
  },

  pulseOrbit: {
    position: 'absolute',
    width: 175,
    height: 175,
    borderRadius: 88,
    borderWidth: 2,
    borderColor: '#DCA8FF',
  },

  orbitCore: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(255,255,255,0.96)',
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#FFB4E8',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.75,
    shadowRadius: 23,
  },

  echo: {
    position: 'absolute',
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#DCC9FF',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  echoTop: {
    top: 4,
    right: 59,
  },

  echoRight: {
    right: -1,
    top: 78,
  },

  echoBottom: {
    bottom: 10,
    right: 51,
  },

  echoLeft: {
    left: 3,
    top: 88,
  },

  /* ---------------------------------------------------------------------- */
  /* SECTION                                                                 */
  /* ---------------------------------------------------------------------- */

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 13,
  },

  sectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  sectionIcon: {
    width: 37,
    height: 37,
    borderRadius: 19,
    backgroundColor: COLORS.violet,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,

    shadowColor: COLORS.violet,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.18,
    shadowRadius: 10,
  },

  sectionTitle: {
    color: COLORS.ink,
    fontSize: 10,
    letterSpacing: 1.15,
    fontWeight: '900',
  },

  sectionSubtitle: {
    color: COLORS.muted,
    fontSize: 10,
    marginTop: 2,
    fontWeight: '500',
  },

  countPill: {
    height: 31,
    paddingHorizontal: 11,
    borderRadius: 16,
    backgroundColor: COLORS.violetSoft,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  countNumber: {
    color: COLORS.violet,
    fontSize: 12,
    fontWeight: '900',
  },

  countLabel: {
    color: COLORS.violet,
    fontSize: 10,
    fontWeight: '700',
  },

  /* ---------------------------------------------------------------------- */
  /* MOMENT CARD                                                             */
  /* ---------------------------------------------------------------------- */

  card: {
    height: 175,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 15,
    flexDirection: 'row',

    shadowColor: '#30296B',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.055,
    shadowRadius: 15,
    elevation: 2,
  },

  momentArtwork: {
    width: 108,
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'flex-end',
  },

  artLight: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    top: -70,
    right: -55,
  },

  artRingLarge: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 1,
    borderColor: 'rgba(73,56,232,0.16)',
    right: -72,
    top: -70,
  },

  artRingMedium: {
    position: 'absolute',
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 1,
    borderColor: 'rgba(73,56,232,0.20)',
    right: -42,
    top: -42,
  },

  artRingSmall: {
    position: 'absolute',
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 1,
    borderColor: 'rgba(73,56,232,0.22)',
    right: -15,
    top: -15,
  },

  artDot: {
    position: 'absolute',
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: COLORS.violet,
    right: 31,
    top: 26,
  },

  echoCount: {
    position: 'absolute',
    bottom: 12,
    left: 11,
    height: 25,
    paddingHorizontal: 8,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.82)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  echoCountText: {
    color: COLORS.violet,
    fontSize: 9.5,
    fontWeight: '900',
  },

  /* ---------------------------------------------------------------------- */
  /* CARD CONTENT                                                            */
  /* ---------------------------------------------------------------------- */

  cardContent: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },

  time: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: '800',
  },

  expiry: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  expiryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.coral,
  },

  expiryText: {
    color: '#D35D70',
    fontSize: 9.5,
    fontWeight: '900',
  },

  title: {
    color: COLORS.text,
    fontSize: 18,
    lineHeight: 22,
    letterSpacing: -0.5,
    fontWeight: '900',
    marginTop: 6,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 5,
  },

  context: {
    color: COLORS.muted,
    fontSize: 10.5,
    fontWeight: '500',
    flex: 1,
  },

  duration: {
    color: COLORS.soft,
    fontSize: 10,
    fontWeight: '600',
  },

  /* ---------------------------------------------------------------------- */
  /* ACTIONS                                                                 */
  /* ---------------------------------------------------------------------- */

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 'auto',
  },

  bookmark: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3F1FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  bookmarkActive: {
    backgroundColor: '#E7E3FF',
  },

  signalButton: {
    height: 38,
    flex: 1,
    borderRadius: 19,
    backgroundColor: COLORS.violet,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,

    shadowColor: COLORS.violet,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.20,
    shadowRadius: 9,
    elevation: 3,
  },

  signalButtonSent: {
    backgroundColor: '#E1F8EE',
    shadowOpacity: 0,
  },

  signalText: {
    color: COLORS.white,
    fontSize: 10.5,
    fontWeight: '900',
  },

  signalTextSent: {
    color: '#17734F',
  },

  /* ---------------------------------------------------------------------- */
  /* PRIVACY                                                                 */
  /* ---------------------------------------------------------------------- */

  privacy: {
    minHeight: 87,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#DDD8FF',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },

  privacyShield: {
    width: 41,
    height: 41,
    borderRadius: 21,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  privacyTextContainer: {
    flex: 1,
  },

  privacyTitle: {
    color: '#4C3BC1',
    fontSize: 11.5,
    fontWeight: '900',
    marginBottom: 3,
  },

  privacyDescription: {
    color: '#6B6595',
    fontSize: 10,
    lineHeight: 15,
    fontWeight: '600',
  },

  lock: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 7,
  },
});