const sequelize = require('./db_connect')

const syncModels = async() => {
    try {
        await sequelize.sync({force: false})
        console.log('All models were synchronized successfully.');
    } catch (error) {
        console.log('Some error occurred', error);
    }
}


module.exports = syncModels
