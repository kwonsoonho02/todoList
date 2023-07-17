import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('todolist', 'root', '0414', {
  host: 'localhost',
  dialect: 'mariadb'
});

async function testConnection() {
  try{
    await sequelize.authenticate();
    console.log("연결 선공")
  }catch (error){
    console.log("연결 실패 : " + error);
  }
}
testConnection();

export default sequelize;
