// components/Gauge.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

type GaugeProps = {
  percent: number;        // -1 for placeholder, else 0..100
  size?: number;          // px
  strokeWidth?: number;   // px
};

export default function Gauge({ percent, size = 132, strokeWidth = 12 }: GaugeProps) {
  const clamped = Math.max(0, Math.min(100, percent < 0 ? 0 : percent));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - clamped / 100);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        {/* base ring */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={percent < 0 ? '#3f3f3f' : '#1f1f1f'}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* progress ring */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={percent < 0 ? 'transparent' : '#e54a1f'}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          rotation={-90}
          originX={size / 2}
          originY={size / 2}
        />
      </Svg>
      <Text style={styles.value}>{percent < 0 ? '-' : `${clamped}`}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  value: {
    position: 'absolute',
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
});
