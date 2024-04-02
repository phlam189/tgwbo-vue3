To get these running - just provide keys to respective apis. You're advised to copy `.env.example` with rename to `.env` then modify it.

## Demos

You can enable demos in build by :

```
VUE_APP_INCLUDE_DEMOS=true
```

Demos are included in staging build by default. They're not present in production because of significant impact on bundle size.

## Build Version

You can enable build version, hash commit, and timestamp by build to the main page footer:

```
VUE_APP_BUILD_VERSION=true
```

This information are excluded by default.
Then, if you use npm:

```
$ npm install

# serve with hot reload at localhost:8080 by default.
$ npm run dev

# build for production
$ npm run build

# build for production and view the bundle analyzer report.
$ npm run build --report
```

If you use yarn:

```
$ yarn install

# serve with hot reload at localhost:8080 by default.
$ yarn dev

# build for production
$ yarn build

# build for production and view the bundle analyzer report.
$ yarn build --report
```
