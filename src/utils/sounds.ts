// src/utils/sounds.ts

let audioContext: AudioContext | null = null;
let unlocked = false;
let forcePlayQueue: Array<() => void> = [];

/**
 * Initialize AudioContext
 */
export const initAudioContext = () => {
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      console.log("🔊 AudioContext created, state:", audioContext.state);
    } catch (error) {
      console.error("❌ Failed to create AudioContext:", error);
      return false;
    }
  }
  return true;
};

/**
 * Try to unlock audio
 */
export const forceUnlockAudio = async (): Promise<boolean> => {
  if (unlocked) return true;

  if (!audioContext) initAudioContext();
  if (!audioContext) return false;

  try {
    if (audioContext.state === "suspended") {
      await audioContext.resume();
      console.log("🔓 AudioContext resumed");
    }

    if (audioContext.state === "running") {
      unlocked = true;
      console.log("✅ Audio UNLOCKED");

      while (forcePlayQueue.length > 0) {
        const play = forcePlayQueue.shift();
        if (play) play();
      }

      return true;
    }
  } catch (error) {
    console.error("❌ Failed to unlock audio:", error);
  }

  return false;
};

/**
 * Request permissions
 */
export const requestAllPermissions = async () => {
  console.log("🔔 Requesting permissions...");

  initAudioContext();

  if ("Notification" in window && Notification.permission === "default") {
    try {
      await Notification.requestPermission();
    } catch (error) {
      console.error("❌ Failed requesting notification permission:", error);
    }
  }

  await forceUnlockAudio();

  return {
    audio: unlocked,
    notifications: Notification.permission
  };
};

/**
 * Play 10-second LOOPING sound
 */
export const playNotificationSound = (type: "message" | "order" = "message") => {
  console.log(`🔔 playNotificationSound called: ${type}`);

  const actualPlay = () => {
    if (!audioContext) {
      initAudioContext();
      if (!audioContext) return;
    }

    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    try {
      const duration = 10; // 🔥 10 seconds
      const volume = type === "order" ? 1.0 : 0.7;
      const interval = type === "order" ? 800 : 1500;
      const endTime = audioContext.currentTime + duration;

      const loop = () => {
        if (!audioContext || audioContext.currentTime >= endTime) return;

        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();

        osc.connect(gain);
        gain.connect(audioContext.destination);

        gain.gain.setValueAtTime(volume, audioContext.currentTime);

        if (type === "order") {
          osc.type = "square";
          osc.frequency.setValueAtTime(900, audioContext.currentTime);
          osc.frequency.setValueAtTime(1300, audioContext.currentTime + 0.2);
          gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);

          osc.start();
          osc.stop(audioContext.currentTime + 0.4);
        } else {
          osc.type = "sine";
          osc.frequency.setValueAtTime(800, audioContext.currentTime);
          osc.frequency.exponentialRampToValueAtTime(350, audioContext.currentTime + 0.4);
          gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

          osc.start();
          osc.stop(audioContext.currentTime + 0.5);
        }

        setTimeout(loop, interval);
      };

      loop();
      console.log("🔁 10-SECOND SOUND LOOP STARTED");

    } catch (error) {
      console.error("❌ Error playing 10-second sound:", error);
    }
  };

  if (unlocked && audioContext?.state === "running") {
    actualPlay();
  } else {
    console.warn("⚠️ Audio locked – queueing sound");
    forcePlayQueue.push(actualPlay);
    forceUnlockAudio();
  }
};

/**
 * Show browser notification
 */
export const showNotification = (
  title: string,
  body: string,
  type: "order" | "message" = "message"
) => {
  if (!("Notification" in window)) return;

  if (Notification.permission === "granted") {
    try {
      const notification = new Notification(title, {
        body,
        icon: type === "order" ? "📦" : "💬",
        badge: type === "order" ? "📦" : "💬",
        tag: `${type}-${Date.now()}`,
        requireInteraction: type === "order",
        silent: false
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } catch (error) {
      console.error("❌ Failed to show notification:", error);
    }
  } else if (Notification.permission === "default") {
    Notification.requestPermission().then(p => {
      if (p === "granted") showNotification(title, body, type);
    });
  }
};

/**
 * Combined notification
 */
export const notifyAdmin = (
  type: "order" | "message",
  title: string,
  body: string
) => {
  playNotificationSound(type);
  showNotification(title, body, type);

  if ("vibrate" in navigator) {
    if (type === "order") {
      navigator.vibrate([200, 100, 200, 100, 200]);
    } else {
      navigator.vibrate(150);
    }
  }
};
