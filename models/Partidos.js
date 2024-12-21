import mongoose from 'mongoose';

// Esquema del Partido
const partidoSchema = new mongoose.Schema({
    id: { type: String, required: true }, // UUID para identificar el partido
    jugadores: [
        {
            nombre: { type: String, required: true },
            numero: { type: Number, required: true },
            x: { type: String, required: true },
            y: { type: String, required: true },
            lado: { type: Number, required: true, enum: [1, 0] },
            hora: { type: String, required: true },
            color: { type: String, required: true },
            colorSecundario: { type: String, required: true }
        },
    ],
    totalJugadores: { type: Number, required: true },
    ganador: { type: String, required: true },
    lugar: { type: String, required: true },
    precioTotal: { type: Number, required: true },

});

// Modelo Partido
const Partido = mongoose.model('Partido', partidoSchema);

export default Partido;
