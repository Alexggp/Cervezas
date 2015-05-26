$(document).ready(function() {

	$( "#Gamefront #play img" ).click(function() {
        $( "#Gamefront" ).hide();
        $( "#container" ).show();
        Game.initialize("game",sprites,startGame);
	});
    
    
    // datos simulados, deberian llegar como json con un get
    var data ={
        'ranking':[
            {'name':'Joaquin Armando','time':'256'},
            {'name':'pepito perez','time':'367'},
            {'name':'Custodio Trujillo','time':'125'},
            {'name':'Roldan Cabrera','time':'326'},
            {'name':'Fulgencio Chavarría','time':'158'},
            {'name':'Rico Capello','time':'265'},
            {'name':'Francisco Robles','time':'157'},
            {'name':'Leandro De Leon','time':'269'},
            {'name':'Anacleto Noguerra','time':'197'},
            {'name':'Regulo Ruiz','time':'105'},
            {'name':'Adrian Gallo','time':'136'},
            {'name':'Tito Ibarra','time':'187'},              
        ],
        'user': 'Rico Capello',
        'best':{'position':'7','time':'311'}
    }

    var fill_ranking = function(data){
        if (data.best.position) {
            $('#Gamefront #yourBest').html(data.best.position);
            $('#Gamefront #yourBestTime').html(data.best.time+"''");
        }

        var ranking=_.sortBy(data.ranking, function(obj){return -obj.time});
        for (var i=0;i<5;i++){
            $('#Gamefront #ranking ol').append("<li>"+ranking[i].name+"<span class='record'>"+ranking[i].time+"''</span></li>");
        }
        var even = _.find(ranking, function(obj){ return obj.name == data.user;});
        if (even) {
            $('#Gamefront #today').html(ranking.indexOf(even));
            $('#Gamefront #todayTime').html(even.time+"''");
        }

        
    }

    fill_ranking(data);
    
});
