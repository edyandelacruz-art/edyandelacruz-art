import './materials-v2.js';
import './material-flow.js';
import './match-effects.js';

const materialsCss = document.createElement('link');
materialsCss.rel = 'stylesheet';
materialsCss.href = './materials-v2.css';
document.head.appendChild(materialsCss);

const matchEffectsCss = document.createElement('link');
matchEffectsCss.rel = 'stylesheet';
matchEffectsCss.href = './match-effects.css';
document.head.appendChild(matchEffectsCss);

// Result accuracy is normalized at the backend boundary. Keep this preflight
// focused on loading progressive-enhancement modules; do not monkey-patch the
// shared API client because that creates hidden transport behaviour.
