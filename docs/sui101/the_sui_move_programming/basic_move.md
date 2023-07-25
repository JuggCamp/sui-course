# Basic Move

## Modules and Scripts
Move has two different types of programs: Modules and Scripts. Modules are libraries that define struct types along with functions that operate on these types. Struct types define the schema of Move's global storage, and module functions define the rules for updating storage. Modules themselves are also stored in global storage. Scripts are executable entrypoints similar to a main function in a conventional language. A script typically calls functions of a published module that perform updates to global storage. Scripts are ephemeral code snippets that are not published in global storage.

A Move source file (or compilation unit) may contain multiple modules and scripts. However, publishing a module or executing a script are separate VM operations.

A script block must start with all of its use declarations, followed by any constants and (finally) the main function declaration. The main function can have any name (i.e., it need not be called main), is the only function in a script block, can have any number of arguments, and must not return a value. Here is an example with each of these components:

```
script {
    // Import the debug module published at the named account address std.
    use std::debug;

    const ONE: u64 = 1;

    fun main(x: u64) {
        let sum = x + ONE;
        debug::print(&sum)
    }
}

```

Module names can start with letters a to z or letters A to Z. After the first character, module names can contain underscores _, letters a to z, letters A to Z, or digits 0 to 9.
All elements inside a module block can appear in any order. Fundamentally, a module is a collection of types and functions. The use keyword is used to import types from other modules. The friend keyword specifies a list of trusted modules. The const keyword defines private constants that can be used in the functions of a module.

```
module test_addr::test {
    struct Example has copy, drop { a: address }

    use std::debug;
    friend test_addr::another_test;

    public fun print() {
        let example = Example { a: @test_addr };
        debug::print(&example)
    }
}
```

The use syntax can be used to create aliases to members in other modules. use can be used to create aliases that last either for the entire module, or for a given expression block scope.

here are several different syntax cases for use. Starting with the most simple, we have the following for creating aliases to other modules


```
use std::vector;
use std::vector as V;

fun new_vecs(): (vector<u8>, vector<u8>, vector<u8>) {
    let v1 = std::vector::empty();
    let v2 = vector::empty();
    let v3 = V::empty();
    (v1, v2, v3)
}

```

Inside of a module all use declarations are usable regardless of the order of declaration.

```
address 0x42 {
module example {
    use std::vector;

    fun example(): vector<u8> {
        let v = empty();
        vector::push_back(&mut v, 0);
        vector::push_back(&mut v, 10);
        v
    }

    use std::vector::empty;
}
}

```

## Variables & Data Types

Local variables in Move are lexically (statically) scoped. New variables are introduced with the keyword let, which will shadow any previous local with the same name. Locals are mutable and can be updated both directly and via a mutable reference.

Move programs use let to bind variable names to values:

```
let x = 1;
let y = x + x:
```

Move's type system prevents a local variable from being used before it has been assigned.

```
let x;
x + x // ERROR!
```

Variable names can contain underscores _, letters a to z, letters A to Z, and digits 0 to 9. Variable names must start with either an underscore _ or a letter a through z. They cannot start with uppercase letters.

### Basic Data Type

#### Integers
Move supports six unsigned integer types: u8, u16, u32, u64, u128, and u256. Values of these types range from 0 to a maximum that depends on the size of the type.

|Type|	Value Range|
|---|---|
|Unsigned 8-bit integer|u8	0 to 28 - 1 |
|Unsigned 16-bit integer| u16	0 to 216 - 1 |
|Unsigned 32-bit integer| u32	0 to 232 - 1 |
|Unsigned 64-bit integer| u64	0 to 264 - 1 |
|Unsigned 128-bit integer| u128	0 to 2128 - 1 |
|Unsigned 256-bit integer| u256	0 to 2256 - 1|

Literal values for these types are specified either as a sequence of digits (e.g.,112) or as hex literals, e.g., 0xFF. The type of the literal can optionally be added as a suffix, e.g., 112u8. If the type is not specified, the compiler will try to infer the type from the context where the literal is used. If the type cannot be inferred, it is assumed to be u64.

Number literals can be separated by underscores for grouping and readability. (e.g.,1_234_5678, 1_000u128, 0xAB_CD_12_35).

If a literal is too large for its specified (or inferred) size range, an error is reported.

#### Bool
bool is Move's primitive type for boolean true and false values.


#### Address
address is a built-in type in Move that is used to represent locations (sometimes called accounts) in global storage. An address value is a 128-bit (16 byte) identifier. At a given address, two things can be stored: Modules and Resources.

Addresses come in two flavors, named or numerical. The syntax for a named address follows the same rules for any named identifier in Move. The syntax of a numerical address is not restricted to hex-encoded values, and any valid u128 numerical value can be used as an address value, e.g., 42, 0xCAFE, and 2021 are all valid numerical address literals.

To distinguish when an address is being used in an expression context or not, the syntax when using an address differs depending on the context where it's used:

* When an address is used as an expression the address must be prefixed by the @ character, i.e., @<numerical_value> or @<named_address_identifier>.
* Outside of expression contexts, the address may be written without the leading @ character, i.e., <numerical_value> or <named_address_identifier>.

#### Signer
signer is a built-in Move resource type. A signer is a capability that allows the holder to act on behalf of a particular address. You can think of the native implementation as being:


struct signer has drop { a: address }
A signer is somewhat similar to a Unix UID in that it represents a user authenticated by code outside of Move (e.g., by checking a cryptographic signature or password).

### Collection Types

### Vector
vector<T> is the only primitive collection type provided by Move. A vector<T> is a homogenous collection of T's that can grow or shrink by pushing/popping values off the "end".

A vector<T> can be instantiated with any type T. For example, vector<u64>, vector<address>, vector<0x42::MyModule::MyResource>, and vector<vector<u8>> are all valid vector types.

```
use std::vector;

let v = vector::empty<u64>();
vector::push_back(&mut v, 5);
vector::push_back(&mut v, 6);

assert!(*vector::borrow(&v, 0) == 5, 42);
assert!(*vector::borrow(&v, 1) == 6, 42);
assert!(vector::pop_back(&mut v) == 6, 42);
assert!(vector::pop_back(&mut v) == 5, 42);
```

### Tuples and Unit

Move does not fully support tuples as one might expect coming from another language with them as a first-class value. However, in order to support multiple return values, Move has tuple-like expressions. These expressions do not result in a concrete value at runtime (there are no tuples in the bytecode), and as a result they are very limited: they can only appear in expressions (usually in the return position for a function); they cannot be bound to local variables; they cannot be stored in structs; and tuple types cannot be used to instantiate generics.

Similarly, unit () is a type created by the Move source language in order to be expression based. The unit value () does not result in any runtime value. We can consider unit() to be an empty tuple, and any restrictions that apply to tuples also apply to unit.

It might feel weird to have tuples in the language at all given these restrictions. But one of the most common use cases for tuples in other languages is for functions to allow functions to return multiple values. Some languages work around this by forcing the users to write structs that contain the multiple return values. However in Move, you cannot put references inside of structs. This required Move to support multiple return values. These multiple return values are all pushed on the stack at the bytecode level. At the source level, these multiple return values are represented using tuples.

```
address 0x42 {
module example {
    // all 3 of these functions are equivalent

    // when no return type is provided, it is assumed to be `()`
    fun returns_unit_1() { }

    // there is an implicit () value in empty expression blocks
    fun returns_unit_2(): () { }

    // explicit version of `returns_unit_1` and `returns_unit_2`
    fun returns_unit_3(): () { () }


    fun returns_3_values(): (u64, bool, address) {
        (0, false, @0x42)
    }
    fun returns_4_values(x: &u64): (&u64, u8, u128, vector<u8>) {
        (x, 0, 1, b"foobar")
    }
}
}
```

## Statements and Expressions

### Conditionals

An if expression specifies that some code should only be evaluated if a certain condition is true. An if expression can optionally include an else clause to specify another expression to evaluate when the condition is false.Commonly, if expressions are used in conjunction with expression blocks.

```
if (x > 5) x = x - 5

if (y <= 10) y = y + 1 else y = 10


let z = if (x < 100) x else 100;


```


### While and Loop
The while construct repeats the body (an expression of type unit) until the condition (an expression of type bool) evaluates to false.

```
fun sum(n: u64): u64 {
    let sum = 0;
    let i = 1;
    while (i <= n) {
        sum = sum + i;
        i = i + 1
    };

    sum
}

```

The break expression can be used to exit a loop before the condition evaluates to false. For example, this loop uses break to find the smallest factor of n that's greater than 1:
```
fun smallest_factor(n: u64): u64 {
    // assuming the input is not 0 or 1
    let i = 2;
    while (i <= n) {
        if (n % i == 0) break;
        i = i + 1
    };

    i
}

```

The continue expression skips the rest of the loop and continues to the next iteration. This loop uses continue to compute the sum of 1, 2, ..., n, except when the number is divisible by 10:

```
fun sum_intermediate(n: u64): u64 {
    let sum = 0;
    let i = 0;
    while (i < n) {
        i = i + 1;
        if (i % 10 == 0) continue;
        sum = sum + i;
    };

    sum
}

```

The loop expression repeats the loop body (an expression with type ()) until it hits a break

Without a break, the loop will continue forever

```
fun sum(n: u64): u64 {
    let sum = 0;
    let i = 0;
    loop {
        i = i + 1;
        if (i > n) break;
        sum = sum + i
    };

    sum
}

```

## Functions

Function syntax in Move is shared between module functions and script functions. Functions inside of modules are reusable, whereas script functions are only used once to invoke a transaction.

Functions are declared with the fun keyword followed by the function name, type parameters, parameters, a return type, acquires annotations, and finally the function body.

```
fun foo<T1, T2>(x: u64, y: T1, z: T2): (T2, T1, u64) { (z, y, x) }

```

A public function can be called by any function defined in any module or script. As shown in the following example, a public function can be called by:

* other functions defined in the same module,
* functions defined in another module
* the function defined in a script.

There are also no restrictions for what the argument types a public function can take and its return type.

The public(friend) visibility modifier is a more restricted form of the public modifier to give more control about where a function can be used. A public(friend) function can be called by:

* other functions defined in the same module, or
* functions defined in modules which are explicitly specified in the friend list (see Friends on how to specify the friend list).

Note that since we cannot declare a script to be a friend of a module, the functions defined in scripts can never call a public(friend) function.


The entry modifier is designed to allow module functions to be safely and directly invoked much like scripts. This allows module writers to specify which functions can be to begin execution. The module writer then knows that any non-entry function will be called from a Move program already in execution.

Essentially, entry functions are the "main" functions of a module, and they specify where Move programs start executing.

Note though, an entry function can still be called by other Move functions. So while they can serve as the start of a Move program, they aren't restricted to that case.

```
address 0x42 {
module m {
    public entry fun foo(): u64 { 0 }
    fun calls_foo(): u64 { foo() } // valid!
}

module n {
    fun calls_m_foo(): u64 {
        0x42::m::foo() // valid!
    }
}

module other {
    public entry fun calls_m_foo(): u64 {
        0x42::m::foo() // valid!
    }
}
}

script {
    fun calls_m_foo(): u64 {
        0x42::m::foo() // valid!
    }
}
```

Function names can start with letters a to z or letters A to Z. After the first character, function names can contain underscores _, letters a to z, letters A to Z, or digits 0 to 9.

Functions parameters are declared with a local variable name followed by a type annotation

```
fun add(x: u64, y: u64): u64 { x + y }

```

When a function accesses a resource using move_from, borrow_global, or borrow_global_mut, the function must indicate that it acquires that resource. This is then used by Move's type system to ensure the references into global storage are safe, specifically that there are no dangling references into global storage.

acquires annotations must also be added for transitive calls within the module. Calls to these functions from another module do not need to annotated with these acquires because one module cannot access resources declared in another module--so the annotation is not needed to ensure reference safety.

```
address 0x42 {
module example {

    struct Balance has key { value: u64 }

    public fun add_balance(s: &signer, value: u64) {
        move_to(s, Balance { value })
    }

    public fun extract_balance(addr: address): u64 acquires Balance {
        let Balance { value } = move_from(addr); // acquires needed
        value
    }

    public fun extract_and_add(sender: address, receiver: &signer) acquires Balance {
        let value = extract_balance(sender); // acquires needed here
        add_balance(receiver, value)
    }
}
}

address 0x42 {
module other {
    fun extract_balance(addr: address): u64 {
        0x42::example::extract_balance(addr) // no acquires needed
    }
}
}

```

After the parameters, a function specifies its return type.

```
fun zero(): u64 { 0 }

```

The result of a function, its "return value", is the final value of its function body. For example

```
fun add(x: u64, y: u64): u64 {
    x + y
}

```

## Struct

A struct is a user-defined data structure containing typed fields. Structs can store any non-reference type, including other structs.

We often refer to struct values as resources if they cannot be copied and cannot be dropped. In this case, resource values must have ownership transferred by the end of the function. This property makes resources particularly well served for defining global storage schemas or for representing important values (such as a token).

By default, structs are linear and ephemeral. By this we mean that they: cannot be copied, cannot be dropped, and cannot be stored in global storage. This means that all values have to have ownership transferred (linear) and the values must be dealt with by the end of the program's execution (ephemeral). We can relax this behavior by giving the struct abilities which allow values to be copied or dropped and also to be stored in global storage or to define global storage schemas.

Structs must be defined inside a module:
```
address 0x2 {
module m {
    struct Foo { x: u64, y: bool }
    struct Bar {}
    struct Baz { foo: Foo, }
    //                   ^ note: it is fine to have a trailing comma
}
}

```

Structs must start with a capital letter A to Z. After the first letter, struct names can contain underscores _, letters a to z, letters A to Z, or digits 0 to 9.


If you need to read and copy a field's value, you can then dereference the borrowed field:

```
let foo = Foo { x: 3, y: true };
let bar = Bar { foo: copy foo };
let x: u64 = *&foo.x;
let y: bool = *&foo.y;
let foo2: Foo = *&bar.foo;

```

## Generics

Generics can be used to define functions and structs over different input data types. This language feature is sometimes referred to as parametric polymorphism. In Move, we will often use the term generics interchangeably with type parameters and type arguments.

Generics are commonly used in library code, such as in vector, to declare code that works over any possible instantiation (that satisfies the specified constraints). In other frameworks, generic code can sometimes be used to interact with global storage many different ways that all still share the same implementation.

Type parameters for functions are placed after the function name and before the (value) parameter list. The following code defines a generic identity function that takes a value of any type and returns that value unchanged.

```
fun id<T>(x: T): T {
    // this type annotation is unnecessary but valid
    (x: T)
}


```

Type parameters for structs are placed after the struct name, and can be used to name the types of the fields.

```
struct Foo<T> has copy, drop { x: T }

struct Bar<T1, T2> has copy, drop {
    x: T1,
    y: vector<T2>,
}

```

## Packages
Packages allow Move programmers to more easily re-use code and share it across projects. The Move package system allows programmers to easily:

* Define a package containing Move code;
* Parameterize a package by named addresses;
* Import and use packages in other Move code and instantiate named addresses;
* Build packages and generate associated compilation artifacts from packages; and
* Work with a common interface around compiled Move artifacts.

The directories marked required must be present in order for the directory to be considered a Move package and to be compiled. Optional directories can be present, and if so will be included in the compilation process. Depending on the mode that the package is built with (test or dev), the tests and examples directories will be included as well.

The sources directory can contain both Move modules and Move scripts (both transaction scripts and modules containing script functions). The examples directory can hold additional code to be used only for development and/or tutorial purposes that will not be included when compiled outside test or dev mode.

A scripts directory is supported so transaction scripts can be separated from modules if that is desired by the package author. The scripts directory will always be included for compilation if it is present. Documentation will be built using any documentation templates present in the doc_templates directory.

```
a_move_package
├── Move.toml      (required)
├── sources        (required)
├── examples       (optional, test & dev mode)
├── scripts        (optional)
├── doc_templates  (optional)
└── tests          (optional, test mode)
```

The Move package manifest is defined within the Move.toml file and has the following syntax. Optional fields are marked with *, + denotes one or more elements:

```
[package]
name = "AName"
version = "0.0.0"

```

## Standard Library

### vector
The vector module defines a number of operations over the primitive vector type. The module is published under the named address Std and consists of a number of native functions, as well as functions defined in Move. 

### option
The option module defines a generic option type Option<T> that represents a value of type T that may, or may not, be present. It is published under the named address Std.

The Move option type is internally represented as a singleton vector, and may contain a value of resource or copyable kind. If you are familiar with option types in other languages, the Move Option behaves similarly to those with a couple notable exceptions since the option can contain a value of kind resource. Particularly, certain operations such as get_with_default and destroy_with_default require that the element type T be of copyable kind.

### errors

Recall that each abort code in Move is represented as an unsigned 64-bit integer. The errors module defines a common interface that can be used to "tag" each of these abort codes so that they can represent both the error category along with an error reason.

Error categories are declared as constants in the errors module and are globally unique with respect to this module. Error reasons on the other hand are module-specific error codes, and can provide greater detail (perhaps, even a particular reason) about the specific error condition. This representation of a category and reason for each error code is done by dividing the abort code into two sections.

### fixed_point32
The fixed_point32 module defines a fixed-point numeric type with 32 integer bits and 32 fractional bits. Internally, this is represented as a u64 integer wrapped in a struct to make a unique fixed_point32 type. Since the numeric representation is a binary one, some decimal values may not be exactly representable, but it provides more than 9 decimal digits of precision both before and after the decimal point (18 digits total). For comparison, double precision floating-point has less than 16 decimal digits of precision, so you should be careful about using floating-point to convert these values to decimal.