# sui.js for Sui

Sui provides a TypeScript/JavaScript SDK to access RPC, similar to Web3.js in the Ethereum ecosystem. The SDK mainly implements RPC-related access interfaces and the functionality of client signature and transaction sending. 
The Web3.js library is mainly divided into three parts:

* RPC access
* Keypair management
* Transaction sending

## SDK installation
In your project, add a dependency on Sui.js via npm:

```
npm install @mysten/sui.js
```
Then, in your project code, import:

```
import { JsonRpcProvider, testnetConnection } from '@mysten/sui.js';
    // connect to Testnet
    const provider = new JsonRpcProvider(testnetConnection);
```

This will create an RPC connection `provider` to the test network, and `JsonRpcProvider` encapsulates Sui's RPC methods.

## Reading API

### Get Owned Objects

Fetch objects owned by the address 0xcc2bd176a478baea9a0de7a24cd927661cc6e860d5bacecb9a138ef20dbab231

```typescript
import { JsonRpcProvider } from '@mysten/sui.js';
const provider = new JsonRpcProvider();
const objects = await provider.getOwnedObjects({
	owner: '0xcc2bd176a478baea9a0de7a24cd927661cc6e860d5bacecb9a138ef20dbab231',
});
```

### Get Object

Fetch object details for the object with id 0xe19739da1a701eadc21683c5b127e62b553e833e8a15a4f292f4f48b4afea3f2

```typescript
import { JsonRpcProvider } from '@mysten/sui.js';
const provider = new JsonRpcProvider();
const txn = await provider.getObject({
	id: '0xcc2bd176a478baea9a0de7a24cd927661cc6e860d5bacecb9a138ef20dbab231',
	// fetch the object content field
	options: { showContent: true },
});
// You can also fetch multiple objects in one batch request
const txns = await provider.multiGetObjects({
	ids: [
		'0xcc2bd176a478baea9a0de7a24cd927661cc6e860d5bacecb9a138ef20dbab231',
		'0x9ad3de788483877fe348aef7f6ba3e52b9cfee5f52de0694d36b16a6b50c1429',
	],
	// only fetch the object type
	options: { showType: true },
});
```

### Get Transaction

Fetch transaction details from transaction digests:

```typescript
import { JsonRpcProvider } from '@mysten/sui.js';
const provider = new JsonRpcProvider();
const txn = await provider.getTransactionBlock({
	digest: '9XFneskU8tW7UxQf7tE5qFRfcN4FadtC2Z3HAZkgeETd=',
	// only fetch the effects field
	options: {
		showEffects: true,
		showInput: false,
		showEvents: false,
		showObjectChanges: false,
		showBalanceChanges: false,
	},
});

// You can also fetch multiple transactions in one batch request
const txns = await provider.multiGetTransactionBlocks({
	digests: [
		'9XFneskU8tW7UxQf7tE5qFRfcN4FadtC2Z3HAZkgeETd=',
		'17mn5W1CczLwitHCO9OIUbqirNrQ0cuKdyxaNe16SAME=',
	],
	// fetch both the input transaction data as well as effects
	options: { showInput: true, showEffects: true },
});
```

### Get Checkpoints

Get latest 100 Checkpoints in descending order and print Transaction Digests for each one of them.

```typescript
provider.getCheckpoints({ descendingOrder: true }).then(function (checkpointPage: CheckpointPage) {
	console.log(checkpointPage);

	checkpointPage.data.forEach((checkpoint) => {
		console.log('---------------------------------------------------------------');
		console.log(
			' -----------   Transactions for Checkpoint:  ',
			checkpoint.sequenceNumber,
			' -------- ',
		);
		console.log('---------------------------------------------------------------');
		checkpoint.transactions.forEach((tx) => {
			console.log(tx);
		});
		console.log('***************************************************************');
	});
});
```

Get Checkpoint 1994010 and print details.

```typescript
provider.getCheckpoint({ id: '1994010' }).then(function (checkpoint: Checkpoint) {
	console.log('Checkpoint Sequence Num ', checkpoint.sequenceNumber);
	console.log('Checkpoint timestampMs ', checkpoint.timestampMs);
	console.log('Checkpoint # of Transactions ', checkpoint.transactions.length);
});
```

### Get Coins

Fetch coins of type `0x65b0553a591d7b13376e03a408e112c706dc0909a79080c810b93b06f922c458::usdc::USDC` owned by an address:

```typescript
import { JsonRpcProvider } from '@mysten/sui.js';
const provider = new JsonRpcProvider();
// If coin type is not specified, it defaults to 0x2::sui::SUI
const coins = await provider.getCoins({
	owner: '0xcc2bd176a478baea9a0de7a24cd927661cc6e860d5bacecb9a138ef20dbab231',
	coinType: '0x65b0553a591d7b13376e03a408e112c706dc0909a79080c810b93b06f922c458::usdc::USDC',
});
```

Fetch all coin objects owned by an address:

```typescript
import { JsonRpcProvider } from '@mysten/sui.js';
const provider = new JsonRpcProvider();
const allCoins = await provider.getAllCoins({
	owner: '0xcc2bd176a478baea9a0de7a24cd927661cc6e860d5bacecb9a138ef20dbab231',
});
```

Fetch the total coin balance for one coin type, owned by an address:

```typescript
import { JsonRpcProvider } from '@mysten/sui.js';
const provider = new JsonRpcProvider();
// If coin type is not specified, it defaults to 0x2::sui::SUI
const coinBalance = await provider.getBalance({
	owner: '0xcc2bd176a478baea9a0de7a24cd927661cc6e860d5bacecb9a138ef20dbab231',
	coinType: '0x65b0553a591d7b13376e03a408e112c706dc0909a79080c810b93b06f922c458::usdc::USDC',
});
```



## Writing API

For a primer for building transactions, refer to [this guide](https://docs.sui.io/build/prog-trans-ts-sdk).

### Transfer Object

```typescript
import { Ed25519Keypair, JsonRpcProvider, RawSigner, TransactionBlock } from '@mysten/sui.js';
// Generate a new Ed25519 Keypair
const keypair = new Ed25519Keypair();
const provider = new JsonRpcProvider();
const signer = new RawSigner(keypair, provider);
const tx = new TransactionBlock();
tx.transferObjects(
	[tx.object('0xe19739da1a701eadc21683c5b127e62b553e833e8a15a4f292f4f48b4afea3f2')],
	tx.pure('0x1d20dcdb2bca4f508ea9613994683eb4e76e9c4ed371169677c1be02aaf0b12a'),
);
const result = await signer.signAndExecuteTransactionBlock({
	transactionBlock: tx,
});
console.log({ result });
```


### Transfer Sui

To transfer `1000` MIST to another address:

```typescript
import { Ed25519Keypair, JsonRpcProvider, RawSigner, TransactionBlock } from '@mysten/sui.js';
// Generate a new Keypair
const keypair = new Ed25519Keypair();
const provider = new JsonRpcProvider();
const signer = new RawSigner(keypair, provider);
const tx = new TransactionBlock();
const [coin] = tx.splitCoins(tx.gas, [tx.pure(1000)]);
tx.transferObjects([coin], tx.pure(keypair.getPublicKey().toSuiAddress()));
const result = await signer.signAndExecuteTransactionBlock({
	transactionBlock: tx,
});
console.log({ result });
```

### Merge coins

```typescript
import { Ed25519Keypair, JsonRpcProvider, RawSigner, TransactionBlock } from '@mysten/sui.js';
// Generate a new Keypair
const keypair = new Ed25519Keypair();
const provider = new JsonRpcProvider();
const signer = new RawSigner(keypair, provider);
const tx = new TransactionBlock();
tx.mergeCoins(tx.object('0xe19739da1a701eadc21683c5b127e62b553e833e8a15a4f292f4f48b4afea3f2'), [
	tx.object('0x127a8975134a4824d9288722c4ee4fc824cd22502ab4ad9f6617f3ba19229c1b'),
]);
const result = await signer.signAndExecuteTransactionBlock({
	transactionBlock: tx,
});
console.log({ result });
```

### Move Call

```typescript
import { Ed25519Keypair, JsonRpcProvider, RawSigner, TransactionBlock } from '@mysten/sui.js';
// Generate a new Keypair
const keypair = new Ed25519Keypair();
const provider = new JsonRpcProvider();
const signer = new RawSigner(keypair, provider);
const packageObjectId = '0x...';
const tx = new TransactionBlock();
tx.moveCall({
	target: `${packageObjectId}::nft::mint`,
	arguments: [tx.pure('Example NFT')],
});
const result = await signer.signAndExecuteTransactionBlock({
	transactionBlock: tx,
});
console.log({ result });
```


## Events API

Querying events created by transactions sent by account
`0xcc2bd176a478baea9a0de7a24cd927661cc6e860d5bacecb9a138ef20dbab231`

```typescript
import { JsonRpcProvider } from '@mysten/sui.js';
const provider = new JsonRpcProvider();
const events = provider.queryEvents({
	query: { Sender: toolbox.address() },
	limit: 2,
});
```

Subscribe to all events created by transactions sent by account `0xcc2bd176a478baea9a0de7a24cd927661cc6e860d5bacecb9a138ef20dbab231`

```typescript
import { JsonRpcProvider, SuiEvent } from '@mysten/sui.js';
const provider = new JsonRpcProvider();

// calls RPC method 'suix_subscribeEvent' with params:
// [ { Sender: '0xbff6ccc8707aa517b4f1b95750a2a8c666012df3' } ]
const unsubscribe = await provider.subscribeEvent({
	filter: {
		Sender: '0xcc2bd176a478baea9a0de7a24cd927661cc6e860d5bacecb9a138ef20dbab231',
	},
	onMessage(event: SuiEvent) {
		// handle subscription notification message here. This function is called once per subscription message.
	},
});

// later, to unsubscribe:
await unsubscribe();
```

Subscribe to all events created by a package's `nft` module

```typescript
import { JsonRpcProvider, SuiEvent } from '@mysten/sui.js';
const provider = new JsonRpcProvider();

const somePackage = '0x...';
const devnetNftFilter = {
    { MoveModule: { somePackage, module: 'nft'} },
};
const devNftSub = await provider.subscribeEvent({
  filter: devnetNftFilter,
  onMessage(event: SuiEvent) {
    // handle subscription notification message here
  },
});
```


## Reference：
* [Sui TypeScript SDK](https://github.com/MystenLabs/sui/tree/main/sdk/typescript)
* [sui.js](https://www.npmjs.com/package/@mysten/sui.js)