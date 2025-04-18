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
    }

    cached.mongoose.promise = mongoose.connect(MONGODB_URI, opts)
  }
  cached.mongoose.conn = await cached.mongoose.promise
  return cached.mongoose.conn
}

export default dbConnect 