import express from 'express';
import mongoose from 'mongoose';
import Jugador from './models/Jugador.js';
import Partido from './models/Partidos.js';
import { v4 as uuidv4 } from 'uuid';
import cors from 'cors';

const app = express();
const PORT = 3000;

// Middleware para manejar JSON
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
const MONGO_URI = 'mongodb://181.228.169.90:27017/Fulbol-Manager?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.3';
mongoose.connect(MONGO_URI, {})
    .then(() => console.log('Conectado a MongoDB'))
    .catch((err) => console.error('Error al conectar a MongoDB:', err));

// Rutas para jugadores
try {
    await db.connectDB();

    db.sync()
    console.log("conectado a la db");
} catch (error) {
    console.log(error);
}


app.get('/partidos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Buscar el partido por ID
        const partido = await Partido.findOne({ id });

        if (!partido) {
            return res.status(404).json({ error: 'Partido no encontrado' });
        }

        // Devolver los detalles del partido, incluidos los jugadores
        res.json(partido);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el partido', detalles: error.message });
    }
});


// Rutas para partidos
app.post('/partidos', async (req, res) => {
    const { jugadores, idcarga, ganador, lugar, precioTotal } = req.body;
    var id = idcarga
    console.log(id);
    // Validar que se reciba un array de jugadores
    if (!Array.isArray(jugadores) || jugadores.length === 0) {
        return res.status(400).json({ error: 'El cuerpo de la solicitud debe incluir un arreglo de jugadores.' });
    }

    try {
        if (id) {
            // Buscar el partido existente por id
            const partidoExistente = await Partido.findOne({ id });

            if (!partidoExistente) {
                return res.status(404).json({ error: 'No se encontró un partido con el ID proporcionado.' });
            }

            // Actualizar el partido existente con los nuevos datos de jugadores
            partidoExistente.jugadores = null;

            await partidoExistente.save();
            partidoExistente.jugadores = jugadores;
            partidoExistente.totalJugadores = jugadores.length;
            partidoExistente.precioTotal = precioTotal;
            partidoExistente.ganador = ganador;


            await partidoExistente.save();

            return res.status(200).json({ message: 'Partido actualizado exitosamente.', id: partidoExistente.id });
        } else {
            // Crear un nuevo partido si no hay un ID proporcionado
            const jugadoresGuardados = [];
            for (const jugador of jugadores) {
                const nuevoJugador = new Jugador(jugador); // Crea un documento en la tabla Jugadores
                const jugadorGuardado = await nuevoJugador.save();
                jugadoresGuardados.push(jugadorGuardado);
            }

            const nuevoId = uuidv4(); // Generar un ID único para el partido
            const nuevoPartido = new Partido({
                id: nuevoId,
                jugadores,
                totalJugadores: jugadores.length,
                lugar,
                precioTotal,
                ganador
            });

            // Guardar el partido en la base de datos
            await nuevoPartido.save();

            return res.status(201).json({ message: 'Partido creado exitosamente.', id: nuevoId });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al procesar la solicitud', detalles: error.message });
    }
});

// Eliminar todos los jugadores de la colección
const borrartodo = () => {
    Jugador.deleteMany({}, (err) => {
        if (err) {
            console.error('Error al eliminar los jugadores:', err);
        } else {
            console.log('Todos los jugadores han sido eliminados');
        }
    });
};

app.get('/borrar', async (req, res) => {
    borrartodo()
    Jugador.collection.drop()
        .then(() => console.log('Colección de jugadores eliminada'))
        .catch((err) => console.error('Error al eliminar la colección:', err));
    res.json({ mensaje: 'Colección de jugadores eliminada con éxito' });
});

app.get('/historial', async (req, res) => {

    const historial = await Partido.find({});


    res.json({ historial })

})


// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
