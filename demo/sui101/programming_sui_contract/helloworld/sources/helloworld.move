module helloworld::hello {
    use sui::tx_context::{Self,TxContext};
    use sui::object::{Self, UID};
    use sui::event::emit;
    use std::string::{Self};
    use sui::transfer;

    struct Message has key, store {
        id: UID,
        from: address,
        to: address,
        message: string::String,
    }


    /// Event
    struct MessageEvent has copy, drop {
        from: address,
        to: address,
        message:  string::String,
    }

    #[allow(unused_function)]
    fun init(_ctx: &mut TxContext) {

    }

    public entry fun say(
        message: vector<u8>,
        to: address,
        ctx: &mut TxContext
    ) {
        let msg = string::utf8(message);
                
        // create a message
        let a_msg = Message {
            id: object::new(ctx),
            from: tx_context::sender(ctx),
            to: to,
            message: msg,
        };

        transfer::transfer(a_msg, to);

        // emit an event confirming gene addition
        emit(MessageEvent {from: tx_context::sender(ctx), to: to, message: msg});

    }

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

}


