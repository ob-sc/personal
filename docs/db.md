# Datenbank

## Tabellen

Siehe `src/db/`, jede Tabelle eine Datei.

## Installation

MySQL installieren und einrichten

```sh
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
sudo mysql
```

### WSL

Kein systemd, also `sudo /etc/init.d/mysql start`

### Mac

```sh
brew install mysql
brew services start mysql
mysqladmin -u root password # wie mac user
mysql -u root -p
```

### Benutzer

MySQL User anlegen, `PASSWORT` austauschen durch das Passwort in `DB_SECRET`

```sql
CREATE USER 'starcar'@'localhost' IDENTIFIED BY 'PASSWORT';
GRANT ALL PRIVILEGES ON *.* TO 'starcar'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```

### DB & User

```sql
CREATE DATABASE development;

INSERT INTO development.users (`domain`,`username`,`access`,`stations`,`createdAt`,`updatedAt`) VALUES ("starcar","bergen","admin","12,18","2021-12-01 13:20:42","2021-12-01 13:20:42");
```

### Troubleshoot

Schauen ob der Service läuft mit `systemctl status mysql.service`, sonst starten. Schauen ob user und Passwort klappen mit `sudo mysqladmin -p -u starcar version`, im prompt Passwort eingeben. Wenns nicht klappt dann gibt es noch `sudo mysql -u root` (eig reicht `sudo mysql`), sonst DB importieren.

## Sicherung

todo

## Extrafelder der Mitarbeiter

- Status: `idl | sl | rl | admin`

  - wenn leer: Disponent (minimale Berechtigungen)

- Extrastation: Stationen durch Komma getrennt oder "\*" für alle Stationen

  - wenn leer: Keine Extrastation

- Region: `alle | hamburg | berlin | nord | süd | ost | west | mitte`

  - wenn leer: Keine Region
