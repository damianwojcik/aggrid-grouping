const draft = structuredClone(optimisticNextContent);
serialize?.(draft);

if (equal(draft, optimisticNextContent)) {
  return; // nic się nie zmieniło, nie zapisuj
}