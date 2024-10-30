import bodyParser from "body-parser"
import express from "express"
import "dotenv/config"
import multer, { diskStorage } from "multer"
import path from "path"
import fs from "fs"
import Table from "./models/table.model"

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//multer
const upload = multer({ dest: "uploads/" })

//upload csv file
app.post("/api/uploads/csv", upload.single('file'), async (req, res) => {
    const file = req.body.file
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
    const isSuccess = await Table.insertMany(products)
    if (!isSuccess) return res.status(500).json({ success: false, errors: isSuccess })
    res.json({ success: true, message: "berhasil menambahkan " + products.products?.length + " data ke DB" })
})

const PORT = process.env.PORT || 3001;

app.listen(() => {
    console.log("backend berhasil berjalan di " + PORT)
})