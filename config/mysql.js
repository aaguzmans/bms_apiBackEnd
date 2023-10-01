const { Sequelize } = require("sequelize");

const host = process.env.MYSQL_HOST;
const username = process.env.MYSQL_USER;
const password = process.env.MYSQL_PASSWORD;
const database = process.env.MYSQL_DATABASE;

const sequelize = new Sequelize(
    database,
    username,
    password,
    {
        host,
        dialect:"mysql"
    }
)

const dbConnect = async () => {
    try{
        await sequelize.authenticate();
        console.log('Conectado a la base de datos')
    } catch (e) {
        console.log('Error al conectarse a la base de datos', e)
    }
}

module.exports = { sequelize, dbConnect}