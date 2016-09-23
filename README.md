# Testing server for cordova-plugin-mauron85-background-geolocation

renders positions updates on map

## Install required dependencies

```
npm install
```

## Add google API key
in index.html
```
replace {{{API KEY HERE}} with google api key
```

## Run server
```
npm start
```

## In your app setup cordova-plugin-mauron85-background-geolocation
```
var bgOptions = {
  ...
  url: 'http://IP_ADDRESS_OF_SERVER:3000/locations',
  syncUrl: 'http://IP_ADDRESS_OF_SERVER:3000/sync',
  syncThreshold: 100,
  httpHeaders: {
    'X-FOO': 'bar'
  },
  ...
};

backgroundGeolocation.configure(
  successFn,
  errorFn,
  bgOptions
);

backgroundGeolocation.start();
```

## Visit url in the browser
```
http://localhost:3000
```
and watch for position updates as map markers
