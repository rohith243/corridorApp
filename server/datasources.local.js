console.log( 'in  datasources local.js' );

var extend = require('util')._extend;

// Use the memory connector by default.
var DB = process.env.DB || 'memory';

var DATASTORES = {
  memory: {
  },
  oracle: {
    host: 'oracle-demo.strongloop.com',
    port: 1521,
    database: 'XE',
    username: 'demo',
    maxConn: 40,
    password: 'L00pBack'
  },
  mongodb: {
    host: process.env.DB_HOST ? process.env.DB_HOST : 'localhost',
    database: 'letsBuild',
    /*username: 'demo',
    password: 'L00pBack',*/
    port: process.env.DB_PORT ? process.env.DB_PORT : '27017'
  },
  mysql: {
    host: 'demo.strongloop.com',
    port: 3306,
    database: 'demo',
    username: 'demo',
    password: 'L00pBack'
  }
};

if (!(DB in DATASTORES)) {
  console.error('Invalid DB "%s"', DB);
  console.error('Supported values', Object.keys(DATASTORES).join(' '));
  process.exit(1);
}

console.error('Using the %s connector.', DB);
console.error('To specify another connector:');
console.error('  `DB=oracle node .` or `DB=oracle slc run .`');
console.error('  `DB=mongodb node .` or `DB=mongodb slc run .`');
console.error('  `DB=mysql node .` or `DB=mysql slc run .`');

var connector = DB === 'memory' ? DB : 'loopback-connector-' + DB;
var config = extend({ connector: connector }, DATASTORES[DB]);

module.exports = {
  db: config
};
