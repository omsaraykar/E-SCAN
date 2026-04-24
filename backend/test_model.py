import os
os.environ["KERAS_BACKEND"] = "tensorflow"

import keras_nlp
import keras
import numpy as np

print("Keras version:", keras.__version__)

try:
    print("Loading classifier architecture...")
    # Use preset to get tokenizers and backbone config
    classifier = keras_nlp.models.DebertaV3Classifier.from_preset(
        "deberta_v3_base_en",
        num_classes=8,
        load_weights=False,
    )
    
    print("Loading weights...")
    # by_name=True ensures we match layers that exist, skip_mismatch skips layers if architecture is slightly different
    classifier.load_weights("./model/model.weights.h5", skip_mismatch=True)
    
    print("Predicting test string...")
    out = classifier.predict(["pragma solidity ^0.7.0; contract Vulnerable {}"])
    print(out)
    print("Success!")
except Exception as e:
    import traceback
    traceback.print_exc()
