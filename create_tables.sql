DROP TABLE IF EXISTS rol;

DROP TABLE IF EXISTS sede;

DROP TABLE IF EXISTS usuario;

DROP TABLE IF EXISTS proveedor;

DROP TABLE IF EXISTS categoria_gasto;

DROP TABLE IF EXISTS tipo_gasto;

DROP TABLE IF EXISTS dte;

DROP TABLE IF EXISTS gasto;

DROP TABLE IF EXISTS gasto_documento;

CREATE TABLE IF NOT EXISTS
  rol (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL
  );

CREATE TABLE IF NOT EXISTS
  sede (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    direccion TEXT NOT NULL
  );

CREATE TABLE IF NOT EXISTS
  usuario (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rol_id INTEGER NOT NULL,
    sede_id INTEGER NOT NULL,
    nombre TEXT NOT NULL,
    apellido_paterno TEXT NOT NULL,
    apellido_materno TEXT NOT NULL,
    rut INTEGER NOT NULL,
    dv TEXT NOT NULL,
    FOREIGN KEY (rol_id) REFERENCES rol (id),
    FOREIGN KEY (sede_id) REFERENCES sede (id)
  );

CREATE TABLE IF NOT EXISTS
  proveedor (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    descripcion TEXT
  );

CREATE TABLE IF NOT EXISTS
  categoria_gasto (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL
  );

CREATE TABLE IF NOT EXISTS
  tipo_gasto (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL
  );

CREATE TABLE IF NOT EXISTS
  dte (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    codigo TEXT NOT NULL
  );

CREATE TABLE IF NOT EXISTS
  gasto (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    proveedor_id INTEGER NOT NULL,
    usuario_id INTEGER NOT NULL,
    sede_id INTEGER NOT NULL,
    categoria_gasto_id INTEGER NOT NULL,
    tipo_gasto_id INTEGER NOT NULL,
    dte_id INTEGER NOT NULL,
    fecha_creacion TEXT NOT NULL,
    fecha_contable TEXT NOT NULL,
    monto_neto INTEGER NOT NULL,
    monto_iva INTEGER NOT NULL,
    monto_total INTEGER NOT NULL,
    notas TEXT,
    FOREIGN KEY (proveedor_id) REFERENCES proveedor (id),
    FOREIGN KEY (usuario_id) REFERENCES usuario (id),
    FOREIGN KEY (sede_id) REFERENCES rol (id),
    FOREIGN KEY (categoria_gasto_id) REFERENCES categoria_gasto (id),
    FOREIGN KEY (tipo_gasto_id) REFERENCES tipo_gasto (id),
    FOREIGN KEY (dte_id) REFERENCES dte (id)
  );

CREATE TABLE IF NOT EXISTS
  gasto_documento (
    documento_id INTEGER PRIMARY KEY AUTOINCREMENT,
    gasto_id TEXT NOT NULL,
    nombre TEXT NOT NULL,
    formato TEXT NOT NULL,
    FOREIGN KEY (gasto_id) REFERENCES gasto (id)
  );