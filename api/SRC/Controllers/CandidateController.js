//IMPORTA O CONSTRUTOR DO REPOSITORY
import CandidateRepository from '../../SRC/Repositories/CandidateRepository.js'

//CONSTRUTOR DO CONTROLLER
class CandidateController {

    // CONTROLLER DE CADASTRO
    //FUNÇÃO DECLARADA COMO ASSÍNCRONA
    async Store(req, res) {
        try {
            //PEGA TODOS OS CAMPOS DO CORPO DA REQUISIÇÃO
            const { NOME_COMPLETO, DATA_NASCIMENTO, NOME_MAE, NOME_PAI, CPF, RG, ORGAO_EMISSOR, UF, GENERO, ESTADO_CIVIL, ETNIA, NACIONALIDADE, NATURALIDADE, EMAIL, TELEFONE, CELULAR, possui_deficiencia, deficiencia, LOGRADOURO, BAIRRO, CIDADE, COMPLEMENTO, NUMERO, CEP, NIVEL_ENSINO, ESCOLA, CURSO, PERIODO, TURNO, HORARIO_ESTAGIO, PREV_FORMATURA, AREAS_DE_INTERESSE, DIGITACAO, WORD, EXCEL, ACESS, POWERPOINT, CORELDRAW, PAGEMAKER, INTERNET, AUTOCAD, INGLES, FRANCES, ESPANHOL, ITALIANO, SITUACAO_MORADIA, TIPO_MORADIA, RECEBE_BENEFICIO, QUEM_RECEBE, VALOR, NOME1, GRAU_PARENTESCO1, IDADE1, OCUPACAO1, VALOR_BRUTO1, NOME2, GRAU_PARENTESCO2, IDADE2, OCUPACAO2, VALOR_BRUTO2, NOME3, GRAU_PARENTESCO3, IDADE3, OCUPACAO3, VALOR_BRUTO3, NOME4, GRAU_PARENTESCO4, IDADE4, OCUPACAO4, VALOR_BRUTO4, NOME5, GRAU_PARENTESCO5, IDADE5, OCUPACAO5, VALOR_BRUTO5, INGRESSO_FACULDADE, password
            } = req.body
            console.log(password)

            //CONSTANTE RESPONSAVEL POR ENVIAR OS DADOS DA REQUISIÇÃO E ARMAZENAR A RESPOSTA DO SERVIDOR
            const row = await CandidateRepository.CreateLogin(NOME_COMPLETO, DATA_NASCIMENTO, NOME_MAE, NOME_PAI, CPF, RG, ORGAO_EMISSOR, UF, GENERO, ESTADO_CIVIL, ETNIA, NACIONALIDADE, NATURALIDADE, EMAIL, TELEFONE, CELULAR, possui_deficiencia, deficiencia, LOGRADOURO, BAIRRO, CIDADE, COMPLEMENTO, NUMERO, CEP, NIVEL_ENSINO, ESCOLA, CURSO, PERIODO, TURNO, HORARIO_ESTAGIO, PREV_FORMATURA, AREAS_DE_INTERESSE, DIGITACAO, WORD, EXCEL, ACESS, POWERPOINT, CORELDRAW, PAGEMAKER, INTERNET, AUTOCAD, INGLES, FRANCES, ESPANHOL, ITALIANO, SITUACAO_MORADIA, TIPO_MORADIA, RECEBE_BENEFICIO, QUEM_RECEBE, VALOR, NOME1, GRAU_PARENTESCO1, IDADE1, OCUPACAO1, VALOR_BRUTO1, NOME2, GRAU_PARENTESCO2, IDADE2, OCUPACAO2, VALOR_BRUTO2, NOME3, GRAU_PARENTESCO3, IDADE3, OCUPACAO3, VALOR_BRUTO3, NOME4, GRAU_PARENTESCO4, IDADE4, OCUPACAO4, VALOR_BRUTO4, NOME5, GRAU_PARENTESCO5, IDADE5, OCUPACAO5, VALOR_BRUTO5, INGRESSO_FACULDADE, password);

            // VAI ENVIAR COMO RESPONSE O RESULTADO QUE OBTEVE AO ENVIAR OS DADOS
            res.json(row);
        } catch (erro) {
            res.status(500).json({ error: "Houve um erro ao cadastrar" });
            console.error(erro);
        }

    }
    // FUNÇÃO ASSÍNCRONA
    async Authentication(req, res) {
        try {
            //PEGA O CPF E A SENHA DO CORPO DA REQUISIÇÃO
            const { cpf, password } = req.body;

            //CASO FALTE UM DOS CAMPOS, ENVIA UMA MENSAGEM COMO RESPOSTA
            if (!cpf || !password) {
                return res.send({ message: "Please enter with your credentials!" })
            }

            //ENVIA O CPF E A SENHA PARA O MÉTODO CREATELOGIN NO REPOSITORY
            const row = await CandidateRepository.Login(cpf, password);
            //ENVIA COMO RESPOSTA O QUE VEIO DO REPOSITORY
            res.json(row)
        }
        catch (err) {
            //CASO DÊ ERRO, RETORNA UM STATUS CODE DE 500 E IMPRIME O ERRO NO CONSOLE 
            console.error(err)
            res.status(500).json({
                message: "internal server error"
            })
        }
    }

    async bringDataCandidate(req, res) {
        try {
            const id = req.body.id;
            const line = await CandidateRepository.bringData(id)
            console.log(line)
            res.json(line)
        } catch (error) {
            res.status(500).json({ message: "erro" + error })
        }
    }
    async Alter(req, res) {
        try {
            // Extrai os dados e id do corpo da requisição
            const { data, id } = req.body;
            console.log(req.body)

            // Verifica se a requisição contém data e id
            if (!data || !id) {
                return res.status(400).send("Dados ou ID inválidos.");
            }

            // Limpando campos com valores inválidos ou vazios
            const cleanedData = Object.fromEntries(
                Object.entries(data).map(([key, value]) => {
                    // Se o valor for uma string vazia, transformamos para null
                    return [key, value === "" ? null : value];
                })
            );

            // Verificar id e garantir que seja um número
            if (typeof id !== 'number' || isNaN(id)) {
                return res.status(400).send("ID inválido.");
            }

            // Chama o repositório para alterar os dados
            const result = await CandidateRepository.alter(cleanedData, id);
            res.json(result);
        } catch (erro) {
            console.log("Erro no backend:", erro);
            res.status(500).send("Erro interno no servidor: " + erro);
        }
    }

    async Vacancies(req, res) {
        try {
            const row = await CandidateRepository.AvaiableVacancies();
            res.json(row);
        }
        catch (err) {
            res.status(500).send("Erro interno no servidor: " + err);
        }
    }

    async WriteDocx(req, res) {
        console.log("🔄 Rota WriteDocx chamada");
    
        try {
            const data = req.body;
            console.log("📦 Dados recebidos:", data);
    
            const filePath = await CandidateRepository.internshipActivityPlan(data);
    
            console.log("📄 Documento gerado em:", filePath);
    
            res.download(filePath, 'plano_estagio_preenchido.docx', () => {
                console.log("📤 Download enviado, limpando arquivo");
                fs.unlinkSync(filePath);
            });
        } catch (error) {
            console.error("❌ Erro ao gerar documento:", error);
            res.status(500).json({ error: 'Erro ao gerar o documento', details: error });
        }
    }
    
    async saveDataIntershipActivityPlanController (req, res) {
        try {
            const data = req.body;
            const line = await CandidateRepository.saveDataIntershipActivityPlan(data)
            res.json(line)
        }
        catch(error) {
            console.log(error)
            res.status(500).json(error)
        }
    }

    async recoverPassword (req, res) {
        try {
            const {token, novaSenha} = req.body
            const row = await CandidateRepository.recovery(token, novaSenha)
            res.json(row)
        }
        catch(err) {
            console.error(err);
            res.json(err)
        }

    }
}

//EXPORTA O CONSTRUTOR 
export default new CandidateController()



