const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Configuración de la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Cambia esto por tu usuario de MySQL
    password: '', // Cambia esto por tu contraseña de MySQL
    database: 'clientes_db' // Cambia esto por el nombre de tu base de datos
});

db.connect(err => {
    if (err) throw err;
    console.log('Conectado a la base de datos MySQL');
});

// Rutas para la API
app.get('/clients', (req, res) => {
    db.query('SELECT * FROM clients', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.post('/clients', (req, res) => {
    const client = req.body;
    const query = 'INSERT INTO clients (name, docType, docNumber, address, district, phone, email, plan, crmStatus, releaseTime, observations, orderStatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [client.name, client.docType, client.docNumber, client.address, client.district, client.phone, client.email, client.plan, client.crmStatus, client.releaseTime, client.observations, client.orderStatus];
    db.query(query, values, (err, results) => {
        if (err) throw err;
        res.json({ message: 'Cliente agregado' });
    });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
