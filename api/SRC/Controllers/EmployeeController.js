import EmployeeRepository from "../Repositories/EmployeeRepository.js";

class EmployeeController {    

    async IRRFCalculatorController(req, res) {
        try {
            const { gross_salary, number_dependents } = req.body;

            const line = await EmployeeRepository.IRRFCalculator(gross_salary, number_dependents)

            res.json(line)
        }
        catch (error) {
            return res.status(500).json(error.message)
        }
    }

    async registerFullEmployeeController(req, res) {
        try {
            const { name, cpf, dependentes, gross_salary, dependentsNumber } = req.body;

            const result = await EmployeeRepository.registerFullEmployeeWithDependents(name, cpf, dependentes, gross_salary, dependentsNumber);

            res.json(result)

        } catch (err) {
            console.log(err)
            res.status(500).json({ error: err.message });
        }
    }

    async bringEmployes(req, res) {
        try {
            const row = await EmployeeRepository.bringDataEmployee();
            res.json(row)
        }
        catch (error) {
            console.log(error)
            res.status(500).json(error)
        }
    }

    async searchEmployeeController(req, res) {
        try {
            const { cpf, name } = req.body;

            if (!cpf && !name) {
                return res.status(400).json({ error: 'Informe ao menos CPF ou Nome para busca.' });
            }

            const employees = await EmployeeRepository.searchEmployee(name, cpf);

            return res.json(employees);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao buscar funcionários.' });
        }
    }


    async alterController(req, res) {
        try {
            const {employeeId, newSalary} = req.body

            const row = await EmployeeRepository.alter(employeeId, newSalary)
            res.json(row)
        }
        catch(error) {
            console.log(error)
            res.status(500).json(error)
        }
    }

    async registerUserController(req, res) {
        try {
            const { data } = req.body;

            const { SENHA } = {...data}

            const row = await EmployeeRepository.registerUser(data, SENHA)
            
            res.json(row);
        } catch (erro) {
            
            res.status(500).json({ error: "Houve um erro ao cadastrar" });
            console.error(erro);
        }
    }

    async AuthController(req, res) {
        try {
            const { cpf, password } = req.body;
            
            if(!cpf || !password) {
                return res.send("Please enter with your credentials!")
            }
            
            const row = await EmployeeRepository.auth(cpf, password);
            res.json(row)
        }
        catch(err) {
            console.error(err)
            res.status(500).json({
                message: "internal server error"
            })      
        }
    } 

    async getDependentsController(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ error: 'ID do funcionário é obrigatório.' });
            }

            const dependents = await EmployeeRepository.getDependents(id);
            return res.json(dependents);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao buscar dependentes.' });
        }
    }

    async delEmployeeController(req, res) {
        try {
            const { id } = req.body;
            const line = await EmployeeRepository.delEmployee(id);
            res.json(line);
        } catch (error) {
            console.error('Erro no delEmployeeController:', error); 
            return res.status(500).json(error);
        }
    }

}

export default new EmployeeController();