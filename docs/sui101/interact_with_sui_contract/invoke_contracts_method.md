# Invoke Contract's Method

Inovkea contract's method is just like call a Move function in a package and module. the function must be a `public entry` function.

here we got a exmaple Move contract, it is `sui/sui_programmability/examples/objects_tutorial`. and we build and deploy it to 

[0x391be525adf65dc7b9317f800c583dcee8a973438ddb4859677e3514b696cb3b](https://suiexplorer.com/object/0x391be525adf65dc7b9317f800c583dcee8a973438ddb4859677e3514b696cb3b?network=testnet)

here we got three modules:

* color_object
* simple_warrior
* trusted_swap

and we will intract with the "color_object"

it has
```
    public entry fun create(red: u8, green: u8, blue: u8, ctx: &mut TxContext) {
        let color_object = new(red, green, blue, ctx);
        transfer::transfer(color_object, tx_context::sender(ctx))
    }
```

a `craete` entry function can be inovke by RPC, and it will crate a Object with "red/gree/blue" attribute.

## Invoke with Sui's CLI

first we use "sui client" to call this Move function.

```
sui client call --package 0x391be525adf65dc7b9317f800c583dcee8a973438ddb4859677e3514b696cb3b --module color_object --function create --args 1 2 3 --gas-budget 10000000
[warn] Client/Server api version mismatch, client api version : 1.5.0, server api version : 1.6.1
----- Transaction Digest ----
9pK5ARtcADhYCc5L5ja8P8DuFECgnH6pS1qM6ybRkthy
----- Transaction Data ----
Transaction Signature: [Signature(Ed25519SuiSignature(Ed25519SuiSignature([0, 80, 138, 173, 224, 130, 230, 222, 117, 227, 39, 116, 149, 100, 50, 225, 195, 72, 49, 36, 65, 104, 7, 222, 65, 146, 154, 18, 243, 126, 166, 127, 139, 203, 215, 28, 115, 55, 98, 214, 232, 120, 125, 251, 181, 198, 190, 213, 35, 22, 161, 92, 225, 3, 9, 44, 201, 222, 156, 43, 86, 65, 88, 67, 15, 169, 199, 105, 117, 112, 178, 123, 183, 21, 64, 74, 48, 213, 44, 198, 5, 91, 53, 13, 220, 193, 62, 56, 226, 106, 173, 54, 130, 46, 221, 25, 126])))]
Transaction Kind : Programmable
Inputs: [Pure(SuiPureValue { value_type: Some(U8), value: 1 }), Pure(SuiPureValue { value_type: Some(U8), value: 2 }), Pure(SuiPureValue { value_type: Some(U8), value: 3 })]
Commands: [
  MoveCall(0x391be525adf65dc7b9317f800c583dcee8a973438ddb4859677e3514b696cb3b::color_object::create(Input(0),Input(1),Input(2))),
]

Sender: 0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78
Gas Payment: Object ID: 0xb7c75543bb69b9f74448783ebfd37eba696d5361ad868df71326d87ef7356a1c, version: 0x1c3, digest: 4RaMiijvPVC54echmDgCpKYHNhARSoPJZDMrA2bXx748 
Gas Owner: 0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78
Gas Price: 1000
Gas Budget: 10000000

----- Transaction Effects ----
Status : Success
Created Objects:
  - ID: 0xd63d78895366e2a3e14723d3c481e2f91d9065d9bbef1ead850c0bad7bb95158 , Owner: Account Address ( 0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78 )
Mutated Objects:
  - ID: 0xb7c75543bb69b9f74448783ebfd37eba696d5361ad868df71326d87ef7356a1c , Owner: Account Address ( 0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78 )

----- Events ----
Array []
----- Object changes ----
Array [
    Object {
        "type": String("mutated"),
        "sender": String("0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78"),
        "owner": Object {
            "AddressOwner": String("0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78"),
        },
        "objectType": String("0x2::coin::Coin<0x2::sui::SUI>"),
        "objectId": String("0xb7c75543bb69b9f74448783ebfd37eba696d5361ad868df71326d87ef7356a1c"),
        "version": String("452"),
        "previousVersion": String("451"),
        "digest": String("f2Sapod1sT9ipjUqYBy6fLBqboi2sR9iuu9ArqxLGCt"),
    },
    Object {
        "type": String("created"),
        "sender": String("0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78"),
        "owner": Object {
            "AddressOwner": String("0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78"),
        },
        "objectType": String("0x391be525adf65dc7b9317f800c583dcee8a973438ddb4859677e3514b696cb3b::color_object::ColorObject"),
        "objectId": String("0xd63d78895366e2a3e14723d3c481e2f91d9065d9bbef1ead850c0bad7bb95158"),
        "version": String("452"),
        "digest": String("B2MK1J7FbzZg6LBQwwpBVbF8Yry96kkkF5bbTus9uURM"),
    },
]
----- Balance changes ----
Array [
    Object {
        "owner": Object {
            "AddressOwner": String("0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78"),
        },
        "coinType": String("0x2::sui::SUI"),
        "amount": String("-2400680"),
    },
]
```

we use `sui client call` command with `--package` address of package `--module` our "colour_object" module and  `--function`  the 
"create" function with `--args` three int value for "red/gree/blue". suffix with gas budget `--ags-budget`

the command's log show create for us . an object(0xd63d78895366e2a3e14723d3c481e2f91d9065d9bbef1ead850c0bad7bb95158) we can see the attribute in [explorer](https://suiexplorer.com/object/0xd63d78895366e2a3e14723d3c481e2f91d9065d9bbef1ead850c0bad7bb95158?network=testnet)

![](./0xd63d78895366e2a3e14723d3c481e2f91d9065d9bbef1ead850c0bad7bb95158.png)

also we can use command to query:

```
sui client object 0xd63d78895366e2a3e14723d3c481e2f91d9065d9bbef1ead850c0bad7bb95158
[warn] Client/Server api version mismatch, client api version : 1.5.0, server api version : 1.6.1
----- 0x391be525adf65dc7b9317f800c583dcee8a973438ddb4859677e3514b696cb3b::color_object::ColorObject (0xd63d78895366e2a3e14723d3c481e2f91d9065d9bbef1ead850c0bad7bb95158[0x1c4]) -----
Owner: Account Address ( 0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78 )
Version: 0x1c4
Storage Rebate: 1390800
Previous Transaction: TransactionDigest(9pK5ARtcADhYCc5L5ja8P8DuFECgnH6pS1qM6ybRkthy)
----- Data -----
type: 0x391be525adf65dc7b9317f800c583dcee8a973438ddb4859677e3514b696cb3b::color_object::ColorObject
blue: 3
green: 2
id: 0xd63d78895366e2a3e14723d3c481e2f91d9065d9bbef1ead850c0bad7bb95158
red: 1
```

Because of the [SUIJSON](https://docs.sui.io/reference/sui-json) and [Sui Object Display Standard](https://docs.sui.io/build/sui-object-display) we can parse 
all the three attribute in this object.


## Invoke With sui.js

we can also do this with [TypeScript/JavaScript SDK](https://github.com/MystenLabs/sui/tree/main/sdk/typescript), here we create a TypeScript project.

in your project, add a dependency on Sui.js via npm:

```
npm install @mysten/sui.js
```

### create a provider

a provider is a `Connection` to Sui RPC node.

```
// Sui Node endpoint:
const connection = new Connection({
    fullnode: 'https://fullnode.testnet.sui.io:443'
});
const suiProvider = new JsonRpcProvider(connection);

```

### keypair

keypair is your wallet, in your local wallet, we got a file : ~/.sui/sui_config/sui.keystore 

the content is a "base64" string which contain private key. so we create a keypair with

```
 const buf = Buffer.from("AOA...mmS", "base64");
    const keyPair = Ed25519Keypair.fromSecretKey(buf.slice(1));
    console.log(keyPair.getPublicKey().toSuiAddress());

```




### create TransactionBlock

every Move call is a RPC transaction requets. so we create a TransactionBlock.
and TransactionBlock has  a `moveCall` method to build MoveCall Transaction.

```
    let txb = new TransactionBlock();
    txb.moveCall({
        target: `0x391be525adf65dc7b9317f800c583dcee8a973438ddb4859677e3514b696cb3b::color_object::create`,
        arguments: [txb.pure(2), txb.pure(4), txb.pure(8)],
    });
```

moveCall's define is :

```
TransactionBlock.moveCall(input: Omit<{
    arguments: ({
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
    })[];
    kind: "MoveCall";
    typeArguments: string[];
    target: `${string}::${string}::${string}`;
}, "arguments" | ... 1 more ... | "typeArguments"> & {
    ...;
}): TransactionResult
```

we can pass "package::module::function" to "targe", and a argument list to "argumetns"

### sign and send

here it is . we need sign the TransactionBlock and send it with a RPC request:

```
    const signer = new RawSigner(keyPair, suiProvider);
    const result = await signer.signAndExecuteTransactionBlock({
        transactionBlock: txb,
    });
```

a "RawSigner"  is a keypair with a provider. and the wrapped `signAndExecuteTransactionBlock` will use this keypair
to sign transaction and send the transaction with this provider.


### all in one is 

```
import { 
    Connection, 
    Ed25519Keypair, 
    JsonRpcProvider, 
    RawSigner,
    TransactionBlock
} from "@mysten/sui.js";



// Sui Node endpoint:
const connection = new Connection({
    fullnode: 'https://fullnode.testnet.sui.io:443'
});
const suiProvider = new JsonRpcProvider(connection);


const run =  async() => {
    const buf = Buffer.from("AOA...mmS", "base64");
    const keyPair = Ed25519Keypair.fromSecretKey(buf.slice(1));
    console.log(keyPair.getPublicKey().toSuiAddress());

    let txb = new TransactionBlock();
    txb.moveCall({
        target: `0x391be525adf65dc7b9317f800c583dcee8a973438ddb4859677e3514b696cb3b::color_object::create`,
        arguments: [txb.pure(2), txb.pure(4), txb.pure(8)],
    });


    const signer = new RawSigner(keyPair, suiProvider);
    const result = await signer.signAndExecuteTransactionBlock({
        transactionBlock: txb,
    });
    console.log({ result });
};

run();
```

run it and we got :

```
 npm run start

> jsclient@1.0.0 start
> npx tsc && node build/client.js

0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78
{
  result: {
    digest: '88iRDyq2qKQyCG2V33dKZuBm854ANUL18f4fPQreCMB5',
    confirmedLocalExecution: false
  }
}
```

in the explorer [88iRDyq2qKQyCG2V33dKZuBm854ANUL18f4fPQreCMB5](https://suiexplorer.com/txblock/88iRDyq2qKQyCG2V33dKZuBm854ANUL18f4fPQreCMB5?network=testnet)

![](88iRDyq2qKQyCG2V33dKZuBm854ANUL18f4fPQreCMB5.png)


