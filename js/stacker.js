//generelle Funktionen für das Malen des Spielfeldes

//wird bei Initialisierung aufgerufen
//--> generiert 11x25 Feld von über ID ausfrufbaren Feldern
function spielfeld(){
    for(let x=0;x<13;x++){
        for(let y=0;y<25;y++){
            document.write('<div class="box" id='+x+'-'+y+'></div>')
            document.getElementById(x+"-"+y).style.left=x*20+"px"
            document.getElementById(x+"-"+y).style.top=y*20+"px"
        }
    }
}
//Übergeben von Farbe als String
function farbeÄndern(xkoord,ykoord,farbe){
    document.getElementById(xkoord+"-"+ykoord).style.backgroundColor=farbe
}
//Reset der Spielfläche
function reset(){
    for(let x=0;x<13;x++){
        for(let y=0;y<25;y++){
            document.getElementById(x+"-"+y).style.backgroundColor="#DCDCDC"
        }
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//stacker Spiel

//Lesen der Tasteninputs und anpassen der Bewegungsrichtung
document.addEventListener('keydown', function(event) {
    switch(event.keyCode){
        case 32: //Leertaste
            blockSetzen()
            break
    }
})

let höhe    //höhe des Stacks 
let score     //Score
let blockgröße //Anzahl der sich noch bewegenden Blöcke
let startposition   //Startposition der sich bewegenden Blöcke
let richtung //true = left, false = right
let highscore = 0

//setzt das Spielfeld zurück und malt die unterste Stufe
function start(){
    reset()
    höhe=1
    for (let i=startposition+1;i<=blockgröße+startposition;i++){
        farbeÄndern(i,24,"red")
    }
}

//aktualisiert abhängig von der Startposition des Blocks die ganze Zeile mit roten bzw. grauen Blöcken
function updateReihe(){
    for (let i=0;i<13;i++){
        if(i>startposition && i<=(startposition+blockgröße)){
            farbeÄndern(i,24-höhe,"red")

        }
        else {
            farbeÄndern(i,24-höhe,"#DCDCDC")
        }
    }
}

//aktualisiert die momentane Position, je nach Bewegungsrichtung(s. Variablendefinition)
function updatePosition(){
    if(richtung){
        startposition--
        if(startposition==-2){ //Anschlag an den linken Rand ändert Bewegungsrichtung 
            startposition=-1
            richtung=false
        }
    }
    else{
        startposition++
        if(startposition==13-blockgröße){ //Anschlag an den rechten Rand
            startposition=12-blockgröße
            richtung=true
        }
    }
}

//setzt einen Block(aufgerufen vom Eventlistener)
function blockSetzen(){
    blöckedaneben = 0 //Gibt an wie viele Blöcke "daneben" gesetzt wurden
    for(let i=0;i<13;i++){
        if(i>startposition && i<=(startposition+blockgröße)){ //stellt für alle Blöcke die gesetzt wurden 
            if(document.getElementById(i+"-"+(24-höhe+1)).style.backgroundColor=="rgb(220, 220, 220)"){ //stellt fest ob unter ihnen auch rot ist
                blöckedaneben++                                                                               //und verkleinert sonst den Block und färbt um
                document.getElementById(i+"-"+(24-höhe)).style.backgroundColor="#DCDCDC"
            }
        }
        else{
            document.getElementById(i+"-"+(24-höhe)).style.backgroundColor="#DCDCDC"
        }
    }
    blockgröße-=blöckedaneben
    höhe++
    score+=blockgröße
    document.getElementById("score").innerHTML = "Score: " + score
}

//sleep function aus dem Internet, die kurzzeitig eine Funktion pausiert (https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep)
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

//Zusamensetzen der Funktionen
function update(){
    if(blockgröße==0){
        alert("Game Over")
        if(score>highscore){
            highscore = score
        }
        spielstart()
        return false
    }
    if(höhe==25){
        //alert("You won")
        //if(score>highscore){
        //    highscore = score
        //}
        start()
        return true
        //return false
    }
    updatePosition()
    updateReihe()
    return true
}

//für HTML bereitgestellte Funktion 
async function spielstart(){
    document.getElementById("highscore").innerHTML = "Highscore: " + highscore
    document.getElementById("Spieltitel").innerHTML = "Stacker"
    document.getElementById("score").innerHTML = "Score: 0"
    score=0
    blockgröße=5
    startposition = 3
    richtung = true //true = left, false = right
    start()
    while(update()){
        await sleep(Math.floor(100/document.getElementById("slider").value)) //Delay von Slider abhängig 
    }
}
