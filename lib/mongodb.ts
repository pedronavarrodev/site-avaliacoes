import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error('Por favor defina a variável de ambiente MONGODB_URI')
}

let cached = global as any
if (!cached.mongoose) {
  cached.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  if (cached.mongoose.conn) {
    return cached.mongoose.conn
  }

  if (!cached.mongoose.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
      maxPoolSize: 10
    }

    cached.mongoose.promise = mongoose.connect(MONGODB_URI, opts).catch(error => {
      console.error('Erro ao conectar ao MongoDB:', error);
      throw error;
    });
  }

  try {
    cached.mongoose.conn = await cached.mongoose.promise
    console.log('MongoDB conectado com sucesso');
    return cached.mongoose.conn
  } catch (e) {
    cached.mongoose.promise = null
    console.error('Erro na conexão com MongoDB:', e);
    throw e
  }
}

export default dbConnect 