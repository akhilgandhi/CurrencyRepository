function makeApiCall(action = "read") {

    var ssId = '1SFbgvc3m2pcyX_VUWA5YJHGvBintNSBrh9xKzJ9sEoo';
    var sRange = 'Sheet1';
    if (action == "write") {
        var writeVal = new Array(1);
        writeVal[0] = new Array(3);
        writeVal[0][0] = document.getElementById('date-input').value;
        writeVal[0][1] = document.getElementById('denomination').value;
        writeVal[0][2] = document.getElementById('currencyValue').value;
        var params = {
            // The ID of the spreadsheet to update.
            spreadsheetId: ssId,  // TODO: Update placeholder value.
            // The A1 notation of a range to search for a logical table of data.
            // Values will be appended after the last row of the table.
            range: sRange,  // TODO: Update placeholder value.
            // How the input data should be interpreted.
            valueInputOption: 'RAW',  // TODO: Update placeholder value.
            // How the input data should be inserted.
            //insertDataOption: '',  // TODO: Update placeholder value.
        };
        var valueRangeBody = {
            // TODO: Add desired properties to the request body.
            "values": writeVal
        };
        var request = gapi.client.sheets.spreadsheets.values.append(params, valueRangeBody);
        request.then(function (response) {
            // TODO: Change code below to process the `response` object:
            console.log(response.result);
            window.location.href = "https://akhilgandhi.github.io/CurrencyRepository/";
        }, function (reason) {
            console.error('error: ' + reason.result.error.message);
        });

    }
    else {
        var params = {
            // The ID of the spreadsheet to retrieve data from.
            spreadsheetId: ssId,  // TODO: Update placeholder value.

            // The A1 notation of the values to retrieve.
            range: sRange,  // TODO: Update placeholder value.

            // How values should be represented in the output.
            // The default render option is ValueRenderOption.FORMATTED_VALUE.
            // valueRenderOption: '',  // TODO: Update placeholder value.

            // How dates, times, and durations should be represented in the output.
            // This is ignored if value_render_option is
            // FORMATTED_VALUE.
            // The default dateTime render option is [DateTimeRenderOption.SERIAL_NUMBER].
            // dateTimeRenderOption: '',  // TODO: Update placeholder value.
        };

        var request = gapi.client.sheets.spreadsheets.values.get(params);
        request.then(function (response) {
            // TODO: Change code below to process the `response` object:
            console.log(response.result);
            localStorage.setItem('searchData', response.result);
            populateSheet(response.result);
        }, function (reason) {
            console.error('error: ' + reason.result.error.message);
        });
    }
}

function initClient() {
    var API_KEY = 'AIzaSyDGrlgb2SkHgvGkvWqjlv_G3AAqq-v113M';  // TODO: Update placeholder with desired API key.

    var CLIENT_ID = '479573033148-kg28go1r68jchtrfppvmedt0v63sb6fq.apps.googleusercontent.com';  // TODO: Update placeholder with desired client ID.

    // TODO: Authorize using one of the following scopes:
    //   'https://www.googleapis.com/auth/drive'
    //   'https://www.googleapis.com/auth/drive.file'
    //   'https://www.googleapis.com/auth/drive.readonly'
    //   'https://www.googleapis.com/auth/spreadsheets'
    //   'https://www.googleapis.com/auth/spreadsheets.readonly'
    var SCOPE = "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets";

    gapi.client.init({
        'apiKey': API_KEY,
        'clientId': CLIENT_ID,
        'scope': SCOPE,
        'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    }).then(function () {
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
        updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
}

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

function updateSignInStatus(isSignedIn) {
    if (isSignedIn) {
        makeApiCall();
    }
}

function handleSignInClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

function handleSignOutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

function handleSaveClick() {
    makeApiCall(action = "write");
}

function populateSheet(result) {
    var table = document.getElementById('data');
    for (var row = 0; row < 1000; row++) {
        var rows = table.insertRow(-1);
        for (var col = 0; col < 3; col++) {
            var cell = rows.insertCell(-1);
            cell.innerHTML += result.values[row][col];
        }
    }
}

var searchQuery = document.getElementById('searchText');

function searchText() {

    let items;

    if (localStorage.getItem('searchData')) {
        items = JSON.parse(localStorage.getItem('searchData'));

        document.getElementById('result').innerHTML = items;
    }
}