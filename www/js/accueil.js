// Note Pour sasha:
// Page d'accueil opérationnel
// création opérationnel
// Suppression et mise à jour du client dans une prochaine version car pas le temps.
// application testé sur android pixel 7.

let main = document.getElementById("main");
let header = document.getElementById('header');
let footer = document.getElementById('footer');
let kwTotal = 0
let editDossierButtons = [];
let deleteDossierButtons = [];
let memoryI = 0;

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  console.log(navigator.notification);
  // Ouverture de la base de données.
  myDBKitadi = window.sqlitePlugin.openDatabase({
    name: "Kitadi.db",
    location: "default",
  });

  // Suppression de la table Client
  // myDBKitadi.transaction(function (transaction) {
  //   transaction.executeSql(
  //     "DROP TABLE IF EXISTS Client",
  //     [],
  //     function (tx, result) {
  //       // alert("La Table Client a été supprimée : " + result);
  //     },
  //     function (error) {
  //       // alert("Une erreur s'est produite à la suppression de la table Client : " + error);
  //     }
  //   );
  // });

  // Suppression de la table Piece
  // myDBKitadi.transaction(function (transaction) {
  //   transaction.executeSql(
  //     "DROP TABLE IF EXISTS Piece",
  //     [],
  //     function (tx, result) {
  //       // alert("La Table piece a été supprimée : " + result);
  //     },
  //     function (error) {
  //       // alert("Une erreur s'est produite à la suppresson de la table Piece : " + error);
  //     }
  //   );
  // });

  // Création de la table Client si inexistante
  myDBKitadi.transaction(function (transaction) {
    transaction.executeSql(
      "CREATE TABLE IF NOT EXISTS Client (Id integer PRIMARY KEY AUTOINCREMENT NOT NULL, Nom varchar(25) NOT NULL, Prenom varchar(25) NOT NULL, Adresse varchar(150) NOT NULL, CodPostal number(5) NOT NULL, Ville varchar(50) NOT NULL, Tel varchar(20) NOT NULL, Mail varchar(80) NOT NULL, Altitude number(4), PuissanceMaison number(6) NOT NULL, DteVisite datetime not null)",
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

  loadAccueil();
}

function loadAccueil() {
  header.innerHTML = "";
  footer.innerHTML = "";

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
    Puissance
    </th>
    <th scope="col" class="px-2 py-3">
    Date de visite
    </th>
    <th scope="col" colspan="2" class="px-2 py-3">
    Action
    </th>
    </tr>
    </thead>
    <tbody class="text-gray-700" id="tableProjets"> </tbody>
    </table>
    </div></main>`;

  btnNewDossier = document.getElementById("btnNewDossier");
  btnNewDossier.addEventListener("click", function () {
    loadDossier();
  });

  loadTable();
}

function loadTable () {
    let tableProjets = document.getElementById("tableProjets");
    myDBKitadi.transaction(function (transaction) {
      transaction.executeSql(
        "SELECT Id, Nom, Prenom, Adresse, CodPostal, Ville, PuissanceMaison, STRFTIME('%d/%m/%Y %H:%M:%S',DteVisite) as DteVisite FROM Client ORDER BY DteVisite DESC",
        [],
        function (tx, results) {
          let len = results.rows.length, i;
          let idClientRow = results.rows.item(i).Id;
            for (i = 0; i < len; i++) {
                let nomDossier = results.rows.item(i).Nom.toUpperCase()
                let prenomDossier = results.rows.item(i).Prenom                
                tableProjets.innerHTML += `
                <tr id="dossier_${results.rows.item(i).Id}">
                    <td>${nomDossier} ${prenomDossier}</td>
                    <td>${results.rows.item(i).PuissanceMaison}</td>
                    <td>${results.rows.item(i).DteVisite}</td>
                    <td><button class="btnEditerDossier"><i class="fa-solid fa-pen-to-square text-3xl mx-4 text-lime-200"></i></td>
                    <td><button class="btnSupprimerDossier"><i class="fa-solid fa-trash-can text-3xl text-red-800"></i></td>
                </tr>`
                editDossierButtons = document.getElementsByClassName("btnEditerDossier"); 
                deleteDossierButtons = document.getElementsByClassName("btnSupprimerDossier");
                editDossierButtons[i].addEventListener("click", function() {
                    alert("Edition du dossier")
                    loadOldDossier (idClientRow)
                });
                deleteDossierButtons[i].addEventListener("click", function() {
                    
                    navigator.notification.confirm(
                        `Voulez-vous supprimer le dossier du client ${nomDossier} ${prenomDossier} ?`,  // message
                        onConfirm,              // callback to invoke with index of button pressed
                        'Supprimer',            // title
                         ['Oui','Non']             // buttonLabels
                    );

                });

                function onConfirm(buttonIndex){
                    if(buttonIndex==1){
                    alert("Suppression du dossier")
                    suppressionDossier(idClientRow)
                    }
            }
            }
        }, null);
    });
}


function loadDossier() {
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
    </div>`;

  main.innerHTML = `<div id="formContainer" class="text-center mt-4">
    <div id="form"></div>
    <button id="btncreation" type="button" class="text-white overflow-y-auto bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">Créer une pièce</button>
    </div>`;

  footer.innerHTML =
    `<footer class="sticky bottom-0 left-0 z-20 w-full p-4 bg-white border-t border-gray-200 shadow md:flex md:items-center md:justify-between md:p-6">
    <div id="total" class="flex justify-center items-center border mx-auto w-full h-20 bg-slate-500 text-white text-center">Puissance Total</div>
    
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
</footer>`;

  let btnCreation = document.getElementById("btncreation");
  let formContainer = document.getElementById("formContainer");
  let form = document.getElementById("form");
  let tb, tc;
  let deltaT;
  let i = -1;
  let puissancePieces = [];

  //-- Variables client --//
  let nomClient = document.getElementById("nomClient");
  let prenomClient = document.getElementById("prenomClient");
  let adresseClient = document.getElementById("adresseClient");
  let codePostal = document.getElementById("codePostal");
  let villeClient = document.getElementById("villeClient");
  let telClient = document.getElementById("telClient");
  let mailClient = document.getElementById("mailClient");

  //-- Bouton footer --//
  let btnSave = document.getElementById("btnSave");
  let btnSup = document.getElementById("btnSave");
  let btnRetour = document.getElementById("btnRetour");

  nomClient.addEventListener("input", function () {
    console.log("Nom client " + nomClient.value);
  });

  prenomClient.addEventListener("input", function () {
    console.log("prenom client " + prenomClient.value);
  });

  adresseClient.addEventListener("input", function () {
    console.log("adresse client " + adresseClient);
  });

  codePostal.addEventListener("input", function () {
    console.log("code postal " + codePostal.value);
  });

  villeClient.addEventListener("input", function () {
    console.log("ville " + villeClient.value);
  });

  telClient.addEventListener("input", function () {
    console.log("telephone " + telClient.value);
  });

  mailClient.addEventListener("input", function () {
    console.log("mail " + mailClient.value);
  });

  btnCreation.addEventListener("click", function () {
    i++;

    let container = document.createElement("div");

    container.innerHTML =
      '<form class="border-4 border-cyan-500 p-4 mt-2 mb-2">' +
      '<div class="flex flex-col justify-center">' +
      '<h2 class="text-center">Nom de la pièce</h2>' +
      `<input type="text" id="nomPiece${i}"  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"/>` +
      "</div>" +
      '<div class="flex justify-center">' +
      '<div class="flex-col">' +
      '<h2 class="text-center">Température de base||</h2>' +
      `<input type="number" id="tempBase${i}" class="bg-gray-50 border items-center w-24 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"/>` +
      "</div>" +
      '<div class="flex-col">' +
      '<h2 class="text-center">Température de confort</h2>' +
      `<input type="number" id="tempConfort${i}" class="bg-gray-50 border w-24 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"/>` +
      "</div>" +
      `<div id="deltaT${i}"></div>` + //-- Calcul des temperatures --//
      "</div>" +
      '<h2 class="text-center mt-2">Dimensions (en mètre)</h2>' +
      '<div class="flex justify-center max-w-full mx-2">' +
      '<div class="flex-col">' +
      '<h3 class="text-center">Longueur</h3>' +
      '<div class="flex justify-center">' +
      `<input type="number" id="longueurP${i}" class="bg-gray-50 border w-full border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3"/>` +
      "</div>" +
      "</div>" +
      '<div class="flex-col">' +
      '<h3 class="text-center">Largeur</h3>' +
      '<div class="flex justify-center">' +
      `<input type="number" id="largeurP${i}" class="bg-gray-50 border w-full border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block py-3"/>` +
      "</div>" +
      "</div>" +
      '<div class="flex-col">' +
      '<h3 class="text-center">Hauteur</h3>' +
      '<div class="flex justify-center">' +
      `<input type="number" id="hauteurP${i}" class="bg-gray-50 border w-full border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3"/>` +
      "</div>" +
      "</div>" +
      '<div class="flex-col">' +
      '<h3 class="text-center">Vol total</h3>' +
      '<div class="flex justify-center">' +
      `<input disabled type="number" id="volumeTotal${i}" class="bg-gray-50 border w-full border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3"/>` +
      "</div>" +
      "</div>" +
      "</div>" +
      '<h2 class="text-center">Niveau isolation</h2>' +
      '<div class="flex justify-center">' +
      `<input type="number" id="isolation${i}" class="bg-gray-50 border  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3"/>` +
      `<div id="puissanceP${i}"></div>` + //-- Div de Puissance P --//
      "</div>" +
      "<br/>" +
      `<div class="hidden" id="indice${i}">${i}</div>` +
      "</form> ";

    form.appendChild(container);

    formContainer.insertBefore(form, btnCreation); //-- Position du bouton "créer" vers le bas --//

    //-- Variables températures --//
    let tb = document.getElementById(`tempBase${i}`);
    let tc = document.getElementById(`tempConfort${i}`);
    let deltaT = document.getElementById(`deltaT${i}`);

    //-- Variables nom, volume ect --//
    let nomPiece = document.getElementById(`nomPiece${i}`);
    let longueurP = document.getElementById(`longueurP${i}`);
    let largeurP = document.getElementById(`largeurP${i}`);
    let hauteurP = document.getElementById(`hauteurP${i}`);
    let volumeP = document.getElementById(`volumeTotal${i}`);
    let g = document.getElementById(`isolation${i}`);
    let puissancePiece = document.getElementById(`puissanceP${i}`);
    let indiceDiv = document.getElementById(`indice${i}`);

    let indicePuissance = indiceDiv.innerHTML;

    nomPiece.addEventListener("input", function () {
      console.log("nom piece " + nomPiece.value);
    });

    tb.addEventListener("input", function () {
      console.log(tb.value);
      updateDeltaT();
      puissanceP(indicePuissance);
    });

    tc.addEventListener("input", function () {
      console.log(tc.value);
      updateDeltaT();
      puissanceP(indicePuissance);
    });

    longueurP.addEventListener("input", function () {
      console.log(longueurP.value);
      updateVolume();
      puissanceP(indicePuissance);
    });
    largeurP.addEventListener("input", function () {
      console.log(largeurP.value);
      updateVolume();
      puissanceP(indicePuissance);
    });
    hauteurP.addEventListener("input", function () {
      console.log(hauteurP.value);
      updateVolume();
      puissanceP(indicePuissance);
    });

    g.addEventListener("input", function () {
      console.log(g.value);
      puissanceP(indicePuissance);
    });

    //-- Calcul du deltaT --//
    function updateDeltaT() {
      deltaT.value = tb.value - tc.value;
      console.log(deltaT.value);
    }
    //-- Calcul du volume total --//
    function updateVolume() {
      volumeP.value = longueurP.value * largeurP.value * hauteurP.value;
      console.log(volumeP.value);
    }

    function puissanceP(indice) {
      puissancePiece.value = g.value * volumeP.value * (tb.value - tc.value);
      console.log(puissancePiece.value);
      puissancePieces[indice] = puissancePiece.value;
      console.log(puissancePieces);

      kwTotal = 0;

      for (j = 0; j < puissancePieces.length; j++) {
        kwTotal += parseFloat = puissancePieces[j];
        console.log(kwTotal);
        let totalDiv = document.getElementById("total");

        totalDiv.innerHTML = `${kwTotal}` + " watts";
      }
    }
  });

  btnSave.addEventListener("click", function () {
    creationDossier();
    alert("Votre piece à bien été crée");
    setTimeout(() => {
      loadAccueil();
    }, 3000);

    btnRetour.addEventListener('click', function(){
        loadAccueil();
    });

  });

}

function loadOldDossier (idClient) {
    myDBKitadi.transaction(function (transaction) {
        transaction.executeSql(`SELECT * FROM Client WHERE Id = ${idClient}`, [], function (tx, results) {
            let len = results.rows.length, i;
            for (i = 0; i < len; i++) {       
                
                header.innerHTML = `
                <div class="flex flex-col text-center border-4 border-cyan-500 p-4">
                    <h3>Nom</h3>
                    <input type="text" id="nomClient" value="${results.rows.item(i).Nom.toUpperCase()}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
                    <h3>Prénom</h3>
                    <input type="text" id="prenomClient" value="${results.rows.item(i).Prenom}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
                    <h3>Adresse</h3>
                    <input type="text" id="adresseClient" value="${results.rows.item(i).Adresse}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
                    <h3>Code Postal</h3>
                    <input type="text" id="codePostal" value="${results.rows.item(i).CodPostal}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
                    <h3>Ville</h3>
                    <input type="text" id="villeClient" value="${results.rows.item(i).Ville}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
                    <h3>Téléphone</h3>
                    <input type="text" id="telClient" value="${results.rows.item(i).Tel}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
                    <h3>e-mail</h3>
                    <input type="text" id="mailClient" value="${results.rows.item(i).Mail}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
                </div>`

            }
        }, null);
    });

    main.innerHTML =
    
     '<div id="formContainer" class="text-center mt-4">' + 
        '<div id="form"></div>' +
        '<button id="btncreation" type="button" class="text-white overflow-y-auto bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">Créer une pièce</button>' +
    '</div>';

    myDBKitadi.transaction(function (transaction) {
        transaction.executeSql(`SELECT * FROM Piece WHERE Client_Id = ${idClient}`, [], function (tx, results) {
            let len = results.rows.length, i;
            memoryI = len;
            for (i = 0; i < len; i++) {  
                let volume =  results.rows.item(i).Longueur * results.rows.item(i).Largeur * results.rows.item(i).Hauteur
                let container = document.createElement('div');
    
            container.innerHTML = '<form class="border-4 border-cyan-500 p-4 mt-2 mb-2">' +
            '<div class="flex flex-col justify-center">'+
                '<h2 class="text-center">Nom de la pièce</h2>'+
                `<input type="text" id="nomPiece${i}" value="${results.rows.item(i).LibellePiece}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"/>`+
            '</div>' + 
        
            '<div class="flex justify-center">'+
                '<div class="flex-col">'+
            '<h2 class="text-center">Température de base||</h2>'+
                    `<input type="number" id="tempBase${i}" value="${results.rows.item(i).TempBase}" class="bg-gray-50 border items-center w-24 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"/>`+
                '</div>'+
                '<div class="flex-col">'+
            '<h2 class="text-center">Température de confort</h2>'+
                    `<input type="number" id="tempConfort${i}" value="${results.rows.item(i).TempComfort}" class="bg-gray-50 border w-24 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"/>`+
                '</div>'+
                `<div id="deltaT${i}"></div>`+ //-- Calcul des temperatures --//
            '</div>'+
        
            '<h2 class="text-center mt-2">Dimensions (en mètre)</h2>'+
            '<div class="flex justify-center max-w-full mx-2">'+
                '<div class="flex-col">'+
            '<h3 class="text-center">Longueur</h3>'+
                '<div class="flex justify-center">'+
                    `<input type="number" id="longueurP${i}" value="${results.rows.item(i).Longueur}" class="bg-gray-50 border w-full border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3"/>`+
                '</div>'+
            '</div>'+
        
            '<div class="flex-col">'+
            '<h3 class="text-center">Largeur</h3>'+
                '<div class="flex justify-center">'+
                   `<input type="number" id="largeurP${i}" value="${results.rows.item(i).Largeur}" class="bg-gray-50 border w-full border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block py-3"/>`+
                '</div>'+
            '</div>'+    
            '<div class="flex-col">'+
            '<h3 class="text-center">Hauteur</h3>'+
                '<div class="flex justify-center">'+
                    `<input type="number" id="hauteurP${i}" value="${results.rows.item(i).Hauteur}" class="bg-gray-50 border w-full border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3"/>`+
                '</div>'+
            '</div>'+
            '<div class="flex-col">'+
            '<h3 class="text-center">Vol total</h3>'+
            '<div class="flex justify-center">'+
                `<input disabled type="number" id="volumeTotal${i}" value="${volume}" class="bg-gray-50 border w-full border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3"/>`+
            '</div>'+
            '</div>'+
        '</div>'+
            '<h2 class="text-center">Niveau isolation</h2>'+
            '<div class="flex justify-center">'+
                `<input type="number" id="isolation${i}" value="${results.rows.item(i).NivIsolation}" class="bg-gray-50 border  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3"/>`+
                `<div id="puissanceP${i}"></div>`+ //-- Div de Puissance P --//
            '</div>'+    
            '<br/>'+
            `<div class="hidden" id="indice${i}">${i}</div>`+
        '</form> ';
        
        form.appendChild(container);
        
        formContainer.insertBefore(form, btnCreation);
            }
        }, null);
    });
    
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
    
    setTimeout(() => {

    let btnCreation = document.getElementById('btncreation');
    let formContainer = document.getElementById('formContainer');
    let form = document.getElementById('form');
    let tb, tc;
    let deltaT;
    let i = memoryI;
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
    
        console.log(i);
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
        majDossier(idClient)
        alert("Votre piece à bien crée");
        loadAccueil();
    });
    
    btnRetour.addEventListener('click', function(){
        loadAccueil();
    });
    }, "1000")
}

//----------------------------------------------
//  FONCTIONS Base de données.
//----------------------------------------------
function creationDossier() {
      
    myDBKitadi.transaction(function (transaction) {
      var executeQuery =
        "INSERT INTO Client (Nom, Prenom, Adresse, CodPostal, Ville, Tel, Mail, Altitude, PuissanceMaison, DteVisite) VALUES (?,?,?,?,?,?,?,?,?,datetime('now','localtime'))";
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
          0,
          `${kwTotal}`,
        ],
        function (tx, result) {
          //   alert("Insertion OK !!!");
        },
        function (error) {
          console.log(
            "INSERTION CLIENT : Une erreur s'est produite !!! : " + error
          );
          console.log(error);
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
    if (idClient > 0) {
      for (let j = 0; j <= i; j++) {
  
        //-- Variables nom, volume etc --//
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
              reqNomPiece.value,
              reqLongueurP.value,
              reqLargeurP.value,
              reqHauteurP.value,
              reqVolumeP.value,
              reqTb.value,
              reqTc.value,
              reqG.value,
              reqPuissancePiece.value,
              idClient,
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
  
  function suppressionDossier(idClient) {
    // On n'exécute le code que si nous avons un idClient de renseigné
    if (`${idClient.value}` > 0) {
      console.log("ID Client à supprimer : " + idClient);
  
      // On supprime la(es) pièce(s) : On doit commencer par supprimer les pièces car la table contient la FOREIGN KEY de Client
      myDBKitadi.transaction(function (transaction) {
        var executeQuery = "DELETE FROM Pieces where Client_Id=?";
        transaction.executeSql(
          executeQuery,
          [idClient],
          function (tx, result) {
            console.log(
              "Suppression(s) réussie(s) pour la(es) pièce(s) du dossier : " +
              idClient
            );
  
            // On supprime le dossier Client
            var executeQuery = "DELETE FROM Client where Id=?";
            transaction.executeSql(
              executeQuery,
              [idClient],
              function (tx, result) {
                console.log(
                  "Suppression réussie pour le client, dossier : " +
                  idClient
                );
              },
              function (error) {
                alert(
                  "Une erreur s'est produite lors de la suppression du client, dossier : " +
                  idClient
                );
              }
            );
          },
          function (error) {
            alert(
              "Une erreur s'est produite lors de la suppression des pièces du dossier : " +
              idClient
            );
          }
        );
      });
    }
  }
  
  function majDossier(idClient) {
    // On n'exécute le code que si nous avons un IdClient de renseigné
    if (IdClient > 0) {
      console.log("ID Client à modifier : " + idClient);
  
      // On supprime ou non la(es) pièce(s) qui existe
      // Avec cette technique on traite tous les cas, les modif., les ajouts et les suppressions de pièces.
      myDBKitadi.transaction(function (transaction) {
        var executeQuery = "DELETE FROM Pieces where Client_Id=?";
        transaction.executeSql(
          executeQuery,
          [idClient],
          function (tx, result) {
            console.log(
              "MAJ - Suppression(s) réussie(s) pour la(es) pièce(s) du dossier : " +  idClient);
  
            // On injecte la nouvelle version des pièces
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
                    idClient,
                  ],
                  function (tx, result) {
                    console.log(
                      "MAJ - Insertion  réussie(s) pour la(es) pièce(s) du dossier : " + idClient);
                  },
                  function (error) {
                    alert("MAJ - Une erreur s'est produite lors de la suppression des pièces du dossier : " + idClient);
                  }
                );
              });
            }
  
            // On met à jour le dossier Client
            myDBKitadi.transaction(function (transaction) {
              var executeQuery =
                "UPDATE Client set Nom=?, Prenom=?, Adresse=?, CodPostal=?, Ville=?, Tel=?, Mail=?, HtMaison=?, Altitude=?, PuissanceMaison=?) where Id=?";
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
                  `${hauteurP.value}`,
                  null,
                  `${kwTotal}`,
                  idClient,
                ],
                function (tx, result) {
                  console.log(
                    "MAJ - Modification réussie pour le client, dossier : " +
                    idClient
                  );
                },
                function (error) {
                  alert(
                    "MAJ - Une erreur s'est produite lors de la modification du client, dossier : " +
                    idClient
                  );
                }
              );
            });
          },
          function (error) {
            alert(
              "MAJ - Une erreur s'est produite lors de la suppression des pièces du dossier : " +
              idClient
            );
          }
        );
      });
    }
  }
  