import conn from "../Database/mysql.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const IRRFCalculator = () => {
    const deduction_for_dependent = 189.59;
    const dependent_value_deduction = deduction_for_dependent * dependentsNumber;

    const IRRFTable = [
        { limit: 2259.20, aliquot: 0, deduction: 0.00 },
        { limit: 2826.65, aliquot: 0.075, deduction: 169.44 },
        { limit: 3751.05, aliquot: 0.15, deduction: 381.44 },
        { limit: 4664.68, aliquot: 0.225, deduction: 662.77 },
        { limit: Infinity, aliquot: 0.275, deduction: 896.00 }
    ];

    const calculateINSS = (salary) => {
        let inss = 0;
        let remaining = salary;

        const inssBrackets = [
            { limit: 1518.00, rate: 0.075 },
            { limit: 2793.89, rate: 0.09 },
            { limit: 4190.83, rate: 0.12 },
            { limit: 8157.41, rate: 0.14 }
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

        return 908.86;
    };

    const inssValue = calculateINSS(gross_salary);
    const taxableSalary = gross_salary - inssValue - dependent_value_deduction;

    let taxBracket = IRRFTable.find(bracket => taxableSalary <= bracket.limit);

    if (!taxBracket) {
        throw new Error("Faixa de IRRF não encontrada para salário tributável: " + taxableSalary);
    }

    const discountIRRF = taxBracket.deduction;

    const taxAmount = (taxableSalary * taxBracket.aliquot) - taxBracket.deduction;
    const finalTaxAmount = Math.max(taxAmount, 0);

    const inss = inssValue.toFixed(2)

    const netSalary = (gross_salary - inssValue - finalTaxAmount).toFixed(2)
}

class EmployeeRepository {


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

    async registerFullEmployeeWithDependents(name, cpf, dependentes, gross_salary, dependentsNumber) {
        const deduction_for_dependent = 189.59;
        const dependent_value_deduction = deduction_for_dependent * dependentsNumber;

        const IRRFTable = [
            { limit: 2259.20, aliquot: 0, deduction: 0.00 },
            { limit: 2826.65, aliquot: 0.075, deduction: 169.44 },
            { limit: 3751.05, aliquot: 0.15, deduction: 381.44 },
            { limit: 4664.68, aliquot: 0.225, deduction: 662.77 },
            { limit: Infinity, aliquot: 0.275, deduction: 896.00 }
        ];

        const calculateINSS = (salary) => {
            let inss = 0;
            let remaining = salary;

            const inssBrackets = [
                { limit: 1518.00, rate: 0.075 },
                { limit: 2793.89, rate: 0.09 },
                { limit: 4190.83, rate: 0.12 },
                { limit: 8157.41, rate: 0.14 }
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

            return 908.86;
        };

        const inssValue = calculateINSS(gross_salary);
        const taxableSalary = gross_salary - inssValue - dependent_value_deduction;

        let taxBracket = IRRFTable.find(bracket => taxableSalary <= bracket.limit);

        if (!taxBracket) {
            throw new Error("Faixa de IRRF não encontrada para salário tributável: " + taxableSalary);
        }

        const discountIRRF = taxBracket.deduction;

        const taxAmount = (taxableSalary * taxBracket.aliquot) - taxBracket.deduction;
        const finalTaxAmount = Math.max(taxAmount, 0);

        const inss = inssValue.toFixed(2)

        const netSalary = (gross_salary - inssValue - finalTaxAmount).toFixed(2)

        console.log(netSalary)

        return new Promise((resolve, reject) => {
            conn.beginTransaction((err) => {
                if (err) return reject(new Error("Erro na transação: " + err));

                const sqlFuncionario = 'INSERT INTO funcionarios (nome, cpf, salario_bruto, desconto_previdencia, numero_dependentes, desconto_IRPF) values (?,?,?,?,?,?)';
                conn.query(sqlFuncionario, [name, cpf, netSalary, inss, dependentsNumber, discountIRRF], (err, result) => {
                    if (err) {
                        return conn.rollback(() => {
                            reject(new Error("Erro ao cadastrar funcionário: " + err));
                        });
                    }

                    const funcionarioId = result.insertId;

                    const dependentesComId = dependentes.map(dep => ({
                        nome: dep.nome || dep.dependentName,
                        idade: dep.idade || parseInt(dep.dependentAge),
                        data_nascimento: dep.data_nascimento || dep.dependent_date_of_birth,
                        possui_deficiencia: dep.possui_deficiencia ?? dep.dependent_have_deficiency,
                        nome_deficiencia: dep.nome_deficiencia ?? dep.dependent_name_deficiency,
                        funcionario_id: funcionarioId
                    }));


                    console.log(dependentes)
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

    async bringDataEmployee() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT
                            f.id AS employeeId,
                            f.nome AS employee_name,
                            f.CPF AS employee_cpf,
                            f.salario_bruto AS gross_salary,
                            f.desconto_previdencia AS previdency_discount,
                            f.numero_dependentes AS number_of_dependents,
                            f.desconto_IRPF AS income_tax_discount,
                            
                            d.id AS dependent_id,
                            d.nome AS dependent_name,
                            d.idade AS dependent_age,
                            d.data_nascimento AS dependent_date_of_birth,
                            d.possui_deficiencia AS dependent_have_deficiency,
                            d.nome_deficiencia AS dependent_name_deficiency

                            FROM funcionarios f
                            LEFT JOIN dependentes d ON f.id = d.funcionario_id;
                        `;

            conn.query(sql, (error, result) => {
                if (error) {
                    return reject("Failed on query.")
                }
                else {
                    const row = JSON.parse(JSON.stringify(result))
                    resolve(row);
                }
            })
        })
    }

    async delEmployee(employeeId) {
        return new Promise((resolve, reject) => {
            conn.beginTransaction((err) => {
                if (err) {
                    return reject(new Error("Erro na transação: " + err));
                }

                const deleteDependent = 'delete from dependentes where funcionario_id = ?';
                conn.query(deleteDependent, [employeeId], (err, resultDependent) => {
                    if (err) {
                        return conn.rollback(() => {
                            reject(new Error("Erro ao deletar dependentes: " + err));
                        });
                    }

                    const sql = 'delete from funcionarios where id = ?';
                    conn.query(sql, [employeeId], (error, resultEmployee) => {
                        if (error) {
                            return conn.rollback(() => {
                                reject(new Error("Erro ao deletar funcionário: " + error));
                            });
                        } else if (resultEmployee.affectedRows === 0) {
                            return conn.rollback(() => {
                                reject(new Error("Funcionário não encontrado com o ID: " + employeeId));
                            });
                        } else {
                            conn.commit((err) => {
                                if (err) {
                                    return conn.rollback(() => {
                                        reject(new Error("Erro ao commitar a transação: " + err));
                                    });
                                }
                                resolve({ message: 'Funcionário e dependentes (se houver) deletados com sucesso.', affectedRows: resultEmployee.affectedRows });
                            });
                        }
                    });
                });
            });
        });
    }

    async searchEmployee(name, cpf) {
        return new Promise((resolve, reject) => {
            const cmd = `
                SELECT * FROM funcionarios
                WHERE nome LIKE ? OR cpf LIKE ?
            `;

            const nameParam = `%${name || ''}%`;
            const cpfParam = `%${cpf || ''}%`;

            conn.query(cmd, [nameParam, cpfParam], (error, result) => {
                if (error) {
                    console.error('Erro ao buscar funcionário:', error);
                    return reject(error);
                }

                const rows = JSON.parse(JSON.stringify(result));
                resolve(rows);
            });
        });
    }

    async alter(employeeId, newSalary) {
        if (!employeeId) {
            throw new Error('ID do funcionário é obrigatório para atualização.');
        }
    
        if (newSalary === undefined || isNaN(newSalary)) {
            throw new Error('Novo salário inválido.');
        }
    
        return new Promise((resolve, reject) => {
            conn.beginTransaction((err) => {
                if (err) {
                    return reject(new Error("Erro na transação: " + err));
                }
    
                const updateSQL = 'UPDATE funcionarios SET salario_bruto = ? WHERE id = ?';
                conn.query(updateSQL, [newSalary, employeeId], (err, resultUpdate) => {
                    if (err) {
                        return conn.rollback(() => {
                            reject(new Error("Erro ao atualizar o salário: " + err));
                        });
                    }
    
                    if (resultUpdate.affectedRows === 0) {
                        return conn.rollback(() => {
                            reject(new Error("Funcionário não encontrado com o ID: " + employeeId));
                        });
                    }
    
                    conn.commit((err) => {
                        if (err) {
                            return conn.rollback(() => {
                                reject(new Error("Erro ao confirmar a transação: " + err));
                            });
                        }
    
                        resolve({ message: 'Salário atualizado com sucesso.' });
                    });
                });
            });
        });
    }    

    async auth(cpf, password) {
        return new Promise((resolve, reject) => {
            const verifyIfExistsUser = 'SELECT * FROM usuarios WHERE CPF = ?'
            conn.query(verifyIfExistsUser, [cpf], (error, result) => {
                if (error) {
                    return reject("User not found!");
                }

                try {
                    const storedHash = result[0].SENHA

                    if (!storedHash) {
                        return reject("Stored hash is undefined or missing!");
                    }

                    bcrypt.compare(password, storedHash, (err, isMatch) => {
                        if (err || !isMatch) {
                            reject("Invalid password!")
                        }

                        let token = jwt.sign({
                            id: result[0].id,
                            name: result[0].nome
                        }, process.env.JWT_KEY, {
                            expiresIn: "1h"
                        })

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
                }
            })
        })
    }

    async registerUser(data, senha) {
        return new Promise((resolve, reject) => {
            bcrypt.hash(senha, 10, (err, hash) => {
                if (err) {
                    return reject("Erro ao criptografar a senha: " + err);
                }
        
                data.SENHA = hash
        
                const cmd = "INSERT INTO usuarios SET ?";
        
                conn.query(cmd, data, (error, result) => {
                    if (error) {
                        return reject("Erro ao inserir no banco: " + error);
                    }
        
                    resolve({ message: "Usuário criado com sucesso!", id: result.insertId });
                });
            });
        });
    }

    async getDependents(employeeId) {
        return new Promise((resolve, reject) => {
            const cmd = `
                SELECT * FROM dependentes
                WHERE funcionario_id = ?
            `;

            conn.query(cmd, [employeeId], (error, result) => {
                if (error) {
                    console.error('Erro ao buscar dependentes:', error);
                    return reject(error);
                }

                const rows = JSON.parse(JSON.stringify(result));
                resolve(rows);
            });
        });
    }

}

export default new EmployeeRepository()