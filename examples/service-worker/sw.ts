/// <reference lib="webworker" />
import { RPCServer } from '../../index';

declare const self: ServiceWorkerGlobalScope;

class WorkerService {
    async add(a: number, b: number): Promise<number> {
        console.log(`[ServiceWorker] Calculating ${a} + ${b}`);
        return a + b;
    }

    async getVersion(): Promise<string> {
        console.log('[ServiceWorker] Getting version');
        return 'v1.0.0';
    }
}

// Initialize RPC Server
const server = new RPCServer(WorkerService);
console.log('[ServiceWorker] RPC Server started');

self.addEventListener('install', (event) => {
    console.log('[ServiceWorker] Installed');
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
    console.log('[ServiceWorker] Activated');
    event.waitUntil(self.clients.claim());
});
