import { api, image } from '@appdeploy/client';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

let busy = false;

function getGuestId() {
  return localStorage.getItem('goalmind_guest_id') || '';
}

function ensureModal() {
  let modal = document.querySelector('#materialModal');
  if (modal) return modal;
  modal = document.createElement('div');
  modal.id = 'materialModal';
  modal.className = 'material-modal';
  modal.innerHTML = `
    <div class="material-backdrop" data-close-material></div>
    <section class="material-sheet" role="dialog" aria-modal="true" aria-labelledby="materialTitle">
      <div class="material-sheet-head">
        <div><small>SCOUT · FUENTE PRIVADA</small><h2 id="materialTitle">Añadir material</h2></div>
        <button class="material-close" data-close-material aria-label="Cerrar">×</button>
      </div>
      <p class="material-copy">El material queda asociado a tu sesión y el Coach lo combina con los repositorios que necesite.</p>
      <div class="material-tabs">
        <button class="active" data-material-tab="file">Archivo</button>
        <button data-material-tab="youtube">YouTube</button>
        <button data-material-tab="text">Texto</button>
      </div>
      <div class="material-pane active" data-material-pane="file">
        <label class="material-drop" for="coachMaterialFile">
          <span>↥</span><b>Sube tu material</b><small id="coachMaterialFileLabel">PDF, imagen, TXT, MD, CSV o JSON · máx. 12 MB</small>
        </label>
        <input id="coachMaterialFile" type="file" hidden accept=".pdf,.txt,.md,.csv,.json,text/plain,text/markdown,text/csv,application/json,image/*" />
      </div>
      <div class="material-pane" data-material-pane="youtube">
        <label><span>Enlace de YouTube</span><input id="coachYoutubeUrl" type="url" placeholder="https://youtu.be/..." /></label>
        <small>GoalMind usa el contenido público que pueda recuperar. Si no hay suficiente, pega la transcripción en Texto.</small>
      </div>
      <div class="material-pane" data-material-pane="text">
        <label><span>Apuntes o transcripción</span><textarea id="coachMaterialText" rows="7" placeholder="Pega aquí el contenido que quieres convertir en partido..."></textarea></label>
      </div>
      <div class="material-status" id="materialStatus"></div>
      <button class="material-save" id="materialSave">Añadir al Coach</button>
    </section>`;
  document.body.appendChild(modal);

  modal.querySelectorAll('[data-close-material]').forEach(el => el.addEventListener('click', closeModal));
  modal.querySelectorAll('[data-material-tab]').forEach(button => button.addEventListener('click', () => {
    modal.querySelectorAll('[data-material-tab]').forEach(x => x.classList.toggle('active', x === button));
    modal.querySelectorAll('[data-material-pane]').forEach(pane => pane.classList.toggle('active', pane.dataset.materialPane === button.dataset.materialTab));
  }));
  const fileInput = modal.querySelector('#coachMaterialFile');
  fileInput.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    modal.querySelector('#coachMaterialFileLabel').textContent = file ? `${file.name} · ${(file.size / 1024 / 1024).toFixed(1)} MB` : 'PDF, imagen, TXT, MD, CSV o JSON · máx. 12 MB';
  });
  modal.querySelector('#materialSave').addEventListener('click', saveMaterial);
  return modal;
}

function openModal() {
  const modal = ensureModal();
  modal.classList.add('show');
  document.body.classList.add('material-open');
  setStatus('');
}
function closeModal() {
  document.querySelector('#materialModal')?.classList.remove('show');
  document.body.classList.remove('material-open');
}
function activeTab() {
  return document.querySelector('#materialModal [data-material-tab].active')?.dataset.materialTab || 'file';
}
function setStatus(message, tone = '') {
  const status = document.querySelector('#materialStatus');
  if (!status) return;
  status.textContent = message;
  status.className = `material-status ${tone}`;
}

async function extractPdf(file) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
  let text = '';
  for (let pageNo = 1; pageNo <= Math.min(pdf.numPages, 40); pageNo++) {
    const page = await pdf.getPage(pageNo);
    const content = await page.getTextContent();
    text += `${content.items.map(item => ('str' in item ? item.str : '')).join(' ')}\n`;
    if (text.length >= 60000) break;
  }
  if (text.trim().length >= 160) return { sourceType: 'text', sourceName: file.name, content: text.slice(0, 60000) };

  const images = [];
  for (let pageNo = 1; pageNo <= Math.min(pdf.numPages, 4); pageNo++) {
    const page = await pdf.getPage(pageNo);
    const viewport = page.getViewport({ scale: 1.3 });
    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const context = canvas.getContext('2d');
    await page.render({ canvasContext: context, viewport }).promise;
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.82));
    if (blob) {
      const prepared = await image.resizeIfNeeded(blob);
      images.push({ data: prepared.data, mimeType: prepared.mimeType });
    }
  }
  if (!images.length) throw new Error('No pudimos leer este PDF.');
  return { sourceType: 'image', sourceName: file.name, images };
}

async function payloadFromFile(file) {
  if (!file) throw new Error('Selecciona un archivo.');
  if (file.size > 12 * 1024 * 1024) throw new Error('El archivo supera 12 MB.');
  if (file.type.startsWith('image/')) {
    const prepared = await image.resizeIfNeeded(file);
    return { sourceType: 'image', sourceName: file.name, images: [{ data: prepared.data, mimeType: prepared.mimeType }] };
  }
  if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) return extractPdf(file);
  const textLike = /\.(txt|md|csv|json)$/i.test(file.name) || ['text/plain', 'text/markdown', 'text/csv', 'application/json'].includes(file.type);
  if (!textLike) throw new Error('Usa PDF, imagen, TXT, MD, CSV o JSON.');
  const content = (await file.text()).slice(0, 60000);
  if (content.trim().length < 120) throw new Error('El archivo tiene muy poco contenido.');
  return { sourceType: 'text', sourceName: file.name, content };
}

function attachToken(token, sourceName) {
  const prompt = document.querySelector('#coachPrompt');
  if (!prompt) throw new Error('Vuelve a la pantalla del Coach.');
  const cleaned = prompt.value.replace(/\[GMATERIAL:[^\]]+\][^\n]*/g, '').trim();
  const materialLine = `[GMATERIAL:${token}] Usa como fuente prioritaria “${sourceName}”.`;
  prompt.value = `${materialLine}${cleaned ? `\n${cleaned}` : '\nQuiero estudiar este material y convertirlo en un partido adaptativo.'}`;
  prompt.dispatchEvent(new Event('input', { bubbles: true }));
}

async function saveMaterial() {
  if (busy) return;
  const modal = ensureModal();
  const button = modal.querySelector('#materialSave');
  busy = true;
  button.disabled = true;
  button.textContent = 'Procesando…';
  setStatus('Scout está leyendo y preparando la fuente…', 'loading');
  try {
    const tab = activeTab();
    let payload;
    if (tab === 'file') {
      payload = await payloadFromFile(modal.querySelector('#coachMaterialFile').files?.[0]);
    } else if (tab === 'youtube') {
      const url = modal.querySelector('#coachYoutubeUrl').value.trim();
      if (!url) throw new Error('Pega un enlace de YouTube.');
      payload = { sourceType: 'youtube', sourceName: 'Video de YouTube', url };
    } else {
      const content = modal.querySelector('#coachMaterialText').value.trim();
      if (content.length < 120) throw new Error('Pega al menos 120 caracteres.');
      payload = { sourceType: 'text', sourceName: 'Texto del estudiante', content: content.slice(0, 60000) };
    }
    const response = await api.post('/api/material/store', { guestId: getGuestId(), ...payload });
    const data = response.data || {};
    if (!data.token) throw new Error('No recibimos una referencia del material.');
    attachToken(data.token, data.sourceName || payload.sourceName || 'Mi material');
    setStatus(`✓ ${data.sourceName || 'Material'} está listo para el Coach.`, 'success');
    button.textContent = 'Material añadido';
    setTimeout(closeModal, 650);
  } catch (err) {
    console.error('GoalMind material flow failed', err);
    setStatus(err instanceof Error ? err.message : 'No pudimos procesar el material.', 'error');
  } finally {
    busy = false;
    if (button?.isConnected) {
      button.disabled = false;
      if (button.textContent !== 'Material añadido') button.textContent = 'Añadir al Coach';
    }
  }
}

document.addEventListener('click', event => {
  const target = event.target instanceof Element ? event.target.closest('#materialsBtn') : null;
  if (!target) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  openModal();
}, true);
