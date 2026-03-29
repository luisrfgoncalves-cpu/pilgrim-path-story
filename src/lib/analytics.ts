/**
 * Lightweight local analytics — no external services needed.
 * Tracks page views, session time, and scene completion rates.
 * Data stays on-device (localStorage) and can be exported.
 */

const ANALYTICS_KEY = 'peregrino-analytics';

export interface AnalyticsData {
  sessions: number;
  totalTimeSeconds: number;
  pageViews: Record<string, number>;
  sceneCompletions: Record<string, number>;
  sceneAbandons: Record<string, number>;
  lastSession: string;
  firstSession: string;
}

function getAnalytics(): AnalyticsData {
  try {
    const raw = localStorage.getItem(ANALYTICS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    sessions: 0,
    totalTimeSeconds: 0,
    pageViews: {},
    sceneCompletions: {},
    sceneAbandons: {},
    lastSession: new Date().toISOString(),
    firstSession: new Date().toISOString(),
  };
}

function saveAnalytics(data: AnalyticsData) {
  try {
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(data));
  } catch {}
}

/** Track a page view */
export function trackPageView(page: string) {
  const data = getAnalytics();
  data.pageViews[page] = (data.pageViews[page] || 0) + 1;
  data.lastSession = new Date().toISOString();
  saveAnalytics(data);
}

/** Track scene completion */
export function trackSceneComplete(sceneId: string) {
  const data = getAnalytics();
  data.sceneCompletions[sceneId] = (data.sceneCompletions[sceneId] || 0) + 1;
  saveAnalytics(data);
}

/** Track scene abandon (user left without choosing) */
export function trackSceneAbandon(sceneId: string) {
  const data = getAnalytics();
  data.sceneAbandons[sceneId] = (data.sceneAbandons[sceneId] || 0) + 1;
  saveAnalytics(data);
}

/** Start a new session — call on app mount */
export function startSession() {
  const data = getAnalytics();
  data.sessions += 1;
  data.lastSession = new Date().toISOString();
  if (!data.firstSession) data.firstSession = data.lastSession;
  saveAnalytics(data);

  // Track session duration
  const startTime = Date.now();
  const updateDuration = () => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const d = getAnalytics();
    d.totalTimeSeconds += elapsed;
    saveAnalytics(d);
  };

  window.addEventListener('beforeunload', updateDuration, { once: true });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') updateDuration();
  }, { once: true });
}

/** Get analytics summary for display */
export function getAnalyticsSummary(): {
  sessions: number;
  totalHours: number;
  topScenes: { id: string; views: number }[];
  abandonedScenes: { id: string; count: number }[];
} {
  const data = getAnalytics();
  const topScenes = Object.entries(data.sceneCompletions)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([id, views]) => ({ id, views }));
  const abandonedScenes = Object.entries(data.sceneAbandons)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([id, count]) => ({ id, count }));

  return {
    sessions: data.sessions,
    totalHours: Math.round((data.totalTimeSeconds / 3600) * 10) / 10,
    topScenes,
    abandonedScenes,
  };
}

/** Export analytics as JSON */
export function exportAnalytics(): AnalyticsData {
  return getAnalytics();
}
