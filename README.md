
1) Install webpack dependencies + Local Dependencies

npm i --save-dev webpack webpack-cli @babel/core @babel/preset-env babel-loader
npm install --save ./deps/lexical
npm install --save ./deps/@lexical/plain-text

2) Build minified

npm run build

3) Serve `static/index.html`

```
yarn global add serve
serve
```

4) Navigate to http://localhost:3000/static/