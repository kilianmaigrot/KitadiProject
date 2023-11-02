let body = document.getElementById('body');
let header = document.getElementById('header');
let main = document.getElementById('main');
let footer = document.getElementById('footer');
let kwTotal = 0


document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Ouverture de la base de données.
    myDBKitadi = window.sqlitePlugin.openDatabase({
        name: "Kitadi.db",
        location: "default",
    });
};

function loadDossier_Empty () {
header.innerHTML = `<div id="accordion-collapse" data-accordion="collapse">
<h2 id="accordion-collapse-heading-2">
  <button type="button" class="flex items-center justify-between w-full p-5 font-medium text-left text-gray-500 border border-b-0 border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800" data-accordion-target="#accordion-collapse-body-2" aria-expanded="false" aria-controls="accordion-collapse-body-2">
      <span>Informations client</span>
      <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
      </svg>
  </button>
</h2>
<div id="accordion-collapse-body-2" class="hidden" aria-labelledby="accordion-collapse-heading-2">
  <div class="p-5 border border-b-0 border-gray-200 dark:border-gray-700">
    <p class="mb-2 text-gray-500 dark:text-gray-400">
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

    
    </p>
  </div>
</div>
</div>`

main.innerHTML =

 '<div id="formContainer" class="text-center mt-4">' + 
    '<div id="form"></div>' +
    '<button id="btncreation" type="button" class="text-white overflow-y-auto bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">Créer une pièce</button>' +
'</div>';

footer.innerHTML = `<div id="total" class="border bg-slate-500 text-center"></div>`+
`<footer class="sticky bottom-0 left-0 z-20 w-full p-4 bg-white border-t border-gray-200 shadow md:flex md:items-center md:justify-between md:p-6">
    
    <ul class="flex flex-wrap p-4 justify-around items-center mt-3 text-xl font-medium text-gray-500 sm:mt-0">
        <li>
            <button id="btnSave" class="border rounded text-red-50 px-6 bg-lime-400">Sauvegarder</button>
        </li>
        <li>
            <button id="btnRetour" class="bg-red-700 text-red-50  px-6 border rounded">Retour</button>
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


// nomClient.addEventListener('change', function(){
//     console.log('Nom client '+nomClient.value);
// });

// prenomClient.addEventListener('change', function(){
//     console.log('prenom client '+prenomClient.value);
// });

// adresseClient.addEventListener('change', function(){
//     console.log('adresse client '+adresseClient);
// });

// codePostal.addEventListener('change', function(){
//     console.log('code postal '+codePostal.value);
// });

// villeClient.addEventListener('change', function(){
//     console.log('ville '+villeClient.value);
// });

// telClient.addEventListener('change', function(){
//     console.log('telephone '+telClient.value);
// });

// mailClient.addEventListener('change', function(){
//     console.log('mail '+mailClient.value);
// });

btnCreation.addEventListener('click', function(){

    i++

    let container = document.createElement('div');

    container.innerHTML = '<form class="overflow-y-auto">' +
    '<div class="flex flex-col justify-center">'+
        '<h2 class="text-center">Nom de la pièce</h2>'+
        `<input type="text" id="nomPiece${i}"  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"/>`+
    '</div>' + 

    '<div class="flex justify-center">'+
        '<div class="flex-col">'+
    '<h2 class="text-center">Température de base</h2>'+
            `<input type="number" id="tempBase${i}" class="bg-gray-50 border items-center  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"/>`+
        '</div>'+
        '<div class="flex-col">'+
    '<h2 class="text-center">Température de confort</h2>'+
            `<input type="number" id="tempConfort${i}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"/>`+
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
    '<h3 class="text-center">Volume total</h3>'+
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



nomPiece.addEventListener('change', function(){
    console.log('nom piece '+nomPiece.value);
});

tb.addEventListener('change', function(){
    
    console.log(tb.value);
    updateDeltaT();
    puissanceP(indicePuissance);
    
});

tc.addEventListener('change', function(){
    console.log(tc.value);
    updateDeltaT();
    puissanceP(indicePuissance);
    
    
});

longueurP.addEventListener('change', function(){
    console.log(longueurP.value);
    puissanceP(indicePuissance);
    
    
});
largeurP.addEventListener('change', function(){
    console.log(largeurP.value);
    puissanceP(indicePuissance);
    
    
    
});
hauteurP.addEventListener('change', function(){
    console.log(hauteurP.value);
    updateVolume();
    puissanceP(indicePuissance);
    
    
});

g.addEventListener('change', function(){
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
        
        totalDiv.innerHTML = `${kwTotal}`;
        
        
        
    }};
});
}

btnSave.addEventListener('click', function(){
    creationDossier_Client()
    creationDossier_Pieces ()
});

function creationDossier_Client() {
    const dateToday = new Date();
    // On fait le client
    alert("Fonction lancée")
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
                `${hauteurP.value}`,
                null,
                `${kwTotal}`,
                `${dateToday}`,
            ],
            function (tx, result) {
                alert("Insertion OK !!!");
            },
            function (error) {
                alert("Une erreur s'est produite !!! : " + error);
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
                        idMax = results.rows.items(0).MaxId;
                    }
                },
                function (error) {
                    console.log("Erreur, base non dsponible.");
                }
                );
            });
            
        }
        
function creationDossier_Pieces () {
    
    // On insert les pi�ces si l'idMax (Id client) est sup�rieur � 0
    if(idMax > 0) {
        for (let j = 0; j < i; j++) {
            
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
                "INSERT INTO Piece (INSERT INTO Piece (LibellePiece, Longueur, Largeur, Hauteur, Volume, TempBase, TempConfort, NivIsolation, PuissancePiece, Client_Id) VALUES (?,?,?,?,?,?,?,?,?,?)";
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
                        `${idMax}`,
                    ],
                    function (tx, result) {
                        alert("Insertion OK !!!");
                    },
                    function (error) {
                        alert("Une erreur s'est produite !!!");
                    }
                    );
                });
            }
        }
    }