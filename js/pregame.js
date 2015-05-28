$(document).ready(function() {

    Game.initialize("game",sprites,readyGame);

	$( "#play img" ).click(function() {
        playGame();
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
        'user': 'Adrian',
        'best':{'position':'7','points':'51'}
    }

    var fill_ranking = function(data){
        if (data.best.position) {
            $('#yourBest').html(data.best.position);
            $('#yourBestTime').html(data.best.points);
        }

        var ranking=_.sortBy(data.ranking, function(obj){return -obj.points});

        var even = _.find(ranking, function(obj){ return obj.name == data.user;});
        if (even) {           
            console.log(ranking.length-ranking.indexOf(even))
            var x=ranking.length-ranking.indexOf(even);
            var n=2
            if (x<3) {
                n=5-x;
            }
            else if (x>ranking.length-2) {
                n=ranking.indexOf(even)
            }
            for (var i=ranking.indexOf(even)-n;i<(ranking.indexOf(even)-n+5);i++){
                $('#ranking #list').append("<p><span class='left'>"+(i+1)+'. '+ranking[i].name+"</span><span class='right'>"+ranking[i].points+"</span></p><br>");                
            }
        }
        else{
            for (var i=0;i<5;i++){
                $('#ranking #list').append("<p><span class='left'>"+(i+1)+'. '+ranking[i].name+"</span><span class='right'>"+ranking[i].points+"</span></p><br>");                
            }
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
