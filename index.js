const express = require('express');
const fileUpload = require('express-fileupload'); // NOVO: Importa a biblioteca de upload
const path = require('path'); // NOVO: Necessário para manipular caminhos de arquivos e extensões
const db = require('./db');
const app = express();
const port = 3000;

app.use(express.json());

// NOVO: Middleware do express-fileupload configurado
app.use(fileUpload({
    createParentPath: true, // Cria a pasta de destino automaticamente se não existir
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB
}));

// NOVO: Torna a pasta 'uploads' pública para poder acessar as fotos via navegação/URL
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Função para calcular o imc
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
    return { imc, status };
}

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/teste2', (req, res) => {
    res.send('Isto é um teste');
});

app.get('/paciente', async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM pacientes");
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({
            mensagem: "Erro interno do servidor!",
            detalhes: error.message
        });
    }
});

app.get('/paciente/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.execute("SELECT * FROM pacientes WHERE id = ?", [id]);
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
});

app.post('/paciente', async (req, res) => {
    const { nome, idade, altura, peso } = req.body;

    if (!nome || !idade || !altura || !peso) {
        return res.status(400).json({
            mensagem: "Solicitação Inválida!"
        });
    }

    // NOVO: Inicializa a variável para armazenar o nome do arquivo da foto
    let nomeFoto = null;

    // NOVO: Bloco de tratamento e salvamento da foto enviada
    if (req.files && req.files.foto) {
        const foto = req.files.foto;
        const extensao = path.extname(foto.name);
        nomeFoto = `${Date.now()}-${Math.round(Math.random() * 1E9)}${extensao}`;
        const uploadPath = path.join(__dirname, 'uploads', nomeFoto);

        try {
            await foto.mv(uploadPath); // Move o arquivo para a pasta 'uploads'
        } catch (err) {
            return res.status(500).json({
                mensagem: "Erro ao salvar a foto do paciente.",
                detalhes: err.message
            });
        }
    }

    const { imc, status } = calcularIMC(Number(peso), Number(altura));

    try {
        // NOVO: Inclusão da coluna 'foto' e do parâmetro 'nomeFoto' na instrução SQL
        const [resultado] = await db.execute(
            "INSERT INTO pacientes (nome, idade, altura, peso, imc, status, foto) VALUES (?,?,?,?,?,?,?);",
            [nome, idade, altura, peso, imc, status, nomeFoto]
        );

        res.status(201).json({
            id: resultado.insertId,
            nome,
            idade,
            altura,
            peso,
            imc,
            status,
            foto: nomeFoto // NOVO: Retorna o nome do arquivo salvo no JSON da resposta
        });
    } catch (error) {
        res.status(500).json({
            mensagem: "Erro interno do servidor!",
            detalhes: error.message
        });
    }
});

app.put('/paciente/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, idade, altura, peso } = req.body;

    if (!nome || !idade || !altura || !peso) {
        return res.status(400).json({
            mensagem: "Solicitação Inválida!"
        });
    }

    try {
        // NOVO: Consulta o banco para obter a foto já cadastrada
        const [pacienteExistente] = await db.execute("SELECT foto FROM pacientes WHERE id = ?", [id]);
        if (pacienteExistente.length === 0) {
            return res.status(404).json({ mensagem: "Paciente não encontrado!" });
        }

        // NOVO: Mantém o nome da foto antiga caso uma nova não seja enviada
        let nomeFoto = pacienteExistente[0].foto;

        // NOVO: Se enviou uma foto nova no PUT, salva o novo arquivo e substitui o nome
        if (req.files && req.files.foto) {
            const foto = req.files.foto;
            const extensao = path.extname(foto.name);
            nomeFoto = `${Date.now()}-${Math.round(Math.random() * 1E9)}${extensao}`;
            const uploadPath = path.join(__dirname, 'uploads', nomeFoto);
            await foto.mv(uploadPath);
        }

        const { imc, status } = calcularIMC(Number(peso), Number(altura));

        // NOVO: Inclusão do campo 'foto = ?' no UPDATE SQL
        const [resultado] = await db.execute(
            "UPDATE pacientes SET nome = ?, idade = ?, altura = ?, peso = ?, imc = ?, status = ?, foto = ? WHERE id = ?;",
            [nome, idade, altura, peso, imc, status, nomeFoto, id]
        );

        res.status(200).json({
            mensagem: "Paciente atualizado com sucesso.",
            foto: nomeFoto // NOVO: Retorna o nome da foto atualizada no JSON
        });
    } catch (error) {
        res.status(500).json({
            mensagem: "Erro interno do servidor!",
            detalhes: error.message
        });
    }
});

app.delete('/paciente/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.execute("DELETE FROM pacientes WHERE id = ?", [id]);
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
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});