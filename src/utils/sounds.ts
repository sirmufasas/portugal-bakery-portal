// src/utils/sounds.ts

let audioContext: AudioContext | null = null;
let unlocked = false;
let forcePlayQueue: Array<() => void> = [];

/**
 * Initialize AudioContext - this will be called repeatedly until unlocked
 */
export const initAudioContext = () => {
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      console.log('🔊 AudioContext created, state:', audioContext.state);
    } catch (error) {
      console.error('❌ Failed to create AudioContext:', error);
      return false;
    }
  }
  return true;
};

/**
 * Aggressively unlock audio on ANY user interaction
 */
export const forceUnlockAudio = async (): Promise<boolean> => {
  if (unlocked) return true;
  
  if (!audioContext) {
    initAudioContext();
  }
  
  if (!audioContext) return false;

  try {
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
      console.log('🔓 AudioContext resumed, state:', audioContext.state);
    }
    
    if (audioContext.state === 'running') {
      unlocked = true;
      console.log('✅ Audio UNLOCKED - notifications will play');
      
      // Play any queued sounds
      while (forcePlayQueue.length > 0) {
        const play = forcePlayQueue.shift();
        if (play) {
          console.log('🔊 Playing queued sound...');
          play();
        }
      }
      
      return true;
    }
  } catch (error) {
    console.error('❌ Failed to unlock audio:', error);
  }
  
  return false;
};

/**
 * Request both audio and notification permissions
 */
export const requestAllPermissions = async () => {
  console.log('🔔 Requesting permissions...');
  
  // Initialize audio
  initAudioContext();
  
  // Request notification permission
  if ('Notification' in window && Notification.permission === 'default') {
    try {
      const permission = await Notification.requestPermission();
      console.log('🔔 Notification permission:', permission);
    } catch (error) {
      console.error('❌ Failed to request notification permission:', error);
    }
  }
  
  // Try to unlock audio
  await forceUnlockAudio();
  
  return {
    audio: unlocked,
    notifications: 'Notification' in window ? Notification.permission : 'denied'
  };
};

/**
 * Play notification sound - WILL PLAY EVEN WITHOUT USER GESTURE
 * If audio is locked, it will queue and play on next user interaction
 */
export const playNotificationSound = (type: 'message' | 'order' = 'message') => {
  console.log(`🔔 playNotificationSound called: ${type}`);
  
  const actualPlay = () => {
    if (!audioContext) {
      console.warn('⚠️ No AudioContext');
      initAudioContext();
      if (!audioContext) return;
    }

    try {
      // Force resume if suspended
      if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
          console.log('🔓 AudioContext resumed during play');
        });
      }

      const volume = type === 'order' ? 1.0 : 0.6; // MAX VOLUME for orders
      console.log(`🔊 Creating sound: ${type} at volume ${volume}`);

      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();

      osc.connect(gain);
      gain.connect(audioContext.destination);

      if (type === 'order') {
        // LOUD three-tone alert for orders
        osc.type = 'square'; // More aggressive waveform
        const now = audioContext.currentTime;
        
        // Three ascending beeps
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.setValueAtTime(1000, now + 0.15);
        osc.frequency.setValueAtTime(1200, now + 0.3);
        
        gain.gain.setValueAtTime(volume, now);
        gain.gain.setValueAtTime(volume, now + 0.45);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

        osc.start(now);
        osc.stop(now + 0.6);
        
        console.log('✅ ORDER SOUND PLAYING');
      } else {
        // Message beep
        osc.type = 'sine';
        const now = audioContext.currentTime;
        
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        osc.start(now);
        osc.stop(now + 0.2);
        
        console.log('✅ MESSAGE SOUND PLAYING');
      }
    } catch (error) {
      console.error('❌ Error playing sound:', error);
    }
  };

  // If audio is unlocked, play immediately
  if (unlocked && audioContext?.state === 'running') {
    actualPlay();
  } else {
    // Queue it and try to unlock
    console.warn('⚠️ Audio locked - queueing sound and attempting unlock');
    forcePlayQueue.push(actualPlay);
    forceUnlockAudio().then(success => {
      if (success) {
        console.log('✅ Audio unlocked via forced attempt');
      }
    });
  }
};

/**
 * Show browser notification
 */
export const showNotification = (title: string, body: string, type: 'order' | 'message' = 'message') => {
  console.log('🔔 showNotification called:', title);
  
  if (!('Notification' in window)) {
    console.warn('⚠️ Notifications not supported');
    return;
  }

  if (Notification.permission === 'granted') {
    try {
      const notification = new Notification(title, {
        body,
        icon: type === 'order' ? '📦' : '💬',
        badge: type === 'order' ? '📦' : '💬',
        tag: `${type}-${Date.now()}`,
        requireInteraction: type === 'order', // Order notifications stay until clicked
        silent: false // Not silent - let system sound play too
      });
      
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
      
      console.log('✅ Notification shown');
    } catch (error) {
      console.error('❌ Failed to show notification:', error);
    }
  } else if (Notification.permission === 'default') {
    console.warn('⚠️ Notification permission not granted yet');
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        showNotification(title, body, type);
      }
    });
  }
};

/**
 * Combined notification - plays sound AND shows browser notification
 */
export const notifyAdmin = (type: 'order' | 'message', title: string, body: string) => {
  console.log(`📢 NOTIFY ADMIN: ${type} - ${title}`);
  
  // Play sound
  playNotificationSound(type);
  
  // Show browser notification
  showNotification(title, body, type);
  
  // Vibrate if supported (mobile)
  if ('vibrate' in navigator) {
    if (type === 'order') {
      navigator.vibrate([200, 100, 200, 100, 200]); // Long vibration pattern
    } else {
      navigator.vibrate(200); // Short vibration
    }
  }
};