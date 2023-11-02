let pageBody = document.getElementById("body")

document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Ouverture de la base de données.
    myDBKitadi = window.sqlitePlugin.openDatabase({
        name: "Kitadi.db",
        location: "default",
    });
    
    // Création de la table Client si inexistante
    myDBKitadi.transaction(function (transaction) {
        transaction.executeSql(
            "CREATE TABLE IF NOT EXISTS Client (Id integer PRIMARY KEY AUTOINCREMENT NOT NULL, Nom varchar(25) NOT NULL, Prenom varchar(25) NOT NULL, Adresse varchar(150) NOT NULL, CodPostal number(5) NOT NULL, Ville varchar(50) NOT NULL, Tel varchar(20) NOT NULL, Mail varchar(80) NOT NULL, HtMaison decimal(3,2) NOT NULL, Altitude number(4), PuissanceMaison number(6) NOT NULL, DteVisite date not null)",
            [],
            function (tx, result) {
                // alert("La Table Client a été créé : " + result);
            },
            function (error) {
                // alert("Une erreur s'est produite à la création de la table Client : " + error);
            }
            );
        });
        
        // Création de la table Piece si inéxistente
        myDBKitadi.transaction(function (transaction) {
            transaction.executeSql(
                "CREATE TABLE IF NOT EXISTS Piece (Id integer PRIMARY KEY AUTOINCREMENT NOT NULL, LibellePiece varchar(50) NOT NULL, Longueur decimal(5,2)  NOT NULL, Largeur decimal(5,2)  NOT NULL, Hauteur decimal(5,2)  NOT NULL, Volume decimal(10,2) NOT NULL, TempBase decimal(5,2) NOT NULL, TempConfort decimal(5,2) NOT NULL, NivIsolation decimal(5,2) NOT NULL, PuissancePiece decimal(10,2) NOT NULL, Client_Id number, FOREIGN KEY (Client_Id) REFERENCES Client (Id))",
                [],
                function (tx, result) {
                    // alert("La Table Piece a été créé : " + result);
                },
                function (error) {
                    // alert("Une erreur s'est produite à la création de la table Piece : " + error );
                }
                );
            });
            
            // Insertion des cas de test, si la base est crée pour la première fois
            let top = 0;
            myDBKitadi.transaction(function (transaction) {
                transaction.executeSql(
                    "SELECT count(*) as Cpt FROM Client",
                    [],
                    function (tx, results) {
                        if (results.rows.item(0).Cpt == 0) {
                            top = 1;
                        }
                    },
                    function (error) {
                        // alert("Erreur, base non dsponible.");
                        top = 0;
                    }
                    );
                });
                
                // Si le résultat de la requête ne ramène pas de ligne, on peut alimenter des cas de test
                if (top == 0) {
                    // Clients
                    myDBKitadi.transaction(function (transaction) {
                        transaction.executeSql(
                            "INSERT INTO Client (Nom, Prenom, Adresse, CodPostal, Ville, Tel, Mail, HtMaison, Altitude, PuissanceMaison, DteVisite) VALUES ('Durand','Paul','38 rue des champs','19100','Brive','0601020304','RueDesChamps@gmail.com',2.5,0,0, date())",
                            [],
                            function (tx, result) {
                                // alert("La ligne a été créé dans la table Client.");
                            },
                            function (error) {
                                // alert("La ligne n'a pas été créé dans la table Client.");
                            }
                            );
                        });
                        
                        myDBKitadi.transaction(function (transaction) {
                            transaction.executeSql(
                                "INSERT INTO Client (Nom, Prenom, Adresse, CodPostal, Ville, Tel, Mail, HtMaison, Altitude, PuissanceMaison, DteVisite) VALUES ('Dupond','Charles','58 rue des alouettes','19100','Brive','0605026374','RueDesAlouettes@gmail.com',2.5,0,0, date())",
                                [],
                                function (tx, result) {
                                    // alert("La ligne a été créé dans la table Client.");
                                },
                                function (error) {
                                    // alert("La ligne n'a pas été créé dans la table Client.");
                                }
                                );
                            });
                            
                            // Pieces
                            myDBKitadi.transaction(function (transaction) {
                                transaction.executeSql(
                                    "INSERT INTO Piece (LibellePiece, Longueur, Largeur, Hauteur, Volume, TempBase, TempConfort, NivIsolation, PuissancePiece, Client_Id) VALUES ('Cuisine',3,3,2.5,22.5,12,21,2,2500,1)",
                                    [],
                                    function (tx, result) {
                                        // alert("La ligne a été créé dans la table Piece.");
                                    },
                                    function (error) {
                                        // alert("La ligne n'a pas été créé dans la table Piece.");
                                    }
                                    );
                                });
                                
                                myDBKitadi.transaction(function (transaction) {
                                    transaction.executeSql(
                                        "INSERT INTO Piece (LibellePiece, Longueur, Largeur, Hauteur, Volume, TempBase, TempConfort, NivIsolation, PuissancePiece, Client_Id) VALUES ('Salon',5,4,2.5,50,15,21,3,2500,1)",
                                        [],
                                        function (tx, result) {
                                            // alert("La ligne a été créé dans la table Piece.");
                                        },
                                        function (error) {
                                            // alert("La ligne n'a pas été créé dans la table Piece.");
                                        }
                                        );
                                    });
                                    
                                    myDBKitadi.transaction(function (transaction) {
                                        transaction.executeSql(
                                            "INSERT INTO Piece (LibellePiece, Longueur, Largeur, Hauteur, Volume, TempBase, TempConfort, NivIsolation, PuissancePiece, Client_Id) VALUES ('Chambre',3,4,2.5,30,18,21,2,2500,1)",
                                            [],
                                            function (tx, result) {
                                                // alert("La ligne a été créé dans la table Piece.");
                                            },
                                            function (error) {
                                                // alert("La ligne n'a pas été créé dans la table Piece.");
                                            }
                                            );
                                        });
                                        
                                        myDBKitadi.transaction(function (transaction) {
                                            transaction.executeSql(
                                                "INSERT INTO Piece (LibellePiece, Longueur, Largeur, Hauteur, Volume, TempBase, TempConfort, NivIsolation, PuissancePiece, Client_Id) VALUES ('Studio',5,5,2.5,62.5,19,21,2,2500,2)",
                                                [],
                                                function (tx, result) {
                                                    // alert("La ligne a été créé dans la table Piece.");
                                                },
                                                function (error) {
                                                    // alert("La ligne n'a pas été créé dans la table Piece.");
                                                }
                                                );
                                            });
                                        }
                                        loadAccueil ()
                                    }

function loadAccueil () {
    
    pageBody.innerHTML = `
    <main class="flex flex-col p-4 bg-lime-200 min-h-screen text-lime-900 font-semibold text-base md:text-2xl">
    <img class="mx-auto mb-8" src="./img/KitadiLogo.png" />
    <h1 class="text-center mb-8">Bienvenue sur l'application Kitadi Energies de calcul de la puissance énergétique d'une Maison.</h1>
    <button class="bg-slate-400 font-bold py-2 px-4 rounded mb-8">
    Créer un nouveau dossier de calcul
    </button>
    <div class="relative overflow-x-auto">
    <table class="w-full text-sm md:text-2xl text-gray-400 text-center">
    <thead class="text-xs text-gray-400 uppercase bg-gray-700">
    <tr>
    <th scope="col" class="px-2 py-3">
    Nom
    </th>
    <th scope="col" class="px-2 py-3">
    Adresse
    </th>
    <th scope="col" class="px-2 py-3">
    Puissance
    </th>
    <th scope="col" class="px-2 py-3">
    Date de visite
    </th>
    </tr>
    </thead>
    <tbody class="text-gray-700" id="tableProjets"> </tbody>
    </table>
    </div></main>`

 loadTable()
}


function loadTable () {
    let tableProjets = document.getElementById("tableProjets")
    myDBKitadi.transaction(function (transaction) {
        transaction.executeSql('SELECT * FROM Client ORDER BY DteVisite DESC', [], function (tx, results) {
            let len = results.rows.length, i;
            for (i = 0; i < len; i++) {
                tableProjets.innerHTML += `
                <tr id="${results.rows.item(i).Id}">
                    <td>${results.rows.item(i).Nom.toUpperCase()} ${results.rows.item(i).Prenom}</td>
                    <td>${results.rows.item(i).Adresse}<br/>${results.rows.item(i).CodPostal} ${results.rows.item(i).Ville}</td>
                    <td>${results.rows.item(i).PuissanceMaison}</td>
                    <td>${results.rows.item(i).DteVisite}</td>
                </tr>`
            }
        }, null);
    });
}