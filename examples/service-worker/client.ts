import { RPCClient } from '../../index';
import swUrl from './sw.ts?worker&url';

interface WorkerAPI {
    add(a: number, b: number): Promise<number>;
    getVersion(): Promise<string>;
}

const statusEl = document.getElementById('status')!;
const outputEl = document.getElementById('output')!;

function log(msg: string) {
    outputEl.innerHTML += `<div>${msg}</div>`;
    console.log(msg);
}

async function init() {
    if (!('serviceWorker' in navigator)) {
        statusEl.textContent = 'Status: Service Worker not supported';
        return;
    }

    try {
        const registration = await navigator.serviceWorker.register(swUrl, {
            type: 'module'
        });
        
        statusEl.textContent = 'Status: Service Worker Registered';
        log('Service Worker registered');

        // Wait for controller
        if (!navigator.serviceWorker.controller) {
            log('Waiting for controller...');
            await new Promise<void>(resolve => {
                navigator.serviceWorker.addEventListener('controllerchange', () => {
                    log('Controller changed');
                    resolve();
                });
            });
        }
        navigator.serviceWorker.addEventListener('message', (event) => {
  console.log('[Client] raw message from SW:', event.data)
})
console.log('controller:', navigator.serviceWorker.controller)
        const client = new RPCClient<WorkerAPI>({
            target: navigator.serviceWorker!,
            timeout: 5000
        }) as unknown as WorkerAPI;

        log('RPC Client initialized');

        // Test RPC calls
        log('Calling getVersion()...');
        const version = await client.getVersion();
        log(`Version: ${version}`);

        log('Calling add(5, 3)...');
        const sum = await client.add(5, 3);
        log(`Result: ${sum}`);

    } catch (err: any) {
        statusEl.textContent = 'Status: Error';
        log(`Error: ${err.message}`);
        console.error(err);
    }
}

init();
