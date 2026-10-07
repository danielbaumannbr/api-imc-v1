const request = require('supertest');
const app = require('./index');
const db = require('./db');

// Mock da conexão com o banco de dados MySQL
jest.mock('./db', () => ({
    execute: jest.fn()
}));

describe('Testes das Rotas da API de Pacientes', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /', () => {
        it('deve retornar 200 e mensagem de Hello World!', async () => {
            const res = await request(app).get('/');
            expect(res.statusCode).toBe(200);
            expect(res.text).toBe('Hello World!');
        });
    });

    describe('GET /prontuarios', () => {
        it('deve retornar a lista de pacientes com status 200', async () => {
            const mockPacientes = [
                { id: 1, nome: 'Carlos', idade: 30, altura: 1.75, peso: 70, imc: 22.86, status: 'Peso normal' }
            ];
            db.execute.mockResolvedValueOnce([mockPacientes]);

            const res = await request(app).get('/prontuarios');
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockPacientes);
            expect(db.execute).toHaveBeenCalledWith("SELECT * FROM pacientes");
        });

        it('deve retornar erro 500 se o banco lançar uma exceção', async () => {
            db.execute.mockRejectedValueOnce(new Error('Erro de Conexão com o BD'));

            const res = await request(app).get('/prontuarios');
            expect(res.statusCode).toBe(500);
            expect(res.body.mensagem).toBe('Erro interno do servidor!');
        });
    });

    describe('GET /paciente/:id', () => {
        it('deve retornar o paciente cadastrado quando o ID existir', async () => {
            const mockPaciente = { id: 1, nome: 'Carlos', idade: 30, altura: 1.75, peso: 70, imc: 22.86, status: 'Peso normal' };
            db.execute.mockResolvedValueOnce([[mockPaciente]]);

            const res = await request(app).get('/paciente/1');
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockPaciente);
        });

        it('deve retornar 404 se o paciente não for encontrado', async () => {
            db.execute.mockResolvedValueOnce([[]]);

            const res = await request(app).get('/paciente/99');
            expect(res.statusCode).toBe(404);
            expect(res.body.mensagem).toBe('Paciente não encontrado!');
        });
    });

    describe('POST /paciente', () => {
        it('deve cadastrar um paciente e calcular o IMC corretamente', async () => {
            const novoPaciente = { nome: 'Ana', idade: 25, altura: 1.60, peso: 60 };
            db.execute.mockResolvedValueOnce([{ insertId: 2 }]);

            const res = await request(app)
                .post('/paciente')
                .send(novoPaciente);

            expect(res.statusCode).toBe(201);
            expect(res.body).toEqual({
                id: 2,
                nome: 'Ana',
                idade: 25,
                altura: 1.60,
                peso: 60,
                imc: 23.44,
                status: 'Peso normal'
            });
        });

        it('deve retornar 400 se algum campo estiver faltando', async () => {
            const res = await request(app)
                .post('/paciente')
                .send({ nome: 'Ana', idade: 25 });

            expect(res.statusCode).toBe(400);
            expect(res.body.mensagem).toBe('Solicitação Inválida!');
        });
    });

    describe('PUT /paciente/:id', () => {
        it('deve atualizar os dados do paciente com sucesso', async () => {
            const dadosAtualizados = { nome: 'Ana Silva', idade: 26, altura: 1.60, peso: 58 };
            db.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);

            const res = await request(app)
                .put('/paciente/2')
                .send(dadosAtualizados);

            expect(res.statusCode).toBe(200);
            expect(res.body.mensagem).toBe('Paciente atualizado com sucesso.');
        });

        it('deve retornar 404 ao tentar atualizar paciente inexistente', async () => {
            const dadosAtualizados = { nome: 'Ana Silva', idade: 26, altura: 1.60, peso: 58 };
            db.execute.mockResolvedValueOnce([{ affectedRows: 0 }]);

            const res = await request(app)
                .put('/paciente/99')
                .send(dadosAtualizados);

            expect(res.statusCode).toBe(404);
            expect(res.body.mensagem).toBe('Paciente não encontrado!');
        });
    });

    describe('DELETE /paciente/:id', () => {
        it('deve remover o paciente com sucesso', async () => {
            db.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);

            const res = await request(app).delete('/paciente/1');
            expect(res.statusCode).toBe(200);
            expect(res.body.mensagem).toBe('Paciente removido com sucesso.');
        });

        it('deve retornar 404 ao tentar deletar paciente não encontrado', async () => {
            db.execute.mockResolvedValueOnce([{ affectedRows: 0 }]);

            const res = await request(app).delete('/paciente/99');
            expect(res.statusCode).toBe(404);
            expect(res.body.mensagem).toBe('Paciente não encontrado!');
        });
    });
});