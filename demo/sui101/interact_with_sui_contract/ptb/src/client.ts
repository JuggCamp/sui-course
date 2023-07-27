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