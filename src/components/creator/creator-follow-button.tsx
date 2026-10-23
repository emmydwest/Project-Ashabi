"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/icons";
import { loadReaderState, toggleFollowCreator } from "@/lib/reader-state";
import { trackEvent } from "@/lib/analytics";

export function CreatorFollowButton({
  creatorId,
  username,
}: {
  creatorId: string;
  username: string;
}) {
  const [followed, setFollowed] = useState(() =>
    loadReaderState().followedCreators.includes(username),
  );

  useEffect(() => {
    const sync = () => {
      const state = loadReaderState();
      setFollowed(state.followedCreators.includes(username));
    };
    window.addEventListener("ashabi-reader-state-changed", sync);
    return () =>
      window.removeEventListener("ashabi-reader-state-changed", sync);
  }, [username]);

  return (
    <button
      type="button"
      onClick={() => {
        const active = toggleFollowCreator(username);
        setFollowed(active);
        trackEvent({
          event: active ? "creator_followed" : "creator_unfollowed",
          creator_id: creatorId,
          surface: "creator_profile",
        });
      }}
      aria-pressed={followed}
      className={"button " + (followed ? "primary" : "secondary")}
    >
      <Icon name={followed ? "check" : "users"} size={18} />
      <span>{followed ? "Following Creator" : "Follow Creator"}</span>
    </button>
  );
}
