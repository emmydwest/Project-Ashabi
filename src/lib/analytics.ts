export type AnalyticsEventName =
  | "page_viewed"
  | "search_performed"
  | "story_impression"
  | "story_opened"
  | "chapter_started"
  | "reading_progress"
  | "chapter_completed"
  | "next_chapter_opened"
  | "story_saved"
  | "story_unsaved"
  | "story_liked"
  | "story_unliked"
  | "story_followed"
  | "story_unfollowed"
  | "creator_followed"
  | "creator_unfollowed"
  | "share_clicked"
  | "content_reported";

export type AnalyticsEventPayload = {
  event: AnalyticsEventName;
  story_id?: string;
  chapter_id?: string;
  creator_id?: string;
  surface?: string;
  properties?: Record<string, string | number | boolean | undefined>;
  occurred_at?: string;
};

const EVENT_LOG_KEY = "ashabi-analytics-events-v1";

export function trackEvent(payload: AnalyticsEventPayload) {
  const stamped = {
    ...payload,
    occurred_at: payload.occurred_at ?? new Date().toISOString(),
  };

  if (typeof window === "undefined") return;

  try {
    const existing = JSON.parse(
      window.sessionStorage.getItem(EVENT_LOG_KEY) ?? "[]",
    ) as AnalyticsEventPayload[];
    const next = [...existing.slice(-49), stamped];
    window.sessionStorage.setItem(EVENT_LOG_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage errors
  }
}
