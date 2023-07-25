# Introduction to RPC
What are RPCs?

> In distributed computing, a remote procedure call (RPC) is
> when a computer program causes a procedure (subroutine) to
> execute in a different address space (commonly on another computer on a shared network)
>
> -- wikipedia

Those who write code should know what RPC is, but what is the relationship between RPC and blockchain?

Quoting an architecture diagram of Polkadot:

![](./assets/images/dot_arch.png)

RPC is used as a layer interface call for the blockchain system to interact with the outside world. directly used by ordinary users.

But why can't ordinary users perceive the existence of RPC? Ordinary users only know the wallet, pull it up, confirm = "the coin is gone.

This is because our group of programmers helped to connect the intermediate processes in series through code. So RPC is again a bridge between the user interface and the blockchain.

The RPC provided by Sui is divided into the HTTP interface for active requests and the Websocket interface for message push. Only a single query generally uses the HTTP interface,
Such as sending transactions, querying user balances. The monitoring of data on the chain is through the Websocket interface, such as monitoring the log of contract execution.

## HTTP API
The HTTP interface provides external services through JSON RPC format, [JSON RPC](https://www.jsonrpc.org/) is a
The RPC mode uses JSON as the serialization tool and HTTP as the transport protocol. It has multiple versions, and the current version is v2.

The request format is:
```
     {
         "jsonrpc": "2.0",
         "id": 1,
         "method": "sui_getCheckpoint",
         "params": [
             "1000"
         ]
     }
```

The outermost layer here is a dictionary, in which each Key is fixed, and method represents the function method name of RPC. params represents the parameters of the function.

The corresponding request result is:

```
     {
         "jsonrpc": "2.0",
         "result": {
            
             },
         "id": 1
     }
```

Similarly, several fields here are also fixed, and result indicates the result of the request. The id corresponds to the id in the request, which indicates the result of the request.

### sui_getChainIdentifier
Return the first four bytes of the chain's genesis checkpoint digest.

use curl in your console:

```
curl https://fullnode.testnet.sui.io:443      -X POST -H "Content-Type: application/json" -d '
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "sui_getChainIdentifier",
  "params": []
}
'
{"jsonrpc":"2.0","result":"4c78adac","id":1}%   
```

here we got  "4c78adac" 


### sui_getCheckpoint
Return a checkpoint

*Params*

* id : <CheckpointId> - Checkpoint identifier, can use either checkpoint digest, or checkpoint sequence number as input.


*Result* 

* Checkpoint : <Checkpoint>
    * checkpointCommitments : <[CheckpointCommitment]> - Commitments to checkpoint state
    * digest : <[CheckpointDigest]> - Checkpoint digest
    * endOfEpochData : <[EndOfEpochData]> - Present only on the final checkpoint of the epoch.
    * epoch : <[BigInt_for_uint64]> - Checkpoint's epoch ID
    * epochRollingGasCostSummary : <[GasCostSummary]> - The running total gas costs of all transactions included in the current epoch so far until this checkpoint.
    * networkTotalTransactions : <[BigInt_for_uint64]> - Total number of transactions committed since genesis, including those in this checkpoint.
    * previousDigest : <[CheckpointDigest]> - Digest of the previous checkpoint
    * sequenceNumber : <[BigInt_for_uint64]> - Checkpoint sequence number
    * timestampMs : <[BigInt_for_uint64]> - Timestamp of the checkpoint - number of milliseconds from the Unix epoch Checkpoint timestamps are monotonic, but not strongly monotonic - subsequent checkpoints can have same timestamp if they originate from the same underlining consensus commit
    *transactions : <[TransactionDigest]> - Transaction digests
    * validatorSignature : <[Base64]> - Validator Signature

```
 curl https://fullnode.testnet.sui.io:443      -X POST -H "Content-Type: application/json" -d '
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "sui_getCheckpoint",
  "params": [
    "5693351"
  ]
}
'
{"jsonrpc":"2.0","result":{"epoch":"68","sequenceNumber":"5693351","digest":"H5v1vGaSSEh8u6vNk6JtSnw1STtcWm7Hg7VLALdFh5AL","networkTotalTransactions":"725683419","previousDigest":"DH8Gg17k2QHQLJGGd5GoE5tmbbZoxDmCoDZdNAF1CATg","epochRollingGasCostSummary":{"computationCost":"1692109600000","storageCost":"6622656537600","storageRebate":"5699894569380","nonRefundableStorageFee":"57574692620"},"timestampMs":"1689664916252","transactions":["rbwefDPSExSpAZPqBRzRx6LAuBEMsrHPyTZ1NCsBpGG","3JTWB1E2VGf9zQCb6Z53CXLfxywTHFN6Dhpyt7LHhkvy","7KPTiREJpm8msHcVZEF87XEgL1v7vrrpXCsXy4yWTg6F","8mkLZtiqd4eLiHMkmNUzZxivARHsbum3k1g4x5xoUsJS","9Bs25Z26N8FZdXrESr5UBdtBMC6X54qDdvfywkwBSds3","9ebzhdQ3n7vu3s3dKeHQdQ9jxPocMyUpsdMD3DjAUZxS","9hD8sz7ow6rsegKFFPmmwdD66Uc4t4p351k7w7jYhc5P","HqcDMCHKXmJyktZM65B79NhMjMGwoYNv33B7zcLhSBXm","9nfG3XQAzT7efdYfeFqfkxj6X1rXJjKWxu9jbt1gHkwm","9vhzwWxk1QEg4AeeyAPs2949pYhiPPHazkB9vGJRpk4e","AEbq2WYV6G7oqhKMFsFWkVu4JwiWs7CSxCLALC42eGfN","BCMvvxPqeqGwcMqq89XYG8aFw455JgLyBVogT3HqSxWY","BWEZ3iJ8bmb4bESMZfce9ALfdzFTpUQ81xsXXci2zuWf","C4A3gA7eqzRG6qZxh9DSbu7sKKHhVyxxuH7NkUKPAVed","CDxgXaBpExSmEBDxCAZmteQ7DR8FKgqbiE3EG3SaUmX1","CRRLvqqj88ot8D3N6HdebUP295QQExsRTq9BA7WHxk4B","D4JcW7deXjxZm4RqHvat9srmXPpcPpFGHLJvFAFbABz8","DPmm7JybYcUSLDedikNMZRgtPvujEZ8PmJYeA36JdkCj","EEsiVCSg5aKMpaYWwQa2XfnJcPUPQBEUphP7wkE2PeLe","EGtD57KYc1XYePzC6h6YqnZgwJ4DKZ7zHiiBj7jz8n7v","F2FowChdZtmEm3NvNJkygxVjQjWMfRctHdC1m1QSwycs","GWM24Jf5PAvzQVhsh41cFifaLiVHXT8CESRVZV78UrLm","GexPe2nWJA6J59vsbNxtihiHGgsbQrv5997kK8Q1gdLS","HCmiGq1tidjRRpdDDdZBG5TtJojzX2K1iVy141esm3Q7","Ha2rry6xPXqAW2gbz8gtRjwh8UyEzFEX8ZgyYZHfeMPu"],"checkpointCommitments":[],"validatorSignature":"r+6Te3Nfa2urOvpHYgNxNUPDxSP71RvnnwBUdfZT3T4ealhR7oCofmTRKxA+2ESV"},"id":1}%  
```

### sui_getEvents

Return transaction events.

*Params*

* transaction_digest : <TransactionDigest> - the event query criteria.

*Result*

* Vec<SuiEvent> : <[Event]>

```
curl https://fullnode.testnet.sui.io:443      -X POST -H "Content-Type: application/json" -d '
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "sui_getEvents",
  "params": [
    "HqcDMCHKXmJyktZM65B79NhMjMGwoYNv33B7zcLhSBXm"
  ]
}
'
{"jsonrpc":"2.0","result":[],"id":1}
```

it means no event in this transaction.

### sui_getLatestCheckpointSequenceNumber
Return the sequence number of the latest checkpoint that has been executed


*Result*

* BigInt<u64> : <BigInt_for_uint64>

```
curl https://fullnode.testnet.sui.io:443      -X POST -H "Content-Type: application/json" -d '
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "sui_getLatestCheckpointSequenceNumber",
  "params": []
}
'
{"jsonrpc":"2.0","result":"6219466","id":1}%      

```

here sequence will be use in transaction.

### sui_getObject

Return the object information for a specified object

*Params*

* object_id : <ObjectID> - the ID of the queried object
* options : <ObjectDataOptions> - options for specifying the content to be returned

*Result*

* SuiObjectResponse : <SuiObjectResponse>
    * data : <[ObjectData]>
    * error : <[ObjectResponseError]>


```
curl https://fullnode.testnet.sui.io:443      -X POST -H "Content-Type: application/json" -d '
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "sui_getObject",
  "params": [
    "0xef4a10156b03893cb66092bbe83e42acfb8e48b88a36623c15a1c5a57d780ca6",
    {
      "showType": true,
      "showOwner": true,
      "showPreviousTransaction": true,
      "showDisplay": false,
      "showContent": true,
      "showBcs": false,
      "showStorageRebate": true
    }
  ]
}
'

{"jsonrpc":"2.0","result":{"data":{"objectId":"0xef4a10156b03893cb66092bbe83e42acfb8e48b88a36623c15a1c5a57d780ca6","version":"445","digest":"7XWZAJmNesE4wQc9jWZkqG8tHTobg8hLrcgFpjrRZLLq","type":"0x2::coin::Coin<0x2::sui::SUI>","owner":{"AddressOwner":"0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78"},"previousTransaction":"CBbiw6CCEQgBLi6ykZhWpL8AzMUBtuqUvi1hSAEuRNgF","storageRebate":"988000","content":{"dataType":"moveObject","type":"0x2::coin::Coin<0x2::sui::SUI>","hasPublicTransfer":true,"fields":{"balance":"995950600","id":{"id":"0xef4a10156b03893cb66092bbe83e42acfb8e48b88a36623c15a1c5a57d780ca6"}}}}},"id":1}

```

here it is a SUI Coin Object，and balance is 995950600 MIST.

### sui_getTransactionBlock

Return the transaction response object.

*Params*

* digest : <TransactionDigest> - the digest of the queried transaction
* options : <TransactionBlockResponseOptions> - options for specifying the content to be returned

*Result*

* SuiTransactionBlockResponse : <TransactionBlockResponse>

```
curl https://fullnode.testnet.sui.io:443      -X POST -H "Content-Type: application/json" -d '
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "sui_getTransactionBlock",
  "params": [
    "CBbiw6CCEQgBLi6ykZhWpL8AzMUBtuqUvi1hSAEuRNgF",
    {
      "showInput": true,
      "showRawInput": false,
      "showEffects": true,
      "showEvents": true,
      "showObjectChanges": false,
      "showBalanceChanges": false
    }
  ]
}
'

{"jsonrpc":"2.0","result":{"digest":"CBbiw6CCEQgBLi6ykZhWpL8AzMUBtuqUvi1hSAEuRNgF","transaction":{"data":{"messageVersion":"v1","transaction":{"kind":"ProgrammableTransaction","inputs":[{"type":"object","objectType":"immOrOwnedObject","objectId":"0xb7c75543bb69b9f74448783ebfd37eba696d5361ad868df71326d87ef7356a1c","version":"444","digest":"6W7XEYdVzEnCJ7ZmG1tjmyriAJF5GpXSsgZRMqXHTrom"},{"type":"object","objectType":"immOrOwnedObject","objectId":"0xd2a4b7892e6e4dce179c08ee62d07d1cc0117d698d6202219d11171efd61ee04","version":"444","digest":"JE6s7WghcWrZ9oELxCFdbGmfC8tbCRyDfL1n32RLXjVY"}],"transactions":[{"MoveCall":{"package":"0x0000000000000000000000000000000000000000000000000000000000000002","module":"pay","function":"join","type_arguments":["0x2::sui::SUI"],"arguments":[{"Input":0},{"Input":1}]}}]},"sender":"0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78","gasData":{"payment":[{"objectId":"0xef4a10156b03893cb66092bbe83e42acfb8e48b88a36623c15a1c5a57d780ca6","version":444,"digest":"AiZeZjy396HM1JyNHEufHqtaZaPFF1mJbxrjzw3PMZQh"}],"owner":"0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78","price":"1000","budget":"10000000"}},"txSignatures":["ANpCDJhk0oNcEezsmQMYUnPKrQeCYA6oGFMR6W0MacKnRgDikKgCWNMl4EXwh8xHXKciDngiNlG1zNsHrBPj2gGpx2l1cLJ7txVASjDVLMYFWzUN3ME+OOJqrTaCLt0Zfg=="]},"effects":{"messageVersion":"v1","status":{"status":"success"},"executedEpoch":"74","gasUsed":{"computationCost":"1000000","storageCost":"1976000","storageRebate":"2934360","nonRefundableStorageFee":"29640"},"modifiedAtVersions":[{"objectId":"0xb7c75543bb69b9f74448783ebfd37eba696d5361ad868df71326d87ef7356a1c","sequenceNumber":"444"},{"objectId":"0xef4a10156b03893cb66092bbe83e42acfb8e48b88a36623c15a1c5a57d780ca6","sequenceNumber":"444"},{"objectId":"0xd2a4b7892e6e4dce179c08ee62d07d1cc0117d698d6202219d11171efd61ee04","sequenceNumber":"444"}],"transactionDigest":"CBbiw6CCEQgBLi6ykZhWpL8AzMUBtuqUvi1hSAEuRNgF","mutated":[{"owner":{"AddressOwner":"0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78"},"reference":{"objectId":"0xb7c75543bb69b9f74448783ebfd37eba696d5361ad868df71326d87ef7356a1c","version":445,"digest":"8muCTsQg43P6jMfxysWELpiAbwb73q3axTjCxdqGxpCR"}},{"owner":{"AddressOwner":"0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78"},"reference":{"objectId":"0xef4a10156b03893cb66092bbe83e42acfb8e48b88a36623c15a1c5a57d780ca6","version":445,"digest":"7XWZAJmNesE4wQc9jWZkqG8tHTobg8hLrcgFpjrRZLLq"}}],"deleted":[{"objectId":"0xd2a4b7892e6e4dce179c08ee62d07d1cc0117d698d6202219d11171efd61ee04","version":445,"digest":"7gyGAp71YXQRoxmFBaHxofQXAipvgHyBKPyxmdSJxyvz"}],"gasObject":{"owner":{"AddressOwner":"0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78"},"reference":{"objectId":"0xef4a10156b03893cb66092bbe83e42acfb8e48b88a36623c15a1c5a57d780ca6","version":445,"digest":"7XWZAJmNesE4wQc9jWZkqG8tHTobg8hLrcgFpjrRZLLq"}},"dependencies":["GfyC7K44Td8EtD1YqenAvpYdJE7vTNPwCf1Du2GV9qNi","JC2ajsNE6wrjoiPZPA7hHhXx2av9RR5e9RGzTXYGJRdk"]},"events":[],"timestampMs":"1690188176781","checkpoint":"6218155"},"id":1}

```

### suix_getAllBalances
Return the total coin balance for all coin type, owned by the address owner.

*Params*

* owner : <SuiAddress> - the owner's Sui address

*Result*

* Vec<Balance> : <[Balance]>

```
 curl https://fullnode.testnet.sui.io:443      -X POST -H "Content-Type: application/json" -d '
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "suix_getAllBalances",
  "params": [
    "0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78"
  ]
}
'
{"jsonrpc":"2.0","result":[{"coinType":"0x2::sui::SUI","coinObjectCount":2,"totalBalance":"1977124704","lockedBalance":{}}],"id":1}% 
```

here account"0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78" only has SUI, and balance is 1.97SUI.

### suix_getAllCoins
Return all Coin objects owned by an address.

*Params*

* owner : <SuiAddress> - the owner's Sui address
* cursor : <ObjectID> - optional paging cursor
* limit : <uint> - maximum number of items per page

*Result*

* CoinPage : <Page_for_Coin_and_ObjectID>

```
curl https://fullnode.testnet.sui.io:443      -X POST -H "Content-Type: application/json" -d '
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "suix_getAllCoins",
  "params": [
    "0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78"
  ]
}
'
{"jsonrpc":"2.0","result":{"data":[{"coinType":"0x2::sui::SUI","coinObjectId":"0xb7c75543bb69b9f74448783ebfd37eba696d5361ad868df71326d87ef7356a1c","version":"445","digest":"8muCTsQg43P6jMfxysWELpiAbwb73q3axTjCxdqGxpCR","balance":"981174104","previousTransaction":"CBbiw6CCEQgBLi6ykZhWpL8AzMUBtuqUvi1hSAEuRNgF"},{"coinType":"0x2::sui::SUI","coinObjectId":"0xef4a10156b03893cb66092bbe83e42acfb8e48b88a36623c15a1c5a57d780ca6","version":"445","digest":"7XWZAJmNesE4wQc9jWZkqG8tHTobg8hLrcgFpjrRZLLq","balance":"995950600","previousTransaction":"CBbiw6CCEQgBLi6ykZhWpL8AzMUBtuqUvi1hSAEuRNgF"}],"nextCursor":"0xef4a10156b03893cb66092bbe83e42acfb8e48b88a36623c15a1c5a57d780ca6","hasNextPage":false},"id":1}%
```
here no "cursor","limit" will got all coins. in the result all coins' object returned.

### suix_getBalance
Return the total coin balance for one coin type, owned by the address owner.

*Params*

* owner : <SuiAddress> - the owner's Sui address
* coin_type : <string> - optional type names for the coin (e.g., 0x168da5bf1f48dafc111b0a488fa454aca95e0b5e::usdc::USDC), default to 0x2::sui::SUI if not specified.

*Result*

* Balance : <Balance>
  * coinObjectCount : <uint>
  * coinType : <string>
  * lockedBalance : <object>
  * totalBalance : <BigInt_for_uint128>

```
curl https://fullnode.testnet.sui.io:443      -X POST -H "Content-Type: application/json" -d '
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "suix_getBalance",
  "params": [
    "0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78",
    "0x2::sui::SUI"
  ]
}
'
{"jsonrpc":"2.0","result":{"coinType":"0x2::sui::SUI","coinObjectCount":2,"totalBalance":"1977124704","lockedBalance":{}},"id":1}
```
here we got two 0x2::sui::SUI Object.

### suix_getCoinMetadata

Return metadata(e.g., symbol, decimals) for a coin

*Params*

* coin_type : <string> - type name for the coin (e.g., 0x168da5bf1f48dafc111b0a488fa454aca95e0b5e::usdc::USDC)

*Result*

* SuiCoinMetadata : <SuiCoinMetadata>
    * decimals : <uint8> - Number of decimal places the coin uses.
    * description : <string> - Description of the token
    * iconUrl : <string,null> - URL for the token logo
    * id : <[ObjectID]> - Object id for the CoinMetadata object
    * name : <string> - Name for the token
    * symbol : <string> - Symbol for the token

```
curl https://fullnode.testnet.sui.io:443      -X POST -H "Content-Type: application/json" -d '
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "suix_getCoinMetadata",
  "params": [
    "0x2::sui::SUI"
  ]
}
'
{"jsonrpc":"2.0","result":{"decimals":9,"name":"Sui","symbol":"SUI","description":"","iconUrl":null,"id":"0x587c29de216efd4219573e08a1f6964d4fa7cb714518c2c8a0f29abfa264327d"},"id":1}% 
```

here we got name/symbol/iconUrl etc... of SUI


### suix_getCoins
Return all Coin<`coin_type`> objects owned by an address.

*Params*

* owner : <SuiAddress> - the owner's Sui address
* coin_type : <string> - optional type name for the coin (e.g., 0x168da5bf1f48dafc111b0a488fa454aca95e0b5e::usdc::USDC), default to 0x2::sui::SUI if not specified.
* cursor : <ObjectID> - optional paging cursor
* limit : <uint> - maximum number of items per page

*Result*

* CoinPage : <Page_for_Coin_and_ObjectID>
Example
Gets all SUI coins owned by the address provided. Return a paginated list of `limit` results per page. Similar to `suix_getAllCoins`, but provides a way to filter by coin type.

```
url https://fullnode.testnet.sui.io:443      -X POST -H "Content-Type: application/json" -d '
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "suix_getCoins",
  "params": [
    "0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78",
    "0x2::sui::SUI"
  ]
}
'
{"jsonrpc":"2.0","result":{"data":[{"coinType":"0x2::sui::SUI","coinObjectId":"0xb7c75543bb69b9f74448783ebfd37eba696d5361ad868df71326d87ef7356a1c","version":"445","digest":"8muCTsQg43P6jMfxysWELpiAbwb73q3axTjCxdqGxpCR","balance":"981174104","previousTransaction":"CBbiw6CCEQgBLi6ykZhWpL8AzMUBtuqUvi1hSAEuRNgF"},{"coinType":"0x2::sui::SUI","coinObjectId":"0xef4a10156b03893cb66092bbe83e42acfb8e48b88a36623c15a1c5a57d780ca6","version":"445","digest":"7XWZAJmNesE4wQc9jWZkqG8tHTobg8hLrcgFpjrRZLLq","balance":"995950600","previousTransaction":"CBbiw6CCEQgBLi6ykZhWpL8AzMUBtuqUvi1hSAEuRNgF"}],"nextCursor":"0xef4a10156b03893cb66092bbe83e42acfb8e48b88a36623c15a1c5a57d780ca6","hasNextPage":false},"id":1}
```

here we got `"hasNextPage":false`, if true, we could add params: "limit" and  "cursor", "cursor" is "nextCursor"


### suix_getDynamicFieldObject

Return the dynamic field object information for a specified object

*Params*

* parent_object_id : <ObjectID> - The ID of the queried parent object
* name : <DynamicFieldName> - The Name of the dynamic field

*Result*

* SuiObjectResponse : <SuiObjectResponse>
  * data : <[ObjectData]>
  * error : <[ObjectResponseError]>

 
### suix_getDynamicFields
Return the list of dynamic field objects owned by an object.
Gets dynamic fields for the object the request provides in a paginated list of `limit` dynamic field results per page. The default limit is 50.

*Params*

* parent_object_id : <ObjectID> - The ID of the parent object
* cursor : <ObjectID> - An optional paging cursor. If provided, the query will start from the next item after the specified cursor. Default to start from the first item if not specified.
* limit : <uint> - Maximum item returned per page, default to [QUERY_MAX_RESULT_LIMIT] if not specified.

*Result*

* DynamicFieldPage : <Page_for_DynamicFieldInfo_and_ObjectID>

### suix_getOwnedObjects
Return the list of objects owned by an address. Note that if the address owns more than `QUERY_MAX_RESULT_LIMIT` objects, the pagination is not accurate, because previous page may have been updated when the next page is fetched.

*Params*

* address : <SuiAddress> - the owner's Sui address
* query : <ObjectResponseQuery> - the objects query criteria.
* cursor : <ObjectID> - An optional paging cursor. If provided, the query will start from the next item after the specified cursor. Default to start from the first item if not specified.
* limit : <uint> - Max number of items returned per page, default to [QUERY_MAX_RESULT_LIMIT] if not specified.

*Result*

* ObjectsPage : <Page_for_SuiObjectResponse_and_ObjectID>

```
curl https://fullnode.testnet.sui.io:443      -X POST -H "Content-Type: application/json" -d '
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "suix_getOwnedObjects",
  "params": [
    "0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78",
    {
      "filter": {
        "MatchAll": [
          {
            "StructType": "0x2::coin::Coin<0x2::sui::SUI>"
          }
        ]
      },
      "options": {
        "showType": true,
        "showOwner": true,
        "showPreviousTransaction": true,
        "showDisplay": false,
        "showContent": false,
        "showBcs": false,
        "showStorageRebate": false
      }
    }
  ]
}
'
{"jsonrpc":"2.0","result":{"data":[{"data":{"objectId":"0xb7c75543bb69b9f74448783ebfd37eba696d5361ad868df71326d87ef7356a1c","version":"445","digest":"8muCTsQg43P6jMfxysWELpiAbwb73q3axTjCxdqGxpCR","type":"0x2::coin::Coin<0x2::sui::SUI>","owner":{"AddressOwner":"0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78"},"previousTransaction":"CBbiw6CCEQgBLi6ykZhWpL8AzMUBtuqUvi1hSAEuRNgF"}},{"data":{"objectId":"0xef4a10156b03893cb66092bbe83e42acfb8e48b88a36623c15a1c5a57d780ca6","version":"445","digest":"7XWZAJmNesE4wQc9jWZkqG8tHTobg8hLrcgFpjrRZLLq","type":"0x2::coin::Coin<0x2::sui::SUI>","owner":{"AddressOwner":"0x65635b3ed941f633cdc51e79f7a730541544344c4dc44b09f5ac33964ff86d78"},"previousTransaction":"CBbiw6CCEQgBLi6ykZhWpL8AzMUBtuqUvi1hSAEuRNgF"}}],"nextCursor":"0xef4a10156b03893cb66092bbe83e42acfb8e48b88a36623c15a1c5a57d780ca6","hasNextPage":false},"id":1}%  
```

Returns all the objects the address provided in the request owns and that match the filter. By default, only the digest value is returned, but the request returns additional information by setting the relevant keys to true. A cursor value can alose be also provided, so the list of results begin after that value.

### suix_getReferenceGasPrice
Return the reference gas price for the network

*Result*

* BigInt<u64> : <BigInt_for_uint64>

```
curl https://fullnode.testnet.sui.io:443      -X POST -H "Content-Type: application/json" -d '
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "suix_getReferenceGasPrice",
  "params": []
}
'
{"jsonrpc":"2.0","result":"1000","id":1}%            
```

it is 1000MIST on testnet.


### suix_queryEvents
Return list of events for a specified query criteria.

*Params*

* query : <EventFilter> - The event query criteria. See Event filter documentation for examples.
* cursor : <EventID> - optional paging cursor
* limit : <uint> - maximum number of items per page, default to [QUERY_MAX_RESULT_LIMIT] if not specified.
* descending_order : <boolean> - query result ordering, default to false (ascending order), oldest record first.

*Result*

* EventPage : <Page_for_Event_and_EventID>


### suix_queryTransactionBlocks
Return list of transactions for a specified query criteria.

*Params*

* query : <TransactionBlockResponseQuery> - the transaction query criteria.
* cursor : <TransactionDigest> - An optional paging cursor. If provided, the query will start from the next item after the specified cursor. Default to start from the first item if not specified.
* limit : <uint> - Maximum item returned per page, default to QUERY_MAX_RESULT_LIMIT if not specified.
* descending_order : <boolean> - query result ordering, default to false (ascending order), oldest record first.

*Result*

* TransactionBlocksPage : <Page_for_TransactionBlockResponse_and_TransactionDigest>

```
 curl https://fullnode.testnet.sui.io:443      -X POST -H "Content-Type: application/json" -d '
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "suix_queryTransactionBlocks",
  "params": [
    {
      "filter": {
        "InputObject": "0xb7c75543bb69b9f74448783ebfd37eba696d5361ad868df71326d87ef7356a1c"
      },
      "options": null
    }
  ]
}
'

{"jsonrpc":"2.0","result":{"data":[{"digest":"DVampzCCcDuvCGFZTAoAz8FX9dwBAnagvv46dy3TzaqH"},{"digest":"G2Z1W7aUE3cBQBER8VJkJQKe17YfuxUkEY4oGTobQtwQ"},{"digest":"93ZBtdpKiX7iQM8p9gbC4BHLJEwWZ1XSGQVLbtTcGBbA"},{"digest":"4TEcQgjzdzduTvPy3opBDUYAjuXF5eEJoEzr1VETMxkn"},{"digest":"6C91BEcP7WAF45J6axjNVGf77XUazin9B7hdrEV9JkdR"},{"digest":"5pUN7mDjPzE6b2XW69XXyHhfXbV9hudbRa72p7SBJsWU"},{"digest":"HUBxaDS2WnVC7svxWZSSfz3K1GufLW5PyEhw3Dwddm7f"},{"digest":"4TXafTjLJovHcZWQQC7mCqihwr2uDAb3eMwHMjxLgYmX"},{"digest":"B7Za8ToK5JYGNeDdDnKp7fywcvvaDEXcHTzeVWqa9rqF"},{"digest":"GUXNSZMRSgWjftfGCE1W9uzKtAfyADtjsDpKwAJzCzym"},{"digest":"GfyC7K44Td8EtD1YqenAvpYdJE7vTNPwCf1Du2GV9qNi"},{"digest":"CBbiw6CCEQgBLi6ykZhWpL8AzMUBtuqUvi1hSAEuRNgF"}],"nextCursor":"CBbiw6CCEQgBLi6ykZhWpL8AzMUBtuqUvi1hSAEuRNgF","hasNextPage":false},"id":1}%      
```

this show gas opration on "0xb7c75543bb69b9f74448783ebfd37eba696d5361ad868df71326d87ef7356a1c" a SUI Coin Object.



## Websocket API
Websocket is a feature added to HTTP to supplement long links. In general, it can be considered as a TCP long link. Sui passed
This long connection is used to push messages to the client.

It's just that the content of the message here is also in JSONRPC format, such as:
```
     {
         "jsonrpc": "2.0",
         "id": 1,
         "method": "suix_subscribeEvent",
         "params": [
             {
             "filter": {"Package": "<PACKAGE-ID>"}
             }
         ]
     }
```

Such messages subscribe to <PACKAGE-ID> event messages.

When there is a change, the result is also packaged into a JSONRPC format and pushed to the client

### suix_subscribeEvent

Subscribe to a stream of Sui event

*Params*

* filter : <EventFilter> - The filter criteria of the event stream. See Event filter documentation for examples.

*Result*

* SuiEvent : <Event>

### suix_subscribeTransaction

Subscribe to a stream of Sui transaction effects

*Params*

* filter : <TransactionFilter> -

*Result*

* SuiTransactionBlockEffects : <TransactionBlockEffects>