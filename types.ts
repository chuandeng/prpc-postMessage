export interface RPCRequest {
    jsonrpc: '2.0';
    method: string;
    params: any[];
    id: string;
    type?: string;
}

export interface RPCResponse {
    jsonrpc: '2.0';
    result?: any;
    error?: {
        code: number;
        message: string;
        data?: any;
    };
    id: string;
    type?: string;
}

export interface RPCClientOptions {
    target: Window | ServiceWorkerContainer | MessagePort;
    origin?: string;
    timeout?: number;
    typePrefix?: string;
}

export interface RPCServerOptions {
    source?: Window | ServiceWorker | MessagePort;
    origin?: string;
    typePrefix?: string;
}
