# `$_CUSTOM_HEADERS_`

[External Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) 

Map of custom response headers to send together with $_RETURN_DATA_.

**Notes**

- Useful for downloads, custom content types, caching headers, and content disposition.

**Agent Guidance**

- Set headers here before assigning binary or special response payloads to $_RETURN_DATA_.

*   Returns: Map object with custom headers

#### Example

```javascript

$_CUSTOM_HEADERS_.set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
$_CUSTOM_HEADERS_.set(
  "Content-Disposition",
  'attachment; filename="file.xlsx"',
);
      
```

