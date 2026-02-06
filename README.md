This script is a Discord “Quest Spoofer” that automatically completes eligible Discord Quests for the current user by faking the required activity instead of actually playing/watching/streaming.

In detail, it:

* Hooks into Discord’s internal webpack modules (RunningGameStore, QuestsStore, FluxDispatcher, etc.) and the internal HTTP API client.
* Scans all quests in `QuestsStore` and filters for active, uncompleted quests whose tasks are supported (`WATCH_VIDEO`, `WATCH_VIDEO_ON_MOBILE`, `PLAY_ON_DESKTOP`, `STREAM_ON_DESKTOP`, `PLAY_ACTIVITY`).
* For video quests, it repeatedly calls the internal `/quests/{id}/video-progress` endpoint and simulates the timestamp increasing until the quest is marked as complete.
* For “play on desktop” quests, it injects a fake running game into `RunningGameStore` and lets Discord think the required app is running until the quest completes.
* For “stream on desktop” quests, it temporarily overrides `getStreamerActiveStreamMetadata` so Discord believes you’re streaming the target application.
* For “play activity” quests, it fakes quest heartbeats (`/quests/{id}/heartbeat`) tied to a valid voice channel until the required time is reached.
* Processes all matching quests one after another and logs every important step (module detection, picked tasks, progress, errors, and completion) with a `[QuestSpoofer]` prefix in the console.

It is meant to be pasted into the Discord client console (preferably desktop, not browser) and relies on internal, undocumented Discord structures, so it may break whenever Discord updates or changes its webpack layout.
