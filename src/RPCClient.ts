import { RPCClientOptions, RPCRequest, RPCResponse } from '../types';

export class RPCClient<T = any> {
    // @ts-ignore
    private _type?: T;
    private target: Window | ServiceWorkerContainer | MessagePort;
    private origin: string;
    private timeout: number;
    private typePrefix: string;
    private pendingRequests = new Map<string, { resolve: Function, reject: Function, timer: any }>();
    private isServiceWorker: boolean = false;

    constructor(options: RPCClientOptions) {
        this.target = options.target;
        this.origin = options.origin || '*';
        this.timeout = options.timeout || 10000;
        this.typePrefix = options.typePrefix || 'prc';
        this.isServiceWorker = this.target instanceof ServiceWorkerContainer;

        this.setupListener();

        return new Proxy(this, {
            get: (target, prop: string | symbol) => {
                if (prop in target) {
                    return (target as any)[prop];
                }
                if (typeof prop === 'string' && prop !== 'then') {
                    return (...args: any[]) => {
                        return this.request(prop, args);
                    };
                }
                return undefined;
            }
        }) as any;
    }

    private setupListener() {
        const listener : EventListener = (event: Event)  => {
             if ((event.type !== 'message')) {
                return;
            }
            const data = (event as MessageEvent).data as RPCResponse;
            if (!data || data.jsonrpc !== '2.0' || !data.id) {
                return;
            }
            
            const expectedType = `${this.typePrefix}-response`;
            if (data.type && data.type !== expectedType) {
                return;
            }
            
            if (this.pendingRequests.has(data.id)) {
                const { resolve, reject, timer } = this.pendingRequests.get(data.id)!;
                clearTimeout(timer);
                this.pendingRequests.delete(data.id);
                
                if (data.error) {
                    reject(new Error(data.error.message));
                } else {
                    resolve(data.result);
                }
            }
        };
        console.log('Client listener:', (this.target as Window).name)
        if(this.isServiceWorker){
            this.target.addEventListener('message', listener);
        }else {
            window.addEventListener('message', listener);
        }
    }

    private request(method: string, params: any[]): Promise<any> {
        const id = Math.random().toString(36).substr(2, 9);
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                if (this.pendingRequests.has(id)) {
                    this.pendingRequests.delete(id);
                    reject(new Error(`Request timeout for method: ${method}`));
                }
            }, this.timeout);

            this.pendingRequests.set(id, { resolve, reject, timer });

            const payload: RPCRequest = {
                jsonrpc: '2.0',
                method,
                params,
                id,
                type: `${this.typePrefix}-request`
            };
            if (this.isServiceWorker) {
                console.log('Sending request to Service Worker:', payload);
                (this.target as ServiceWorkerContainer).controller?.postMessage(payload);
            }else if (typeof window !== 'undefined' && this.target instanceof Window) {
                console.log('Sending request to Window:',this.target.name, payload);
                 this.target.postMessage(payload, this.origin);
            } else {
                 (this.target as any).postMessage(payload);
            }
        });
    }
}
