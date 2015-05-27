$(document).ready(function() {

	$( "#Gamefront #play img" ).click(function() {
        $( "#Gamefront" ).hide();
        $( "#container" ).show();
        Game.initialize("game",sprites,startGame);
	});
    
    
    // datos simulados, deberian llegar como json con un get
    var data ={
        'ranking':[
            {'name':'Joaquin','points':'26'},
            {'name':'pepito','points':'37'},
            {'name':'Custodio','points':'15'},
            {'name':'Roldan','points':'26'},
            {'name':'Fulgencio','points':'28'},
            {'name':'Rico','points':'25'},
            {'name':'Francisco','points':'57'},
            {'name':'Leandro','points':'59'},
            {'name':'Anacleto','points':'67'},
            {'name':'Regulo','points':'05'},
            {'name':'Adrian','points':'36'},
            {'name':'Tito','points':'87'},              
        ],
        'user': 'Rico',
        'best':{'position':'7','points':'51'}
    }

    var fill_ranking = function(data){
        if (data.best.position) {
            $('#Gamefront #yourBest').html(data.best.position);
            $('#Gamefront #yourBestTime').html(data.best.points);
        }

        var ranking=_.sortBy(data.ranking, function(obj){return -obj.points});
        for (var i=0;i<5;i++){
            $('#Gamefront #ranking ol').append("<li>"+ranking[i].name+"<span class='record'>"+ranking[i].points+"</span></li>");
        }
        var even = _.find(ranking, function(obj){ return obj.name == data.user;});
        if (even) {
            $('#Gamefront #today').html(ranking.indexOf(even));
            $('#Gamefront #todayTime').html(even.points);
        }

        
    }
  
    fill_ranking(data);
    
    AudioOn=false;
    MusicOn=false;
    //AudioOn=true;
    //$('#checkEfx').change(function(){
    //    AudioOn = this.checked ? true : false;
    //});
    //
    //MusicOn=true;
    //$('#checkMusic').change(function(){
    //    MusicOn = this.checked ? true : false;
    //});
    //
    
    
});
