# Sui Client CLI

Sui provides a set of client command line tools, which are implemented using Rust. Rust has some dependencies in the compilation process.
Therefore, you need to install the corresponding dependencies first. According to different operating systems, the dependencies are as follows:

|Prerequisite| Linux| macOS| Windows 11|
|---|---|---|---|
|cURL |X |X |X|
|Rust and Cargo |X |X |X|
|Git CLI |X |X |X|
|CMake |X |X |X|
|GCC |X || |
|libssl-dev| X || |
|libclang-dev |X|||
|libpq-dev |X|| |
|build-essential |X|| |
|Brew ||X| |
|C++ build tools||| X|
|LLVM Compiler |||X|


Basically, they are some common development libraries. For related installation methods, please refer to [Official Documents](https://docs.sui.io/build/install)

After the dependencies are installed, you can use the Rust development tool Cargo to install the Sui command line:

First update rust routinely

     rustup update stable

Then install Sui:

     cargo install --locked --git https://github.com/MystenLabs/sui.git --branch devnet sui

The devnet branch is selected here. If you need testnet, you can modify the branch here:

     cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui


After the installation is complete, you can check the installation status by checking the Sui command line version:

     sui --version
     sui 1.5.0-e7c581093

## Configure the cli environment

When using Sui cli for the first time, it needs to be configured:

     sui client
     Config file ["/Users/you/.sui/sui_config/client.yaml"] doesn't exist, do you want to connect to a Sui Full node server [y/N]?y
     Sui Full node server URL (Defaults to Sui Devnet if not specified) : https://fullnode.testnet.sui.io:443
     Environment alias for [https://fullnode.testnet.sui.io:443] : testnet
     Select key scheme to generate keypair (0 for ed25519, 1 for secp256k1, 2: for secp256r1):
     0
     Generated new keypair for address with scheme "ed25519" [0x65635b...6d78]
     Secret Recovery Phrase : [define ... outdoor]

During the configuration process, he will be asked to fill in the RPC address, environment name, and keypair algorithm (here we choose ed25519). The RPC address Sui officially provides

`https://fullnode.<SUI-NETWORK-VERSION>.sui.io:443` is for testing, fill in "mainnet" for the main network, and "testnet" for the test network.

The development network is a node node development environment, which is updated frequently. The test network is generally used for contract development, which is similar to the main network, and the main network is a formal environment for real money. So we will choose to conduct tutorials on the test network in the future.



After configuration, the configuration file of Sui cli is in

     ~/.sui/sui_config/
     /Users/you/.sui/sui_config/
     ├── client.yaml
     └── sui.keystore

There are two main files here. client.yaml configures the RPC address and environment, the location of the keystore, and the currently used wallet address:

     ---
     keystore:
     File: /Users/you/.sui/sui_config/sui.keystore
     envs:
     - alias: mainnet
         rpc: "https://fullnode.mainnet.sui.io:443"
         ws: ~
     active_env:mainnet
     active_address: "0xb5fc847aa0ef16e80e4a80ec66a90d88236dcd1ca169b833ba589e324e56d530"

After preparing the environment and address, we can apply for test coins for testing.

* Join Discord.
If you try to join the Sui Discord channel using a newly created Discord account you may need to wait a few days for validation.

* Get your Sui client address: sui client active-address
Request test SUI tokens in the Sui #devnet-faucet or #testnet-faucet Discord channel. Send the following message to the relevant channel with your client address: !faucet <YOUR-CLIENT-ADDRESS>. If you have a local network, programmatically request tokens from your local faucet.




## Initiate contract call
Because Sui's messages can be described in JSON, we can pass parameters in the form of JSON on the command line. Therefore, the contract can be invoked through the command tool, and the invoked command is:

```
sui client call --function your_function --module your_module --package 0x<YOUR-PACKAGE-ID> --args args_list --gas-budget 15000000
```

Here is an example, we first publish a Sui test contract:

``` 
sui client publish /Users/changzeng/repos/github.com/MystenLabs/sui/sui_programmability/examples/move_tutorial --gas-budget 15000000

INCLUDING DEPENDENCY Sui
INCLUDING DEPENDENCY MoveStdlib
BUILDING MyFirstPackage
Successfully verified dependencies on-chain against source.
----- Transaction Digest ----
4TEcQgjzdzduTvPy3opBDUYAjuXF5eEJoEzr1VETMxkn
----- Transaction Data ----
Transaction Signature: [Signature(Ed25519SuiSignature(Ed25519SuiSignature([0, 144, 233, 115, 155, 9, 95, 174, 111, 94, 147, 28, 245, 200, 18, 83, 202, 93, 82, 179, 98, 175, 241, 230, 237, 33, 9, 92, 165, 21, 72, 107, 177, 139, 102, 11, 167, 51, 63, 162, 167, 143, 228, 183, 197, 46, 61, 19, 161, 62, 95, 126, 81, 147, 31, 29, 190, 229, 159, 26, 19, 24, 190, 218, 5, 169, 199, 105, 117, 112, 178, 123, 183, 21, 64, 74, 48, 213, 44, 198, 5, 91, 53, 13, 220, 193, 62, 56, 226, 106, 173, 54, 130, 46, 221, 25, 126])))]
Transaction Kind : Programmable
Inputs: [Pure(SuiPureValue { value_type: Some(Address), value: "0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78" })]
Commands: [
  Publish(<modules>,0x0000000000000000000000000000000000000000000000000000000000000001,0x0000000000000000000000000000000000000000000000000000000000000002),
  TransferObjects([Result(0)],Input(0)),
]

...

----- Object changes ----
Array [
    Object {
        "type": String("published"),
        "packageId": String("0x41a972fdd05da3ed9b6a9f960e96ef346c87958e20156efdb8fc3b7101e20b7a"),
        "version": String("1"),
        "digest": String("AoD41CzJDDjbfnhmkWFr3PaG4fXnLaYM18LW9hJ3Wd5M"),
        "modules": Array [
            String("my_module"),
        ],
    },
    Object {
        "type": String("created"),
        "sender": String("0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78"),
        "owner": Object {
            "AddressOwner": String("0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78"),
        },
        "objectType": String("0x41a972fdd05da3ed9b6a9f960e96ef346c87958e20156efdb8fc3b7101e20b7a::my_module::Forge"),
        "objectId": String("0x3f148a8eea0c87fa67d5da477317b8027b5d06a72d5ed599c66e4cb067457894"),
        "version": String("437"),
        "digest": String("EYW4E1HbsEstwfXVwSNiDsnAKf4tbearCXYZjKzG2AeG"),
    },

...

```

Here you can see that there is a package published, the address is: 0x41a972fdd05da3ed9b6a9f960e96ef346c87958e20156efdb8fc3b7101e20b7a

Also created a forge: 0x3f148a8eea0c87fa67d5da477317b8027b5d06a72d5ed599c66e4cb067457894

Then try the above method to call, view the source code [ public entry fun sword_create(forge: &mut Forge, magic: u64, strength: u64, recipient: address, ctx: &mut TxContext) ](https://github.com/MystenLabs/sui/blob/main/sui_programmability/examples/move_tu torial/sources/my_module.move#L47)

Here you need to pass the Forge object created above, a number, a strength and the player address created for which player. So we use the following command:

```
 sui client call --function sword_create --module my_module --package 0x41a972fdd05da3ed9b6a9f960e96ef346c87958e20156efdb8fc3b7101e20b7a --args \"0x3f148a8eea0c87fa67d5da477317b8027b5d06a72d5ed599c66e4cb067457894\" 42 7 \"0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78\" --gas-budget 10000000
----- Transaction Digest ----
5pUN7mDjPzE6b2XW69XXyHhfXbV9hudbRa72p7SBJsWU
----- Transaction Data ----
Transaction Signature: [Signature(Ed25519SuiSignature(Ed25519SuiSignature([0, 59, 108, 245, 233, 137, 4, 76, 4, 11, 227, 63, 227, 222, 152, 100, 190, 79, 101, 66, 0, 135, 10, 15, 68, 123, 115, 140, 189, 238, 72, 9, 238, 157, 32, 138, 183, 86, 175, 170, 153, 190, 124, 61, 37, 151, 202, 154, 85, 246, 18, 147, 76, 135, 61, 15, 54, 67, 233, 157, 162, 106, 184, 91, 7, 169, 199, 105, 117, 112, 178, 123, 183, 21, 64, 74, 48, 213, 44, 198, 5, 91, 53, 13, 220, 193, 62, 56, 226, 106, 173, 54, 130, 46, 221, 25, 126])))]
Transaction Kind : Programmable
Inputs: [Object(ImmOrOwnedObject { object_id: 0x3f148a8eea0c87fa67d5da477317b8027b5d06a72d5ed599c66e4cb067457894, version: SequenceNumber(438), digest: o#9BjuYQVbkumgQEDo4c3E5BfCiKUYLiHfcsEubHB2oPua }), Pure(SuiPureValue { value_type: Some(U64), value: "42" }), Pure(SuiPureValue { value_type: Some(U64), value: "7" }), Pure(SuiPureValue { value_type: Some(Address), value: "0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78" })]
Commands: [
  MoveCall(0x41a972fdd05da3ed9b6a9f960e96ef346c87958e20156efdb8fc3b7101e20b7a::my_module::sword_create(Input(0),Input(1),Input(2),Input(3))),
]

----- Object changes ----
Array [
    ...
    Object {
        "type": String("created"),
        "sender": String("0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78"),
        "owner": Object {
            "AddressOwner": String("0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78"),
        },
        "objectType": String("0x41a972fdd05da3ed9b6a9f960e96ef346c87958e20156efdb8fc3b7101e20b7a::my_module::Sword"),
        "objectId": String("0x813310711be4141a3c6462f3a232aa5770a49c654f8cae842b392056201754be"),
        "version": String("439"),
        "digest": String("AkkkvoWdgUqPHV7ZKnRrcBYXf73jCMyM8V8jKntLK3Qx"),
    },
]
```
Open explorer [0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78](https://suiscan.xyz/testnet/account/0x65635b3ed941f633cdc51e79f7a73054154) via browser 4344c4dc44b09f5ac33964ff86d78/tx-blocks), you can see that we have one more Sword Object. That is the corresponding `sword_create` here

## client commands
First look at the help of the client command

First look at the help of the client command

```
sui client
sui-client 
Client for interacting with the Sui network

USAGE:
    sui client [OPTIONS] [SUBCOMMAND]

OPTIONS:
        --client.config <CONFIG>    Sets the file storing the state of our user accounts (an empty
                                    one will be created if missing)
    -h, --help                      Print help information
        --json                      Return command outputs in json format
    -y, --yes                       

SUBCOMMANDS:
    active-address           Default address used for commands when none specified
    active-env               Default environment used for commands when none specified
    addresses                Obtain the Addresses managed by the client
    call                     Call Move function
    chain-identifier         Query the chain identifier from the rpc endpoint
    dynamic-field            Query a dynamic field by its address
    envs                     List all Sui environments
    execute-signed-tx        Execute a Signed Transaction. This is useful when the user prefers
                                 to sign elsewhere and use this command to execute
    gas                      Obtain all gas objects owned by the address
    help                     Print this message or the help of the given subcommand(s)
    merge-coin               Merge two coin objects into one coin
    new-address              Generate new address and keypair with keypair scheme flag {ed25519
                                 | secp256k1 | secp256r1} with optional derivation path, default to
                                 m/44'/784'/0'/0'/0' for ed25519 or m/54'/784'/0'/0/0 for secp256k1
                                 or m/74'/784'/0'/0/0 for secp256r1. Word length can be { word12 |
                                 word15 | word18 | word21 | word24} default to word12 if not
                                 specified
    new-env                  Add new Sui environment
    object                   Get object info
    objects                  Obtain all objects owned by the address
    pay                      Pay coins to recipients following specified amounts, with input
                                 coins. Length of recipients must be the same as that of amounts
    pay-all-sui              Pay all residual SUI coins to the recipient with input coins, after
                                 deducting the gas cost. The input coins also include the coin for
                                 gas payment, so no extra gas coin is required
    pay-sui                  Pay SUI coins to recipients following following specified amounts,
                                 with input coins. Length of recipients must be the same as that of
                                 amounts. The input coins also include the coin for gas payment, so
                                 no extra gas coin is required
    publish                  Publish Move modules
    split-coin               Split a coin object into multiple coins
    switch                   Switch active address and network(e.g., devnet, local rpc server)
    transfer                 Transfer object
    transfer-sui             Transfer SUI, and pay gas with the same SUI coin object. If amount
                                 is specified, only the amount is transferred; otherwise the entire
                                 object is transferred
    tx-block                 Get the effects of executing the given transaction block
    upgrade                  Upgrade Move modules
    verify-bytecode-meter    Run the bytecode verifier on the package
    verify-source            Verify local Move packages against on-chain packages, and
                                 optionally their dependencies
```
There are a lot of commands, most of which correspond to RPC.

### Select Wallet

pass:
``` 
sui client addresses
Showing 1 result.
0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78 <=
```

You can list several wallets managed in the local keystore file. If you want to use the wallet with this address, you need to activate it first:
```
sui client switch --address 0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78
Active address switched to 0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78
```

You can also check which wallet is currently in use:
```
sui client active-address
0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78
```

### Operation object

Check which objects the current user has:
```
sui client active-address 
0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78
```

### Operation object

Check which objects the current user has:
```
sui client objects
                 Object ID                  |  Version   |                    Digest                    |   Owner Type    |               Object Type               
---------------------------------------------------------------------------------------------------------------------------------------------------------------------
 0x3f148a8eea0c87fa67d5da477317b8027b5d06a72d5ed599c66e4cb067457894 |    439     | IrEyy7NAHgkEZOYO811zNwYhMXw9Ai0GNxDch5XS1ig= |  AddressOwner   | Some(Struct(MoveObjectType(Other(StructTag { address: 41a972fdd05da3ed9b6a9f960e96ef346c87958e20156efdb8fc3b7101e20b7a, module: Identifier("my_module"), name: Identifier("Forge"), type_params: [] }))))
 0x48380fdd8db787840edbdd8281919f208500a0bf528eb5b8040477f8922ebde0 |    437     | 4FO2RwytmMPGTCJ9UEvgm83sol/yGfLz7nf20NWjApg= |  AddressOwner   | Some(Struct(MoveObjectType(Other(StructTag { address: 0000000000000000000000000000000000000000000000000000000000000002, module: Identifier("package"), name: Identifier("UpgradeCap"), type_params: [] }))))
 0x813310711be4141a3c6462f3a232aa5770a49c654f8cae842b392056201754be |    439     | kO6iPTXS2tx8XJ18KXzgtQ/dXlKOJ4/BBRwHEFNXe9U= |  AddressOwner   | Some(Struct(MoveObjectType(Other(StructTag { address: 41a972fdd05da3ed9b6a9f960e96ef346c87958e20156efdb8fc3b7101e20b7a, module: Identifier("my_module"), name: Identifier("Sword"), type_params: [] }))))
 0xb7c75543bb69b9f74448783ebfd37eba696d5361ad868df71326d87ef7356a1c |    439     | N35Y3VpQz/hUhN44uxHt6vKvOfE0CN9Fvv5v9WekfuE= |  AddressOwner   |  Some(Struct(MoveObjectType(GasCoin)))  
 0xef4a10156b03893cb66092bbe83e42acfb8e48b88a36623c15a1c5a57d780ca6 |    434     | FGRv1w+lXbaNayVOG+lMGKX0zn5eWlwSkmjYCytYnCM= |  AddressOwner   |  Some(Struct(MoveObjectType(GasCoin)))  
```

View a specific Object:
```
sui client object 0xb7c75543bb69b9f74448783ebfd37eba696d5361ad868df71326d87ef7356a1c
----- 0x2::coin::Coin<0x2::sui::SUI> (0xb7c75543bb69b9f74448783ebfd37eba696d5361ad868df71326d87ef7356a1c[0x1b7]) -----
Owner: Account Address ( 0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78 )
Version: 0x1b7
Storage Rebate: 988000
Previous Transaction: TransactionDigest(5pUN7mDjPzE6b2XW69XXyHhfXbV9hudbRa72p7SBJsWU)
----- Data -----
type: 0x2::coin::Coin<0x2::sui::SUI>
balance: 983198196
id: 0xb7c75543bb69b9f74448783ebfd37eba696d5361ad868df71326d87ef7356a1c
```

You can see that this is an object of SUI tokens, with a balance of 0.98.

To transfer your own Object to others, you can use the "transfer" command:
```
sui client transfer --to 0xcd2630011f6cb9aef960ed42d95b04e063c44a6143083ef89a35ea02b85c61b7 --object-id 0x813310711be4141a3c6462f3a232aa5770a49c654f8cae842b392056201754be  --gas-budget 10000000
----- Transaction Digest ----
4TXafTjLJovHcZWQQC7mCqihwr2uDAb3eMwHMjxLgYmX
----- Transaction Data ----
Transaction Signature: [Signature(Ed25519SuiSignature(Ed25519SuiSignature([0, 72, 184, 248, 184, 143, 193, 207, 32, 113, 58, 3, 133, 95, 103, 82, 216, 20, 252, 20, 165, 226, 88, 3, 11, 39, 11, 248, 239, 62, 126, 139, 23, 216, 173, 218, 115, 84, 7, 94, 0, 56, 226, 54, 25, 45, 160, 191, 123, 161, 235, 85, 85, 92, 121, 213, 92, 245, 70, 93, 68, 214, 234, 27, 11, 169, 199, 105, 117, 112, 178, 123, 183, 21, 64, 74, 48, 213, 44, 198, 5, 91, 53, 13, 220, 193, 62, 56, 226, 106, 173, 54, 130, 46, 221, 25, 126])))]
Transaction Kind : Programmable
Inputs: [Pure(SuiPureValue { value_type: Some(Address), value: "0xcd2630011f6cb9aef960ed42d95b04e063c44a6143083ef89a35ea02b85c61b7" }), Object(ImmOrOwnedObject { object_id: 0x813310711be4141a3c6462f3a232aa5770a49c654f8cae842b392056201754be, version: SequenceNumber(440), digest: o#5hNxPHwuydYAJLBtX4KprcnCXmYrFyrtEkLfXhFeiywL })]
Commands: [
  TransferObjects([Input(1)],Input(0)),
]
...
----- Object changes ----
Array [
    Object {
        "type": String("mutated"),
        "sender": String("0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78"),
        "owner": Object {
            "AddressOwner": String("0xcd2630011f6cb9aef960ed42d95b04e063c44a6143083ef89a35ea02b85c61b7"),
        },
        "objectType": String("0x41a972fdd05da3ed9b6a9f960e96ef346c87958e20156efdb8fc3b7101e20b7a::my_module::Sword"),
        "objectId": String("0x813310711be4141a3c6462f3a232aa5770a49c654f8cae842b392056201754be"),
        "version": String("441"),
        "previousVersion": String("440"),
        "digest": String("3LqgdhCymtjezu2ppcQX2xzjbLhew4gzaiyQUcWG54hq"),
    }
]
```
从结果中，可以看到， "0x813310711be4141a3c6462f3a232aa5770a49c654f8cae842b392056201754be"的owner变成了 "0xcd2630011f6cb9aef960ed42d95b04e063c44a6143083ef89a35ea02b85c61b7"。

### Operate the Coin object
The token object of SUI is a special existence, it is a
```
sui client object 0xb7c75543bb69b9f74448783ebfd37eba696d5361ad868df71326d87ef7356a1c
----- 0x2::coin::Coin<0x2::sui::SUI> (0xb7c75543bb69b9f74448783ebfd37eba696d5361ad868df71326d87ef7356a1c[0x1b7]) -----
Owner: Account Address ( 0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78 )
Version: 0x1b7
Storage Rebate: 988000
Previous Transaction: TransactionDigest(5pUN7mDjPzE6b2XW69XXyHhfXbV9hudbRa72p7SBJsWU)
----- Data -----
type: 0x2::coin::Coin<0x2::sui::SUI>
balance: 983198196
id: 0xb7c75543bb69b9f74448783ebfd37eba696d5361ad868df71326d87ef7356a1c
```


"0x2::sui::SUI" object, and there are multiple. Then there will be a need for splitting and merging.
```
sui client split-coin --coin-id  0xb7c75543bb69b9f74448783ebfd37eba696d5361ad868df71326d87ef7356a1c  --amounts 1000  --gas-budget 10000000
----- Transaction Digest ----
GUXNSZMRSgWjftfGCE1W9uzKtAfyADtjsDpKwAJzCzym
----- Transaction Data ----
Transaction Signature: [Signature(Ed25519SuiSignature(Ed25519SuiSignature([0, 135, 197, 78, 152, 52, 188, 229, 48, 170, 207, 12, 141, 132, 156, 252, 70, 216, 213, 117, 130, 95, 254, 193, 184, 118, 141, 155, 75, 165, 182, 55, 52, 66, 121, 20, 41, 98, 234, 149, 195, 71, 56, 209, 210, 155, 88, 92, 65, 66, 129, 189, 80, 62, 56, 0, 153, 151, 54, 84, 68, 10, 132, 109, 0, 169, 199, 105, 117, 112, 178, 123, 183, 21, 64, 74, 48, 213, 44, 198, 5, 91, 53, 13, 220, 193, 62, 56, 226, 106, 173, 54, 130, 46, 221, 25, 126])))]
Transaction Kind : Programmable
Inputs: [Object(ImmOrOwnedObject { object_id: 0xb7c75543bb69b9f74448783ebfd37eba696d5361ad868df71326d87ef7356a1c, version: SequenceNumber(442), digest: o#FyMgoZwo1e851AY2kVcoVS9jN5rLcKDeQqbUnVqyb2Tg }), Pure(SuiPureValue { value_type: Some(Vector(U64)), value: ["1000"] })]
Commands: [
  MoveCall(0x0000000000000000000000000000000000000000000000000000000000000002::pay::split_vec<0x2::sui::SUI>(Input(0),Input(1))),
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
        "version": String("443"),
        "previousVersion": String("442"),
        "digest": String("5zaJdg6tCcwQPfhyeAJRCeCzAezn7dwULuKtsP4MDUxQ"),
    },
    Object {
        "type": String("mutated"),
        "sender": String("0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78"),
        "owner": Object {
            "AddressOwner": String("0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78"),
        },
        "objectType": String("0x2::coin::Coin<0x2::sui::SUI>"),
        "objectId": String("0xef4a10156b03893cb66092bbe83e42acfb8e48b88a36623c15a1c5a57d780ca6"),
        "version": String("443"),
        "previousVersion": String("442"),
        "digest": String("ASGK8pcdRtCGqJvVKtkMmrZjPNAgpVkMd22DFioAhy2T"),
    },
    Object {
        "type": String("created"),
        "sender": String("0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78"),
        "owner": Object {
            "AddressOwner": String("0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78"),
        },
        "objectType": String("0x2::coin::Coin<0x2::sui::SUI>"),
        "objectId": String("0xd2a4b7892e6e4dce179c08ee62d07d1cc0117d698d6202219d11171efd61ee04"),
        "version": String("443"),
        "digest": String("7mybKGqLdKTrag7mTy4UgQwqzuXg1K2UGeTq3jEidPfo"),
    },
]
```

As you can see, a "0xd2a4b7892e6e4dce179c08ee62d07d1cc0117d698d6202219d11171efd61ee04" object was created. Its balance is:
``` 
sui client object 0xd2a4b7892e6e4dce179c08ee62d07d1cc0117d698d6202219d11171efd61ee04
----- 0x2::coin::Coin<0x2::sui::SUI> (0xd2a4b7892e6e4dce179c08ee62d07d1cc0117d698d6202219d11171efd61ee04[0x1bb]) -----
Owner: Account Address ( 0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78 )
Version: 0x1bb
Storage Rebate: 988000
Previous Transaction: TransactionDigest(GUXNSZMRSgWjftfGCE1W9uzKtAfyADtjsDpKwAJzCzym)
----- Data -----
type: 0x2::coin::Coin<0x2::sui::SUI>
balance: 1000
id: 0xd2a4b7892e6e4dce179c08ee62d07d1cc0117d698d6202219d11171efd61ee04
```

1000MIST。

At this point, our account has 3 SUI objects:
```
sui client objects
                 Object ID                  |  Version   |                    Digest                    |   Owner Type    |               Object Type               
---------------------------------------------------------------------------------------------------------------------------------------------------------------------
0xb7c75543bb69b9f74448783ebfd37eba696d5361ad868df71326d87ef7356a1c |    443     | Si6CwpX4HHKEvB5MJbV+SP+xjGuM4obWf3t2s3geRNk= |  AddressOwner   |  Some(Struct(MoveObjectType(GasCoin)))  
 0xd2a4b7892e6e4dce179c08ee62d07d1cc0117d698d6202219d11171efd61ee04 |    443     | ZKuqYAFpkn6tiIltSlUhAYCHq/UgG+fk9QZ2qSrJ07I= |  AddressOwner   |  Some(Struct(MoveObjectType(GasCoin)))  
 0xef4a10156b03893cb66092bbe83e42acfb8e48b88a36623c15a1c5a57d780ca6 |    443     | jDIEQ37PHge2DeHAUQwksQi3/SDAHfucb4L0dhNrDAQ= |  AddressOwner   |  Some(Struct(MoveObjectType(GasCoin)))  
```

So how about tidying up and merging them?
```
sui client merge-coin --primary-coin 0xb7c75543bb69b9f74448783ebfd37eba696d5361ad868df71326d87ef7356a1c --coin-to-merge 0xd2a4b7892e6e4dce179c08ee62d07d1cc0117d698d6202219d11171efd61ee04 --gas-budget 10000000

----- Transaction Digest ----
CBbiw6CCEQgBLi6ykZhWpL8AzMUBtuqUvi1hSAEuRNgF
----- Transaction Data ----
Transaction Signature: [Signature(Ed25519SuiSignature(Ed25519SuiSignature([0, 218, 66, 12, 152, 100, 210, 131, 92, 17, 236, 236, 153, 3, 24, 82, 115, 202, 173, 7, 130, 96, 14, 168, 24, 83, 17, 233, 109, 12, 105, 194, 167, 70, 0, 226, 144, 168, 2, 88, 211, 37, 224, 69, 240, 135, 204, 71, 92, 167, 34, 14, 120, 34, 54, 81, 181, 204, 219, 7, 172, 19, 227, 218, 1, 169, 199, 105, 117, 112, 178, 123, 183, 21, 64, 74, 48, 213, 44, 198, 5, 91, 53, 13, 220, 193, 62, 56, 226, 106, 173, 54, 130, 46, 221, 25, 126])))]
Transaction Kind : Programmable
Inputs: [Object(ImmOrOwnedObject { object_id: 0xb7c75543bb69b9f74448783ebfd37eba696d5361ad868df71326d87ef7356a1c, version: SequenceNumber(444), digest: o#6W7XEYdVzEnCJ7ZmG1tjmyriAJF5GpXSsgZRMqXHTrom }), Object(ImmOrOwnedObject { object_id: 0xd2a4b7892e6e4dce179c08ee62d07d1cc0117d698d6202219d11171efd61ee04, version: SequenceNumber(444), digest: o#JE6s7WghcWrZ9oELxCFdbGmfC8tbCRyDfL1n32RLXjVY })]
Commands: [
  MoveCall(0x0000000000000000000000000000000000000000000000000000000000000002::pay::join<0x2::sui::SUI>(Input(0),Input(1))),
]
...
```

Looking at it again, we only have 2 SUI Coin objects:
```

 sui client objects                                                                                                                                                                                              
                 Object ID                  |  Version   |                    Digest                    |   Owner Type    |               Object Type               
---------------------------------------------------------------------------------------------------------------------------------------------------------------------
0xb7c75543bb69b9f74448783ebfd37eba696d5361ad868df71326d87ef7356a1c |    445     | c4JiV2gAIApezzqypt/b7NZEod7QbPRqWPlZVv403jo= |  AddressOwner   |  Some(Struct(MoveObjectType(GasCoin)))  
 0xef4a10156b03893cb66092bbe83e42acfb8e48b88a36623c15a1c5a57d780ca6 |    445     | YPb2lDxMjMcxiXyoMGxM0fTGVppLYXTwx6xsideDPEo= |  AddressOwner   |  Some(Struct(MoveObjectType(GasCoin)))  
```

