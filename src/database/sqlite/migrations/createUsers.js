const createUsers = `
CREATE TABLE IF NOT EXISTIS users (
  id INTERGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR,
  email VARCHAR,
  password VARCHAR,
  avatar VARCHAR NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;

module.exports = createUsers;