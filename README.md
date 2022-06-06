## Brukerveiledinng

### Installasjon

#### Via git

Skriv git clone https://github.com/NUB31/skoolProjFrontend

#### Via GitHub

Trykk på "Download Zip" oppe i høgre hjørne av sida
![image](https://user-images.githubusercontent.com/59693115/171844525-f5edfa40-4224-4581-8ad6-213c219fc7d7.png)

- ### Oppsett

#### Starte serveren

_Om du brukte git til å laste ned, hopp over steg nr. 1_

1. Extract den zippa fila du lasta ned
2. Opne mappa "skoolProjBackend" i en kommandolinje
3. skriv "npm i", og så "npm start" i kommandolinja (NodeJs må vere installert)
4. opne http://localhost:12000 i nettleseren din

#### Starte MySQL server

1. Last ned og installer en MySQL server kalt MariaDB fra https://mariadb.org/download/
2. Set root passordet til Qwerty12345@1 når du blir bedt om det
3. Opne det inkluderte programmet HeidiSQL, og koble til serveren din på localhost med brukernamn root og passordet Qwerty12345@1
   ![image](https://user-images.githubusercontent.com/59693115/171843436-61bdb5dd-6a00-4b0e-a387-b422257aade8.png)
4. Trykk på file og så på "Run SQL file"
   ![image](https://user-images.githubusercontent.com/59693115/171844363-f3ffd9e2-62af-45f8-b41f-beb1b62b3da5.png)
5. Velg 2.sql fra mappa og kjør
6. Når den er ferdig, trykk f5 for å se databasen din
7. Databasen kommer ferdig med noen brukere der alle passorda er 1234. Bruk desse for å teste

#### Etter å ha starta appen

1. Lag en bruker ved å fylle ut skjemaet
2. Etter å ha blitt flytta til login skjermen, skriv inn detaljanee for å logge in.
3. Bruk søkefeltet for legge til en venn
4. Sriv en melding til vennen
