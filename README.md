# Alarmas Del Subte

[![Build Status](https://travis-ci.org/feldmatias/AlarmasDelSubte.svg?branch=master)](https://travis-ci.org/feldmatias/AlarmasDelSubte)
[![Coverage Status](https://coveralls.io/repos/github/feldmatias/AlarmasDelSubte/badge.svg?branch=master&a=2)](https://coveralls.io/github/feldmatias/AlarmasDelSubte?branch=master)

### App
https://github.com/feldmatias/AlarmasDelSubte-App

### Documentation
[GraphQL schema](src/graphql/schema.graphql)

[Command Endpoints](src/commands/routes.ts)

### Setup
Install node.js and npm, then run `npm install`

### Build
- Start dev: `npm start`
- Run tests: `npm test`
- Run linter: `npm run pretest`

### Migrations
-Generate: `npm run migrations:generate -- -n \<migration name\>`

### Config for development
Check `config/default.ts` for missing configuration values, they need to be set in a file named `config/development.ts`

Important values:
- `subways.realTimeUrl`: url where to fetch subways status.
- `notifications.configFile`: json file with firebase configuration (needs to be in `config/push_notifications/`)

### Git hooks
Copy all files in `/hooks` to `.git/hooks/`

They will run the linter for every commit, and tests before a push.
