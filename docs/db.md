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
| username | `sAMAccountName` aus AD | `ole.bergen`               |

## zeiten

- zu times

- id: übernehmen wie bisher, primary und fortlaufend

# todo

- ich mache am besten neue tabellen und dann am besten iwas wie `INSERT INTO db_1.tabelle SELECT * FROM db_2.tabelle ...`, ka wie der genaue Befehl wäre

- datenmodell

- datensicherung:

  - db und upload in docker volumes
  - ein bind mount mit backups
  - diese backups täglich erstellen?

- pdf in db nicht upload?

## sequelize:

- in log eine neue funktion dblog oder so. https://sequelize.org/master/manual/getting-started.html unter logging
