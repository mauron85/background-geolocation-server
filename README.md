# Testing server

Watch location updates from native app live in your browser. Locations are pushed to the browser via websocket and rendered on a google map.

Useful for debugging issues with
[cordova-plugin-mauron85-background-geolocation](https://github.com/mauron85/cordova-plugin-background-geolocation)
or [react-native-mauron85-background-geolocation](https://github.com/mauron85/react-native-background-geolocation).

## Clone repo

```
git clone https://github.com/mauron85/background-geolocation-server.git

cd background-geolocation-server
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

## In your app setup

Configure plugin with options `url` and `syncUrl`:

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

// At some point call start() method of the plugin to start receiving location updates

```
## Visit url in the browser
```
http://localhost:3000
```
and watch for position updates as map markers

## Example Apps

Following example apps can be used with this server:

* [cordova-plugin-background-geolocation-example](https://github.com/mauron85/cordova-plugin-background-geolocation-example)
* [react-native-background-geolocation-example](https://github.com/mauron85/react-native-background-geolocation-example)

## Mocking locations

### Android
There is Lockito app on play store to mock actual routes:

https://play.google.com/store/apps/details?id=fr.dvilleneuve.lockito

### iOS simulator

Follow project: https://github.com/lyft/set-simulator-location

### Genymotion

It's possible to mock locations using Genymotion Shell.
Read Genymotion blog post: [Simulate GPS Movements Using GMTool & Genymotion Shell](https://www.genymotion.com/blog/simulate-gps-movements/)

If you prefer nodejs (over python), you can also use alternative `genylocation.js` script. Follow blog post instructions how to prepare locations using google maps and gpsvisualizer. Instead of GPX format set gpsvisualizer:

* Output format to: Plain text
* Plain text delimiter: comma

Execute:

`node genylocation.js your.csv`

Or use repo sample:

`node genylocation.js samples/sample_route.csv`

NOTE: genyshell binary has to be accesible via shell $PATH property.
