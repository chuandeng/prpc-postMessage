import { RPCClient } from '../../index';

interface PRCAPI {
    getName(): Promise<string>;
}
window.name ='iframe'
// Start Client
// We pass null as first arg because it's just for type inference in this implementation
const client = new RPCClient<PRCAPI>({
    target: window.parent,
    origin: '*'
}) as unknown as PRCAPI;

console.log('RPC Client started in Iframe');

const output = document.getElementById('output')!;

async function test() {
    output.innerHTML += 'Calling getName()...<br>';
    try {
        const name = await client.getName();
        console.log('Result:', name);
        output.innerHTML += `Result: <strong>${name}</strong><br>`;
    } catch (e: any) {
        console.error(e);
        output.innerHTML += `Error: ${e.message}<br>`;
    }
}

// Call after a slight delay to ensure parent is ready (though parent loads first usually)
setTimeout(test, 1000);
