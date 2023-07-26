# HelloWorld
we create a helloworld contract. this contract has a "say" method with a "message" argument and a "to" argument.
means the sender say "message" to "to" user.

we will create a "Message" object and transfer this object to "to" user.


## Create Project

```
sui move new helloworld
```

now the directory is :
```
├── Move.toml
└── sources
```

and create file "./sources/helloworld.move"

then we write our codes:

```

module helloworld::hello {
    use sui::tx_context::{Self,TxContext};
    use sui::object::{Self, UID};
    use sui::event::emit;
    use std::string::{Self};
    use sui::transfer;

    struct Message has key, store {
        id: UID,
        from: address,
        to: address,
        message: string::String,
    }


    /// Event
    struct MessageEvent has copy, drop {
        from: address,
        to: address,
        message:  string::String,
    }

    #[allow(unused_function)]
    fun init(_ctx: &mut TxContext) {

    }

    public entry fun say(
        message: vector<u8>,
        to: address,
        ctx: &mut TxContext
    ) {
        let msg = string::utf8(message);
                
        // create a message
        let a_msg = Message {
            id: object::new(ctx),
            from: tx_context::sender(ctx),
            to: to,
            message: msg,
        };

        transfer::transfer(a_msg, to);

        // emit an event confirming gene addition
        emit(MessageEvent {from: tx_context::sender(ctx), to: to, message: msg});

    }

}

```
## Build

sui's toolchain has a build command:

```
sui move build
UPDATING GIT DEPENDENCY https://github.com/MystenLabs/sui.git
INCLUDING DEPENDENCY Sui
INCLUDING DEPENDENCY MoveStdlib
BUILDING helloworld
```

which means build success.
## Publish

```
sui client publish --gas-budget  10000000 ./

[warn] Client/Server api version mismatch, client api version : 1.5.0, server api version : 1.6.1
UPDATING GIT DEPENDENCY https://github.com/MystenLabs/sui.git
INCLUDING DEPENDENCY Sui
INCLUDING DEPENDENCY MoveStdlib
BUILDING helloworld
Successfully verified dependencies on-chain against source.
----- Transaction Digest ----
5JD2yijA6apeF1AVTz6zU6Yexj7o8tenNjYUv8ss44Kf
----- Transaction Data ----
...
Inputs: [Pure(SuiPureValue { value_type: Some(Address), value: "0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78" })]
Commands: [
  Publish(<modules>,0x0000000000000000000000000000000000000000000000000000000000000001,0x0000000000000000000000000000000000000000000000000000000000000002),
  TransferObjects([Result(0)],Input(0)),
]

----- Transaction Effects ----
Status : Success
Created Objects:
  - ID: 0x429dc26ad9e9dee19df5366fa75fda440561bda834cac989872462b987a7bc81 , Owner: Account Address ( 0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78 )
  - ID: 0xd6dd8b3e2f904e815dfb340a47823ff8114528acd65add98526065e6cfa75f3a , Owner: Immutable
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
        "version": String("447"),
        "previousVersion": String("446"),
        "digest": String("Eyef4HV188LS7morKmhmTdRa5DmTX8E3GEvWTBV7e8By"),
    },
    Object {
        "type": String("created"),
        "sender": String("0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78"),
        "owner": Object {
            "AddressOwner": String("0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78"),
        },
        "objectType": String("0x2::package::UpgradeCap"),
        "objectId": String("0x429dc26ad9e9dee19df5366fa75fda440561bda834cac989872462b987a7bc81"),
        "version": String("447"),
        "digest": String("EmnQvZasrbpEVXhuimFq5NZjE6CjbDrbFWUUsn4TYfB3"),
    },
    Object {
        "type": String("published"),
        "packageId": String("0xd6dd8b3e2f904e815dfb340a47823ff8114528acd65add98526065e6cfa75f3a"),
        "version": String("1"),
        "digest": String("5w87zWPTRVvzcT85juYvS4AcJD5YBVUq1gdzGeH96Eqw"),
        "modules": Array [
            String("hello"),
        ],
    },
]
...
```

Open sui explorer and see [0xd6dd8b3e2f904e815dfb340a47823ff8114528acd65add98526065e6cfa75f3a](https://suiscan.xyz/testnet/object/0xd6dd8b3e2f904e815dfb340a47823ff8114528acd65add98526065e6cfa75f3a)

we got :

![](helloworld_explorer.png)


## invoke
invovke our "say" method from cli

```
client call --package 0xd6dd8b3e2f904e815dfb340a47823ff8114528acd65add98526065e6cfa75f3a  --module hello --function say --args 'b"Hello"' '0x7d20dcdb2bca4f508ea9613994683eb4e76e9c4ed371169677c1be02aaf0b58e' --gas-budget 10000000 
[warn] Client/Server api version mismatch, client api version : 1.5.0, server api version : 1.6.1
----- Transaction Digest ----
H46N7C1ahgMhJ9yaXixNVobb95YFVBCSMiRLfGiFqpsC
----- Transaction Data ----
...
Inputs: [Pure(SuiPureValue { value_type: Some(Vector(U8)), value: "b\"Hello\"" }), Pure(SuiPureValue { value_type: Some(Address), value: "0x7d20dcdb2bca4f508ea9613994683eb4e76e9c4ed371169677c1be02aaf0b58e" })]
Commands: [
  MoveCall(0xd6dd8b3e2f904e815dfb340a47823ff8114528acd65add98526065e6cfa75f3a::hello::say(Input(0),Input(1))),
]

Sender: 0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78
...

----- Transaction Effects ----
Status : Success
Created Objects:
  - ID: 0xb958f1c9b1aca8c22d40a876f87c4ab781877fd299298850d09910d4891a2f16 , Owner: Account Address ( 0x7d20dcdb2bca4f508ea9613994683eb4e76e9c4ed371169677c1be02aaf0b58e )
Mutated Objects:
  - ID: 0xb7c75543bb69b9f74448783ebfd37eba696d5361ad868df71326d87ef7356a1c , Owner: Account Address ( 0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78 )

----- Events ----
Array [
    Object {
        "id": Object {
            "txDigest": String("H46N7C1ahgMhJ9yaXixNVobb95YFVBCSMiRLfGiFqpsC"),
            "eventSeq": String("0"),
        },
        "packageId": String("0xd6dd8b3e2f904e815dfb340a47823ff8114528acd65add98526065e6cfa75f3a"),
        "transactionModule": String("hello"),
        "sender": String("0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78"),
        "type": String("0xd6dd8b3e2f904e815dfb340a47823ff8114528acd65add98526065e6cfa75f3a::hello::MessageEvent"),
        "parsedJson": Object {
            "from": String("0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78"),
            "message": String("b\"Hello\""),
            "to": String("0x7d20dcdb2bca4f508ea9613994683eb4e76e9c4ed371169677c1be02aaf0b58e"),
        },
        "bcs": String("7c7G9VA9rUe9beGuqEpNF5fpgGX6WvPmcDo3DHt85M8S3WzoZ6opJpbmaHH7H7SyUmCjZyV19Z4kZvfauCga8YcN8TYVcioR2XyK"),
    },
]
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
        "version": String("448"),
        "previousVersion": String("447"),
        "digest": String("EHKn2JyfR8DyktY9xNKqeWwR69P6PXkXLujXHvhveLsp"),
    },
    Object {
        "type": String("created"),
        "sender": String("0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78"),
        "owner": Object {
            "AddressOwner": String("0x7d20dcdb2bca4f508ea9613994683eb4e76e9c4ed371169677c1be02aaf0b58e"),
        },
        "objectType": String("0xd6dd8b3e2f904e815dfb340a47823ff8114528acd65add98526065e6cfa75f3a::hello::Message"),
        "objectId": String("0xb958f1c9b1aca8c22d40a876f87c4ab781877fd299298850d09910d4891a2f16"),
        "version": String("448"),
        "digest": String("HqWkQJys1SzYs3UG5g8pnVRGNa7URKRhMnZsMUNporQX"),
    },
]
...
```


we can see our contract craete a Object: 0xb958f1c9b1aca8c22d40a876f87c4ab781877fd299298850d09910d4891a2f16 it is a `hello::Message` type.

```
sui client object 0xb958f1c9b1aca8c22d40a876f87c4ab781877fd299298850d09910d4891a2f16
[warn] Client/Server api version mismatch, client api version : 1.5.0, server api version : 1.6.1
----- 0xd6dd8b3e2f904e815dfb340a47823ff8114528acd65add98526065e6cfa75f3a::hello::Message (0xb958f1c9b1aca8c22d40a876f87c4ab781877fd299298850d09910d4891a2f16[0x1c0]) -----
Owner: Account Address ( 0x7d20dcdb2bca4f508ea9613994683eb4e76e9c4ed371169677c1be02aaf0b58e )
Version: 0x1c0
Storage Rebate: 1839200
Previous Transaction: TransactionDigest(H46N7C1ahgMhJ9yaXixNVobb95YFVBCSMiRLfGiFqpsC)
----- Data -----
type: 0xd6dd8b3e2f904e815dfb340a47823ff8114528acd65add98526065e6cfa75f3a::hello::Message
from: 0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78
id: 0xb958f1c9b1aca8c22d40a876f87c4ab781877fd299298850d09910d4891a2f16
message: b"Hello"
to: 0x7d20dcdb2bca4f508ea9613994683eb4e76e9c4ed371169677c1be02aaf0b58e
```

and the ower is the `to` argument: 0x7d20dcdb2bca4f508ea9613994683eb4e76e9c4ed371169677c1be02aaf0b58e, and in `hello::Message` 

```
from: 0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78
to: 0x7d20dcdb2bca4f508ea9613994683eb4e76e9c4ed371169677c1be02aaf0b58e
message: b"Hello"
```

say user 0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78(we) say "Hello" to user(0x7d20dcdb2bca4f508ea9613994683eb4e76e9c4ed371169677c1be02aaf0b58e).