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
    
}

export default new EmployeeController();