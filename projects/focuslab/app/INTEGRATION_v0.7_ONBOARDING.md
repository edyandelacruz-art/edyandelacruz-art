# v0.7 onboarding integration

The local working tree already integrates `Onboarding`, `NeoHome` and the persisted `LearnerProfile` into `FocusLabApp`.

Required app-shell behavior:

```tsx
const [profile, setProfile] = useState<LearnerProfile | null>(() => loadProfile());

if (!profile) {
  return (
    <Onboarding
      onComplete={(nextProfile) => {
        saveProfile(nextProfile);
        setProfile(nextProfile);
      }}
    />
  );
}
```

The Home route renders the approved simplified experience:

```tsx
<NeoHome
  profile={profile}
  sessions={sessions}
  lastSession={lastSession}
  onNewSession={() => setView('setup')}
  onContinue={() => setView(hasResults ? 'results' : 'setup')}
  onGames={() => setView('explore')}
  onSkills={() => setView('progress')}
  onProgress={() => setView('progress')}
  onProfile={() => setView('profile')}
/>
```

## Preserve existing behavior

This visual integration must not alter:

- session persistence;
- learning accuracy;
- response latency;
- game score and error events;
- adaptive level;
- pause policy;
- baseline/dual-task condition;
- source identity and fingerprint;
- matched baseline comparisons.

## Next source migration

The remaining v0.6 application tree is being migrated under `projects/focuslab/app/` in implementation blocks. Until that migration is complete, the AppDeploy alpha snapshot plus the local v0.7 package remain the executable build used for QA.
