DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS locale;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS provider;
DROP TABLE IF EXISTS bill_category;
DROP TABLE IF EXISTS bill_type;
DROP TABLE IF EXISTS dte;
DROP TABLE IF EXISTS bill;
DROP TABLE IF EXISTS bill_document;

CREATE TABLE IF NOT EXISTS
  role (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  );

CREATE TABLE IF NOT EXISTS
  locale (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address TEXT NOT NULL
  );

CREATE TABLE IF NOT EXISTS
  user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role_id INTEGER NOT NULL,
    locale_id INTEGER NOT NULL,
    username TEXT NOT NULL,
    name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    second_last_name TEXT NOT NULL,
    rut INTEGER NOT NULL,
    dv TEXT NOT NULL,
    password TEXT NOT NULL,
    FOREIGN KEY (role_id) REFERENCES role (id),
    FOREIGN KEY (locale_id) REFERENCES locale (id)
  );

CREATE TABLE IF NOT EXISTS
  provider (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT
  );

CREATE TABLE IF NOT EXISTS
  bill_category (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  );

CREATE TABLE IF NOT EXISTS
  bill_type (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  );

CREATE TABLE IF NOT EXISTS
  dte (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    code TEXT NOT NULL
  );

CREATE TABLE IF NOT EXISTS
  bill (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    provider_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    locale_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    bill_type_id INTEGER NOT NULL,
    dte_id INTEGER NOT NULL,
    creation_date TEXT NOT NULL,
    contable_date TEXT NOT NULL,
    total_neto INTEGER NOT NULL,
    total_iva INTEGER NOT NULL,
    total_amount INTEGER NOT NULL,
    notes TEXT,
    image TEXT,
    FOREIGN KEY (provider_id) REFERENCES provider (id),
    FOREIGN KEY (user_id) REFERENCES user (id),
    FOREIGN KEY (locale_id) REFERENCES locale (id),
    FOREIGN KEY (category_id) REFERENCES bill_category (id),
    FOREIGN KEY (bill_type_id) REFERENCES bill_type (id),
    FOREIGN KEY (dte_id) REFERENCES dte (id)
  );

CREATE TABLE IF NOT EXISTS
  bill_document (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bill_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    format TEXT NOT NULL,
    FOREIGN KEY (bill_id) REFERENCES bill (id)
  );
