# DeepEye Multiplayer Protocol: "The Arena"

## 1. Overview

The Arena is a real-time, low-latency competitive typing environment where operatives race against each other.

- **Technology**: Firebase Realtime Database (RTDB) for sub-100ms sync.
- **Capacity**: 1v1 Duels and 4-Player Free-For-All.
- **Stakes**: XP Wagering and "Pink Slips" (Badges).

## 2. Architecture

### Database Schema (RTDB)

```json
{
  "lobbies": {
    "lobby_id_xyz": {
      "status": "WAITING" | "COUNTDOWN" | "RACING" | "FINISHED",
      "hostId": "user_123",
      "textId": "lesson_delta_9",
      "timestamp": 1790821312,
      "players": {
        "user_123": {
          "status": "READY",
          "progress": 45, // % completed
          "wpm": 82,
          "name": "Operative Zero",
          "avatar": "https://..."
        },
        "user_456": {
          "status": "JOINING",
          "progress": 0,
          "wpm": 0,
          "name": "Neon Blade",
          "avatar": "https://..."
        }
      }
    }
  }
}
```

### State Management

New Store: `useMultiplayerStore.ts`

- `lobbyId`: string | null
- `opponents`: Map<string, OpponentState>
- `matchStatus`: MatchStatus

## 3. Core Features

### Phase 1: The Lobby

- **Host**: Selects difficulty/text.
- **Join**: Via 6-digit access code.
- **Ready Check**: All players must hit "READY" to trigger 3s countdown.

### Phase 2: The Race

- **Ghost Cars**: Opponent progress represented by their caret/ghost on a progress bar.
- **Live WPM**: Real-time feed of opponent velocity.
- **Hazards** (Future): "Glitch" attacks that blur opponent screens (Mario Kart style).

### Phase 3: Debrief

- **Winner**: Calculated by server-time finish.
- **Rewards**:
  - 1st: +500 XP
  - 2nd: +250 XP
  - 3rd: +100 XP
  - 4th: -50 XP (Rank Decay)

## 4. UI Components Needed

1. **`LobbyBrowser.tsx`**: List open public lobbies.
2. **`DuelInterface.tsx`**: Split view (Your View / Opponent View).
3. **`RaceTrack.tsx`**: Visual progress bars with avatar heads.
4. **`WinnerCircle.tsx`**: Post-match animation.

## 5. Implementation Steps

1. **Infra**: Enable RTDB in Firebase Console.
2. **Core**: Create `useMultiplayerStore` in `packages/core`.
3. **UI**: Build `ArenaPage.tsx` route in `apps/desktop`.
4. **Logic**: Implement "Ghost" sync loop (throttle updates to 200ms).
