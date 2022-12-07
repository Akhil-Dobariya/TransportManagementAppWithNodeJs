const dbConfig = {
    user: 'tmadmin', //sql user
  password: 'IN#22@TMapp', //sql password
  server: 'DESKTOP-K17OPLG\\SQLEXPRESS', //sql server name
  database: 'TransportManagement', //database name
  options: {
    trustedConnection: true,
    trustServerCertificate: true,
  },
  port: 1433
}

const JWTConfig = {
  ACCESS_TOKEN_SECRET:"0efc15ee008bd46218c4fd4643d746c7e7402843ae615d8f581571e5ec303551",
  REFRESH_TOKEN_SECRET:"744d1b4ba83176f930a80611bac45537c46bf6f8aa9b05d1727b52d3e399dee3",
  ACCESS_TOKEN_VALIDITY:"20s",
  REFRESH_TOKEN_VALIDITY:"1y"
}

module.exports = {
    dbConfig,
    JWTConfig
}