# Programmable Transaction

One of Sui’s most powerful core developer primitives is Programmable Transaction blocks. For conventional blockchains, a transaction is the fundamental unit of execution, and each transaction is typically simplistic and close to the VM execution. On Sui, the fundamental, atomic unit of execution is elevated to the level of a complex, composable sequence of transactions where:

* Any public on-chain Move function across all smart contracts is accessible to the Programmable Transaction block.
* Typed outputs from earlier on-chain Move calls can be chained as typed inputs to later on-chain Move calls. These types can be arbitrary Sui objects that carry a rich set of attributes and properties. Programmable Transaction blocks can be highly heterogeneous. A single block can extract a Player object from a smart contract wallet, use it to make a move in a Game, then send a Badge object won by the move to a multi-game TrophyCase, all without publishing any new smart contract code. The natural compositionality of these blocks allow existing contracts to seamlessly interoperate with both old and new code (for example, the Game does not have to know/care that the user stores their Player in a Multisig wallet or their Badge in a TrophyCase).
* Chained transactions in a Programmable Transaction block execute and fail atomically. For example, a Defi programmable transaction block might perform multiple swaps across many distinct pools, mutating dozens of existing objects and creating new ones in the process. If one of these transactions fails, the chain breaks and causes the Programmable Transaction block to also fail.
* Each Programmable Transaction block supports up to 1,024 transactions, which enables unbounded expressivity and efficiency. You can use these blocks for homogeneous batching (such as for payments or NFT mints), and heterogeneous chains of single-sender operations as described in the two preceding examples. Both modes leverage Sui's high-speed execution, and allow developers to push already low transaction fees even lower by packing more productive work into a single block.

With the power and convenience of Programmable Transaction blocks, developers on Sui are constructing increasingly sophisticated blocks customized for their applications. Sui’s programmability was highly expressive even before Programmable Transaction blocks. Now, a single execution can perform up to 1,024 heterogeneous operations. On most other blockchains, each of the 1,024 operations would be an individual transaction.

## Inputs and transactions

Programmable Transaction blocks have two key concepts: inputs and transactions.

Inputs are values that are used as arguments to the transactions in the transaction block. Inputs can either be an object reference (either to an owned object, an immutable object, or a shared object), or a pure BCS value (for example, an encoded string used as an argument to a move call).

Transactions are steps of execution in the transaction block. You can also use the result of previous transaction as an argument to future transactions. By combining multiple transactions together, Programmable Transaction blocks provide a flexible way to create complex transactions.

###  Constructing inputs

Inputs are how you provide external values to transaction blocks. For example, defining an amount of Sui to transfer, or which object to pass into a Move call, or a shared object. There are currently two ways to define inputs:

* For objects: the txb.object(objectId) function is used to construct an input that contains an object reference.
* For pure values: the txb.pure(rawValue) function is used, and returns an input reference that you use in transactions.

### Available transactions

Sui supports following transactions:

* txb.splitCoins(coin, amounts) - Creates new coins with the defined amounts, split from the provided coin. Returns the coins so that it can be used in subsequent transactions.
    * Example: txb.splitCoins(txb.gas, [txb.pure(100), txb.pure(200)])
* txb.mergeCoins(destinationCoin, sourceCoins) - Merges the sourceCoins into the destinationCoin.
    * Example: txb.mergeCoins(txb.object(coin1), [txb.object(coin2), txb.object(coin3)])
* txb.transferObjects(objects, address) - Transfers a list of objects to the specified address.
    * Example: txb.transferObjects([txb.object(thing1), txb.object(thing2)], txb.pure(myAddress))
* txb.moveCall({ target, arguments, typeArguments }) - Executes a Move call. Returns whatever the Sui Move call returns.
    * Example: txb.moveCall({ target: '0x2::devnet_nft::mint', arguments: [txb.pure(name), txb.pure(description), txb.pure(image)] })
* txb.makeMoveVec({ type, objects }) - Constructs a vector of objects that can be passed into a moveCall. This is required as there’s no way to define a vector as an input.
    * Example: txb.makeMoveVec({ objects: [txb.object(id1), txb.object(id2)] })
* txb.publish(modules, dependencies) - Publishes a Move package. Returns the upgrade capability object.


### Passing transaction results as arguments
You can use the result of a transaction as an argument in a subsequent transactions. Each transaction method on the transaction builder returns a reference to the transaction result.


When a transaction returns multiple results, you can access the result at a specific index either using destructuring, or array indexes.

```
// Destructuring (preferred, as it gives you logical local names):
const [nft1, nft2] = txb.moveCall({ target: "0x2::nft::mint_many" });
txb.transferObjects([nft1, nft2], txb.pure(address));

// Array indexes:
const mintMany = txb.moveCall({ target: "0x2::nft::mint_many" });
txb.transferObjects([mintMany[0], mintMany[1]], txb.pure(address));
```

## color_object

back to our "color_object" package. it also support a "update" function to update object's color:

```

    public entry fun update(
        object: &mut ColorObject,
        red: u8, green: u8, blue: u8,
    ) {
        object.red = red;
        object.green = green;
        object.blue = blue;
    }
```


can we create and modify a color object in one RPC? Although this operation is a bit redundant, it is possible to simulate a scenario that requires two actions.

first use the former code create a object:

```
    const [color] = txb.moveCall({
        target: `0x391be525adf65dc7b9317f800c583dcee8a973438ddb4859677e3514b696cb3b::color_object::create`,
        arguments: [txb.pure(2), txb.pure(4), txb.pure(8)],
    });
```
this time ,we have the return value, it is a array of TransactionArgument

```
const TransactionArgument: Struct<{
    kind: "Input";
    index: number;
    type?: "object" | "pure" | undefined;
    value?: any;
} | {
    kind: "GasCoin";
} | {
    kind: "Result";
    index: number;
} | {
    kind: "NestedResult";
    index: number;
    resultIndex: number;
}, null>;
```

the another moveCall:

```
    txb.moveCall({
        target: `0x391be525adf65dc7b9317f800c583dcee8a973438ddb4859677e3514b696cb3b::color_object::update`,
        arguments: [color, txb.pure(12), txb.pure(14), txb.pure(18)],
    });
```

here we change the target to "update" functon. and use the return value of the former moveCall `color` to be the first argument for `update`


at last ,we sign and send the transaction.

### all in one 

all codes:

```
import { 
    Connection, 
    Ed25519Keypair, 
    JsonRpcProvider, 
    RawSigner,
    TransactionBlock
} from "@mysten/sui.js";

// gas budget, in MIST
const GAS_BUDGET = 5000000;    

// Sui Node endpoint:
const connection = new Connection({
    fullnode: 'https://fullnode.testnet.sui.io:443'
});
const suiProvider = new JsonRpcProvider(connection);


const run =  async() => {
    const buf = Buffer.from("AOAB...mS", "base64");
    const keyPair = Ed25519Keypair.fromSecretKey(buf.slice(1));
    console.log(keyPair.getPublicKey().toSuiAddress());

    let txb = new TransactionBlock();
    
    const [color] = txb.moveCall({
        target: `0x391be525adf65dc7b9317f800c583dcee8a973438ddb4859677e3514b696cb3b::color_object::create`,
        arguments: [txb.pure(2), txb.pure(4), txb.pure(8)],
    });
    console.log("color:", color)

    txb.moveCall({
        target: `0x391be525adf65dc7b9317f800c583dcee8a973438ddb4859677e3514b696cb3b::color_object::update`,
        arguments: [color, txb.pure(12), txb.pure(14), txb.pure(18)],
    });
    txb.setGasBudget(100000000);
    
    const signer = new RawSigner(keyPair, suiProvider);
    const result = await signer.signAndExecuteTransactionBlock({
        transactionBlock: txb,
    });
    console.log({ result });
};

run();
```

run and get

```
 npm run start

> pbt@1.0.0 start
> npx tsc && node build/client.js

0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78
color: { kind: 'NestedResult', index: 0, resultIndex: 0 }
{
  result: {
    digest: '33P9bpYEMx8hbY1rguaz6cN96GzQFuHH4Aa4CVNk9Rjw',
    confirmedLocalExecution: false
  }
}
```