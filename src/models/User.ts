import { Model, DataTypes } from 'sequelize';
import sequelize  from "../database"

export class User extends Model{
    public userid! : string;
    public userpassword! : string;
}

User.init(
    {
        userid:{
            type: DataTypes.STRING,
            primaryKey : true,
            allowNull : false,
        },
        userpassword:{
            type: DataTypes.STRING,
            allowNull : false,
        },
    },
    {
        sequelize,
        timestamps: false,
        modelName: 'User',
        tableName : 'users',
    }
)

sequelize.sync({
    alter: true
})
  .then(() => {
    console.log('데이터베이스와 모델 User 동기화 완료');
  })
  .catch((error) => {
    console.error('동기화 오류:', error);
  });

  export default User;