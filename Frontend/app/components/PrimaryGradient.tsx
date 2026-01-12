import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';

function PrimaryGradient({ children, className, optColors }: { children?: React.ReactNode, className?: string, optColors?: string[] }) {
  return (
    <LinearGradient
      colors={optColors ? [optColors[0], optColors[1]] : ["#2BAA8C", "#2D8686"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className={`rounded-2xl overflow-hidden ${className}`}
    >
      {children}
    </LinearGradient>
  );
}
export default PrimaryGradient