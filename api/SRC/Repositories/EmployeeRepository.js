import conn from "../Database/mysql.js"

class EmployeeRepository {

    async registerEmployee (data) {
        return new Promise((resolve, reject) => {
            const sql = 'insert into funcionarios set ?';

            conn.query(sql, [data], (error, result) => {
                if(error) {
                    return reject("Error registering employee." + error)
                }
                else {
                    const row = JSON.parse(JSON.stringify(result))
                    resolve(row)
                }
            })

        })
    }
}

export default new EmployeeRepository()