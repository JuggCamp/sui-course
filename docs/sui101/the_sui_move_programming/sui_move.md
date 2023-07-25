# Sui Move

First, note Move is based upon the well-supported Rust programming language. And Sui Move differs from core Move in subtle yet distinct ways. 

Sui Move is an open source language for writing safe smart contracts. It is Sui's dialect of Move, which was originally developed at Facebook to power the Diem blockchain.

Sui Move can define, create, and manage programmable Sui objects representing user-level assets. Sui's object system is implemented by adding new functionality while also imposing additional restrictions to the original Move. This is one of the major differences in the Sui Move dialect that makes certain parts of the original Move documentation not applicable to smart contract development in Sui. Consequently, it's best to follow this tutorial and the relevant Move documentation links within.

##  Object-centric global storage

In core Move, global storage is part of the programming model and can be accessed through special operations, such as move_to, move_from and many more global storage operators. Both resources and modules are stored in the core Move global storage. When you publish a module, it’s stored into a newly generated module address inside Move. When a new object (a.k.a. resource) is created, it's usually stored into some address, as well.

But on-chain storage is expensive and limited (not optimized for storage and indexing). Current blockchains cannot scale to handle storage-heavy applications such as marketplaces and social apps.

So there is no global storage in Sui Move. None of the global storage-related operations are allowed in Sui Move. (There is a bytecode verifier for this to detect violations.) Instead, storage happens exclusively within Sui. When you publish a module, the newly published module is stored in Sui storage, instead of Move storage. Similarly, newly created objects are stored in Sui storage. This also means that when you need to read an object in Move, you cannot rely on global storage operations but instead Sui must explicitly pass all objects that need to be accessed into Move.

## Addresses represent Object IDs
In Move, there is a special address type. This type is used to represent addresses in core Move. Core Move needs to know the address of an account when dealing with the global storage. The address type is 16 bytes, which is sufficient for the core Move security model.

In Sui, since it doesn’t support global storage in Move, you don’t need the address type to represent user accounts. Instead, use the address type to represent the Object ID. Refer to the object.move file in Sui framework for an understanding of address use.



## Object with key ability, globally unique IDs
You need a way to distinguish between objects that are internal to Sui Move and objects that can be stored in Sui storage. This is important because you need to be able to serialize/deserialize objects in the Move-Sui boundary, and this process makes assumptions on the shape of the objects.

You can take advantage of the key ability in Move to annotate a Sui object. In core Move, the key ability is used to tell that the type can be used as a key for global storage. Since you don’t touch global storage in Sui Move, you are able to repurpose this ability. Sui requires that any struct with key ability must start with an id field with the ID type. The ID type contains both the ObjectID and the sequence number (a.k.a. version). Sui has bytecode verifiers in place to make sure that the ID field is immutable and cannot be transferred to other objects (as each object must have a unique ID).

## Module initializers

As described in Object-centric global storage, Sui Move modules are published into Sui storage. A special initializer function optionally defined in a module is executed (once) at the time of module publication by the Sui runtime for the purpose of pre-initializing module-specific data (e.g., creating singleton objects). The initializer function must have the following properties in order to be executed at publication:

* Name init
* Single parameter of &mut TxContext type
* No return values
* Private

## Entry functions
One of the basic operations in Sui is a gas object transfer between addresses representing individual users. The gas object transfer implementation in the SUI module is also an example of the use of an entry function:

```
public entry fun transfer(c: coin::Coin<SUI>, recipient: address, _ctx: &mut TxContext) {
    ...
}
```



## Code organization

Sui Move shares the same code organization concepts as Move. The main unit of Move code organization (and distribution) is a package. A package consists of a set of modules defined in separate files with the .move extension. These files include Move functions and type definitions. A package must include the Move.toml manifest file describing package configuration, such as package name, metadata and dependencies. See Move.toml for more information about package manifest files in Sui Move. Packages also include an auto-generated Move.lock file. The Move.lock file is similar in format to the package manifest, but is not meant for users to edit directly. See Move.lock for more information about the lock file in Sui Move.

The minimal package source directory structure looks as follows and contains the manifest file, the lock file, and the sources subdirectory where one or more module files are located:

```
my_move_package
├── Move.lock
├── Move.toml
├── sources
    ├── coin.move
```

The Sui platform includes the Sui Framework, which includes the core on-chain libraries that Sui Move developers need to bootstrap Sui operations. For example, Sui supports user-defined coin types, which are custom assets. Sui Framework contains the Coin module supporting creation and management of custom coins. The Coin module is located in the coin.move file. As you might expect, the manifest file describing how to build the package containing the Coin module is located in the corresponding Move.toml file.

Let's see how module definition appears in the Coin module file:
```
module sui::coin {
...
}
```

Important: In Sui Move, package names are always in PascalCase, while the address alias is lowercase, for example sui = 0x2 and std = 0x1. So: Sui = name of the imported package (Sui = sui framework), sui = address alias of 0x2, sui::sui = module sui under the address 0x2, and sui::sui::SUI = type in the module above.

When you define a module, specify the module name (coin) preceded by the name of the package where this module resides (sui). The combination of the package name and the module name uniquely identifies a module in Sui Move source code. The package name is globally unique, but different packages can contain modules with the same name. While module names are not unique, when they combine with their unique package name they result in a unique combination.

For example, if you have a published package "P", you cannot publish an entirely different package also named "P". At the same time you can have module "P1::M1", "P2::M1", and "P1::M2" but not another, say, "P1::M1" in the system at the same time.

While you can't name different packages the same, you can upgrade a package on chain with updated code using the same package name.

In addition to having a presence at the source code level, as discussed in Sui Move code organization, a package in Sui is also a Sui object and must have a unique numeric ID in addition to a unique name, which is assigned in the manifest file:
```
[addresses]
sui = "0x2"
```


##  Sui Move structs
The Coin module defines the Coin struct type that you can use to represent different types of user-defined coins as Sui objects:

```
struct Coin<phantom T> has key, store {
    id: UID,
    value: u64
}
```


Sui Move's struct type is similar to struct types defined in other programming languages, such as C or C++, and contains a name and a set of typed fields. In particular, struct fields can be of a primitive type, such as an integer type, or of a struct type.

You can read more about Move primitive types and structs in the Move book.

For a Sui Move struct type to define a Sui object type, such as Coin, its first field must be id: UID. UID is a struct type defined in the object module. The Move struct type must also have the key ability, which allows Sui's global storage to persist the object. Abilities of a Move struct are listed after the has keyword in the struct definition, and their existence (or lack thereof) helps the compiler enforce various properties on a definition or on instances of a given struct.


The reason that the Coin struct can represent different types of coin is that the struct definition is parameterized with a type parameter. When you create an instance of the Coin struct, you can pass it an arbitrary concrete Move type (e.g. another struct type) to distinguish different types of coins from one another.


In particular, one type of custom coin already defined in Sui is Coin<SUI>, which represents a token used to pay for Sui computations (more generally known as gas) - in this case, the concrete type used to parameterize the Coin struct is the SUI struct in the SUI module:
```
struct SUI has drop {}
```


The Write a Sui Move Package topic shows how to define and instantiate custom structs.

## Sui Move functions
Similar to other popular programming languages, the main unit of computation in Move is a function. Let us look at one of the simplest functions defined in the Coin module, that is the value function.
```
public fun value<T>(self: &Coin<T>): u64 {
    self.value
}
```


Functions in other modules can call this public function to return the unsigned integer value currently stored in a given instance of the Coin struct. The Move compiler allows direct access to fields of a struct only within the module defining a given struct, as described in Privileged Struct Operations. The body of the function simply retrieves the value field from the Coin struct instance parameter and returns it. The coin parameter is a read-only reference to the Coin struct instance, indicated by the & preceding the parameter type. Move's type system enforces an invariant that struct instance arguments passed by read-only references (as opposed to mutable references) cannot be modified in the body of a function.



The Write a Sui Move Package topic shows how to call Move functions from other functions and how to define the new ones.

The Sui dialect of the Move language also defines entry functions. These must satisfy a certain set of properties and you can call them directly from Sui (e.g., from a Sui application written in a different language).

##  Sui Framework

The Sui Framework includes the core on-chain libraries for Sui Move developers. 
the full SDK doc is [here](https://github.com/MystenLabs/sui/tree/main/crates/sui-framework/docs)