// Note Pour sasha:
// Page d'accueil opérationnel
// création opérationnel
// Suppression et mise à jour du client dans une prochaine version car pas le temps.
// application testé sur android pixel 7.

let main = document.getElementById("main");
let header = document.getElementById("header");
let footer = document.getElementById("footer");
let kwTotal = 0;
let editDossierButtons = [];
let deleteDossierButtons = [];
let memoryI = 0;
let numberPiece = 0;

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  console.log(navigator.notification);
  // Ouverture de la base de données.
  myDBKitadi = window.sqlitePlugin.openDatabase({
    name: "Kitadi.db",
    location: "default",
  });

  //   // Suppression de la table Client
  //   myDBKitadi.transaction(function (transaction) {
  //     transaction.executeSql(
  //       "DROP TABLE IF EXISTS Client",
  //       [],
  //       function (tx, result) {
  //         alert("La Table Client a été supprimée : " + result);
  //       },
  //       function (error) {
  //         alert("Une erreur s'est produite à la suppression de la table Client : " + error);
  //       }
  //     );
  //   });

  //   // Suppression de la table Piece
  //   myDBKitadi.transaction(function (transaction) {
  //     transaction.executeSql(
  //       "DROP TABLE IF EXISTS Piece",
  //       [],
  //       function (tx, result) {
  //         alert("La Table piece a été supprimée : " + result);
  //       },
  //       function (error) {
  //         alert("Une erreur s'est produite à la suppresson de la table Piece : " + error);
  //       }
  //     );
  //   });

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

//----------------------------------------------
//  GESTION des pages
//----------------------------------------------
function loadAccueil() {
  header.innerHTML = "";
  footer.innerHTML = "";

  main.innerHTML = `
    <main class="flex flex-col p-4 min-h-screen text-lime-900 font-semibold text-base md:text-2xl">
    <img class="mx-auto mb-8" src="./img/KitadiLogo.png" />
    <h1 class="text-center mb-8">Bienvenue sur l'application Kitadi Energies de calcul de la puissance énergétique d'une Maison.</h1>
    <button id="btnNewDossier" class="bg-gray-700 text-gray-400 font-bold py-2 px-4 rounded mb-8">
    Créer un nouveau dossier de calcul
    </button>
    <div class="relative overflow-x-auto">
    <table class="w-full text-sm md:text-2xl text-gray-400 text-center bg-slate-400 bg-opacity-30">
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

function loadTable() {
  let tableProjets = document.getElementById("tableProjets");
  tableProjets.innerHTML = "";
  myDBKitadi.transaction(function (transaction) {
    transaction.executeSql(
      "SELECT Id, Nom, Prenom, Adresse, CodPostal, Ville, PuissanceMaison, STRFTIME('%d/%m/%Y %H:%M:%S',DteVisite) as DteVisite FROM Client ORDER BY DteVisite DESC",
      [],
      function (tx, results) {
        let len = results.rows.length,
          i;
        for (i = 0; i < len; i++) {
          tableProjets.innerHTML += `
                  <tr id="${results.rows.item(i).Id}">
                      <td>${results.rows.item(i).Nom.toUpperCase()} ${
            results.rows.item(i).Prenom
          }</td>
                      <td>${results.rows.item(i).PuissanceMaison}</td>
                      <td>${results.rows.item(i).DteVisite}</td>
                      <td><button class="btnEditerDossier"><i class="fa-solid fa-pen-to-square text-3xl mx-4 text-lime-200"></i></td>
                      <td><button class="btnSupprimerDossier"><i class="fa-solid fa-trash-can text-3xl text-red-800"></i></td>
                  </tr>`;
        }
        setTimeout(() => {
          for (i = 0; i < len; i++) {
            let idClientRow = results.rows.item(i).Id;
            let nomDossier = results.rows.item(i).Nom.toUpperCase();
            let prenomDossier = results.rows.item(i).Prenom;
            editDossierButtons =
              document.getElementsByClassName("btnEditerDossier");
            deleteDossierButtons = document.getElementsByClassName(
              "btnSupprimerDossier"
            );
            editDossierButtons[i].addEventListener("click", function () {
              // alert("Edition du dossier");
              loadOldDossier(idClientRow);
            });

            deleteDossierButtons[i].addEventListener("click", function () {
              const confirmation = confirm(
                `Confirmez vous la suppression du dossier ${nomDossier} ${prenomDossier} ?`
              );
              if (confirmation) {
                // alert("Suppression du dossier " + idClientRow);
                suppressionDossier(idClientRow);
                setTimeout(() => {
                  loadAccueil();
                }, "1500");
              } else {
                return;
              }
            });
          }
        }, "1500");
      },
      null
    );
  });
}

function loadDossier() {
  header.innerHTML = `
<div class="accordion">
  <input type="checkbox" id="section1" class="accordion-input">
  <label for="section1" class="accordion-header">Informations client <i class="fa-solid fa-arrow-down"></i></label>
  <div class="accordion-content">
  <div class="flex flex-col text-center border-4 bg-gray-600 opacity-95 rounded-e-md border-white text-white p-4">
        <h3>Nom</h3>
        <input type="text" id="nomClient"  class="input-field bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
        <h3>Prénom</h3>
        <input type="text" id="prenomClient"  class="input-field bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
        <h3>Adresse</h3>
        <input type="text" id="adresseClient"  class="input-field bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
        <h3>Code Postal</h3>
        <input type="text" id="codePostal"  class="input-field bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
        <h3>Ville</h3>
        <input type="text" id="villeClient"  class="input-field bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
        <h3>Téléphone</h3>
        <input type="text" id="telClient"  class="input-field bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
        <h3>e-mail</h3>
        <input type="text" id="mailClient"  class="input-field bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
    </div>
    </div>
</div>`;

  main.innerHTML = `<div id="formContainer" class="text-center mt-4">
    <div id="form"></div>
    <button id="btncreation" type="button" class="text-white overflow-y-auto bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">Créer une pièce</button>
    </div>`;

  footer.innerHTML = footer.innerHTML =
    `<div id="total" class="flex justify-center items-center border mx-auto w-full h-20 bg-slate-500 text-white text-center">Puissance Total</div>` +
    `<footer class="sticky bottom-0 left-0 z-20 w-full p-4 bg-white border-t border-gray-200 shadow md:flex md:items-center md:justify-between md:p-6">
      
      <ul class="flex flex-wrap p-4 justify-around items-center mt-3 text-xl font-medium text-gray-500 sm:mt-0">
          <li>
              <button id="btnSave" class="border rounded text-red-50 px-6 bg-lime-400">Sauvegarder</button>
          </li>
          <li>
              <button id="btnRetour" class="text-red-50 bg-sky-500 px-6 border rounded">Retour</button>
          </li>
      </ul>
  </footer>`;

  setTimeout(() => {
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

    //-- Bouton RETOUR --//
    btnRetour.addEventListener("click", function () {
      const confirmation = confirm(
        `Vos données ne seront pas sauvegardées. Voulez-vous retourner à l'accueil ?`
      );
      if (confirmation) {
        loadAccueil();
      } else {
        return;
      }
    });

    btnCreation.addEventListener("click", function () {
      i++;

      let container = document.createElement("div");

      container.innerHTML =
        `<form id="container${i}" class="border-4 bg-gray-600 opacity-95 rounded-e-md border-white mx-2 mt-2 mb-2 pieceForm text-white">` +
        '<div class="flex flex-col justify-center">' +
        '<h2 class="text-center">Nom de la pièce</h2>' +
        `<input type="text" id="nomPiece${i}"  class="bg-gray-50 border mx-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"/>` +
        "</div>" +
        '<div class="flex justify-around">' +
        '<div class="flex-col">' +
        '<h2 class="text-center ml-8">Temp de base</h2>' +
        `<input type="number" id="tempBase${i}" class="bg-gray-50 border items-center w-24 ml-10 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"/>` +
        "</div>" +
        '<div class="flex-col">' +
        '<h2 class="text-center ml-8">Temp de confort</h2>' +
        `<input type="number" id="tempConfort${i}" class="bg-gray-50 border w-24 ml-10 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"/>` +
        "</div>" +
        `<div id="deltaT${i}"></div>` + //-- Calcul des temperatures --//
        "</div>" +
        '<h2 class="text-center mt-2">Dimensions (en mètre)</h2>' +
        '<div class="flex mx-2">' +
        '<div class="flex-col">' +
        '<h3 class="text-center">Longueur</h3>' +
        '<div class="flex justify-around">' +
        `<input type="number" id="longueurP${i}" class="bg-gray-50 border w-full mx-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3"/>` +
        "</div>" +
        "</div>" +
        '<div class="flex-col">' +
        '<h3 class="text-center">Largeur</h3>' +
        '<div class="flex justify-center">' +
        `<input type="number" id="largeurP${i}" class="bg-gray-50 border w-full mx-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block py-3"/>` +
        "</div>" +
        "</div>" +
        '<div class="flex-col">' +
        '<h3 class="text-center">Hauteur</h3>' +
        '<div class="flex justify-center">' +
        `<input type="number" id="hauteurP${i}" class="bg-gray-50 border w-full mx-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3"/>` +
        "</div>" +
        "</div>" +
        `<div id="volumeTotal${i}"> 
        </div>` +
        "</div>" +
        '<h2 class="text-center">Niveau isolation</h2>' +
        '<div class="flex justify-center">' +
        `<input type="number" id="isolation${i}" class="bg-gray-50 border  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3"/>` +
        "</div>" +
        `<div class="flex justify-center items-center">
        <div id="puissanceP${i}" class="flex justify-center mr-12 items-center border mx-auto mt-2 mb-2 w-1/2 h-10 bg-slate-500 text-white text-center">Watts</div>
        <div id="btnSupprPiece${i}"><i class=" mt-6 mr-6 fa-solid fa-trash-can fa-xl" style="color: #ed0c0c;"></i></div>` + //-- Div de Puissance P --//
        "</div>" +
        `<div class="hidden" id="indice${i}">${i}</div>` +
        "</form> ";


      form.appendChild(container);

      formContainer.insertBefore(form, btnCreation); //-- Position du bouton "créer" vers le bas --//

      //-- Variables températures --//indicePuissanceif (con)
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
      let btnSupprPiece = document.getElementById(`btnSupprPiece${i}`);

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
        if (indice != -1) {
          puissancePiece.value =
            g.value * volumeP.value * (tb.value - tc.value);
          puissancePiece.innerHTML = puissancePiece.value + " Watts";
          console.log(puissancePiece.value);
          puissancePieces[indice] = puissancePiece.value;
          console.log(puissancePieces);
        }

        kwTotal = 0;

        for (j = 0; j < puissancePieces.length; j++) {
          kwTotal += parseFloat = puissancePieces[j];
          console.log("kw total calculé : " + kwTotal);
          let totalDiv = document.getElementById("total");

          totalDiv.innerHTML = `${kwTotal}` + " Watts";
        }

        console.log(
          "kw total calculé sortie de boucle newDossier : " + kwTotal
        );
      }

      //-- BOUTON DE SUPPRESSION D'UNE SEULE PIECE --//
      btnSupprPiece.addEventListener("click", function () {
        const confirmation = confirm(
          "Voulez-vous vraiment supprimer cette pièce?"
        );

        if (confirmation) {
          // let supprTotal = kwTotal - puissancePiece.value;
          // totalDiv.innerHTML = supprTotal;
          console.log("Indice puissance = " + indicePuissance);
          puissancePieces[indicePuissance] = 0;
          container.setAttribute("style", "display: none");
          container.children[0].classList.add("pieceSuppr");
          puissanceP(-1);
        } else {
          return;
        }
      });
    });

    btnSave.addEventListener("click", function () {
      creationDossier();
      alert("Votre client à bien été crée");
      setTimeout(() => {
        loadAccueil();
      }, 1000);
    });
  });
}

function loadOldDossier(idClient) {
  let puissancePieces = [];

  myDBKitadi.transaction(function (transaction) {
    transaction.executeSql(
      `SELECT * FROM Client WHERE Id = ${idClient}`,
      [],
      function (tx, results) {
        let len = results.rows.length,
          i;
        for (i = 0; i < len; i++) {
          header.innerHTML = `
              <div class="accordion">
                <input type="checkbox" id="section1" class="accordion-input">
                <label for="section1" class="accordion-header">Informations client <i class="fa-solid fa-arrow-down"></i></label>
                <div class="accordion-content">
                <div class="flex flex-col text-center border-4 bg-gray-600 opacity-95 rounded-e-md border-white p-4 text-white">
                      <h3>Nom</h3>
                      <input type="text" id="nomClient"  value="${results.rows
                        .item(i)
                        .Nom.toUpperCase()}"  class="input-field bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
                      <h3>Prénom</h3>
                      <input type="text" id="prenomClient"  value="${
                        results.rows.item(i).Prenom
                      }" class="input-field bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
                      <h3>Adresse</h3>
                      <input type="text" id="adresseClient" value="${
                        results.rows.item(i).Adresse
                      }" class="input-field bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
                      <h3>Code Postal</h3>
                      <input type="text" id="codePostal" value="${
                        results.rows.item(i).CodPostal
                      }" class="input-field bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
                      <h3>Ville</h3>
                      <input type="text" id="villeClient" value="${
                        results.rows.item(i).Ville
                      }" class="input-field bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
                      <h3>Téléphone</h3>
                      <input type="text" id="telClient" value="${
                        results.rows.item(i).Tel
                      }" class="input-field bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
                      <h3>e-mail</h3>
                      <input type="text" id="mailClient" value="${
                        results.rows.item(i).Mail
                      }" class="input-field bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
                  </div>
                  </div>
              </div>`;
        }
      },
      null
    );
  });

  main.innerHTML =
    '<div id="formContainer" class="text-center mt-4">' +
    '<div id="form"></div>' +
    '<button id="btncreation" type="button" class="text-white overflow-y-auto bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">Créer une pièce</button>' +
    "</div>";

  let formContainer = document.getElementById("formContainer");
  let form = document.getElementById("form");

  myDBKitadi.transaction(function (transaction) {
    transaction.executeSql(
      `SELECT * FROM Piece WHERE Client_Id = ?`,
      [idClient],
      function (tx, results) {
        let len = results.rows.length,
          i;
        memoryI = len;
        for (i = 0; i < len; i++) {
          let container = document.createElement("div");

          container.innerHTML =
            `<form id="container${i}" class="border-4 bg-gray-600 opacity-95 rounded-e-md border-white mx-2 mt-2 mb-2 pieceForm text-white">` +
            '<div class="flex flex-col justify-center">' +
            '<h2 class="text-center">Nom de la pièce</h2>' +
            `<input type="text" id="nomPiece${i}" value="${
              results.rows.item(i).LibellePiece
            }" class="bg-gray-50 border border-gray-300 mx-2 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"/>` +
            "</div>" +
            '<div class="flex justify-center">' +
            '<div class="flex-col">' +
            '<h2 class="text-center ml-6">Temp de base</h2>' +
            `<input type="number" id="tempBase${i}" value="${
              results.rows.item(i).TempBase
            }" class="bg-gray-50 border items-center w-24 ml-8 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"/>` +
            "</div>" +
            '<div class="flex-col">' +
            '<h2 class="text-center ml-6">Temp de confort</h2>' +
            `<input type="number" id="tempConfort${i}" value="${
              results.rows.item(i).TempConfort
            }" class="bg-gray-50 border w-24 border-gray-300 ml-8 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"/>` +
            "</div>" +
            `<div id="deltaT${i}"></div>` + //-- Calcul des temperatures --//
            "</div>" +
            '<h2 class="text-center mt-2">Dimensions (en mètre)</h2>' +
            '<div class="flex justify-center max-w-full mx-2">' +
            '<div class="flex-col">' +
            '<h3 class="text-center">Longueur</h3>' +
            '<div class="flex justify-center">' +
            `<input type="number" id="longueurP${i}" value="${
              results.rows.item(i).Longueur
            }" class="bg-gray-50 border w-full mx-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3"/>` +
            "</div>" +
            "</div>" +
            '<div class="flex-col">' +
            '<h3 class="text-center">Largeur</h3>' +
            '<div class="flex justify-center">' +
            `<input type="number" id="largeurP${i}" value="${
              results.rows.item(i).Largeur
            }" class="bg-gray-50 border w-full mx-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block py-3"/>` +
            "</div>" +
            "</div>" +
            '<div class="flex-col">' +
            '<h3 class="text-center">Hauteur</h3>' +
            '<div class="flex justify-center">' +
            `<input type="number" id="hauteurP${i}" value="${
              results.rows.item(i).Hauteur
            }" class="bg-gray-50 border w-full mx-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3"/>` +
            "</div>" +
            "</div>" +
            `<div id="volumeTotal${i}"> 
                  </div>` +
            "</div>" +
            '<h2 class="text-center">Niveau isolation</h2>' +
            '<div class="flex justify-center">' +
            `<input type="number" id="isolation${i}" value="${
              results.rows.item(i).NivIsolation
            }" class="bg-gray-50 border  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3"/>` +
            "</div>" +
            `<div class="flex justify-center items-center">
                  <div id="puissanceP${i}" class="flex justify-center mr-12 items-center border mx-auto mt-2 mb-2 w-1/2 h-10 bg-slate-500 text-white text-center">Watts</div>
                  <div id="btnSupprPiece${i}"><i class=" mt-6 mr-6 fa-solid fa-trash-can fa-xl" style="color: #ed0c0c;"></i></div>` + //-- Div de Puissance P --//
            "</div>" +
            `<div class="hidden" id="indice${i}">${i}</div>` +
            "</form> ";

          form.appendChild(container);

          // formContainer.insertBefore(form, btnCreation);
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
          let totalDiv = document.getElementById("total");
          let btnSupprPiece = document.getElementById(`btnSupprPiece${i}`);

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
            if (indice != -1) {
              puissancePiece.value =
                g.value * volumeP.value * (tb.value - tc.value);
              puissancePiece.innerHTML = puissancePiece.value + " Watts";
              console.log(puissancePiece.value);
              puissancePieces[indice] = puissancePiece.value;
              console.log(puissancePieces);
            }

            //-- APPARITION DU TOTAL D'UNE PIECE DANS  LA CASE --//
            kwTotal = 0;

            for (j = 0; j < puissancePieces.length; j++) {
              console.log(puissancePieces[j]);
              kwTotal += parseInt(puissancePieces[j]);
              console.log("kw total calculé : " + kwTotal);
              totalDiv = document.getElementById("total");

              totalDiv.innerHTML = `${kwTotal} Watts`;
            }
            console.log(
              "kw total calculé sortie de boucle oldDossier - vieilles div : " +
                kwTotal
            );
          }

          //-- BOUTON DE SUPPRESSION D'UNE SEULE PIECE --//
          btnSupprPiece.addEventListener("click", function () {
            const confirmation = confirm(
              "Voulez-vous vraiment supprimer cette pièce?"
            );

            if (confirmation) {
              // let supprTotal = kwTotal - puissancePiece.value;
              // totalDiv.innerHTML = supprTotal;
              console.log("Indice puissance = " + indicePuissance);
              puissancePieces[indicePuissance] = 0;
              container.setAttribute("style", "display: none");
              container.children[0].classList.add("pieceSuppr");
              puissanceP(-1);
            } else {
              return;
            }
          });

          setTimeout(() => {
            updateDeltaT();
            updateVolume();
            puissanceP(indicePuissance);
          }, 1000);
        }
        i = i - 1;
        console.log("Valeur de I en sortie de for des pieces = " + i);
      },
      null
    );
  });

  footer.innerHTML =
    `<div id="total" class="flex justify-center items-center border mx-auto w-full h-20 bg-slate-500 text-white text-center">Puissance Total</div>` +
    `<footer class="sticky bottom-0 left-0 z-20 w-full p-4 bg-white border-t border-gray-200 shadow md:flex md:items-center md:justify-between md:p-6">
      
      <ul class="flex flex-wrap p-4 justify-around items-center mt-3 text-xl font-medium text-gray-500 sm:mt-0">
          <li>
              <button id="btnSave" class="border rounded text-red-50 px-6 bg-lime-400">Sauvegarder</button>
          </li>
          <li>
              <button id="btnRetour" class="text-red-50 bg-sky-500 px-6 border rounded">Retour</button>
          </li>
      </ul>
  </footer>`;

  setTimeout(() => {
    let btnCreation = document.getElementById("btncreation");
    let tb, tc;
    let deltaT;
    let i = memoryI - 1;

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

    //-- Bouton RETOUR --//
    btnRetour.addEventListener("click", function () {
      const confirmation = confirm(
        `Si vous avez fait des modifications, celle-ci ne seront pas pris en compte. Voulez-vous retourner à l'accueil ?`
      );
      if (confirmation) {
        loadAccueil();
      } else {
        return;
      }
    });

    btnCreation.addEventListener("click", function () {
      console.log("Valeur de I au lancement d'une nouvelle pièce = " + i);

      i++;

      let container = document.createElement("div");

      container.innerHTML =
      `<form id="container${i}" class="border-4 bg-gray-600 opacity-95 rounded-e-md border-white mx-2 mt-2 mb-2 pieceForm text-white">` +
      '<div class="flex flex-col justify-center">' +
      '<h2 class="text-center">Nom de la pièce</h2>' +
      `<input type="text" id="nomPiece${i}"  class="bg-gray-50 border mx-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"/>` +
      "</div>" +
      '<div class="flex justify-center">' +
      '<div class="flex-col">' +
      '<h2 class="text-center">Temp de base</h2>' +
      `<input type="number" id="tempBase${i}" class="bg-gray-50 border items-center w-24 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"/>` +
      "</div>" +
      '<div class="flex-col">' +
      '<h2 class="text-center">Temp de confort</h2>' +
      `<input type="number" id="tempConfort${i}" class="bg-gray-50 border w-24 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"/>` +
      "</div>" +
      `<div id="deltaT${i}"></div>` + //-- Calcul des temperatures --//
      "</div>" +
      '<h2 class="text-center mt-2">Dimensions (en mètre)</h2>' +
      '<div class="flex justify-center max-w-full mx-2">' +
      '<div class="flex-col">' +
      '<h3 class="text-center">Longueur</h3>' +
      '<div class="flex justify-center">' +
      `<input type="number" id="longueurP${i}" class="bg-gray-50 border w-full mx-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3"/>` +
      "</div>" +
      "</div>" +
      '<div class="flex-col">' +
      '<h3 class="text-center">Largeur</h3>' +
      '<div class="flex justify-center">' +
      `<input type="number" id="largeurP${i}" class="bg-gray-50 border w-full mx-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block py-3"/>` +
      "</div>" +
      "</div>" +
      '<div class="flex-col">' +
      '<h3 class="text-center">Hauteur</h3>' +
      '<div class="flex justify-center">' +
      `<input type="number" id="hauteurP${i}" class="bg-gray-50 border w-full mx-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3"/>` +
      "</div>" +
      "</div>" +
      `<div id="volumeTotal${i}"> 
    </div>` +
      "</div>" +
      '<h2 class="text-center">Niveau isolation</h2>' +
      '<div class="flex justify-center">' +
      `<input type="number" id="isolation${i}" class="bg-gray-50 border  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3"/>` +
      "</div>" +
      `<div class="flex justify-center items-center">
    <div id="puissanceP${i}" class="flex justify-center mr-12 items-center border mx-auto mt-2 w-1/2 h-10 mb-2 bg-slate-500 text-white text-center">Watts</div>
    <div id="btnSupprPiece${i}"><i class=" mt-6 mr-6 fa-solid fa-trash-can fa-xl" style="color: #ed0c0c;"></i></div>` + //-- Div de Puissance P --//
      "</div>" +
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
      let totalDiv = document.getElementById("total");
      let btnSupprPiece = document.getElementById(`btnSupprPiece${i}`);

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
        if (indice != -1) {
          puissancePiece.value =
            g.value * volumeP.value * (tb.value - tc.value);
          puissancePiece.innerHTML = puissancePiece.value + " Watts";
          console.log(puissancePiece.value);
          puissancePieces[indice] = puissancePiece.value;
          console.log(puissancePieces);
        }

        //-- APPARITION DU TOTAL D'UNE PIECE DANS  LA CASE --//
        kwTotal = 0;

        for (j = 0; j < puissancePieces.length; j++) {
          console.log(puissancePieces[j]);
          kwTotal += parseInt(puissancePieces[j]);
          console.log("kw total calculé : " + kwTotal);
          totalDiv = document.getElementById("total");

          totalDiv.innerHTML = `${kwTotal} Watts`;
        }
        console.log(
          "kw total calculé sortie de boucle oldDossier - nouvelle div : " +
            kwTotal
        );
      }

      //-- BOUTON DE SUPPRESSION D'UNE SEULE PIECE --//
      btnSupprPiece.addEventListener("click", function () {
        const confirmation = confirm(
          "Voulez-vous vraiment supprimer cette pièce?"
        );

        if (confirmation) {
          // let supprTotal = kwTotal - puissancePiece.value;
          // totalDiv.innerHTML = supprTotal;
          console.log("Indice puissance = " + indicePuissance);
          puissancePieces[indicePuissance] = 0;
          container.setAttribute("style", "display: none");
          container.children[0].classList.add("pieceSuppr");
          puissanceP(-1);
        } else {
          return;
        }
      });
    });

    btnSave.addEventListener("click", function () {
      numberOfPiece();
      console.log("Puissance totale avant appel MAJ = " + kwTotal);
      setTimeout(() => {
        majDossier(idClient, numberPiece);
      }, 1000);
      alert("Les modifications ont bien été sauvegardées");
      setTimeout(() => {
        loadAccueil();
      }, 1000);
    });
  }, "1000");
}

//----------------------------------------------
//  FONCTIONS Base de données.
//----------------------------------------------
function creationDossier() {
  // On insere le client dans la table client
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
        console.log("CREATION DOSSIER CLIENT - Insertion dossier/client OK.");
      },
      function (error) {
        console.log("CREATION DOSSIER CLIENT - Une erreur s'est produite a la creation du dossier/client : " + error);
      }
    );
  });

  // On va rechercher le dernier max ID creer dans la table Client
  let idMax = 0;
  myDBKitadi.transaction(function (transaction) {
    transaction.executeSql(
      "SELECT Max(Id) as MaxId FROM Client",
      [],
      function (tx, results) {
        if (results.rows.length != 0) {
          numberOfPiece();
          creationPieceDossier(results.rows.item(0).MaxId, numberPiece);
        }
      },
      function (error) {
        console.log("CREATION DOSSIER CLIENT - Erreur, dans la récupération de l'id dossier.");
      }
    );
  });
}

function creationPieceDossier(idClient, nbPiece) {
  // On insert les pieces si l'idClient est superieur a 0
  if (idClient > 0) {
    for (let j = 0; j < nbPiece; j++) {
      //-- Variables nom, volume etc --//
      let reqContainer = document.getElementById(`container${j}`);
      let reqNomPiece = document.getElementById(`nomPiece${j}`);
      let reqLongueurP = document.getElementById(`longueurP${j}`);
      let reqLargeurP = document.getElementById(`largeurP${j}`);
      let reqHauteurP = document.getElementById(`hauteurP${j}`);
      let reqVolumeP = document.getElementById(`volumeTotal${j}`);
      let reqTb = document.getElementById(`tempBase${j}`);
      let reqTc = document.getElementById(`tempConfort${j}`);
      let reqG = document.getElementById(`isolation${j}`);
      let reqPuissancePiece = document.getElementById(`puissanceP${j}`);

        // On insere uniquement les pieces qui ne sont pas tagué "pieceSuppr"
      if (!reqContainer.classList.contains("pieceSuppr")) {
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
              reqVolumeP.innerHTML,
              reqTb.value,
              reqTc.value,
              reqG.value,
              reqPuissancePiece.value,
              idClient,
            ],
            function (tx, result) {
              console.log("CREATION PIECE DOSSIER - Insertion Pièce OK, dossier/client : " + idClient + " Piece numero : " + j);
            },
            function (error) {
              console.log("CREATION PIECE DOSSIER - Une erreur s'est produite, dossier/client : " + idClient + " Piece numero : " + j);
            }
          );
        });
      }
    }
  }
}

function suppressionDossier(idClient) {
  // On n'exécute le code que si nous avons un idClient de renseigné
  if (`${idClient}` > 0) {
    // On supprime la(es) pièce(s) : On doit commencer par supprimer les pièces car la table contient la FOREIGN KEY de Client
    myDBKitadi.transaction(function (transaction) {
      var executeQuery = "DELETE FROM Piece where Client_Id=?";
      transaction.executeSql(
        executeQuery,
        [idClient],
        function (tx, result) {
          console.log("SUPPRESSION - Suppression(s) réussie(s) pour la(es) pièce(s) du dossier/client : " + idClient);

          // On supprime le dossier Client
          var executeQuery = "DELETE FROM Client where Id=?";
          transaction.executeSql(
            executeQuery,
            [idClient],
            function (tx, result) {
              console.log("SUPPRESSION - Suppression réussie pour le dossier/client : " + idClient);
            },
            function (error) {
              console.log("SUPPRESSION - Une erreur s'est produite lors de la suppression du client/dossier : " + idClient);
            }
          );
        },
        function (error) {
          console.log("SUPPRESSION - Une erreur s'est produite lors de la suppression des pièces du dossier : " + idClient);
        }
      );
    });
  }
}

function majDossier(idClient, nbPiece) {
  // On n'exécute le code que si nous avons un IdClient de renseigné
  if (idClient > 0) {
    // On supprime ou non la(es) pièce(s) qui existe
    // Avec cette technique on traite tous les cas, les modif., les ajouts et les suppressions de pièces.
    myDBKitadi.transaction(function (transaction) {
      var executeQuery = "DELETE FROM Piece where Client_Id=?";
      transaction.executeSql(
        executeQuery,
        [idClient],
        function (tx, result) {
          console.log("MAJ - Suppression(s) réussie(s) pour la(es) pièce(s) du client/dossier : " + idClient);

          // On injecte la nouvelle version des pièces
          for (let j = 0; j < nbPiece; j++) {
            //-- Variables nom, volume ect --//
            let reqContainer = document.getElementById(`container${j}`);
            let reqNomPiece = document.getElementById(`nomPiece${j}`);
            let reqLongueurP = document.getElementById(`longueurP${j}`);
            let reqLargeurP = document.getElementById(`largeurP${j}`);
            let reqHauteurP = document.getElementById(`hauteurP${j}`);
            let reqVolumeP = document.getElementById(`volumeTotal${j}`);
            let reqTb = document.getElementById(`tempBase${j}`);
            let reqTc = document.getElementById(`tempConfort${j}`);
            let reqG = document.getElementById(`isolation${j}`);
            let reqPuissancePiece = document.getElementById(`puissanceP${j}`);

            // On insere uniquement les pieces qui ne sont pas tagué "pieceSuppr"
            if (!reqContainer.classList.contains("pieceSuppr")) {
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
                    `${reqVolumeP.innerHTML}`,
                    `${reqTb.value}`,
                    `${reqTc.value}`,
                    `${reqG.value}`,
                    `${reqPuissancePiece.value}`,
                    idClient,
                  ],
                  function (tx, result) {
                    console.log("MAJ - Insertion  réussie(s) pour la(es) pièce(s) du client/dossier : " + idClient + " Piece numero : " + j);
                  },
                  function (error) {
                    console.log("MAJ - Une erreur s'est produite lors de la suppression des pièces du client/dossier : " + idClient + " Piece numero : " + j);
                  }
                );
              });
            }
          }

          // On met à jour le dossier Client
          myDBKitadi.transaction(function (transaction) {
            console.log("kwTotal : " + kwTotal);
            var executeQuery =
              "UPDATE Client set Nom=?, Prenom=?, Adresse=?, CodPostal=?, Ville=?, Tel=?, Mail=?, Altitude=?, PuissanceMaison=? where Id=?";
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
                null,
                `${kwTotal}`,
                idClient,
              ],
              function (tx, result) {
                console.log("MAJ - Modification réussie pour le client, client/dossier : " + idClient);
              },
              function (error) {
                console.log("MAJ - Une erreur s'est produite lors de la modification du client, client/dossier : " + idClient);
              }
            );
          });
        },
        function (error) {
          console.log("MAJ - Une erreur s'est produite lors de la suppression des pièces du client/dossier : " + idClient);
        }
      );
    });
  }
}


// Nous retourne le nombre de pièce du dossier encours (Modif. ou creation)
function numberOfPiece() {
  let piecesArrayForSum = document.getElementsByClassName("pieceForm");
  numberPiece = piecesArrayForSum.length;
  console.log("numberofPiece retour = " + numberPiece);
}
