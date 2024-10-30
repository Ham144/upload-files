import mongoose from "mongoose"
import "dotenv/config"

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("berhasil menyambung ke DB")
    } catch (error) {
        console.log("terjadi kesalahan menyambung DB: " + error)
        return process.exit(0)
    }
}

export default connectDB