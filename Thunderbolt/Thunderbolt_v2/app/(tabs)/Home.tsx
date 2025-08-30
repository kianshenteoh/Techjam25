// app/(tabs)/Home.tsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Gauge from '../../components/Gauge';

type FeatureCount = { label: string; value: number };
type Results = {
  dangerPercent: number;            // 0..100
  features: FeatureCount[];         // e.g. [{label:'Signs', value:4}, ...]
};

type Props = { initialResults?: Results };

const COLORS = {
  pageBg: '#000000',
  text: '#ffffff',
  muted: '#b6b6b6',
  brand: '#5a1176',
  brandPress: '#4a0e61',
  card: '#252525',
  chip: '#3a3a3a',
  bar: '#c01414',
};

const { width } = Dimensions.get('window');
const MAX_CARD_WIDTH = Math.min(480, width);

const NAV_HEIGHT = 92; // purple bar height

export default function Home({ initialResults }: Props) {
  const [imgUri, setImgUri] = useState<string | null>(null);
  const [results, setResults] = useState<Results | undefined>(initialResults);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const percent = results?.dangerPercent ?? -1;
  const bars = results?.features ?? [];

  const handlePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      console.warn('permission to access media library was denied');
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
    });
    if (!res.canceled && res.assets?.length) {
      const uri = res.assets[0].uri;
      setImgUri(uri);

      // TODO: call your backend scorer -> setResults(...)
      // const r = await scoreImage(uri); setResults(r);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      {/* CONTENT */}
      <View
        style={[
          styles.appPad,
          { paddingBottom: NAV_HEIGHT + insets.bottom }, // leave room for the bar
        ]}
      >
        {/* Welcome + subtitle */}
        <Text style={styles.welcome}>Welcome to Thunderbolt</Text>
        <Text style={styles.subtitle}>Detection risk with Thunderbolt AI</Text>

        {/* New image button */}
        <TouchableOpacity onPress={handlePick} activeOpacity={0.8} style={styles.primaryBtn}>
          <Text style={styles.primaryBtnText}>New image</Text>
        </TouchableOpacity>

        {/* Small bolt icon */}
        <Image
          style={styles.topBolt}
          source={require('../../assets/icon-bolt.png')}
          resizeMode="contain"
        />

        {/* Results card */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.cardTitle}>Recent results</Text>
            <Text style={styles.muted}>Danger level:</Text>
          </View>

          <View style={[styles.cardRow, { marginTop: 10 }]}>
            <TouchableOpacity activeOpacity={0.8} style={styles.secondaryBtn}>
              <Text style={styles.secondaryBtnText}>View image</Text>
            </TouchableOpacity>

            <Gauge percent={percent} />
          </View>

          {/* “Your image contains …” */}
          <View style={styles.explain}>
            <Text style={styles.explainHead}>Your image contained several identifying features:</Text>
          </View>

          {/* Bars grid */}
          {bars.length > 0 ? (
            <View style={styles.bars}>
              {bars.slice(0, 6).map((b, i) => {
                const hPct = Math.min(8, Math.max(0, b.value)) / 8;
                const barHeight = 100 * hPct;
                return (
                  <View style={styles.barCol} key={`${b.label}-${i}`}>
                    <View style={[styles.bar, { height: Math.max(6, barHeight) }]} />
                    <Text style={styles.barValue}>{b.value}</Text>
                    <Text style={styles.barLabel}>{b.label}</Text>
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={styles.barsPlaceholder} />
          )}
        </View>
      </View>

      {/* PURPLE NAV pinned to the true bottom */}
      <View style={[styles.nav, { paddingBottom: insets.bottom }]} pointerEvents="box-none">
        <LinearGradient
          colors={[
            'rgba(164,76,219,0.98)',
            'rgba(131,56,205,0.92)',
            'rgba(92,0,153,0.86)',
            'rgba(26,0,42,0.95)',
            'rgba(0,0,0,1.0)',
          ]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.navGrad}
        />
        <View style={styles.navInner}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.replace('/(tabs)/Home')}
            activeOpacity={0.8}
          >
            <Image source={require('../../assets/icon-home.png')} style={styles.navIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.replace('/(tabs)/Thunderbolt')}
            activeOpacity={0.8}
          >
            <Image source={require('../../assets/icon-bolt.png')} style={styles.navIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.pageBg,
  },
  appPad: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 20,
    maxWidth: MAX_CARD_WIDTH,
    width: '100%',
    alignSelf: 'center',
  },

  // top
  welcome: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 14,
    marginBottom: 12,
  },

  // buttons
  primaryBtn: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.brand,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 14,
  },
  secondaryBtn: {
    backgroundColor: COLORS.brand,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  secondaryBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 13,
  },

  topBolt: {
    width: 36,
    height: 36,
    marginTop: 14,
    marginBottom: 8,
  },

  // card
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 16,
    marginTop: 12,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b6b6b',
  },
  muted: {
    fontSize: 14,
    color: COLORS.muted,
  },

  // explain
  explain: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  explainHead: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },

  // bars
  bars: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 18,
    columnGap: 18,
  },
  barsPlaceholder: {
    marginTop: 12,
    height: 92,
    borderTopWidth: 2,
    borderTopColor: '#6b6b6b',
    borderStyle: 'dashed',
  },
  barCol: {
    width: (MAX_CARD_WIDTH - 16 * 2 - 18 * 2) / 3, // roughly 3 columns w/ gaps
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
  },
  bar: {
    width: 22,
    maxHeight: 100,
    borderRadius: 6,
    backgroundColor: COLORS.bar,
    alignSelf: 'center',
  },
  barValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  barLabel: {
    fontSize: 12,
    color: COLORS.muted,
  },

  // custom purple nav (pinned to true bottom)
  nav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: NAV_HEIGHT,
  },
  navGrad: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  navInner: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  navItem: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
    tintColor: '#fff',
    opacity: 0.85,
  },
});
