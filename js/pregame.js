$(document).ready(function() {

	$( "#play" ).click(function() {
        $( "#pregame" ).hide();
        $( "#container" ).show();

	});


    Game.initialize("game",sprites,startGame);



});
