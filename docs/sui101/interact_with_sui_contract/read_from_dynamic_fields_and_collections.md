# Read from  Dynamic Fields and Collections
object fields to store primitive data and other objects (wrapping), but there are a few limitations to this approach:

* Object's have a finite set of fields keyed by identifiers that are fixed when its module is published (i.e. limited to the fields in the struct declaration).
* An object can become very large if it wraps several other objects. Larger objects can lead to higher gas fees in transactions. In addition, there is an upper bound on object size.
*Later chapters include use cases where you need to store a collection of objects of heterogeneous types. Since the Sui Move vector type must be instantiated with one single type T, it is not suitable for this.

Fortunately, Sui provides dynamic fields with arbitrary names (not just identifiers), added and removed on-the-fly (not fixed at publish), which only affect gas when they are accessed, and can store heterogeneous values. This chapter introduces the libraries for interacting with this kind of field.


There are two flavors of dynamic field -- "fields" and "object fields" -- which differ based on how their values are stored:

* Fields can store any value that has store, however an object stored in this kind of field will be considered wrapped and will not be accessible via its ID by external tools (explorers, wallets, etc) accessing storage.
* Object field values must be objects (have the key ability, and id: UID as the first field), but will still be accessible at their ID to external tools.

The modules for interacting with these fields can be found at dynamic_field and dynamic_object_field respectively.


Unlike an object's regular fields whose names must be Move identifiers, dynamic field names can be any value that has copy, drop and store. This includes all Move primitives (integers, booleans, byte strings), and structs whose contents all have copy, drop and store.