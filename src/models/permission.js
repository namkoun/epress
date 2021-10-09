
export default (sequelize, DataTypes) => {

    const Permission = sequelize.define("permission", {
    
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });
    Permission.associate = function(models){
        models.Permission.hasOne(models.group);
        models.Permission.belongsTo(models.group);
    }
    return Permission;
    };