import h5py

def print_h5_structure(filename):
    with h5py.File(filename, 'r') as f:
        print("Keys in h5 file:")
        def print_keys(name, obj):
            if isinstance(obj, h5py.Dataset):
                print(f"  {name}: {obj.shape}")
        
        f.visititems(print_keys)

print_h5_structure("./model/model.weights.h5")
