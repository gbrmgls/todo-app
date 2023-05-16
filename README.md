# ToDo App

A monorepo for a todo app.

Contains an Express API and a React GUI.

Implements the Hexagonal Architecture and Redux Pattern using pure Typescript.

Persists data to PouchDB, syncs with CouchDB compatible servers.

Consumes external APIs: [DummyJSON](https://dummyjson.com/) and [Bacon Ipsum](https://baconipsum.com/). Add todos `:random` and `:quote` to call each.

Environment variables are in `Application/envconfig.json`

---

## Running

- React
  - Installing dependencies: `npm run react-install`
  - Development environment: `npm run react-dev`
  - Build: `npm run react-build`
  - Serving build: `npm run react-start`
- Express
  - Installing dependencies: `npm run express-install`
  - Development environment: `npm run express-dev`
  - Build: `npm run express-build`
  - Serving build: `npm run express-start`
