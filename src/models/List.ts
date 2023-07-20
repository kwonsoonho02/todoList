import { Model, DataTypes } from 'sequelize';
import sequelize  from "../database"

export class List extends Model{
    public id! : number;
    public title! : string;
    public content! : string;
}

List.init(
    {
        userid:{
            type: DataTypes.STRING,
            allowNull : false,
        },
        id:{
            type: DataTypes.INTEGER,
            autoIncrement : true,
            primaryKey : true,
            allowNull : false,
        },
        title:{
            type: DataTypes.STRING(20),
            allowNull : false,
        },
        content:{
            type: DataTypes.STRING(100),
            allowNull : false,
        },
    },
    {
        sequelize,
        timestamps: false,
        modelName: 'List',
        tableName : 'lists',
    }
)

sequelize.sync({
    alter: true
})
  .then(() => {
    console.log('데이터베이스와 모델 동기화 완료');
  })
  .catch((error) => {
    console.error('동기화 오류:', error);
  });

  export default List;