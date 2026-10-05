const express = require('express');
const db = require('./db')
const app = express()
const port = 3000
app.use(express.json())
app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.get('/teste2', (req, res) => {
    res.send('Isto é um teste')
})
app.get('/prontuarios', async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM pacientes");
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({
            mensagem: "Erro interno do servidor!",
            detalhes: error.message
        });
    }
})
app.get('/paciente/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.execute("SELECT * FROM `pacientes` WHERE id = ?", [id]);
        if (rows.length === 0) {
            return res.status(404).json("Paciente não encontrado!");
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({
            mensagem: "Erro interno do servidor!",
            detalhes: error.message
        });
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})