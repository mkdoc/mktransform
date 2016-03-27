## Example

Run a custom stream transformation:

```shell
mkcat README.md | mktransform doc/upper.js | mkout
```

Run multiple transformations:

```shell
mkcat README.md | mktransform test/fixtures/upper1.js test/fixtures/upper2.js | mkout
```

