# `z`

[External Documentation](https://zod.dev/?id=introduction) 

Zod schema builder and validator, exposed in the JS handler as the variable z.

**Notes**

- The runtime key is z, even though the imported module is named Zod in this source file.

#### Example

```javascript

const schema = z.object({
  name: z.string(),
  age: z.number().int().nonnegative(),
});

const result = schema.parse({ name: 'John', age: 30 });
$_RETURN_DATA_ = result;
      
```

