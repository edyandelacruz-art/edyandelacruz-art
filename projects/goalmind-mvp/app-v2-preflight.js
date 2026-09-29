import { api } from '@appdeploy/client';
import './materials-v2.js';

const materialsCss = document.createElement('link');
materialsCss.rel = 'stylesheet';
materialsCss.href = './materials-v2.css';
document.head.appendChild(materialsCss);

const originalPost = api.post.bind(api);
api.post = (url, data) => {
  if (url === '/api/coach/result' && data && typeof data.accuracy === 'number' && data.accuracy >= 0 && data.accuracy <= 1) {
    return originalPost(url, { ...data, accuracy: data.accuracy * 100 });
  }
  return originalPost(url, data);
};
