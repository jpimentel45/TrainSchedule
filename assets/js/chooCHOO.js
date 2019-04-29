// 1. Initialize Firebase
var config = {
    apiKey: "AIzaSyDcXtBemw3B8tCgSaQHmCsooamo4qjMpKw",
    authDomain: "train-time-66add.firebaseapp.com",
    databaseURL: "https://train-time-66add.firebaseio.com",
    projectId: "train-time-66add",
    storageBucket: "train-time-66add.appspot.com",
    messagingSenderId: "770383555927"
};

firebase.initializeApp(config);

var database = firebase.database();
//grab momeny, current date, time, store into var
//formart later, can't format directly on this var creates error 
var life = moment().format();
//console.log(life);
// 2. Button for adding Employees
$("#addTrain").on("click", function (event) {
    event.preventDefault();

    // Grabs user input
    var tName = $("#trainName").val().trim();
    var tDestination = $("#destination").val().trim();
    var tFirst = moment($("#firstTime").val().trim(), "HH:mm").format("HH:mm");
    var tFrequency = $("#frequency").val().trim();

    // Create local "temporary" object for holding train data
    var newTrain = {
        name: tName,
        destination: tDestination,
        first: tFirst,
        frequency: tFrequency
    };

    // push object to the database
    database.ref().push(newTrain);

    // Logs everything to console
    // console.log(newTrain.name);
    // console.log(newTrain.destination);
    // console.log(newTrain.first);
    // console.log(newTrain.frequency);

    //alert("New Train added");

    // Clear input
    $("#trainName").val("");
    $("#destination").val("");
    $("#firstTime").val("");
    $("#frequency").val("");
});

//create event to add train to database, append row in html element when train added
database.ref().on("child_added", function (childSnapshot) {
    //console.log(childSnapshot.val());

    // Store child into var with proper train data
    var tName = childSnapshot.val().name;
    var tDestination = childSnapshot.val().destination;
    var tFirst = childSnapshot.val().first;
    var tFrequency = childSnapshot.val().frequency;

    // train Info
    // console.log(tName);
    // console.log(tDestination);
    // console.log(tFirst);
    // console.log(tFrequency);

    //convert first time into military time, store into var
    var convertTrain = moment(tFirst, "HH:mm");
    //console.log(convertTrain);
    //diff of converTrain value into minutes, store into var
    var timeDiff = moment().diff(moment(convertTrain), "minutes");
    //console.log(timeDiff);
    //store childSnapshot value of frequency, into var
    var frequencyTrain = childSnapshot.val().frequency;
    //console.log("Frequency Minutes: " + frequencyTrain);
    // value of timeDiff % by frequency value
    var eta = Math.abs(timeDiff % frequencyTrain);
    //console.log("Minutes Away: " + eta);
    //use life declared at beggining, add minutes away, format into 12 hr
    //"hh:mm A" for AM/PM instead of military
    var nextArrival = moment(life).add(eta, "minutes").format("hh:mm A");
    //console.log("Next Arrival: " + nextArrival);

    // Create the new row with table data to display
    var newRow = $("<tr id='row'>").append(
        $("<td>").text(tName),
        $("<td>").text(tDestination),
        $("<td>").text(tFrequency),
        $("<td>").text(nextArrival),
        $("<td>").text(eta)
        // $("<td").html(<button id="delete"></button>)
    );

    // Append the new row to the table
    $("#trainTable > tbody").append(newRow);
    // $(document).on("click", "#delete", deleteTrain);

    // function deleteTrain() {
    //     $("#row").remove();

    // }
});

