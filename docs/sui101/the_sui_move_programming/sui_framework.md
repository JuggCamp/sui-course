# Sui Framework

The Sui Framework includes the core on-chain libraries for Sui Move developers. the full SDK doc is [here](https://github.com/MystenLabs/sui/tree/main/crates/sui-framework/docs)
here are someone of them.

## 0x2::address

### Function to_u256
Convert a into a u256 by interpreting a as the bytes of a big-endian integer (e.g., to_u256(0x1) == 1)
```
public fun to_u256(a: address): u256
```

### Function from_u256
Convert n into an address by encoding it as a big-endian integer (e.g., from_u256(1) = @0x1) Aborts if n > MAX_ADDRESS
```
public fun from_u256(n: u256): address
```


### Function from_bytes
Convert bytes into an address. Aborts with EAddressParseError if the length of bytes is not 32
```
public fun from_bytes(bytes: vector<u8>): address

```


### Function to_bytes
Convert a into BCS-encoded bytes.
```
public fun to_bytes(a: address): vector<u8>
```

## 0x2::bcs

This module implements BCS (de)serialization in Move. Full specification can be found here: https://github.com/diem/bcs

Short summary (for Move-supported types):

* address - sequence of X bytes
* bool - byte with 0 or 1
* u8 - a single u8 byte
* u64 / u128 - LE bytes
* vector - ULEB128 length + LEN elements
* option - first byte bool: None (0) or Some (1), then value

Usage example:
```
/// This function reads u8 and u64 value from the input
/// and returns the rest of the bytes.
fun deserialize(bytes: vector<u8>): (u8, u64, vector<u8>) {
use sui::bcs::{Self, BCS};

let prepared: BCS = bcs::new(bytes);
let (u8_value, u64_value) = (
bcs::peel_u8(&mut prepared),
bcs::peel_u64(&mut prepared)
);

// unpack bcs struct
let leftovers = bcs::into_remainder_bytes(prepared);

(u8_value, u64_value, leftovers)
}
```
