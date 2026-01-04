import { RPCRequest, RPCResponse, RPCServerOptions } from '../types';

export class RPCServer {
    private service: any;
    private source?: Window | ServiceWorker | MessagePort;
    private origin: string = '*';
    private typePrefix: string = 'prc';

    constructor(service: any, options: RPCServerOptions = {}) {
        this.service = typeof service === 'function' ? new service() : service;
        this.source = options.source;
        this.origin = options.origin || '*';
        this.typePrefix = options.typePrefix || 'prc';
        this.setupListener();
    }

    private setupListener() {
        const listener = async (event: MessageEvent) => {
            const data = event.data as RPCRequest;
            console.log('Received message:', data);
            if (!data || data.jsonrpc !== '2.0' || !data.method) {
                return;
            }

            const expectedType = `${this.typePrefix}-request`;
            if (data.type && data.type !== expectedType) {
                return;
            }

            // Check if method exists on service
            if (typeof this.service[data.method] === 'function') {
                let result;
                let error;

                try {
                    result = await this.service[data.method](...data.params);
                    console.log(`[RPCServer] Method ${data.method} executed successfully`);
                } catch (e: any) {
                    error = {
                        code: -32603,
                        message: e.message || 'Internal error'
                    };
                }

                const response: RPCResponse = {
                    jsonrpc: '2.0',
                    id: data.id,
                    result,
                    error,
                    type: `${this.typePrefix}-response`
                };

                const replyTarget: any | undefined = this.source ?? (event.source as any);
                if (replyTarget) {
                    const target = replyTarget;
                    let isWindow = false;
                    try {
                        // 'closed' is a safe property to check on WindowProxy
                        isWindow = 'closed' in target;
                    } catch (e) {
                        // If it throws, it's likely a cross-origin Window
                        isWindow = true;
                    }

                    if (isWindow) {
                        target.postMessage(response, this.origin);
                    } else {
                        target.postMessage(response);
                    }
                }
            }
        };
        if (typeof window !== 'undefined') {
            window.addEventListener('message', listener);
            console.log('[RPCServer] setupListener for window', window.name);

        } else if (typeof self !== 'undefined') {
            self.addEventListener('message', listener);
            console.log('[RPCServer] setupListener for self', self);
        }
    }
}
