#! /usr/bin/env node

const minimist = require('minimist');
const { connectDb, closeDb } = require('./connection');
const { createAttendants } = require('./populate-attendants');
const { createEvents } = require('./populate-events');
const { createInterests } = require('./populate-interests');
const { createUsers } = require('./populate-users');

const userArgs = minimist(process.argv.slice(2), {
  boolean: ['random-location', 'verbose'],
  number: 'multiplier',
  string: 'collection',
  alias: {
    c: 'collection',
    m: 'multiplier',
    r: 'random-location',
    v: 'verbose',
  },
  default: { multiplier: 1 },
});

const populateCollections = async () => {
  connectDb();
  await createInterests(userArgs.v);
  await createUsers(userArgs.m, userArgs.r, userArgs.v);
  await createEvents(userArgs.m, userArgs.r, userArgs.v);
  await createAttendants(userArgs.v);
  closeDb();
};

const populateCollection = async () => {
  connectDb();
  switch (userArgs.c.toLowerCase()) {
    case 'interests':
      await createInterests(userArgs.v);
      break;
    case 'users':
      await createUsers(userArgs.m, userArgs.r, userArgs.v);
      break;
    case 'events':
      await createEvents(userArgs.m, userArgs.r, userArgs.v);
      break;
    case 'attendants':
      await createAttendants(userArgs.v);
      break;
    default:
      console.log(
        `Unknown collection '${userArgs.c}', possible options are: [interests, users, events, attendants]`
      );
      break;
  }
  closeDb();
};

userArgs.c ? populateCollection() : populateCollections();
