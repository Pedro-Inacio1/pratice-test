import EmployeeRepository from "../Repositories/EmployeeRepository.js";

class EmployeeController {

    async registerEmployeeController(req, res) {
        try {
            const data = req.body;
        
            const line = await EmployeeRepository.registerEmployee(data)
            res.status(200).json(line)
        }
        catch(err) {
            return res.status(500).json(err.message)
        }
    }

    async IRRFCalculatorController(req, res) {
        try {
            const {gross_sallary, number_dependents} = req.body;

            const line = await EmployeeRepository.IRRFCalculator(gross_sallary, number_dependents)

            res.json(line)
        }
        catch(error){
            return res.status(500).json(error.message)
        }
    }

    async registerFullEmployeeController(req, res) {
        try {
            const { funcionario, dependentes } = req.body;

            const result = await EmployeeRepository.registerFullEmployeeWithDependents(funcionario, dependentes);

            res.status(201).json({
                message: 'Funcionário e dependentes cadastrados com sucesso!',
                funcionarioId: result.funcionarioId
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    
}

export default new EmployeeController();