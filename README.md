# prpc-postmessage

![npm](https://img.shields.io/npm/v/prpc-postmessage)
![license](https://img.shields.io/npm/l/prpc-postmessage)
![npm downloads](https://img.shields.io/npm/dm/prpc-postmessage)
![build](https://img.shields.io/github/actions/workflow/status/chuandeng/prpc-postMessage/release.yml)

A Promise-based RPC programming experience built on **postMessage**.

`prpc-postmessage` provides a lightweight and type-safe Promise RPC layer that makes it easy to call methods across different JavaScript execution contexts, including:

- Browser windows and iframes
- Main thread ↔ Service Worker
- Figma plugin ↔ UI

---

## ✨ Features

- Promise-based RPC API
- TypeScript-first, fully typed methods
- Built on standard `postMessage`
- Works with Service Workers
- No runtime dependencies
- Suitable for Web and Figma plugin environments

---

## 📦 Installation

```bash
pnpm add prpc-postmessage

```
##🚀 Basic Usage

### Service Worker (RPC Server)
```javascript
import { RPCServer } from 'prpc-postmessage';

class WorkerService {
  async add(a: number, b: number): Promise<number> {
    return a + b;
  }

  async getVersion(): Promise<string> {
    return 'v1.0.0';
  }
}

new RPCServer(WorkerService);
```

### Web / Client (RPC Client)
```javascript
import { RPCClient } from 'prpc-postmessage';

await navigator.serviceWorker.ready;
interface PRCAPI {
  getVersion(): Promise<string>;
}

const client = new RPCClient<PRCAPI>({
  target: navigator.serviceWorker
});

const version = await client.getVersion();
console.log(version);
```
## Demo
[Service worker demo](https://github.com/chuandeng/prpc-postMessage/tree/main/examples/service-worker)
[Iframe Demo](https://github.com/chuandeng/prpc-postMessage/tree/main/examples/iframe)


## 🧩 Supported Scenarios
	•	Window ↔ Window
	•	Window ↔ iframe
	•	Main thread ↔ Service Worker
	•	Figma plugin ↔ UI

## ⚠️ Notes
	•	The Service Worker must be activated and controlling the page
	•	Always wait for navigator.serviceWorker.ready before creating the client
	•	Messages are transported via postMessage


## 📄 License

MIT © chuandeng