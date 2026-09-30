import { api } from '@appdeploy/client';

const GUEST_KEY = 'goalmind_guest_id';

function guestId() {
  return localStorage.getItem(GUEST_KEY) || '';
}

function esc(value) {
  return String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

function ensureDialog() {
  let dialog = document.querySelector('#materialDialog');
  if (dialog) return dialog;
  dialog = document.createElement('dialog');
  dialog.id = 'materialDialog';
  dialog.className = 'material-dialog';
  dialog.innerHTML = `
    <form method="dialog" class="material-sheet" id="materialForm">
      <header><div><small>MIS MATERIALES</small><h2>Entrena con tu propia fuente</h2><p>El material queda asociado a esta sesión y entra al mismo circuito Scout → Coach → Referee.</p></div><button class="material-close" value="cancel" aria-label="Cerrar">×</button></header>
      <div class="material-tabs" role="tablist">
        <button type="button" class="active" data-material-tab="text">Texto</button>
        <button type="button" data-material-tab="youtube">YouTube</button>
        <button type="button" data-material-tab="image">Imagen</button>
      </div>
      <section data-material-panel="text" class="material-panel active">
        <label>Nombre de la fuente<input id="materialName" maxlength="120" placeholder="Ej. Guía de función cuadrática" /></label>
        <label>Contenido<textarea id="materialText" rows="9" placeholder="Pega apuntes, una guía, transcripción o contenido académico (mínimo 120 caracteres)."></textarea></label>
      </section>
      <section data-material-panel="youtube" class="material-panel">
        <label>Enlace de YouTube<input id="materialUrl" type="url" placeholder="https://www.youtube.com/watch?v=…" /></label>
        <p class="material-help">GoalMind intentará recuperar únicamente contenido público disponible. Si el video no expone suficiente texto, pega la transcripción en la pestaña Texto.</p>
      </section>
      <section data-material-panel="image" class="material-panel">
        <label class="material-drop">Imagen académica<input id="materialImage" type="file" accept="image/png,image/jpeg,image/webp" /><span>PNG, JPG o WebP · hasta 5 MB</span></label>
        <p class="material-help">Scout extrae el contenido visible sin inventar información y lo conserva como evidencia privada de la sesión.</p>
      </section>
      <div id="materialStatus" class="material-status" aria-live="polite"></div>
      <footer><button type="button" class="material-secondary" id="materialCancel">Cancelar</button><button type="button" class="material-primary" id="materialSubmit">Usar con Coach →</button></footer>
    </form>`;
  document.body.appendChild(dialog);
  wireDialog(dialog);
  return dialog;
}

let activeType = 'text';
function wireDialog(dialog) {
  dialog.querySelectorAll('[data-material-tab]').forEach(button => button.addEventListener('click', () => {
    activeType = button.dataset.materialTab;
    dialog.querySelectorAll('[data-material-tab]').forEach(x => x.classList.toggle('active', x === button));
    dialog.querySelectorAll('[data-material-panel]').forEach(panel => panel.classList.toggle('active', panel.dataset.materialPanel === activeType));
    setStatus('');
  }));
  dialog.querySelector('#materialCancel').addEventListener('click', () => dialog.close());
  dialog.querySelector('#materialSubmit').addEventListener('click', submitMaterial);
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
}

function setStatus(message, kind = '') {
  const status = document.querySelector('#materialStatus');
  if (!status) return;
  status.textContent = message;
  status.dataset.kind = kind;
}

function readImage(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) return reject(new Error('Selecciona una imagen válida.'));
    if (file.size > 5 * 1024 * 1024) return reject(new Error('La imagen supera 5 MB.'));
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('No pude leer la imagen.'));
    reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
    reader.readAsDataURL(file);
  });
}

async function submitMaterial() {
  const dialog = document.querySelector('#materialDialog');
  const submit = dialog.querySelector('#materialSubmit');
  const id = guestId();
  if (!id) return setStatus('No pude identificar la sesión. Recarga GoalMind e inténtalo otra vez.', 'error');
  submit.disabled = true;
  submit.textContent = 'Procesando…';
  setStatus('Scout está preparando tu evidencia privada…');
  try {
    let payload = { guestId: id, sourceType: activeType, sourceName: dialog.querySelector('#materialName')?.value?.trim() || 'Mi material' };
    if (activeType === 'text') {
      const content = dialog.querySelector('#materialText').value.trim();
      if (content.length < 120) throw new Error('Pega al menos 120 caracteres para crear un entrenamiento fiable.');
      payload.content = content;
    } else if (activeType === 'youtube') {
      const url = dialog.querySelector('#materialUrl').value.trim();
      if (!/^https:\/\/(www\.|m\.)?(youtube\.com|youtu\.be)\//i.test(url)) throw new Error('Usa un enlace válido de YouTube.');
      payload.url = url;
    } else {
      const file = dialog.querySelector('#materialImage').files?.[0];
      const data = await readImage(file);
      payload.sourceName = file?.name || 'Imagen académica';
      payload.images = [{ data, mimeType: file.type }];
    }
    const response = await api.post('/api/material/store', payload);
    const data = response.data || {};
    if (!data.token) throw new Error('El material se procesó pero no devolvió una referencia válida.');
    const prompt = document.querySelector('#coachPrompt');
    if (!prompt) throw new Error('No encontré el Coach en esta pantalla.');
    const humanRequest = activeType === 'text' ? 'Crea un partido usando principalmente este material. Identifica el tema y adapta la dificultad a mi nivel.' : activeType === 'youtube' ? 'Crea un partido basado principalmente en este video y usa sus contenidos verificables.' : 'Crea un partido basado principalmente en esta imagen académica y en la evidencia extraída.';
    prompt.value = `${humanRequest} [GMATERIAL:${data.token}]`;
    prompt.dataset.materialToken = data.token;
    setStatus(`Fuente lista: ${data.sourceName || payload.sourceName}. Enviando al Coach…`, 'success');
    setTimeout(() => {
      dialog.close();
      document.querySelector('#coachSend')?.click();
    }, 350);
  } catch (error) {
    console.error('GoalMind material flow failed', error);
    setStatus(error?.message || 'No pude procesar el material.', 'error');
  } finally {
    submit.disabled = false;
    submit.textContent = 'Usar con Coach →';
  }
}

document.addEventListener('click', event => {
  const button = event.target.closest('#materialsBtn');
  if (!button) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  const dialog = ensureDialog();
  setStatus('');
  dialog.showModal();
}, true);
