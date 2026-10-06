const express = require('express');
const db = require('./db')
const app = express()
const port = 3000
app.use(express.json())

//Função para calcular o imc
function calcularIMC(peso, altura) {
    const resultado = peso / (altura * altura);
    const imc = parseFloat(resultado.toFixed(2));
    let status = "";
    if (imc < 18.5) {
        status = "Abaixo do peso normal";
    } else if (imc < 25) {
        status = "Peso normal";

    } else if (imc < 30) {
        status = "Excesso de Peso";
    } else {
        status = "Obesidade";
    }
    return { imc, status }
}
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
            return res.status(404).json({ mensagem: "Paciente não encontrado!" });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({
            mensagem: "Erro interno do servidor!",
            detalhes: error.message
        });
    }
})
app.post('/paciente', async (req, res) => {
    const { nome, idade, altura, peso } = req.body;
    if (!nome || !idade || !altura || !peso) {
        res.status(400).json({
            mensagem: " Solicitação Inválida!",
            detalhes: error.message
        });
    }
    const { imc, status } = calcularIMC(Number(peso), Number(altura));
    try {
        const [resultado] = await db.execute("INSERT INTO pacientes (nome, idade, altura, peso, imc, status) VALUES (?,?,?,?,?,?);", [nome, idade, altura, peso, imc, status]);
        res.status(201).json({
            id: resultado.insertId,
            nome,
            idade,
            altura,
            peso,
            imc,
            status

        })
    } catch (error) {
        res.status(500).json({
            mensagem: "Erro interno do servidor!",
            detalhes: error.message
        });
    }

})
app.put('/paciente/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, idade, altura, peso } = req.body;
    if (!nome || !idade || !altura || !peso) {
        res.status(400).json({
            mensagem: " Solicitação Inválida!",
            detalhes: error.message
        });
    }
    const { imc, status } = calcularIMC(Number(peso), Number(altura));
    try {
        const [resultado] = await db.execute("UPDATE `pacientes` SET `nome` = ?, `idade` = ?, `altura` = ?, `peso` = ?, `imc` = ?, `status` = ? WHERE `pacientes`.`id` = ?;", [nome, idade, altura, peso, imc, status, id]);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: "Paciente não encontrado!" });
        }
        res.status(200).json({ mensagem: "Paciente atualizado com sucesso." })
    } catch (error) {
        res.status(500).json({
            mensagem: "Erro interno do servidor!",
            detalhes: error.message
        });
    }

})
app.delete('/paciente/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.execute("DELETE FROM `pacientes` WHERE id = ?", [id]);
        if (rows.affectedRows === 0) {
            return res.status(404).json({ mensagem: "Paciente não encontrado!" });
        }
        res.status(200).json({ mensagem: "Paciente removido com sucesso." });
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