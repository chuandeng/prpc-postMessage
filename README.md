# prpc-postMessage
A Promise-based RPC programming experience built on postMessage, making it easy to interact across multiple web windows. It can be used as the communication layer between the plugin and UI in Figma plugins.


```javascript
import {RPCClient, RPCServer} from 'prpc-postmessage';

interface PRCAPI {
  getName(): Promise<string>;
}

// in iframe

const client = new RPCClient(PRCAPI, {
window: window.parent,
origin: '*',
});

class MyService implements PRCAPI {
    getName() {
        return Promise.resolve('Motiz')
    }
}
const server = new RPCServer(MyService);
client.getName().then(name => {
    console.log(name);
})
```
