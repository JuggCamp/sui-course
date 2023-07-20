# About Sui

Sui is a smart contract platform that is maintained by a group of validators who have a role similar to validators or miners in other blockchain systems. It offers scalability and low-latency for simple use cases by processing most transactions in parallel, which improves resource utilization and allows for increased throughput by adding more resources. Sui uses simpler and lower-latency primitives instead of consensus for simple use cases like payment transactions and assets transfer, which is unprecedented in the blockchain world and enables various latency-sensitive distributed applications.

Sui is written in Rust and supports smart contracts written in Sui Move, a powerful asset-centric adaptation of Move for the Sui blockchain. Sui tokens called SUI are used for gas payments and users can stake their SUI tokens with validators in a Delegated Proof-of-Stake model. Validators receive fees collected from transactions and can share rewards with users who stake their SUI tokens.

Sui transactions can be simple or complex, and simple transactions can bypass the consensus protocol. Complex transactions go through the Narwhal and Bullshark DAG-based mempool and efficient Byzantine Fault Tolerant (BFT) consensus.

Sui's system design allows for parallel agreement on causally independent transactions, which scales horizontally and eliminates the need for global consensus on a total-ordered list of transactions. This significant breakthrough is made possible by Sui's novel data model and Move programming language.

Sui highlights include unmatched scalability and instant settlement, a safe and accessible smart contract language, the ability to define rich and composable on-chain assets, and a better user experience for web3 apps.

Sui aims to provide the most accessible smart contract platform and empower developers to create great user experiences. It enables various applications like DeFi, reward and loyalty programs, complex games and business logic, asset tokenization services, and decentralized social media networks.

In terms of security, Sui provides high security guarantees by ensuring that assets can only be used by their owners and by implementing Byzantine fault tolerant broadcast and consensus. The security architecture of Sui relies on validators and requires transaction authorization through private signature keys.

## Parallel Agreement

Sui is a blockchain implementation that is designed to scale horizontally without any limitations in order to meet the demands of applications. It achieves this scalability while maintaining very low operating costs per transaction. The key innovation of Sui lies in its system design, which eliminates a major bottleneck present in existing blockchains. Unlike other blockchains that require global consensus on a total-ordered list of transactions, Sui achieves parallel agreement on transactions that are causally independent. This eliminates the wasteful computation associated with achieving global consensus when many transactions do not contend for the same resource against other transactions.

To accomplish this, Sui utilizes Byzantine Consistent Broadcast, enabling validators to commit causally independent transactions. This approach removes the overhead of global consensus while still ensuring the safety and liveness guarantees of the system.

This breakthrough in scalability is facilitated by Sui's novel data model, which adopts an object-centric view and utilizes strong ownership types in Move. This enables explicit encoding of dependencies. As a result, Sui can agree on and execute transactions on multiple objects in parallel. Transactions that affect shared state are ordered through Byzantine Fault Tolerant consensus and executed in parallel.

##  Scalability
Currently, users of existing blockchains face challenges such as high fees and slow transaction speeds. This creates a poor user experience and limits the potential of web3 applications. Specifically, games are slow and expensive, DeFi investors struggle to liquidate under-collateralized loans, and high gas prices lead to artificially inflated asset prices. Additionally, services like micro-payments and coupons are not feasible on these blockchains.

Sui addresses these issues by offering horizontal scalability. The network can expand its capacity by adding more workers, thereby increasing processing power and accommodating high network traffic. As a result, Sui ensures low gas fees even during peak periods. This scalability sets Sui apart from other blockchains with rigid limitations.

Sui validators, or nodes, have the ability to infinitely scale the network throughput in accordance with the needs of builders and creators. This scalability is a game-changer for web3, similar to how broadband internet revolutionized web2.

An experiment conducted on Sui reveals impressive results. A non-optimized single-worker Sui validator running on an 8-core M1 MacBook Pro achieved a throughput of 120,000 token transfer transactions per second (TPS). This indicates that throughput scales linearly with the number of cores. For instance, the same machine processed 25,000 TPS in a single core configuration.

The experiment employed a configuration where each client submitted a batch of 100 transactions with a single signature. This simulates the anticipated usage pattern of a highly scalable blockchain, such as a custodial wallet or game server operating at scale. With a batch size of 1, a validator running on the same machine achieved a throughput of 20,000 TPS with 8 cores. Furthermore, the throughput continues to grow linearly as more cores are added.

## Security

Sui is designed to provide very high security guarantees to asset owners. Assets on Sui can be used only by their owners, according to the logic pre-defined by smart contracts that can be audited, and that the network will be available to process them correctly despite some of the validators operating Sui not following the protocol correctly (fault tolerance).

The security features of the Sui system ensure a number of properties:

* Only the owner of an owned asset can authorize a transaction that operates on this asset. Authorization is performed through the use of a private signature key that is known only to the asset owner.
* Everyone can operate on shared assets or immutable assets, but additional access control logic can be implemented by the smart contract.
* Transactions operate on assets according to predefined rules set by the smart contract creator that defined the asset type. These are expressed using the Move language.
* Once a transaction is finalized, its effects - namely changes to the assets it operates on or new assets created - will be persisted, and the resulting assets will be available for further processing.
* The Sui system operates through a protocol between a set of independent validators. Yet all its security properties are preserved when a small subset of the validators do not follow the protocol.
* All operations in Sui can be audited to ensure any assets have been correctly processed. This implies all operations on Sui are visible to all, and users may wish to use multiple different addresses to protect their privacy.
* Validators are determined periodically through users of Sui locking and delegating SUI tokens to one or more validators.

The Sui system is operated by a set of validators that process transactions. They implement the Sui protocol that allows them to reach agreement on valid transactions submitted and processed in the system.

The agreement protocols Sui uses tolerate a fraction of validators not following the Sui protocol correctly, through the use of Byzantine fault tolerant broadcast and consensus. Specifically, each validator has some voting power, assigned to it through the process of users staking / voting for them using their SUI tokens. Sui maintains all its security properties if over 2/3 of the stake is assigned to validators that follow the protocol. However, a number of auditing properties are maintained even if more validators are faulty.
