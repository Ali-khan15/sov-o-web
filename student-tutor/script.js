(() => {
  'use strict';
  const dialog = document.getElementById('download-dialog');
  let lastFocused = null;

  document.querySelectorAll('[data-download]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      lastFocused = link;
      if (!dialog.open) {
        if (typeof dialog.showModal === 'function') dialog.showModal();
        else dialog.setAttribute('open', '');
      }
      document.body.classList.add('modal-open');
    });
  });
  dialog.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    if (lastFocused) lastFocused.focus({ preventScroll: true });
  });
  document.getElementById('year').textContent = String(new Date().getFullYear());
})();

(() => {
  'use strict';
  const root = document.querySelector('.app-walkthrough');
  if (!root) return;
  const panels = Array.from(root.querySelectorAll('.walkthrough-panel'));
  const previous = root.querySelector('.walkthrough-previous');
  const next = root.querySelector('.walkthrough-next');
  const progress = root.querySelector('.walkthrough-progress');
  if (!panels.length || !previous || !next || !progress) return;
  let current = 0;

  function selectStep(index) {
    current = Math.max(0, Math.min(panels.length - 1, index));
    panels.forEach((panel, i) => { panel.hidden = i !== current; });
    previous.disabled = current === 0;
    next.disabled = current === panels.length - 1;
    progress.textContent = `Step ${current + 1} of ${panels.length}`;
  }

  previous.addEventListener('click', () => selectStep(current - 1));
  next.addEventListener('click', () => selectStep(current + 1));
  selectStep(0);
})();
