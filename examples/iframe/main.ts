import { RPCServer } from '../../index';
window.name = 'Main Window'
class MyService {
    getName() {
        console.log('MyService.getName called in Main');
        return Promise.resolve('Hello from Main Window!');
    }
}

// Start Server
new RPCServer(MyService);
console.log('RPC Server started in Main Window');
