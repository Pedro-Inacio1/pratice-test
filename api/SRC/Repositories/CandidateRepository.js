import path from 'path';
import fs from 'fs';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

// IMPORTAÇÃO DA CONEXÃO
import conn from '../Database/mysql.js'

// IMPORTAÇÃO DAS BIBLIOTECAS PARA AUTENTICAÇÃO
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// CONSTRUTOR
// Obtém o diretório atual, similar ao __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
class CandidateRepository {

    // MÉTODO PARA AUTENTICAÇÃO DE USUÁRIO
    async Login(cpf, password) {
        //RETORNA UMA PROMISSE
        return new Promise((resolve, reject) => {
            //STRING DE CONEXÃO
            const verifyIfExistsUser = 'SELECT * FROM candidato WHERE CPF = ?'
            //QUERY
            // PASSA A STRING DE CONEXÃO E O CPF NA INTERROGAÇÃO, PEGA O ERRO OU O SUCESSO PELOS PARÂMETROS.
            conn.query(verifyIfExistsUser, [cpf], (error, result) => {
                // SE DER ERRO, RETORNA O REJECT DA MINHA PROMISSE
                if (error) {
                    return reject("User not found!");
                }

                try {
                    //SE TIVER RESULTADO, ARMAZENA EM UM ARRAY ONDE SEMPRE VAI ESTAR NO PRIMEIRO ÍNDICE
                    //CRIA CONSTANTE QUE ACESSA O RESULTADO E ARMAZENA A SENHA
                    const storedHash = result[0].SENHA
                    console.log(typeof (storedHash))

                    //SE NÃO RETORNAR UMA SENHA, RETORNA O REJECT DA PROMISSE
                    if (!storedHash) {
                        return reject("Stored hash is undefined or missing!");
                    }

                    // COMPARA A SENHA QUE VEIO DO USUÁRIO COM A SENHA CRIPTOGRAFADA DO BANCO DE DADOS E CAPTURA O ERRO E O RESULTADO POR PARÂMETROS DA ARROW FUNCTION
                    bcrypt.compare(password, storedHash, (err, isMatch) => {

                        // SE DER ERRO OU NÃO DER CERTO, VAI RETORNAR O REJECT DA PROMISSE DIZENDO QUE A SENHA FORNECIDA ESTÁ INCORRETA
                        if (err || !isMatch) {
                            return reject("Invalid password!")
                        }

                        //SE NÃO CAIR NA CONDIÇÃO DE ERRO, IRÁ GERAR O TOKEN DE AUTENTICAÇÃO, QUE EXPIRA EM 1H
                        let token = jwt.sign({
                            id: result[0].id,
                            name: result[0].nome
                        }, process.env.JWT_KEY, {
                            expiresIn: "1h"
                        })

                        // RETORNA O SUCESSO DA PROMISSE, ENVIANDO UMA MENSAGEM, O NOME DE USUÁRIO E O TOKEN DE ACESSO
                        resolve({
                            message: "User has been authenticated!",
                            token: token,
                            name: result[0].nome,
                            id: result[0].id
                        });
                    })
                }
                catch (err) {
                    console.log(err.message)
                    return reject(err.message)
                }
            })
        })
    }

    // MÉTODO PARA CADASTRO DE CANDIDATOS
    async CreateLogin(NOME_COMPLETO, DATA_NASCIMENTO, NOME_MAE, NOME_PAI, CPF, RG, ORGAO_EMISSOR, UF, GENERO, ESTADO_CIVIL, ETNIA, NACIONALIDADE, NATURALIDADE, EMAIL, TELEFONE, CELULAR, possui_deficiencia, deficiencia, LOGRADOURO, BAIRRO, CIDADE, COMPLEMENTO, NUMERO, CEP, NIVEL_ENSINO, ESCOLA, CURSO, PERIODO, TURNO, HORARIO_ESTAGIO, PREV_FORMATURA, AREAS_DE_INTERESSE, DIGITACAO, WORD, EXCEL, ACESS, POWERPOINT, CORELDRAW, PAGEMAKER, INTERNET, AUTOCAD, INGLES, FRANCES, ESPANHOL, ITALIANO, SITUACAO_MORADIA, TIPO_MORADIA, RECEBE_BENEFICIO, QUEM_RECEBE, VALOR, NOME1, GRAU_PARENTESCO1, IDADE1, OCUPACAO1, VALOR_BRUTO1, NOME2, GRAU_PARENTESCO2, IDADE2, OCUPACAO2, VALOR_BRUTO2, NOME3, GRAU_PARENTESCO3, IDADE3, OCUPACAO3, VALOR_BRUTO3, NOME4, GRAU_PARENTESCO4, IDADE4, OCUPACAO4, VALOR_BRUTO4, NOME5, GRAU_PARENTESCO5, IDADE5, OCUPACAO5, VALOR_BRUTO5, INGRESSO_FACULDADE, SENHA
    ) {
        const saults = 10
        return new Promise((resolve, reject) => {
            console.log(SENHA)
            // CRIPTOGRAFA A SENHA QUE VEIO POR PARÂMETRO, COM A FORÇA 10
            bcrypt.hash(SENHA, saults, (err, hash) => {
                if (err) { // SE CAPTURAR O ERRO PELO PARÂMETRO DA ARROW FUNCTION, RETORNA O REJECT DA PROMISSE E IMPRIME O ERRO NO CONSOLE
                    return reject("Erro ao criptografar a senha" + err);
                }

                //COMNANDO SQL QUE VAI REALIZAR A QUERY
                const sql = `INSERT INTO candidato (
                    NOME_COMPLETO, DATA_NASCIMENTO, NOME_MAE, NOME_PAI, CPF, RG, ORGAO_EMISSOR, UF, GENERO, ESTADO_CIVIL,
                    ETNIA, NACIONALIDADE, NATURALIDADE, EMAIL, TELEFONE, CELULAR, possui_deficiencia, deficiencia, LOGRADOURO, BAIRRO,
                    CIDADE, COMPLEMENTO, NUMERO, CEP, NIVEL_ENSINO, ESCOLA, CURSO, PERIODO, TURNO, HORARIO_ESTAGIO, PREV_FORMATURA,
                    AREAS_DE_INTERESSE, DIGITACAO, WORD, EXCEL, ACESS, POWERPOINT, CORELDRAW, PAGEMAKER, INTERNET, AUTOCAD, INGLES,
                    FRANCES, ESPANHOL, ITALIANO, SITUACAO_MORADIA, TIPO_MORADIA, RECEBE_BENEFICIO, QUEM_RECEBE, VALOR, 
                    NOME1, GRAU_PARENTESCO1, IDADE1, OCUPACAO1, VALOR_BRUTO1, NOME2, GRAU_PARENTESCO2, IDADE2, OCUPACAO2, VALOR_BRUTO2,
                    NOME3, GRAU_PARENTESCO3, IDADE3, OCUPACAO3, VALOR_BRUTO3, NOME4, GRAU_PARENTESCO4, IDADE4, OCUPACAO4, VALOR_BRUTO4,
                    NOME5, GRAU_PARENTESCO5, IDADE5, OCUPACAO5, VALOR_BRUTO5, INGRESSO_FACULDADE, SENHA
                ) VALUES (
                    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,   
                    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                    ?, ?, ?, ?, ?, ?, ?
                )`;

                conn.query(sql, [NOME_COMPLETO, DATA_NASCIMENTO, NOME_MAE, NOME_PAI, CPF, RG, ORGAO_EMISSOR, UF, GENERO, ESTADO_CIVIL, ETNIA, NACIONALIDADE, NATURALIDADE, EMAIL, TELEFONE, CELULAR, possui_deficiencia, deficiencia, LOGRADOURO, BAIRRO, CIDADE, COMPLEMENTO, NUMERO, CEP, NIVEL_ENSINO, ESCOLA, CURSO, PERIODO, TURNO, HORARIO_ESTAGIO,
                    PREV_FORMATURA, AREAS_DE_INTERESSE, DIGITACAO, WORD, EXCEL, ACESS, POWERPOINT, CORELDRAW, PAGEMAKER, INTERNET, AUTOCAD, INGLES, FRANCES, ESPANHOL, ITALIANO, SITUACAO_MORADIA, TIPO_MORADIA,
                    RECEBE_BENEFICIO, QUEM_RECEBE, VALOR, NOME1, GRAU_PARENTESCO1, IDADE1, OCUPACAO1, VALOR_BRUTO1, NOME2, GRAU_PARENTESCO2, IDADE2, OCUPACAO2, VALOR_BRUTO2,
                    NOME3, GRAU_PARENTESCO3, IDADE3, OCUPACAO3, VALOR_BRUTO3, NOME4, GRAU_PARENTESCO4, IDADE4, OCUPACAO4, VALOR_BRUTO4, NOME5, GRAU_PARENTESCO5, IDADE5, OCUPACAO5, VALOR_BRUTO5, INGRESSO_FACULDADE,
                    hash], (error, result) => { //CAPTURA OS ERROS E O SUCESSO DA QUERY
                        if (error) {
                            // SE CAIR NO ERRO, RETORNA O REJECT DA PROMISSE, ENVIA UMA MENSAGEM JUNTO COM O ERRO
                            return reject({ message: "Não foi possível concluir o cadastro!" + error })
                        }
                        else {
                            // CASO NÃO DÊ ERRO, PEGA O RESULTADO DA QUERY E TRANSFORMA O OBJETO EM JSON E LOGO APÓS EM OBJETO JAVASCRIPT
                            const row = JSON.parse(JSON.stringify(result));
                            resolve(row);
                            //RESOLVE DA PROMISSE
                        }
                    })
            })
        })
    }

    async bringData(id) {
        return new Promise((resolve, reject) => {
            const cmd = "SELECT * FROM candidato WHERE id = ?"
            conn.query(cmd, id, (error, result) => {
                if (error) {
                    return reject("erro" + error)
                }
                else {
                    const row = JSON.parse(JSON.stringify(result))
                    resolve(row)
                }
            })
        })
    }

    async alter(data, id) {
        return new Promise((resolve, reject) => {
            // Validação para garantir que o 'data' e o 'id' são válidos
            if (!data || !id) {
                return reject("Dados ou ID inválidos.");
            }

            const query = 'UPDATE candidato SET ? WHERE id = ?';
            conn.query(query, [data, id], (error, result) => {
                if (error) {
                    return reject("Erro ao atualizar dados: " + error);
                } else {
                    resolve(result);
                }
            });
        });
    }

    async AvaiableVacancies() {
        return new Promise((Resolve, Reject) => {
            const sql = "SELECT * FROM vagas";

            conn.query(sql, (error, result) => {
                if (error) {
                    return Reject("Não há vagas disponíveis!")
                }
                else {
                    const rowz = JSON.parse(JSON.stringify(result))
                    Resolve(rowz)
                }
            })
        })
    }

    async internshipActivityPlan(dados) {
        return new Promise((resolve, reject) => {
            const templatePath = path.join(__dirname, '..', 'templates', 'plano_atividades_estagio_prefeitura.docx');
    
            fs.readFile(templatePath, (err, data) => {
                if (err) return reject(err);
    
                const zip = new PizZip(data);
                const doc = new Docxtemplater(zip, { paragraphLoop: true });
    
                doc.setData(dados);
    
                try {
                    doc.render();
                } catch (error) {
                    return reject(error);
                }
    
                const buf = doc.getZip().generate({ type: 'nodebuffer' });
                const outputPath = path.join(__dirname, 'plano_estagio_preenchido_' + Date.now() + '.docx');
    
                fs.writeFileSync(outputPath, buf);
                resolve(outputPath);
            });
        });
    }
    
    async saveDataIntershipActivityPlan (data) {
        return new Promise((resolve, reject) => {   
            const sql = `INSERT INTO dadosPlanoAtividadeEstagio SET ?`

            conn.query(sql, [data], (error, result) => {
                if(error) {
                    console.error(error)
                    return reject("Não foi possível inserir os dados.")
                }
                else {
                    const row = JSON.parse(JSON.stringify(result))
                    resolve(row)
                }
            })
        })
    }

    async recovery (cpf) {
        const token = crypto.randomBytes(32).toString('hex')
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'pedroinacio061@gmail.com',
                pass: 'ebjw hgui sket fcum'
            }
        })

        const mailOptions = {
            from: 'seuemail@gmail.com',
            to: emailDoUsuario,
            subject: 'Recuperação de senha',
            html: `<p>Para resetar sua senha, clique no link abaixo:</p>
                   <a href="https://localhost:8000/recover-password?token=${token}">Resetar Senha</a>`
          };
          
          transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
              console.error(err);
              return res.status(500).send("Erro ao enviar e-mail.");
            }
            res.send("E-mail de recuperação enviado.");
          });
    }
}
//EXPORTA O CONSTRUTOR COM OS MÉTODOS
export default new CandidateRepository()