# `sequentialPromises`

[External Documentation](https://github.com/edwinspire/sequential-promises) 

Legacy alias of PromiseSequence kept for backward compatibility.

**Notes**

- Deprecated alias. Prefer PromiseSequence in new endpoint code.

#### Example

```javascript

const result = await sequentialPromises.ByBlocks(async (item) => item, 2, [1, 2, 3, 4]);
$_RETURN_DATA_ = result;
      
```

