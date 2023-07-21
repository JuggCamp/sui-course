# Core Concept


## Checkpoint

Sui is a DAG-based blockchain and uses checkpoints for node synchronization and global transaction ordering. Checkpoints differ from blocks in the following ways:

Sui creates checkpoints and adds finalized transactions. Note that transactions are finalized even before they are included in a checkpoint
Checkpoints do not fork, roll back, or reorganize.

Sui creates one checkpoint about every 3 seconds.

A checkpoint is established every time an increment is added to a blockchain resulting from a certified transaction. Checkpoints work much like a write ahead log that stores state prior to full execution of a program. The calls in that program represent a smart contract in a blockchain. A checkpoint contains not only the transactions but also commitments to the state of the blockchain before and after the transactions.

## Transaction
All updates to the Sui ledger happen via a transaction. A transaction in Sui is a change to the blockchain. This may be a simple transaction affecting only single-writer, single-address objects, such as minting an NFT or transferring an NFT or another token. These transactions may bypass the consensus protocol in Sui.

More complex transactions affecting objects that are shared or owned by multiple addresses, such as asset management and other DeFi use cases, will use  Narwhal and Bullshark DAG-based mempool and efficient Byzantine Fault Tolerant (BFT) consensus.

## Sponsored Transactions 

A Sui Sponsored transaction is one where a Sui address (the sponsor’s) pays the gas fees for a transaction initialized by another address (the user’s). You can use Sponsored transactions to cover the fees for users on your site or app so that they do not get charged for them. This removes a significant obstacle that web2 users encounter when entering web3, as they often have to purchase tokens to perform a transaction on chain. For example, you could increase conversion rates for gamers by sponsoring their early transactions.

You can use Sui Sponsored transactions to:

* Sponsor (pay gas fees for) a transaction initiated by a user.
* Sponsor transactions you initiate as the sponsor.
* Provide a wildcard GasData object to users. The object covers the gas fees for a user transaction. The GasData object covers any fee amount determined for the transaction as long as the budget is sufficient.

## Programmable Transaction

One of Sui’s most powerful core developer primitives is Programmable Transaction blocks. For conventional blockchains, a transaction is the fundamental unit of execution, and each transaction is typically simplistic and close to the VM execution. On Sui, the fundamental, atomic unit of execution is elevated to the level of a complex, composable sequence of transactions where:

Any public on-chain Move function across all smart contracts is accessible to the Programmable Transaction block.
Typed outputs from earlier on-chain Move calls can be chained as typed inputs to later on-chain Move calls. These types can be arbitrary Sui objects that carry a rich set of attributes and properties. Programmable Transaction blocks can be highly heterogeneous. A single block can extract a Player object from a smart contract wallet, use it to make a move in a Game, then send a Badge object won by the move to a multi-game TrophyCase, all without publishing any new smart contract code. The natural compositionality of these blocks allow existing contracts to seamlessly interoperate with both old and new code (for example, the Game does not have to know/care that the user stores their Player in a Multisig wallet or their Badge in a TrophyCase).

Chained transactions in a Programmable Transaction block execute and fail atomically. For example, a Defi programmable transaction block might perform multiple swaps across many distinct pools, mutating dozens of existing objects and creating new ones in the process. If one of these transactions fails, the chain breaks and causes the Programmable Transaction block to also fail.

Each Programmable Transaction block supports up to 1,024 transactions, which enables unbounded expressivity and efficiency. You can use these blocks for homogeneous batching (such as for payments or NFT mints), and heterogeneous chains of single-sender operations as described in the two preceding examples. Both modes leverage Sui's high-speed execution, and allow developers to push already low transaction fees even lower by packing more productive work into a single block.

With the power and convenience of Programmable Transaction blocks, developers on Sui are constructing increasingly sophisticated blocks customized for their applications. Sui’s programmability was highly expressive even before Programmable Transaction blocks. Now, a single execution can perform up to 1,024 heterogeneous operations. On most other blockchains, each of the 1,024 operations would be an individual transaction.

## Epoch

Operation of the Sui network is temporally partitioned into non-overlapping, approximate fixed-duration (e.g. 24-hour) epochs. During a particular epoch, the set of validators participating in the network and their voting power is fixed. At an epoch boundary, reconfiguration may occur and can change the set of validators participating in the network and their voting power. Conceptually, reconfiguration starts a new instance of the Sui protocol with the previous epoch's final state as genesis and the new set of validators as the operators. Besides validator set changes, tokenomics operations such as staking/un-staking, and distribution of staking rewards are also processed at epoch boundaries.

here [networkinfo](https://sui.io/networkinfo) is Epoch Duration setting information. 

## Narwhal and Bullshark

This is a brief introduction to Narwhal, and Bullshark, the high-throughput mempool and consensus engines offered by Mysten Labs. Sui uses Narwhal as the mempool and Bullshark as the consensus engine by default, to sequence transactions that require a total ordering, synchronize transactions between validators and periodically checkpoint the network's state.

The names highlight that the components split the responsibilities of:

* ensuring the availability of data submitted to consensus = Narwhal
* agreeing on a specific ordering of this data = Bullshark

The Sui Consensus Engine represents the latest variant of decades of work on multi-proposer, high-throughput consensus algorithms that reach throughputs of more than 125,000 transactions per second with a two-second latency for a deployment of 50 parties, with production cryptography, permanent storage, and a scaled-out primary-worker architecture.

## Object

The basic unit of storage in Sui is object. In contrast to many other blockchains where storage is centered around accounts and each account contains a key-value store, Sui's storage is centered around objects. A smart contract is an object (called a Sui Move package), and these smart contracts manipulate objects on the Sui network:

* Sui Move Package: a set of Sui Move bytecode modules. Each module has a name that's unique within the package. The combination of the package ID and the name of a module uniquely identifies the module. When you publish smart contracts to Sui, a package is the unit of publishing. Once a package object is published, it is immutable and can never be changed or removed. A package object can depend on other package objects that were previously published to the Sui ledger.

* Sui Move Object: typed data governed by a particular Sui Move module from a Sui Move package. Each object value is a struct with fields that can contain primitive types (e.g. integers, addresses), other objects, and non-object structs. Each object value is mutable and owned by an address at the time of its creation, but can subsequently be frozen and become permanently immutable, or be shared and thus become accessible by other addresses.


## Gas
A Sui transaction must pay for both the computational cost of execution and the long-term cost of storing the objects a transaction creates or mutates. Specifically, Sui’s Gas Pricing Mechanism is such that any transaction pays the following gas fees:

    total_gas_fees = computation_units * gas_price + storage_units * storage_price

where gas_price is the amount provided by the transaction signer and gas_price >= reference_gas_price.

While computation and storage fees are separate, they are conceptually similar in that they each translate computation or storage into SUI terms by multiplying computation or storage units by the relevant price.

Finally, Sui’s Storage mechanics provide storage fee rebates whenever a transaction deletes previously-stored objects. Hence, the net fees that a user pays equals Gas Fees minus the rebates associated with data deletion:

    net_gas_fees = computation_gas_fee + storage_gas_fee - storage_rebate

The [Reference Gas Price](https://docs.sui.io/learn/tokenomics/gas-pricing#computation-gas-prices) translates the real-time cost of executing a transaction into SUI units and is updated at each epoch boundary by the validator set. Similarly, the [Storage Price](https://docs.sui.io/learn/tokenomics/gas-pricing#storage-gas-prices) translates the long-term cost of storing data on-chain into SUI units and is updated infrequently; often remaining constant for various consecutive epochs. During regular network operations, all Sui users should expect to pay the Reference Gas Price and Storage Price for computation and storage, respectively.

Different Sui transactions require varying amounts of computational time in order to be processed and executed. Sui translates these varying operational loads into transaction fees by measuring each transaction in terms of Computation Units. All else equals, more complex transactions will require more Computation Units.

Similarly, Sui transactions vary depending on the amount of new data written into on-chain storage. The variable Storage Units captures these difference by mapping the amount of bytes held in storage into storage units. Sui’s current schedule is linear and maps each byte into 100 storage units. So, for example, a transaction that stores 25 bytes will cost 2,500 Storage Units while a transaction that stores 75 bytes will cost 7,500 units.

All transactions need to be submitted together with a Gas Budget. This provides a cap to the amount of Gas Fees a user will pay, especially since in some cases it may be hard to perfectly forecast how much a transaction will cost before it is submitted to the Sui Network.

A transaction’s Gas Budget is defined in SUI units and transactions will be successfully executed if:

    gas_budget >= max{computation_fees,total_gas_fees}

The minimum Gas Budget is 2,000 MIST. The maximum Gas Budget is 50 billion MIST or 50 SUI. This protects the network against overflow of internal multiplications and gas limits for denial of service attack.

## Cryptography


Sui follows SLIP-0010 for managing wallets that support the Ed25519 (EdDSA) signing scheme.

For managing wallets that support the Ed25519 (EdDSA) signing scheme, Sui follows SLIP-0010, which enforces wallets to always derive child private keys from parent private keys using the hardened key path.

Sui follows BIP-32 for managing wallets that support the ECDSA Secp256k1 and ECDSA Secp256r1 signing scheme.

BIP-32 defines the hierarchical deterministic wallet structure to logically associate a set of keys. Grouping keys in this manner reduces the overhead of keeping track of a large number of private keys for a user. This method also lets custodians issue distinct managed addresses for each user account under one source of control. Using BIP-32 decouples the private key derivation from the public key derivation, enabling the watch-only wallet use case, where a chain of public keys and its addresses can be derived, while the private key can be kept offline for signing.

When a user submits a signed transaction, a serialized signature and a serialized transaction data is submitted. The serialized transaction data is the BCS serialized bytes of the struct TransactionData and the serialized signature is defined as a concatenation of bytes of flag || sig || pk.

The flag is a 1-byte representation corresponding to the signature scheme that the signer chooses. The signing scheme and its corresponding flag are defined below:

|Scheme|	Flag|
|---|---|
|Pure Ed25519	|0x00|
|ECDSA Secp256k1	|0x01|
|ECDSA Secp256r1	|0x02|
|MultiSig	|0x03|

The sig bytes is the compressed bytes representation of the signature instead of DER encoding. See the expected size and format below:

|Scheme|Signature|
|---|---|
|Pure Ed25519	|Compressed, 64 bytes
|ECDSA Secp256k1|Non-recoverable, compressed, 64 bytes
|ECDSA Secp256r1|	Non-recoverable, compressed, 64 bytes
|MultiSig|	BCS serialized all signatures, size varies


The pk bytes is the bytes representation of the public key corresponding to the signature.

|Scheme	Public key
|---|---|---|
|Pure Ed25519|	Compressed, 32 bytes
|ECDSA Secp256k1|	Compressed, 33 bytes
|ECDSA Secp256r1|	Compressed, 33 bytes
|MultiSig|	BCS serialized all participating public keys, size varies


## Kiosk

Sui Kiosk is a primitive, or building block (a module in the Sui Framework), you can use to build a trading platform for digital assets. Sui Kiosk supports adding digital assets that you can store and list for sale to other users. You can also define rules for the kiosk as part of a transfer policy that controls how purchasers can use the asset after purchase. To add digital assets to your kiosk to list for sale, you must first create and publish a package to Sui as part of a programmable transaction block. The package must define a type (T). You can then create a transfer policy (TransferPolicy) using the Publisher object. The transfer policy which determines the conditions that must be met for the purchase to succeed. You can specify different requirements for each asset and transaction. To learn more about transfer policies, see Transfer Policy. To learn more about using the Publisher object, see Publisher in Sui by Example.

To extend and customize Kiosk functionality, Sui Kiosk also supports building extensions that take full advantage of the highly accessible, composable, and dynamic nature of objects on Sui.