const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');

const root = path.resolve(__dirname, '../src');
const browser = spawn(process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', '--no-first-run', '--remote-debugging-port=9337',
  '--user-data-dir=' + path.join(os.tmpdir(), 'mariage-font-check-' + Date.now()), 'about:blank',
], { windowsHide: true, stdio: 'ignore' });

async function check() {
  let pages;
  for (let attempt = 0; attempt < 30; attempt++) {
    try {
      pages = await (await fetch('http://127.0.0.1:9337/json')).json();
      break;
    } catch {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
  if (!pages) throw new Error('Headless Chrome did not start.');
  const socket = new WebSocket(pages[0].webSocketDebuggerUrl);
  await new Promise(resolve => { socket.onopen = resolve; });
  let id = 0;
  const pending = new Map();
  socket.onmessage = event => {
    const message = JSON.parse(event.data);
    if (message.id) {
      pending.get(message.id)(message);
      pending.delete(message.id);
    }
  };
  const send = (method, params) => new Promise(resolve => {
    const requestId = ++id;
    pending.set(requestId, resolve);
    socket.send(JSON.stringify({ id: requestId, method, params }));
  });
  let css = fs.readFileSync(path.join(root, 'styles/fontThemes.css'), 'utf8');
  function appendStyles(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) appendStyles(file);
      else if (file.endsWith('.css')) css += '\n' + fs.readFileSync(file, 'utf8');
    }
  }
  appendStyles(path.join(root, 'screens'));
  css = css.replace(/@import[^;]+;/g, '');
  function inspect(styles) {
    const style = document.createElement('style');
    style.textContent = styles;
    document.head.append(style);
    const templates = ['classic-template', 'signature-marble', 'royal-template', 'love-letter-template',
      'floral-butterfly-template', 'modern-minimalist-template', 'eid-template', 'birthday-template',
      'romantic-birthday-template', 'neon-birthday-template', 'happy-message-template'];
    const fonts = { playful: ['Handjet', 'Lalezar'], cheerful: ['Comfortaa', 'Alexandria'],
      sunny: ['Quicksand', 'Changa'], bloom: ['Josefin Sans', 'El Messiri'] };
    let checked = 0;
    const failures = [];
    for (const template of templates) for (const [font, pair] of Object.entries(fonts)) {
      for (const [index, dir] of ['ltr', 'rtl'].entries()) {
        const box = document.createElement('div');
        box.className = 'wil-font-theme';
        box.dataset.fontFamily = font;
        box.dir = dir;
        box.innerHTML = '<main class="' + template + '"><h1 class="font-display">Wedding</h1><h2>Title</h2>'
          + '<p class="font-amiri">Message</p><span class="font-serif romantic-recipient-name">Names</span>'
          + '<button>RSVP</button><input></main>';
        document.body.append(box);
        for (const element of box.querySelectorAll('h1,h2,p,span,button,input')) {
          checked++;
          const actual = getComputedStyle(element).fontFamily;
          if (!actual.includes(pair[index])) failures.push({ template, font, dir, actual });
        }
        box.remove();
      }
    }
    return { checked, failures };
  }
  try {
    const result = await send('Runtime.evaluate', {
      expression: '(' + inspect.toString() + ')(' + JSON.stringify(css) + ')', returnByValue: true,
    });
    if (result.result.exceptionDetails) throw new Error(JSON.stringify(result.result.exceptionDetails));
    const report = result.result.result.value;
    console.log(JSON.stringify(report, null, 2));
    if (report.failures.length) process.exitCode = 1;
  } finally {
    socket.close();
  }
}
check().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => browser.kill());
