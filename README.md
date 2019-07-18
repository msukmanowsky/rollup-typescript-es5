# rollup-typescript-es5

Sample project using Rollup and TypeScript that demonstrates an apparent issue
where TypeScript isn't compiling to the ES5 target.

See [`dist/library-js.umd.js`](dist/library-js.umd.js)–arrow functions are in
that file and they shouldn't be:

```
var strictUriEncode = str => encodeURIComponent(str).replace(/[!'()*]/g, x => `%${x.charCodeAt(0).toString(16).toUpperCase()}`);
```