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

module.exports = {
    dbConfig
}