# Program with Objects

In Sui Move, besides primitive data types, you can define organized data structures using struct. For example:

```
struct Color {
    red: u8,
    green: u8,
    blue: u8,
}
```


The struct defines a data structure to represent RGB color. You can use a struct like this to organize data with complicated semantics. However, an instance of a struct, such as Color, is not a Sui object yet. To define a struct that represents a Sui object type, you must add a key capability to the definition. The first field of the struct must be the id of the object with type UID from the object module - a module from the core Sui Framework.

```
use sui::object::UID;

struct ColorObject has key {
    id: UID,
    red: u8,
    green: u8,
    blue: u8,
}
```


The ColorObject represents a Sui object type that you can use to create Sui objects that can eventually be stored on the Sui network.

Important: In both core Move and Sui Move, the key ability denotes a type that can appear as a key in global storage. However, the structure of global storage is a bit different: core Move uses a (type, address)-indexed map, whereas Sui Move uses a map keyed by object IDs.

The UID type is internal to Sui, and you most likely won't need to deal with it directly. For curious readers, it contains the "unique ID" that defines an object on the Sui network. It is unique in the sense that no two values of type UID will ever have the same underlying set of bytes.

Sui authentication mechanisms ensure only you can use objects owned by you in Sui Move calls. To use an object in Sui Move calls, pass them as parameters to an entry function. Similar to Rust, there are a few ways to pass parameters, as described in the following sections.


## Create Sui object
After you define a Sui object type you can create or instantiate a Sui object. To create a new Sui object from its type, you must assign an initial value to each of the fields, including id. The only way to create a new UID for a Sui object is to call object::new. The new function takes the current transaction context as an argument to generate unique IDs. The transaction context is of type &mut TxContext and should be passed down from an entry function. You can call Entry functions directly from a transaction.

To define a constructor for ColorObject:

```
// object creates an alias to the object module, which allows you to call
// functions in the module, such as the `new` function, without fully
// qualifying, for example `sui::object::new`.
use sui::object;
// tx_context::TxContext creates an alias to the TxContext struct in the tx_context module.
use sui::tx_context::TxContext;


fun new(red: u8, green: u8, blue: u8, ctx: &mut TxContext): ColorObject {
    ColorObject {
        id: object::new(ctx),
        red,
        green,
        blue,
    }
}
```


Sui Move supports field punning, which allows you to skip the field values if the field name happens to be the same as the name of the value variable it is bound to. The preceding code example leverages this to write "red," as shorthand for "red: red,".

## Store Sui object
You now have a constructor for the ColorObject. If you call this constructor, it puts the value in a local variable. The local variable can be returned from the current function, passed to other functions, or stored inside another struct. The object can be placed in persistent global storage, be read by anyone, and accessed in subsequent transactions.

All of the APIs for adding objects to persistent storage are defined in the transfer module. One key API is:
```
public fun transfer<T: key>(obj: T, recipient: address)
```

This places obj in global storage along with the metadata that records recipient as the owner of the object. In Sui, every object must have an owner. The owner can be either an address, another object, or "shared". See Object ownership for more details.

In core Move, you call move_to<T>(a: address, t: T) to add the entry (a, T) -> t to the global storage. But the schema of Sui Move's global storage is different, so you can use the Transfer APIs instead of move_to or the other global storage operators in core Move. You can't use these operators in Sui Move.

A common use of this API is to transfer the object to the sender/signer of the current transaction, such as when you mint an NFT owned by you. The only way to obtain the sender of the current transaction is to rely on the transaction context passed in from an entry function. The last argument to an entry function must be the current transaction context, defined as `ctx: &mut TxContext.`

To obtain the current signer's address, you can call `tx_context::sender(ctx)`

The following code sample creates a new ColorObject and sets the owner to the sender of the transaction:

```
use sui::transfer;

// This is an entry function that you can call directly by a Transaction.
public entry fun create(red: u8, green: u8, blue: u8, ctx: &mut TxContext) {
    let color_object = new(red, green, blue, ctx);
    transfer::transfer(color_object, tx_context::sender(ctx))
}
```

Note: Naming convention: Constructors are typically named new, which returns an instance of the struct type. The create function is typically defined as an entry function that constructs the struct and transfers it to the desired owner (most commonly the sender).

You can also add a getter to ColorObject that returns the color values so that modules outside of ColorObject are able to read their values:

```
public fun get_color(self: &ColorObject): (u8, u8, u8) {
    (self.red, self.green, self.blue)
}
```

Find the full code in the Sui repo under sui_programmability/examples/objects_tutorial/sources/ in color_object.move.


## Pass objects by reference

There are two ways to pass objects by reference: read-only references (&T) and mutable references (&mut T). Read-only references allow you to read data from the object, while mutable references allow you to mutate the data in the object. To add a function that allows you to update one of the values of ColorObject with another value of ColorObject. This exercises both using read-only references and mutable references.

```
struct ColorObject has key {
    id: UID,
    red: u8,
    green: u8,
    blue: u8,
}

/// Copies the values of `from_object` into `into_object`.
public entry fun copy_into(from_object: &ColorObject, into_object: &mut ColorObject) {
    into_object.red = from_object.red;
    into_object.green = from_object.green;
    into_object.blue = from_object.blue;
}

```


Declare this function with the entry modifier so that it is callable as an entry function from transactions.

In the preceding function signature, from_object can be a read-only reference because you only need to read its fields. Conversely, into_object must be a mutable reference since you need to mutate it. For a transaction to make a call to the copy_into function, the sender of the transaction must be the owner of both from_object and into_object.


## Delete the object

If the intention is to actually delete the object, unpack it. You can do this only in the module that defined the struct type, due to Move's privileged struct operations rules. If any field is also of struct type, you must use recursive unpacking and deletion when you unpack the object.

However, the id field of a Sui object requires special handling. You must call the following API in the object module to signal Sui that you intend to delete this object:

```
public fun delete(id: UID) { ... }
```

Define a function in the ColorObject module that allows us to delete the object:

```
    public entry fun delete(object: ColorObject) {
        let ColorObject { id, red: _, green: _, blue: _ } = object;
        object::delete(id);
    }
```

The object unpacks and generates individual fields. You can drop all of the u8 values, which are primitive types. However, you can't drop the id, which has type UID, and must explicitly delete it using the object::delete API. At the end of this call, the object is no longer stored on-chain.



## Immutable Objects
Objects in Sui can have different types of ownership, with two broad categories: immutable objects and mutable objects. An immutable object is an object that can't be mutated, transferred or deleted. Immutable objects have no owner, so anyone can use them.

To convert an object into an immutable object, call the following function in the

```
public native fun freeze_object<T: key>(obj: T);
```


This call makes the specified object immutable. This is a non-reversible operation. You should freeze an object only when you are certain that you don't need to mutate it.

Add an entry function to the color_object module to turn an existing (owned) ColorObject into an immutable object:

```
public entry fun freeze_object(object: ColorObject) {
    transfer::freeze_object(object)
}
```

In the preceding function, you must already own a ColorObject to pass it in. At the end of this call, this object is frozen and can never be mutated. It is also no longer owned by anyone.

## Object Wrapping

In many programming languages, you organize data structures in layers by nesting complex data structures in another data structure. In Sui Move, you can organize data structures by putting a field of struct type in another, like the following:

```
struct Foo has key {
    id: UID,
    bar: Bar,
}

struct Bar has store {
    value: u64,
}
```

COPY
To embed a struct type in a Sui object struct (with a key ability), the struct type must have the store ability.

In the preceding example, Bar is a normal struct, but it is not a Sui object since it doesn't have the key ability. This is common usage to organize data with good encapsulation.

To put a Sui object struct type as a field in another Sui object struct type, change Bar into:

```
struct Bar has key, store {
    id: UID,
    value: u64,
}

```

Now Bar is also a Sui object type. If you put a Sui object of type Bar into a Sui object of type Foo, the object type Foo wraps the object type Bar. The object type Foo is the wrapper or wrapping object.

In Sui Move code, you can put a Sui object as a field of a non-Sui object struct type. For example, the preceding code sample defined Foo to not have key, but Bar to have key, store. This case can happen only temporarily in the middle of a Sui Move execution, and cannot persist on-chain. This is because a non-Sui object cannot flow across the Move-Sui boundary, and one must unpack the non-Sui object at some point and handle the Sui object fields in it.

There are some interesting consequences of wrapping a Sui object into another. When an object is wrapped, the object no longer exists independently on-chain. You can no longer look up the object by its ID. The object becomes part of the data of the object that wraps it. Most importantly, you can no longer pass the wrapped object as an argument in any way in Sui Move calls. The only access point is through the wrapping object.

It is not possible to create circular wrapping behavior, where A wraps B, B wraps C, and C also wraps A.

At some point, you can then take out the wrapped object and transfer it to an address. This is called unwrapping. When an object is unwrapped, it becomes an independent object again, and can be accessed directly on-chain. There is also an important property about wrapping and unwrapping: the object's ID stays the same across wrapping and unwrapping.

There are a few common ways to wrap a Sui object into another Sui object, and their use cases are typically different. This section describes three different ways to wrap a Sui object with typical use cases.


### Direct wrapping

If you put a Sui object type directly as a field in another Sui object type (as in the preceding example), it is called direct wrapping. 

The following example implementation of a trusted swap demonstrates how to use direct wrapping. Assume there is an NFT-style Object type that has scarcity and style. In this example, scarcity determines how rare the object is (presumably the more scarce the higher its market value), and style determines the object content/type or how it's rendered. If you own some of these objects and want to trade your objects with others, you want to make sure it's a fair trade. You are willing to trade an object only with another one that has identical scarcity, but want a different style (so that you can collect more styles).

First, define such an object type:
```
struct Object has key, store {
    id: UID,
    scarcity: u8,
    style: u8,
}
```


In a real application, you might make sure that there is a limited supply of the objects, and there is a mechanism to mint them to a list of owners. For simplicity and demonstration purposes, this example simplifies creation:

```
public entry fun create_object(scarcity: u8, style: u8, ctx: &mut TxContext) {
    let object = Object {
        id: object::new(ctx),
        scarcity,
        style,
    };
    transfer::transfer(object, tx_context::sender(ctx))
}
```

Anyone can call create_object to create a new object with specified scarcity and style. 

### Wrapping through Option
When Sui object type Bar is directly wrapped into Foo, there is not much flexibility: a Foo object must have a Bar object in it, and to take out the Bar object you must destroy the Foo object. However, for more flexibility, the wrapping type might not always have the wrapped object in it, and the wrapped object might be replaced with a different object at some point.

To demonstrate this use case, design a simple game character: A warrior with a sword and shield. A warrior might have a sword and shield, or might not have either. The warrior should be able to add a sword and shield, and replace the current ones at any time. To design this, define a SimpleWarrior type:

```
struct SimpleWarrior has key {
    id: UID,
    sword: Option<Sword>,
    shield: Option<Shield>,
}

```


Each SimpleWarrior type has an optional sword and shield wrapped in it, defined as:

```
struct Sword has key, store {
    id: UID,
    strength: u8,
}

struct Shield has key, store {
    id: UID,
    armor: u8,
}
```

When you create a new warrior, set the sword and shield to none to indicate there is no equipment yet:
```
public entry fun create_warrior(ctx: &mut TxContext) {
    let warrior = SimpleWarrior {
        id: object::new(ctx),
        sword: option::none(),
        shield: option::none(),
    };
    transfer::transfer(warrior, tx_context::sender(ctx))
}
```
