# Loket fork of chatwoot-mobile-app

Rebranded build of [chatwoot/chatwoot-mobile-app](https://github.com/chatwoot/chatwoot-mobile-app)
(MIT) for the Loket Chatwoot instance at https://loket.rezeki.chat.

## Fork deltas (re-check these when merging `upstream/main`)
- `app.config.ts`: name `Loket`, package/bundle id `chat.rezeki.loket` (permanent once
  published), scheme `loketapp`, deep-link host `loket.rezeki.chat`, no `owner`.
- Deep-link scheme `loketapp` also in `src/constants/index.ts`, `src/utils/ssoUtils.ts`,
  `src/navigation/index.tsx`.
- Default server URL `loket.rezeki.chat` in `src/store/settings/settingsSlice.ts`.
- Icons/splash/login logo: `assets/{icon,adaptive-icon,splash}.png`,
  `src/assets/{images,local}/logo.png` (Loket locket on #2563EB).

## Updating from upstream
    git fetch upstream && git merge upstream/main   # resolve conflicts in the files above

## Push notifications
Needs our own Firebase project (`google-services.json` via
`EXPO_PUBLIC_ANDROID_GOOGLE_SERVICES_FILE`) plus `FIREBASE_PROJECT_ID` +
`FIREBASE_CREDENTIALS` on the Chatwoot server. Setting those switches the server
off Chatwoot's push relay for EVERY device, so the official Chatwoot app stops
getting pushes — only flip it once all staff use this app.
