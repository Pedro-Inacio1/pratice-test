import mysql from 'mysql2'

const conn = mysql.createConnection({
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    host: process.env.HOST,
    port: 3306
})

conn.connect((err) => {
    if (err) {
        console.error('Erro ao conectar: ' + err.message);
        return;
    }
    console.log('MYSQL: Conexão bem-sucedida!');
})

export default conn