# Caddy — Golf Trainer

A mobile-first golf training app: drills, scorecards, finisher games, and progress tracking.

## Deploy this yourself (no local setup needed)

1. Upload this whole folder to a new GitHub repository.
2. Go to https://vercel.com, sign in with GitHub.
3. Click "Add New Project", select this repo, click "Deploy".
4. Done — you'll get a live URL to share.

## Notes

- All data is stored in the browser's localStorage — one device, no account sync across devices.
- The AI-generated exercise photos only work inside Claude's own artifact preview; everywhere else (including this deployment) the app automatically falls back to clean illustrated diagrams instead. This is expected, not a bug.
