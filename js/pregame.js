$(document).ready(function() {

	$( "#Gamefront #play" ).click(function() {
        $( "#Gamefront" ).hide();
        $( "#container" ).show();
        Game.initialize("game",sprites,startGame);
	});




});
