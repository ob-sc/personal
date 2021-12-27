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

MySQL User anlegen, `PASSWORT` austauschen durch das Passwort in `DB_SECRET`

```sql
CREATE USER 'starcar'@'localhost' IDENTIFIED BY 'PASSWORT';
GRANT ALL PRIVILEGES ON *.* TO 'starcar'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;
exit
```

Schauen ob der Service läuft mit `systemctl status mysql.service`, sonst starten. Schauen ob user und Passwort klappen mit `sudo mysqladmin -p -u starcar version`, im prompt Passwort eingeben. Wenns nicht klappt dann gibt es noch `sudo mysql -u root`, sonst DB importieren.

## Sicherung

todo

## Extrafelder der Mitarbeiter

- Status: IDL | SL | RL | ADMIN

  - wenn leer: Disponent (minimale Berechtigungen)

- Extrastation: Stationen durch Komma getrennt | "\*" für alle Stationen

  - wenn leer: Keine Extrastation

- Region: 'alle' | 'hamburg' | 'berlin' | 'nord' | 'süd' | 'ost' | 'west' | 'mitte'

  - wenn leer: Keine Region
