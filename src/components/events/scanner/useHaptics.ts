/**
 * Haptic feedback utilities for One-Tap Scanner
 * Provides distinct tactile feedback patterns for different actions
 */

export const haptics = {
  // Success scan - double pulse
  scanSuccess: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 30, 100]);
    }
  },
  
  // Hot lead - triple strong pulse (excitement)
  hotLead: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100, 50, 100]);
    }
  },
  
  // Warm lead - double medium pulse
  warmLead: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([80, 40, 80]);
    }
  },
  
  // Cold lead - single light pulse
  coldLead: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([40]);
    }
  },
  
  // Error - long-short-long
  error: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
  },
  
  // Button tap - subtle
  tap: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([10]);
    }
  },
  
  // Save success - satisfying confirmation
  save: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([30, 50, 80]);
    }
  }
};

export type LeadTemperature = 'hot' | 'warm' | 'cold';

export const temperatureHaptic = (temp: LeadTemperature) => {
  switch (temp) {
    case 'hot':
      haptics.hotLead();
      break;
    case 'warm':
      haptics.warmLead();
      break;
    case 'cold':
      haptics.coldLead();
      break;
  }
};
