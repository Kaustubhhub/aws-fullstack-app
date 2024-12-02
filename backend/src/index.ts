import express from "express"
import cors from "cors"
import { Request, Response } from "express"

interface params {
    id: string;
    title: string;
}

const PORT = 8080
const app = express()
app.use(express.json())
app.use(cors())

app.get("/", (req: Request<params>, res: Response) => {
    res.json({
        message: "server health check"
    })
})

app.post("/item", (req: Request<params>, res: Response) => {
    const { id, title }: { id: string; title: string } = req.body;
    console.log(id, title)
})

app.get("/items", (req: Request<params>, res: Response) => {

})

app.put("/item/{id}", (req: Request<params>, res: Response) => {

})

app.delete("/item/{id}", (req: Request<params>, res: Response) => {

})

app.listen(PORT, () => {
    console.log(`The server is running on port ${PORT}`)
})