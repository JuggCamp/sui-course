# Test Your Pakcages

Sui includes support for the [Move testing framework](https://github.com/move-language/move/blob/main/language/documentation/book/src/unit-testing.md) that enables you to write unit tests that analyze Move code much like test frameworks for other languages (e.g., the built-in Rust testing framework or the JUnit framework for Java).

An individual Move unit test is encapsulated in a public function that has no parameters, no return values, and has the `#[test]` annotation. The testing framework executes such functions when you call the sui move test command from the package root .


```
sui move test
```

## Test your Codes

add these code in "hello"  module

```


    #[test]
    public fun test_message_create() {
        use sui::tx_context;
        let user = @0xBABE;
        let to = @0xBEBA;
        let msg = b"hello";

        // Create a dummy TxContext for testing
        let ctx = tx_context::dummy();

        // Create a sword
        let msg = Message {
            id: object::new(&mut ctx),
            from: user,
            to: to,
            message: string::utf8(msg),
        };

        // Check if accessor functions return correct values
        assert!(msg.message==string::utf8(b"hello"), 1);

        let dummy_address = @0xCAFE;
        transfer::public_transfer(msg, dummy_address);
    }

```

then use the "test" command:

```
sui move test
UPDATING GIT DEPENDENCY https://github.com/MystenLabs/sui.git
INCLUDING DEPENDENCY Sui
INCLUDING DEPENDENCY MoveStdlib
BUILDING helloworld
INCLUDING DEPENDENCY Sui
INCLUDING DEPENDENCY MoveStdlib
BUILDING helloworld
Running Move unit tests
[ PASS    ] 0x0::hello::test_message_create
Test result: OK. Total tests: 1; passed: 1; failed: 0
```


As the code shows, the unit test function (test_message_create()) creates a dummy instance of the TxContext struct and assigns it to ctx. The function then creates a message object using ctx to create a unique identifier . Finally, the test check the messages's vaule.

The function passes the dummy context, ctx, to the object::new function as a mutable reference argument (&mut), but passes message to its accessor functions as a read-only reference argument, &msg.

## Sui-specific testing

The previous testing example is largely pure Move and isn't specific to Sui beyond using some Sui packages, such as sui::tx_context and sui::transfer. While this style of testing is already useful for writing Move code for Sui, you might also want to test additional Sui-specific features. In particular, a Move call in Sui is encapsulated in a Sui transaction, and you might want to test interactions between different transactions within a single test (for example, one transaction creating an object and the other one transferring it).

Sui-specific testing is supported through the test_scenario module that provides Sui-related testing functionality otherwise unavailable in pure Move and its testing framework.

The test_scenario module provides a scenario that emulates a series of Sui transactions, each with a potentially different user executing them. A test using this module typically starts the first transaction using the test_scenario::begin function. This function takes an address of the user executing the transaction as its argument and returns an instance of the Scenario struct representing a scenario.

An instance of the Scenario struct contains a per-address object pool emulating Sui object storage, with helper functions provided to manipulate objects in the pool. After the first transaction finishes, subsequent test transactions start with the test_scenario::next_tx function. This function takes an instance of the Scenario struct representing the current scenario and an address of a user as arguments.

in our test code  `test_say_transactions` we use  test_scenario to begin and end a transaction context.

```
    #[test]
    fun test_say_transactions (){
        use sui::test_scenario;

        let user = @0xBABE;
        let to = @0xBEBA;
        let msg = b"hello";

        let scenario_val = test_scenario::begin(user);
        let scenario = &mut scenario_val;
        {
            say(msg, to, test_scenario::ctx(scenario));
        };

        test_scenario::next_tx(scenario, to);
        {
            let msg = test_scenario::take_from_sender<Message>(scenario);
            assert!(msg.message==string::utf8(b"hello"), 1);
            test_scenario::return_to_sender(scenario, msg);
        };

        test_scenario::end(scenario_val);
    }
```

The test then creates a scenario by starting the first transaction on behalf of the user's address.

The "user" executes the first transaction. The transaction creates a "msg" where the "to" is the receiver.

The "to" then executes the second transaction (passed as an argument to the test_scenario::next_tx function),. In pure Move there is no notion of Sui storage; consequently, there is no easy way for the emulated Sui transaction to retrieve it from storage. This is where the test_scenario module helps - its take_from_sender function allows an object of a given type (Message) that is owned by an address executing the current transaction to be available for Move code manipulation. For now, assume that there is only one such object. In this case, the test transfers the object it retrieves from storage to another address.

At laest we check "msg"'s value with `assert`.

In the pure Move testing function, the function transfers the sword object to the fake address to handle the diappearing problem. The test_scenario package provides a more elegant solution, however, which is closer to what happens when Move code actually executes in the context of Sui - the package simply returns the sword to the object pool using the test_scenario::return_to_sender function.

when use "test" command, we got:

```
sui move test
UPDATING GIT DEPENDENCY https://github.com/MystenLabs/sui.git
INCLUDING DEPENDENCY Sui
INCLUDING DEPENDENCY MoveStdlib
BUILDING helloworld
INCLUDING DEPENDENCY Sui
INCLUDING DEPENDENCY MoveStdlib
BUILDING helloworld
Running Move unit tests
[ PASS    ] 0x0::hello::test_message_create
[ PASS    ] 0x0::hello::test_say_transactions
Test result: OK. Total tests: 2; passed: 2; failed: 0
```