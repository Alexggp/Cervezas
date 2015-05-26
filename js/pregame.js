$(document).ready(function() {

	$( "#Gamefront #play img" ).click(function() {
        $( "#Gamefront" ).hide();
        $( "#container" ).show();
        Game.initialize("game",sprites,startGame);
	});
    
    
    // datos simulados, deberian llegar como json con un get
    var data ={
        'ranking':[
            {'name':'Joaquin Armando','points':'26'},
            {'name':'pepito perez','points':'37'},
            {'name':'Custodio Trujillo','points':'15'},
            {'name':'Roldan Cabrera','points':'26'},
            {'name':'Fulgencio Chavarría','points':'28'},
            {'name':'Rico Capello','points':'25'},
            {'name':'Francisco Robles','points':'57'},
            {'name':'Leandro De Leon','points':'59'},
            {'name':'Anacleto Noguerra','points':'67'},
            {'name':'Regulo Ruiz','points':'05'},
            {'name':'Adrian Gallo','points':'36'},
            {'name':'Tito Ibarra','points':'87'},              
        ],
        'user': 'Rico Capello',
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
    
    AudioOn=true;
    $('#checkEfx').change(function(){
        AudioOn = this.checked ? true : false;
    });
    
    MusicOn=true;
    $('#checkMusic').change(function(){
        MusicOn = this.checked ? true : false;
    });
    
    
    
});
