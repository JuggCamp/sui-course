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
    const buf = Buffer.from("AOABctqzDSbXSaN/sWIjZqC3g0+64i+JjQjAWWbf6mmS", "base64");
    const keyPair = Ed25519Keypair.fromSecretKey(buf.slice(1));
    console.log(keyPair.getPublicKey().toSuiAddress());

    let txb = new TransactionBlock();
    const signer = new RawSigner(keyPair, suiProvider);
    txb.moveCall({
        target: `0x391be525adf65dc7b9317f800c583dcee8a973438ddb4859677e3514b696cb3b::color_object::create`,
        arguments: [txb.pure(2), txb.pure(4), txb.pure(8)],
    });
    const result = await signer.signAndExecuteTransactionBlock({
        transactionBlock: txb,
    });
    console.log({ result });
};

run();