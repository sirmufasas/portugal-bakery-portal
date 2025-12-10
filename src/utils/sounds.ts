// src/utils/sounds.ts
export const playNotificationSound = (type: 'message' | 'order' = 'message') => {
    const volume = type === 'order' ? 0.8 : 0.4; // Louder for orders

    console.log(`🔔 Playing ${type} notification sound at volume ${volume}`);

    try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        if (type === 'order') {
            // More dramatic three-tone alert for orders
            oscillator.type = 'sine';

            // First tone (high)
            oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(1200, audioContext.currentTime + 0.15);
            // Second tone (low)
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.15);
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.3);
            // Third tone (high)
            oscillator.frequency.setValueAtTime(1200, audioContext.currentTime + 0.3);
            oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.6);

            gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
            gainNode.gain.setValueAtTime(volume, audioContext.currentTime + 0.5);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.6);
        } else {
            // Regular bell sound for messages
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.2);

            gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        }

        console.log('✅ Sound played successfully');
    } catch (error) {
        console.error('❌ Error playing sound:', error);
        console.log('🔄 Trying fallback beep...');

        // Fallback: Try to play a simple beep
        try {
            const beep = new Audio(
                'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTeF0fPTgjMGHm7A7+OZSA0PVqzn77BdGAg+ltryxnUnBSh+zPLaizsIGGS57OihUBELTKXh8bllHAU2jdXzzn0vBSV7yvHajj4IF2W98+OdTA0NUqvl8LFfGQc7ltzy0YA2Bx9tx/Dbk0QODlCq5fCzYhsINZHY8tGANQccbsHv45lIDQ5TrOXwtmMcBjiP1/PMeS0FJXnJ8tyOPggYZbvs46FOEQ1Mpe/'
            );
            beep.volume = volume;
            beep.play().catch(e => console.error('Fallback beep also failed:', e));
        } catch (e) {
            console.error('❌ All sound playback methods failed');
        }
    }
};

// Request audio permission on page load
export const requestAudioPermission = async () => {
    try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        await audioContext.resume();
        console.log('✅ Audio context ready');
        return true;
    } catch (error) {
        console.error('❌ Could not initialize audio context:', error);
        return false;
    }
};