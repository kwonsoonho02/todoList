import { Model, DataTypes } from 'sequelize';
import sequelize  from "../database"

export class List extends Model{
    public id! : number;
    public title! : string;
    public content! : string;
}

List.init(
    {
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