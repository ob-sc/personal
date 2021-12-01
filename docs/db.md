# Datenbank

## Installation

MySQL installieren und einrichten

```sh
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
sudo mysql
```

MySQL User anlegen, `PASSWORT` austauschen durch das Passwort in `DB_SECRET`

```sql
CREATE USER 'starcar'@'localhost' IDENTIFIED BY 'PASSWORT';
GRANT ALL PRIVILEGES ON *.* TO 'starcar'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;
exit
```

Schauen ob der Service läuft mit `systemctl status mysql.service`, sonst starten. Schauen ob user und Passwort klappen mit `sudo mysqladmin -p -u starcar version`, im prompt Passwort eingeben. Dann DB importieren.

## Sicherung der DB

todo bla

# Tabellen

## Users

| Feld     | Beschreibung            | Beispiel                   |
| -------- | ----------------------- | -------------------------- |
| id       | Jacando ID              | `5eg5e2b211070502555bcb59` |
| domain   | Domäne                  | `starcar`                  |
| username | `sAMAccountName` aus AD | `max.mustermann`           |

## zeiten

- zu times

- id: übernehmen wie bisher, primary und fortlaufend

# todo

- ich mache am besten neue tabellen und dann am besten iwas wie `INSERT INTO db_1.tabelle SELECT * FROM db_2.tabelle ...`, ka wie der genaue Befehl wäre

  - mit sequelize? https://sequelize.org/master/manual/model-querying-basics.html#creating-in-bulk

- datenmodell

- datensicherung:

  - db und upload in docker volumes
  - ein bind mount mit backups
  - diese backups täglich erstellen?

- pdf in db nicht upload?

## sequelize:

- siehe links sequelize (typescript example)

```js
interface ProjectAttributes {
  id: number;
  ownerId: number;
  name: string;
}

interface ProjectCreationAttributes extends Optional<ProjectAttributes, "id"> {}

class Project extends Model<ProjectAttributes, ProjectCreationAttributes>
  implements ProjectAttributes {
  public id!: number;
  public ownerId!: number;
  public name!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Project.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    ownerId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "projects",
  }
);
```
