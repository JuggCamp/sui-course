# Wallet for Sui

Sui has implemented a wallet based on the Chrome browser extension called [Sui Wallet browser extension](https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil). Additionally, Sui has developed a [Wallet Adapter](https://github.com/MystenLabs/sui/tree/main/sdk/wallet-adapter) mechanism to facilitate interactions between DApps and wallets. Therefore, by implementing the relevant methods in this Adapter, it can be easily integrated into the Sui ecosystem, such as...

* [Suiet](https://suiet.app/) 
* [Trust Wallet](https://trustwallet.com/sui-wallet/) 
* [Martian Sui Wallet](https://martianwallet.xyz/sui-wallet/)

Below, we will take the official wallet as an example and list the usage methods.

## Sui Wallet 

### Install

### Create an account

### Send Tokens

### Receive Tokens



## DApp integration of wallets

As mentioned above, the [Wallet Adapter](https://github.com/MystenLabs/sui/tree/main/sdk/wallet-adapter) defines a set of methods for DApps to interact with wallets. Therefore, as a DApp, as long as you call wallet-related methods according to this specification, you can integrate with multiple wallets.
For React projects, the official implementation of `'@mysten/wallet-kit'` provides some UI support.

### Connect Wallet
Before connecting to a wallet, first check if the wallet is installed:

```
    import { useWalletKit, type WalletWithFeatures } from '@mysten/wallet-kit';

    type QredoConnectInput = {
        service: string;
        apiUrl: string;
        token: string;
        organization: string;
    };
    type QredoConnectFeature = {
        'qredo:connect': {
            version: '0.0.1';
            qredoConnect: (input: QredoConnectInput) => Promise<void>;
        };
    };
    type QredoConnectWallet = WalletWithFeatures<Partial<QredoConnectFeature>>;



    const { wallets } = useWalletKit();
    const selectedWallet = wallets.filter(
        (aWallet) =>
            'wallet' in aWallet && !!(aWallet.wallet as QredoConnectWallet).features['qredo:connect'],
    )[0];
    if (!selectedWallet || !('wallet' in selectedWallet)) {
        // no wallet installed
    }
```
If it is not installed, prompt the user to install it. If installed, show the Link button:

```
		<button
			onClick={async () => {
				try {
					await qredoConnectWallet.features['qredo:connect']?.qredoConnect({
						service: 'qredo-testing',
						apiUrl: 'http://localhost:8080/connect/sui',
						token: 'aToken',
						organization: 'org1',
					});
				} catch (e) {
					console.log(e);
				}
			}}
		>
			Connect
		</button>
```

### Sending your Message

When sending a transaction, first construct your transaction, and then call Adapter's signMessage method to sign it：

```
    import { ConnectButton, useWalletKit } from '@mysten/wallet-kit';

	const {
		currentWallet,
		currentAccount,
		signTransactionBlock,
		signAndExecuteTransactionBlock,
		signMessage,
	} = useWalletKit();

    <button
        onClick={async () => {
            console.log(
                await signMessage({
                    message: new TextEncoder().encode('Message to sign'),
                }),
            );
        }}
	    >
					Sign message
	</button>
```

### Sign And Send Transaction
Sign And Send Transaction invoke `signAndExecuteTransactionBlock` method：

```
    import { ConnectButton, useWalletKit } from '@mysten/wallet-kit';

	const {
		currentWallet,
		currentAccount,
		signTransactionBlock,
		signAndExecuteTransactionBlock,
		signMessage,
	} = useWalletKit();

    <button
        onClick={async () => {
            const txb = new TransactionBlock();
            const [coin] = txb.splitCoins(txb.gas, [txb.pure(1)]);
            txb.transferObjects([coin], txb.pure(currentAccount!.address));

            console.log(
                await signAndExecuteTransactionBlock({
                    transactionBlock: txb,
                    options: { showEffects: true },
                }),
            );
        }}
	    >
					Sign And Send
	</button>

```

## Reference

* [Sui Wallet by Mysten Labs](https://docs.mystenlabs.com/wallet)
* [Wallet Adapter](https://github.com/MystenLabs/sui/tree/main/sdk/wallet-adapter)