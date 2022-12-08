# WASM Test

A basic application for testing WASM binaries in the browser using webpack and requirejs.

## Usage

- clone the repository
- run `npm i`
- run `npx webpack serve`
- open browser to [http://localhost:9000](http://localhost:9000)

## Caveats

Each wasm is different / requires different capabilities. This repo attempts to handle most things required for emscripten but assumes that any other dependencies like fs, crypto, streams, process, are pulled in with requirejs rather than using the globals / Module defined by emscripten. However, if you are using a basic emscripten build you can start with this repo and replace the contents in src/patch.js with the global Module definition needed for emscripten.
