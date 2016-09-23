# Testing server for cordova-plugin-mauron85-background-geolocation

renders positions updates on map

## Clone repo

```
git clone https://github.com/mauron85/cordova-bg-server

cd cordova-bg-server
```

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

## Mocking locations
There is Lockito app on play store to mock actual routes:

https://play.google.com/store/apps/details?id=fr.dvilleneuve.lockito

## Visit url in the browser
```
http://localhost:3000
```
and watch for position updates as map markers
