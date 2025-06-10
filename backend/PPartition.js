const express = require('express');
const app = express();
const cors = require('cors')
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Importa la función del algoritmo (ajusta la ruta según tu estructura)
const { algoritmoPropio } = require('./Algoritmo_Propio');

// Ruta de inicio
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Ruta para acceder al algoritmo desde Particion.jsx
app.post('/algoritmo-propio', (req, res) => {
    const inputData = req.body;
    try {
        const resultado = algoritmoPropio(inputData);
        res.json({ resultado });
    } catch (error) {
        res.status(500).json({ error: 'Error al ejecutar el algoritmo' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});