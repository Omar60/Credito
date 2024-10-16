import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());

// Configurar CORS para permitir solicitudes desde el frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

// Conexión a la base de datos
let db;

async function initializeDatabase() {
  db = await open({
    filename: path.join(__dirname, 'database.sqlite'),
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS clientes (
      id TEXT PRIMARY KEY,
      nombre TEXT NOT NULL,
      empresa TEXT NOT NULL,
      montoCredito REAL NOT NULL,
      plazo INTEGER NOT NULL,
      estadoCredito TEXT NOT NULL,
      fechaCreacion TEXT NOT NULL,
      comision REAL NOT NULL,
      comisionPagada INTEGER NOT NULL
    )
  `);
}

initializeDatabase();

// Rutas API

// Obtener todos los clientes
app.get('/api/clientes', async (req, res) => {
  try {
    const clientes = await db.all('SELECT * FROM clientes');
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear un nuevo cliente
app.post('/api/clientes', async (req, res) => {
  const { id, nombre, empresa, montoCredito, plazo, estadoCredito, fechaCreacion, comision, comisionPagada } = req.body;
  try {
    await db.run(
      'INSERT INTO clientes (id, nombre, empresa, montoCredito, plazo, estadoCredito, fechaCreacion, comision, comisionPagada) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, nombre, empresa, montoCredito, plazo, estadoCredito, fechaCreacion, comision, comisionPagada ? 1 : 0]
    );
    res.status(201).json({ message: 'Cliente creado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar un cliente
app.put('/api/clientes/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, empresa, montoCredito, plazo, estadoCredito, comision, comisionPagada } = req.body;
  try {
    await db.run(
      'UPDATE clientes SET nombre = ?, empresa = ?, montoCredito = ?, plazo = ?, estadoCredito = ?, comision = ?, comisionPagada = ? WHERE id = ?',
      [nombre, empresa, montoCredito, plazo, estadoCredito, comision, comisionPagada ? 1 : 0, id]
    );
    res.json({ message: 'Cliente actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un cliente
app.delete('/api/clientes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.run('DELETE FROM clientes WHERE id = ?', id);
    res.json({ message: 'Cliente eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});
