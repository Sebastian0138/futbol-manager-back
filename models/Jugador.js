import mongoose from 'mongoose';

// Esquema del Jugador
const jugadorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  numero: { type: Number, required: true },
  x: { type: String, required: true },
  y: { type: String, required: true },
  lado: { type: Number, required: true, enum: [1, 0] },
  hora: { type: String, required: true },
  color: { type: String, required: true },
  colorSecundario: { type: String, required: true }
});

// Modelo Jugador
const Jugador = mongoose.model('Jugador', jugadorSchema);

export default Jugador
