let main = document.getElementById("main");
let header = document.getElementById('header');
let footer = document.getElementById('footer');
let kwTotal = 0

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
                
    loadAccueil ()
}

function loadAccueil () {

    header.innerHTML = ""
    
    main.innerHTML = `
    <main class="flex flex-col p-4 min-h-screen text-lime-900 font-semibold text-base md:text-2xl">
    <img class="mx-auto mb-8" src="./img/KitadiLogo.png" />
    <h1 class="text-center mb-8">Bienvenue sur l'application Kitadi Energies de calcul de la puissance énergétique d'une Maison.</h1>
    <button id="btnNewDossier" class="bg-slate-400 font-bold py-2 px-4 rounded mb-8">
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

    btnNewDossier = document.getElementById("btnNewDossier")
    btnNewDossier.addEventListener("click", function() {
        loadDossier()
    })

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

function loadDossier () {
    
header.innerHTML = `
<div class="flex flex-col text-center border-4 border-cyan-500 p-4">
    <h3>Nom</h3>
    <input type="text" id="nomClient"  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
    <h3>Prénom</h3>
    <input type="text" id="prenomClient"  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
    <h3>Adresse</h3>
    <input type="text" id="adresseClient"  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
    <h3>Code Postal</h3>
    <input type="text" id="codePostal"  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
    <h3>Ville</h3>
    <input type="text" id="villeClient"  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
    <h3>Téléphone</h3>
    <input type="text" id="telClient"  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
    <h3>e-mail</h3>
    <input type="text" id="mailClient"  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
    </div>`

main.innerHTML =

 '<div id="formContainer" class="text-center mt-4">' + 
    '<div id="form"></div>' +
    '<button id="btncreation" type="button" class="text-white overflow-y-auto bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">Créer une pièce</button>' +
'</div>';

footer.innerHTML = `<div id="total" class="flex justify-center items-center border mx-auto w-full h-20 bg-slate-500 text-white text-center">Puissance Total</div>`+
`<footer class="sticky bottom-0 left-0 z-20 w-full p-4 bg-white border-t border-gray-200 shadow md:flex md:items-center md:justify-between md:p-6">
    
    <ul class="flex flex-wrap p-4 justify-around items-center mt-3 text-xl font-medium text-gray-500 sm:mt-0">
        <li>
            <button id="btnSave" class="border rounded text-red-50 px-6 bg-lime-400">Sauvegarder</button>
        </li>
        <li>
            <button id="btnDelete" class="border rounded text-red-50 px-6 bg-red-700">Supprimer</button>
        </li>
        <li>
            <button id="btnRetour" class="text-red-50 mt-6 bg-sky-500 px-6 border rounded">Retour</button>
        </li>
    </ul>
</footer>`

let btnCreation = document.getElementById('btncreation');
let formContainer = document.getElementById('formContainer');
let form = document.getElementById('form');
let tb, tc;
let deltaT;
let i = -1;
let puissancePieces = []

//-- Variables client --//
let nomClient = document.getElementById('nomClient');
let prenomClient = document.getElementById('prenomClient');
let adresseClient = document.getElementById('adresseClient');
let codePostal = document.getElementById('codePostal');
let villeClient = document.getElementById('villeClient');
let telClient = document.getElementById('telClient');
let mailClient = document.getElementById('mailClient');

//-- Bouton footer --//
let btnSave = document.getElementById('btnSave');
let btnRetour = document.getElementById('btnRetour');


nomClient.addEventListener('input', function(){
    console.log('Nom client '+nomClient.value);
});

prenomClient.addEventListener('input', function(){
    console.log('prenom client '+prenomClient.value);
});

adresseClient.addEventListener('input', function(){
    console.log('adresse client '+adresseClient);
});

codePostal.addEventListener('input', function(){
    console.log('code postal '+codePostal.value);
});

villeClient.addEventListener('input', function(){
    console.log('ville '+villeClient.value);
});

telClient.addEventListener('input', function(){
    console.log('telephone '+telClient.value);
});

mailClient.addEventListener('input', function(){
    console.log('mail '+mailClient.value);
});



btnCreation.addEventListener('click', function(){

    i++

    let container = document.createElement('div');

    container.innerHTML = '<form class="border-4 border-cyan-500 p-4 mt-2 mb-2">' +
    '<div class="flex flex-col justify-center">'+
        '<h2 class="text-center">Nom de la pièce</h2>'+
        `<input type="text" id="nomPiece${i}"  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"/>`+
    '</div>' + 

    '<div class="flex justify-center">'+
        '<div class="flex-col">'+
    '<h2 class="text-center">Température de base||</h2>'+
            `<input type="number" id="tempBase${i}" class="bg-gray-50 border items-center w-24 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"/>`+
        '</div>'+
        '<div class="flex-col">'+
    '<h2 class="text-center">Température de confort</h2>'+
            `<input type="number" id="tempConfort${i}" class="bg-gray-50 border w-24 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"/>`+
        '</div>'+
        `<div id="deltaT${i}"></div>`+ //-- Calcul des temperatures --//
    '</div>'+

    '<h2 class="text-center mt-2">Dimensions (en mètre)</h2>'+
    '<div class="flex justify-center max-w-full mx-2">'+
        '<div class="flex-col">'+
    '<h3 class="text-center">Longueur</h3>'+
        '<div class="flex justify-center">'+
            `<input type="number" id="longueurP${i}" class="bg-gray-50 border w-full border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3"/>`+
        '</div>'+
    '</div>'+

    '<div class="flex-col">'+
    '<h3 class="text-center">Largeur</h3>'+
        '<div class="flex justify-center">'+
           `<input type="number" id="largeurP${i}" class="bg-gray-50 border w-full border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block py-3"/>`+
        '</div>'+
    '</div>'+    
    '<div class="flex-col">'+
    '<h3 class="text-center">Hauteur</h3>'+
        '<div class="flex justify-center">'+
            `<input type="number" id="hauteurP${i}" class="bg-gray-50 border w-full border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3"/>`+
        '</div>'+
    '</div>'+
    '<div class="flex-col">'+
    '<h3 class="text-center">Vol total</h3>'+
    '<div class="flex justify-center">'+
        `<input disabled type="number" id="volumeTotal${i}" class="bg-gray-50 border w-full border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3"/>`+
    '</div>'+
    '</div>'+
'</div>'+
    '<h2 class="text-center">Niveau isolation</h2>'+
    '<div class="flex justify-center">'+
        `<input type="number" id="isolation${i}" class="bg-gray-50 border  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3"/>`+
        `<div id="puissanceP${i}"></div>`+ //-- Div de Puissance P --//
    '</div>'+    
    '<br/>'+
    `<div class="hidden" id="indice${i}">${i}</div>`+
'</form> ';

form.appendChild(container);

formContainer.insertBefore(form, btnCreation); //-- Position du bouton "créer" vers le bas --//

//-- Variables températures --//
let tb = document.getElementById(`tempBase${i}`);
let tc = document.getElementById(`tempConfort${i}`);
let deltaT = document.getElementById(`deltaT${i}`);

//-- Variables nom, volume ect --//
let nomPiece = document.getElementById(`nomPiece${i}`)
let longueurP = document.getElementById(`longueurP${i}`);
let largeurP = document.getElementById(`largeurP${i}`);
let hauteurP = document.getElementById(`hauteurP${i}`);
let volumeP = document.getElementById(`volumeTotal${i}`);
let g = document.getElementById(`isolation${i}`);
let puissancePiece = document.getElementById(`puissanceP${i}`)
let indiceDiv = document.getElementById(`indice${i}`)

let indicePuissance = indiceDiv.innerHTML;



nomPiece.addEventListener('input', function(){
    console.log('nom piece '+nomPiece.value);
});

tb.addEventListener('input', function(){
    
    console.log(tb.value);
    updateDeltaT();
    puissanceP(indicePuissance);

});

tc.addEventListener('input', function(){
    console.log(tc.value);
    updateDeltaT();
    puissanceP(indicePuissance);

   
});

longueurP.addEventListener('input', function(){
    console.log(longueurP.value);
    puissanceP(indicePuissance);

    
});
largeurP.addEventListener('input', function(){
    console.log(largeurP.value);
    puissanceP(indicePuissance);

    
    
});
hauteurP.addEventListener('input', function(){
    console.log(hauteurP.value);
    updateVolume();
    puissanceP(indicePuissance);

    
});

g.addEventListener('input', function(){
    console.log(g.value);
    puissanceP(indicePuissance);

});


//-- Calcul du deltaT --//
function updateDeltaT() {
    deltaT.value = tb.value - tc.value;
    console.log(deltaT.value);
};
//-- Calcul du volume total --//
function updateVolume(){
    volumeP.value = longueurP.value * largeurP.value * hauteurP.value;
    console.log(volumeP.value);
    
};

function puissanceP(indice){
    puissancePiece.value = g.value * volumeP.value * (tb.value-tc.value)
    console.log(puissancePiece.value);
    puissancePieces[indice]=puissancePiece.value;
    console.log(puissancePieces);

    kwTotal = 0;

for (j=0; j<puissancePieces.length; j++){

    kwTotal  += parseFloat=(puissancePieces[j]);
    console.log(kwTotal);
    let totalDiv = document.getElementById("total")

    totalDiv.innerHTML = `${kwTotal}`+ ' watts';

    

}};
});

btnSave.addEventListener('click', function(){
    creationDossier();
    alert("Votre piece à bien crée");
    footer.innerHTML= "";
    loadAccueil();
});

function creationDossier() {    
    // On fait le client
    let dateToday = new Date();
    // let hauteurSousPlafond  = document.getElementById(hauteurP0).value || (document.getElementById(hauteurP0).value = 0);
    let hauteurSousPlafond  = 0;
    
    myDBKitadi.transaction(function (transaction) {
      var executeQuery =
        "INSERT INTO Client (Nom, Prenom, Adresse, CodPostal, Ville, Tel, Mail, HtMaison, Altitude, PuissanceMaison, DteVisite) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
      transaction.executeSql(
        executeQuery,
        [
          `${nomClient.value}`,
          `${prenomClient.value}`,
          `${adresseClient.value}`,
          `${codePostal.value}`,
          `${villeClient.value}`,
          `${telClient.value}`,
          `${mailClient.value}`,
          hauteurSousPlafond,
          0,
          `${kwTotal}`,
          dateToday,
        ],
        function (tx, result) {
        //   alert("Insertion OK !!!");
        },
        function (error) {
            console.log("Une erreur s'est produite !!! : " + error);
        }
      );
    });
      
    // On va rechercher le dernier max ID cr�er dans la table Client
    let idMax = 0;
    myDBKitadi.transaction(function (transaction) {
      transaction.executeSql(
        "SELECT Max(Id) as MaxId FROM Client",
        [],
        function (tx, results) {
          if (results.rows.length != 0) {
            creationPieceDossier(results.rows.item(0).MaxId);  
            }
        },
        function (error) {
          console.log("Erreur, base non disponible.");
        }
      );
    });
} 

function creationPieceDossier(idClient) {    
    // On insert les pi�ces si l'idClient est sup�rieur � 0
    if(idClient > 0) {
        for (let j = 0; j <= i; j++) {

            //-- Variables nom, volume ect --//
            let reqNomPiece = document.getElementById(`nomPiece${j}`);
            let reqLongueurP = document.getElementById(`longueurP${j}`);
            let reqLargeurP = document.getElementById(`largeurP${j}`);
            let reqHauteurP = document.getElementById(`hauteurP${j}`);
            let reqVolumeP = document.getElementById(`volumeTotal${j}`);
            let reqTb = document.getElementById(`tempBase${j}`);
            let reqTc = document.getElementById(`tempConfort${j}`);
            let reqG = document.getElementById(`isolation${j}`);
            let reqPuissancePiece = document.getElementById(`puissanceP${j}`);

            myDBKitadi.transaction(function (transaction) {
                var executeQuery =
                "INSERT INTO Piece (LibellePiece, Longueur, Largeur, Hauteur, Volume, TempBase, TempConfort, NivIsolation, PuissancePiece, Client_Id) VALUES (?,?,?,?,?,?,?,?,?,?)";
                transaction.executeSql(
                executeQuery,
                [
                    `${reqNomPiece.value}`,
                    `${reqLongueurP.value}`,
                    `${reqLargeurP.value}`,
                    `${reqHauteurP.value}`,
                    `${reqVolumeP.value}`,
                    `${reqTb.value}`,
                    `${reqTc.value}`,
                    `${reqG.value}`,
                    `${reqPuissancePiece.value}`,
                    `${idClient}`,
                ],
                function (tx, result) {
                    console.log("Insertion Pièce OK !!!");
                },
                function (error) {
                    console.log("Une erreur s'est produite Pièce !!!");
                }
                );
            });
        }
    }   
} 
};

