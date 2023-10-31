let pageBody = document.getElementById("body")

document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {

    myDBFormation = window.sqlitePlugin.openDatabase({ name: "Plombiers.db", location: 'default' });

}

function loadAccueil () {

    pageBody.innerHTML = `
    <main class="flex flex-col p-4 bg-slate-300 min-h-screen text-lime-900 font-semibold text-base md:text-2xl">
        <img class="mx-auto mb-8" src="./img/KitadiLogo.png" />
        <h1 class="text-center mb-8">Bienvenue sur l'application Kitadi Energies de calcul de la puissance énergétique d'une Maison.</h1>
        <button class="bg-slate-400 font-bold py-2 px-4 rounded mb-8">
            Créer un nouveau dossier de calcul
        </button>
        <div class="relative overflow-x-auto">
            <table id="tableProjets" class="w-full text-sm md:text-2xl text-gray-400 text-center">
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
                    </tr>
                </thead>
                <tbody>
                    <tr class="border-b bg-gray-800 border-gray-700">
                        <th scope="row" class="px-2 py-4 font-medium whitespace-nowrap text-white">
                            MARTIN Jean
                        </th>
                        <td class="px-2 py-4">
                            8 rue de la Boustifaille<br />19100 Brive-la-Gaillarde
                        </td>
                        <td class="px-2 py-4">
                            1 200W
                        </td>
                    </tr>
                    <tr class="border-b bg-gray-800 border-gray-700">
                        <th scope="row" class="px-2 py-4 font-medium whitespace-nowrap text-white">
                            WITCHY Woman
                        </th>
                        <td class="px-2 py-4">
                            1 rue de la Rue<br />01000 Ainville
                        </td>
                        <td class="px-2 py-4">
                            2 300W
                        </td>
                    </tr>
                    <tr class="border-b bg-gray-800 border-gray-700">
                        <th scope="row" class="px-2 py-4 font-medium whitespace-nowrap text-white">
                            MAIGROT Kilian
                        </th>
                        <td class="px-2 py-4">
                            9 rue Soliers<br />19100 Brive-la-Gaillarde
                        </td>
                        <td class="px-2 py-4">
                            3 250W
                        </td>
                    </tr>
                    <tr class="border-b bg-gray-800 border-gray-700">
                        <th scope="row" class="px-2 py-4 font-medium whitespace-nowrap text-white">
                            MAIGROT Kilian
                        </th>
                        <td class="px-2 py-4">
                            9 rue Soliers<br />19100 Brive-la-Gaillarde
                        </td>
                        <td class="px-2 py-4">
                            3 250W
                        </td>
                    </tr>
                    <tr class="border-b bg-gray-800 border-gray-700">
                        <th scope="row" class="px-2 py-4 font-medium whitespace-nowrap text-white">
                            MAIGROT Kilian
                        </th>
                        <td class="px-2 py-4">
                            9 rue Soliers<br />19100 Brive-la-Gaillarde
                        </td>
                        <td class="px-2 py-4">
                            3 250W
                        </td>
                    </tr>
                    <tr class="border-b bg-gray-800 border-gray-700">
                        <th scope="row" class="px-2 py-4 font-medium whitespace-nowrap text-white">
                            MAIGROT Kilian
                        </th>
                        <td class="px-2 py-4">
                            9 rue Soliers<br />19100 Brive-la-Gaillarde
                        </td>
                        <td class="px-2 py-4">
                            3 250W
                        </td>
                    </tr>
                    <tr class="border-b bg-gray-800 border-gray-700">
                        <th scope="row" class="px-2 py-4 font-medium whitespace-nowrap text-white">
                            MAIGROT Kilian
                        </th>
                        <td class="px-2 py-4">
                            9 rue Soliers<br />19100 Brive-la-Gaillarde
                        </td>
                        <td class="px-2 py-4">
                            3 250W
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

    </main>
    `

}

function loadTable () {
    let tableProjets = document.getElementById("tableProjets")
    myDBFormation.transaction(function (transaction) {
        transaction.executeSql('SELECT * FROM Client', [], function (tx, results) {
            let len = results.rows.length, i;
            for (i = 0; i < len; i++) {
                tableProjets.append("<tr><td>" + results.rows.item(i).Nom.toUpperCase() + " " + results.rows.item(i).Prenom + "</td><td>" + results.rows.item(i).Adresse + "<br/>"  + results.rows.item(i).CodPostal + " " + results.rows.item(i).Ville + "</td><td>" + results.rows.item(i).PuissanceMaison + "</td></tr>");
            }
        }, null);
    });
}

loadAccueil ()