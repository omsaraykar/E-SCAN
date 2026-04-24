import os
os.environ["KERAS_BACKEND"] = "tensorflow"

import keras_nlp
import keras
import numpy as np

# Load the architecture
classifier = keras_nlp.models.DebertaV3Classifier.from_preset(
    "deberta_v3_base_en",
    num_classes=8,
    load_weights=False,
)

classifier.load_weights("./model/model.weights.h5", skip_mismatch=True)

test_cases = {
    "Arithmetic": """
pragma solidity ^0.4.15;
contract Overflow {
    uint public sellerBalance=0;
    function add(uint value) returns (bool){
        sellerBalance += value;
        return true;
    }
}
""",
    "Reentrancy": """
pragma solidity ^0.5.0;
contract Reentrance {
    mapping (address => uint) userBalance;
    function getBalance(address u) constant returns(uint){
        return userBalance[u];
    }
    function addToBalance() payable{
        userBalance[msg.sender] += msg.value;
    }   
    function withdrawBalance(){
        if( ! (msg.sender.call.value(userBalance[msg.sender])() ) ){
            revert();
        }
        userBalance[msg.sender] = 0;
    }   
}
""",
    "Unchecked Low Level Calls": """
pragma solidity ^0.4.0;
contract UncheckedExternalCall {
    function callToken(address token) {
        token.call("");
    }
}
""",
    "Time Manipulation": """
pragma solidity ^0.4.0;
contract Time {
    function play() {
        require(block.timestamp > 1500000000);
    }
}
""",
    "Randomness": """
pragma solidity ^0.4.0;
contract GuessTheRandomNumber {
    function guess(uint n) {
        require(n == block.timestamp % 10);
    }
}
"""
}

# The class map from backend
CLASS_NAMES = {
    0: 'Access Control',
    1: 'Reentrancy',
    2: 'Arithmetic',
    3: 'Unchecked Low Level Calls',
    4: 'Bad Randomness',
    5: 'Front Running',
    6: 'Time Manipulation',
    7: 'Short Addresses',
}

for name, code in test_cases.items():
    logits = classifier.predict([code], verbose=0)
    probabilities = np.exp(logits) / np.sum(np.exp(logits), axis=-1, keepdims=True)
    probabilities = probabilities[0]
    predicted_id = int(np.argmax(probabilities))
    print(f"Test case '{name}': Predicted '{CLASS_NAMES.get(predicted_id)}' with conf {np.max(probabilities):.3f}")
    
