// app/(tabs)/Thunderbolt.tsx
import React, { useEffect, useState } from 'react';
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

// If you created this from earlier steps, keep it at project/lib/imageStore.ts
import { getImagePath, setImagePath } from '../../lib/imageStore';

const COLORS = {
  pageBg: '#000',
  text: '#fff',
  muted: '#b6b6b6',
  brand: '#5a1176',
  brandPress: '#4a0e61',
  card: '#252525',
};

const { width } = Dimensions.get('window');
const MAX_CARD_WIDTH = Math.min(480, width);

// layout constants
const NAV_HEIGHT = 92;   // custom purple bar height
const FAB_SIZE = 84;     // action bolt diameter
const FAB_GAP = 12;      // gap between FAB and the bar

export default function Thunderbolt() {
  const [imgUri, setImgUri] = useState<string | null>(null);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const existing = getImagePath();
    if (existing) setImgUri(existing);
  }, []);

  const handlePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Permission to access photos was denied');
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
    });
    if (!res.canceled && res.assets?.length) {
      const uri = res.assets[0].uri;
      setImgUri(uri);
      setImagePath(uri);
    }
  };

  const handleDetect = () => {
    // TODO: call your backend detection endpoint with imgUri
    console.log('Run Thunderbolt detection on:', imgUri);
  };

  return (
    <SafeAreaView style={styles.screen}>
      {/* CONTENT */}
      <View
        style={[
          styles.appPad,
          {
            // leave room for FAB + bar so content never hides behind them
            paddingBottom: NAV_HEIGHT + FAB_SIZE + FAB_GAP + insets.bottom,
          },
        ]}
      >
        {/* Title row */}
        <View style={styles.titleRow}>
          <Text style={styles.title}>Detect with Thunderbolt AI</Text>
          <Image
            style={styles.titleBolt}
            source={require('../../assets/icon-bolt.png')}
            resizeMode="contain"
          />
        </View>

        {/* Upload controls */}
        <Text style={styles.uploadLabel}>Upload image here:</Text>
        <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.8} onPress={handlePick}>
          <Text style={styles.primaryBtnText}>Upload</Text>
        </TouchableOpacity>

        {/* Preview card */}
        <View style={styles.previewCard}>
          <Text style={styles.previewTitle}>Preview</Text>
          {imgUri ? (
            <Image source={{ uri: imgUri }} style={styles.previewImg} resizeMode="cover" />
          ) : (
            <View style={styles.previewBox} />
          )}
        </View>
      </View>

      {/* FLOATING ACTION BOLT (sits above the bar, centered) */}
      <TouchableOpacity
        style={[
          styles.actionBolt,
          {
            position: 'absolute',
            alignSelf: 'center',
            bottom: insets.bottom + NAV_HEIGHT + FAB_GAP,
          },
        ]}
        activeOpacity={0.85}
        onPress={handleDetect}
      >
        <Image
          style={styles.actionBoltIcon}
          source={require('../../assets/icon-bolt.png')}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* PURPLE NAV pinned to the true bottom */}
      <View
        style={[
          styles.nav,
          {
            paddingBottom: insets.bottom, // respect safe area
          },
        ]}
        pointerEvents="box-none"
      >
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
            <Image
              source={require('../../assets/icon-home.png')}
              style={styles.navIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.replace('/(tabs)/Thunderbolt')}
            activeOpacity={0.8}
          >
            <Image
              source={require('../../assets/icon-bolt.png')}
              style={styles.navIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.pageBg },

  appPad: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 20,
    maxWidth: MAX_CARD_WIDTH,
    width: '100%',
    alignSelf: 'center',
  },

  // Title row
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingBottom: 8,
    marginTop: 8,
  },
  title: { fontSize: 22, fontWeight: '700', color: COLORS.text },
  titleBolt: { width: 32, height: 32 },

  // Upload
  uploadLabel: { marginTop: 18, marginBottom: 8, color: COLORS.muted, fontSize: 14 },
  primaryBtn: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.brand,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  primaryBtnText: { color: '#fff', fontSize: 14, fontWeight: '600', lineHeight: 14 },

  // Preview card
  previewCard: { backgroundColor: COLORS.card, borderRadius: 18, padding: 16, marginTop: 32 },
  previewTitle: { color: '#d3d3d3', fontSize: 14, marginBottom: 10 },
  previewBox: { width: '100%', height: 360, borderRadius: 10, backgroundColor: '#d9d9d9' },
  previewImg: { width: '100%', height: 360, borderRadius: 10 },

  // Floating action bolt
  actionBolt: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  actionBoltIcon: { width: 34, height: 34 },

  // Custom purple nav
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
  navItem: { width: 64, height: 64, alignItems: 'center', justifyContent: 'center' },
  navIcon: { width: 36, height: 36, tintColor: '#ffffff' },
});
