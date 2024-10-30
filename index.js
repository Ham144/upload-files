import express from "express"
import "dotenv/config"
import multer from "multer"
import path from "path"
import fs from "fs"
import Table from "./models/table.model.js"
import csv from "csv-parser"
import connectDB from "./libs/connectDB.js"
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//multer
const upload = multer({ dest: "uploads/" })

app.get("/", (req, res) => { return res.send("sukses") }) //aku bahkan ga bisa akses ini

//database init
connectDB()

//upload csv file
app.post("/api/uploads/csv", upload.single('file'), async (req, res) => {
    const result = []

    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => result.push(data))
        .on('end', () => {
            fs.unlinkSync(req.file.path); //menhapus file setelah dibaca
            res.json(result)
        })
})

app.post("/api/uploads/confirm-upload", async (req, res) => {
    const products = req.body.products
    await Table.insertMany(products).then((response) => {
        console.log("berhasil tambah multiple products")
        return res.json({ success: true, message: "berhasil menambahkan " + products?.length + " products ke DB" })
    }).catch(err => {
        console.log(err)
        return res.send("gagal menambahkan")
    })
})

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log("backend berhasil berjalan di " + PORT)
})