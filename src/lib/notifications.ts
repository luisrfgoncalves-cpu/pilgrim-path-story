/**
 * PWA Local Notifications — works without a server.
 * Requests permission and schedules reminder notifications.
 */

const NOTIFICATION_KEY = 'peregrino-notifications';

interface NotificationPrefs {
  enabled: boolean;
  lastReminder: string;
  permissionGranted: boolean;
}

function getPrefs(): NotificationPrefs {
  try {
    const raw = localStorage.getItem(NOTIFICATION_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { enabled: false, lastReminder: '', permissionGranted: false };
}

function savePrefs(prefs: NotificationPrefs) {
  localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(prefs));
}

/** Request notification permission */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  
  if (Notification.permission === 'granted') {
    const prefs = getPrefs();
    prefs.permissionGranted = true;
    prefs.enabled = true;
    savePrefs(prefs);
    return true;
  }

  if (Notification.permission === 'denied') return false;

  const result = await Notification.requestPermission();
  const granted = result === 'granted';
  const prefs = getPrefs();
  prefs.permissionGranted = granted;
  prefs.enabled = granted;
  savePrefs(prefs);
  return granted;
}

/** Check if notifications are enabled */
export function isNotificationsEnabled(): boolean {
  return getPrefs().enabled && 'Notification' in window && Notification.permission === 'granted';
}

/** Toggle notifications on/off */
export function toggleNotifications(enabled: boolean) {
  const prefs = getPrefs();
  prefs.enabled = enabled;
  savePrefs(prefs);
}

/** Show a local notification immediately */
export function showNotification(title: string, body: string, icon?: string) {
  if (!isNotificationsEnabled()) return;
  
  try {
    new Notification(title, {
      body,
      icon: icon || '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      tag: 'peregrino-reminder',
      silent: false,
    });
  } catch {
    // Fallback for some mobile browsers
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SHOW_NOTIFICATION',
        title,
        body,
        icon: icon || '/icons/icon-192.png',
      });
    }
  }
}

/** Schedule a daily reminder check — call on app start */
export function scheduleReminder() {
  if (!isNotificationsEnabled()) return;

  const prefs = getPrefs();
  const lastDate = prefs.lastReminder ? new Date(prefs.lastReminder).toDateString() : '';
  const today = new Date().toDateString();

  // Already reminded today
  if (lastDate === today) return;

  // Check if user hasn't played in 24h+
  const lastSession = localStorage.getItem('peregrino-analytics');
  if (lastSession) {
    try {
      const analytics = JSON.parse(lastSession);
      const lastTime = new Date(analytics.lastSession).getTime();
      const hoursSince = (Date.now() - lastTime) / (1000 * 60 * 60);
      
      if (hoursSince >= 24) {
        // Show reminder after a short delay
        setTimeout(() => {
          showNotification(
            'O Peregrino te espera! 🚶‍♂️',
            'Sua jornada continua. Volte e descubra o que aguarda no próximo capítulo.',
          );
          prefs.lastReminder = new Date().toISOString();
          savePrefs(prefs);
        }, 5000);
      }
    } catch {}
  }
}
