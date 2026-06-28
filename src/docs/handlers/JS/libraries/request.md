# `request`

[External Documentation](https://fastify.dev/docs/latest/Reference/Request/) 

Fastify Request object with body, query, headers, params, and request metadata.

**Notes**

- For GET endpoints, use request.query. For JSON POST endpoints, use request.body.

*   Returns: Fastify Request object

#### Example

```javascript

$_RETURN_DATA_ = {
  query: request.query,
  body: request.body,
  headers: request.headers,
};
      
```

