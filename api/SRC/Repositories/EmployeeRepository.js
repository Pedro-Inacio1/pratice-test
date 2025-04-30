import conn from "../Database/mysql.js"

class EmployeeRepository {

    async registerEmployee(data) {
        return new Promise((resolve, reject) => {
            const sql = 'insert into funcionarios set ?';

            conn.query(sql, [data], (error, result) => {
                if (error) {
                    return reject("Error registering employee." + error)
                }
                else {
                    const row = JSON.parse(JSON.stringify(result))
                    resolve(row)
                }
            })

        })
    }

    async registerDependent(data) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO dependentes SET ?';

            conn.query(sql, [data], (error, result) => {
                if (error) {
                    return reject("Error registering dependent. " + error);
                } else {
                    const row = JSON.parse(JSON.stringify(result));
                    resolve(row);
                }
            });
        });
    }

    async IRRFCalculator(gross_salary, dependentsNumber) {
        const deduction_for_dependent = 189.59;
        const dependent_value_deduction = deduction_for_dependent * dependentsNumber;
    
        const IRRFTable = [
            { limit: 2259.20, aliquot: 0, deduction: 0.00 },
            { limit: 2826.65, aliquot: 0.075, deduction: 169.44 },
            { limit: 3751.05, aliquot: 0.15, deduction: 381.44 },
            { limit: 4664.68, aliquot: 0.225, deduction: 662.77 },
            { limit: Infinity, aliquot: 0.275, deduction: 896.00 }
        ];
    
        // Cálculo do INSS com base na tabela progressiva de 2024
        const calculateINSS = (salary) => {
            let inss = 0;
            let remaining = salary;
    
            const inssBrackets = [
                { limit: 1412.00, rate: 0.075 },
                { limit: 2666.68, rate: 0.09 },
                { limit: 4000.03, rate: 0.12 },
                { limit: 7786.02, rate: 0.14 }
            ];
    
            let previousLimit = 0;
            for (let i = 0; i < inssBrackets.length; i++) {
                const bracket = inssBrackets[i];
                if (salary > bracket.limit) {
                    inss += (bracket.limit - previousLimit) * bracket.rate;
                    previousLimit = bracket.limit;
                } else {
                    inss += (salary - previousLimit) * bracket.rate;
                    return inss;
                }
            }
    
            // Se salário > teto do INSS
            return 908.86;
        };
    
        const inssValue = calculateINSS(gross_salary);
        const taxableSalary = gross_salary - inssValue - dependent_value_deduction;
    
        // Encontra faixa do IRRF
        let taxBracket = IRRFTable.find(bracket => taxableSalary <= bracket.limit);
    
        // Calcula IRRF
        const taxAmount = (taxableSalary * taxBracket.aliquot) - taxBracket.deduction;
        const finalTaxAmount = Math.max(taxAmount, 0);
    
        return {
            inss: inssValue.toFixed(2),
            irrf: finalTaxAmount.toFixed(2),
            netSalary: (gross_salary - inssValue - finalTaxAmount).toFixed(2)
        };
    }
    


    async registerFullEmployeeWithDependents(funcionario, dependentes) {
        return new Promise((resolve, reject) => {
            conn.beginTransaction((err) => {
                if (err) return reject(new Error("Erro na transação: " + err));

                const sqlFuncionario = 'INSERT INTO funcionarios SET ?';
                conn.query(sqlFuncionario, funcionario, (err, result) => {
                    if (err) {
                        return conn.rollback(() => {
                            reject(new Error("Erro ao cadastrar funcionário: " + err));
                        });
                    }

                    const funcionarioId = result.insertId;

                    const dependentesComId = dependentes.map(dep => ({
                        ...dep,
                        funcionario_id: funcionarioId
                    }));

                    const sqlDependente = 'INSERT INTO dependentes SET ?';

                    let inseridos = 0;
                    dependentesComId.forEach(dep => {
                        conn.query(sqlDependente, dep, (err) => {
                            if (err) {
                                return conn.rollback(() => {
                                    reject(new Error("Erro ao cadastrar dependente: " + err));
                                });
                            }

                            inseridos++;
                            if (inseridos === dependentesComId.length) {
                                conn.commit((err) => {
                                    if (err) {
                                        return conn.rollback(() => {
                                            reject(new Error("Erro ao finalizar transação: " + err));
                                        });
                                    }

                                    resolve({ funcionarioId });
                                });
                            }
                        });
                    });
                });
            });
        });
    }
}

export default new EmployeeRepository()