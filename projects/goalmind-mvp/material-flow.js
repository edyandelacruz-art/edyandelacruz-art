// Compatibility bridge for the private-material flow.
// materials-v2.js owns ingestion and GMATERIAL attachment. This module only
// advances a successfully attached material into the same Coach pipeline.

const observer = new MutationObserver(() => {
  const status = document.querySelector('#materialStatus');
  if (!status?.classList.contains('success')) return;
  if (status.dataset.coachQueued === 'true') return;
  status.dataset.coachQueued = 'true';
  window.setTimeout(() => {
    const prompt = document.querySelector('#coachPrompt');
    const send = document.querySelector('#coachSend');
    if (!prompt?.value.includes('[GMATERIAL:') || !send || send.disabled) return;
    send.click();
  }, 850);
});

observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['class'] });
