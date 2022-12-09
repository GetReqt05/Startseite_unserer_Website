//generelle Funktionen für das Malen des Spielfeldes

//wird bei Initialisierung aufgerufen
//--> generiert 25x25 Feld von über ID ausfrufbaren Feldern
function spielfeld(){
    for(let x=0;x<25;x++){
        for(let y=0;y<25;y++){
            document.write('<div class="box" id='+x+'-'+y+'></div>')
            document.getElementById(x+"-"+y).style.left=x*20+"px"
            document.getElementById(x+"-"+y).style.top=y*20+"px"
            console
        }
    }
}
//Übergeben von Farbe als String(bspw. "red")
function farbeÄndern(xkoord,ykoord,farbe){
    document.getElementById(xkoord+"-"+ykoord).style.backgroundColor=farbe
}
//Reset der Spielfläche
function reset(){
    for(let x=0;x<25;x++){
        for(let y=0;y<25;y++){
            document.getElementById(x+"-"+y).style.backgroundColor="#DCDCDC"
        }
    }
}



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//snake Spiel
let kopf //Kopfposition der Schlange
let körper //Körper der Schlange (anfangs natürlich leer)
let zähler //Spielzähler (Länge der Schlange)
let essen //Position des Essens
let bewegung //Bewegungsrichtung der Schlange
let highscore = 0
let bewegt = false
//Lesen der Tasteninputs und anpassen der Bewegungsrichtung
document.addEventListener('keydown', function(event) {
    if(!bewegt){
        switch(event.keyCode){
            case 37: //left
                bewegt=true
                bewegung.x = -1
                bewegung.y = 0 
                break
            case 38: //up
                bewegt = true
                bewegung.x = 0
                bewegung.y = -1
                break
            case 39: //right
                bewegt = true
                bewegung.x = 1
                bewegung.y = 0
                break
            case 40: //down
                bewegt = true
                bewegung.x = 0
                bewegung.y = 1
                break
        }
    }
})

function updateSchlangenPosition() {
    for(let i=zähler-1; i>0; i--) { //eine Nachzugsbewegung der Schlange (jeder Block nimmt vom Block davor die Position)
        körper[i].x = körper[i-1].x
        körper[i].y = körper[i-1].y
    }
    if(zähler>0){ //erster Körperblock bekommt Kopf als Position
        körper[0].x = kopf.x
        körper[0].y = kopf.y
    }
    if(bewegung.x!=0) { //setzt die Kopfposition entsprechend der Bewegungsrichtung
        kopf.x += bewegung.x
    }
    else{
        kopf.y += bewegung.y
    }
}

//malt den Kopf und alle Körperteile der Schlange über die FarbeÄndern Funktion
function schlangeUndEssenMalen(){
    reset()
    for(let i=0;i<zähler;i++){
        farbeÄndern(körper[i].x,körper[i].y,"green")
    }
    farbeÄndern(kopf.x,kopf.y,"black")
    farbeÄndern(essen.x,essen.y,"red")
}

//bestimmt zufällig eine neue Position für das Essen
function neueEssenPosition(){
    essen.x = Math.floor(Math.random()*25)
    essen.y = Math.floor(Math.random()*25)

    //Wenn das Essen auf der Schlange spawnen würde, wird die Funktion erneut aufgerufen
    if (essen.x == kopf.x && essen.y == kopf.y){
        neueEssenPosition()
    }
    for(let i=0;i<zähler;i++){
        if(körper[i].x==essen.x && körper[i].y==essen.y){
            neueEssenPosition()
        }
    }
}

//fügt ein Körperglied hinzu
function körperhinzufügen() {
    körper.push({x:0,y:0})
    zähler++
    if(zähler%10==0){
        document.getElementById("Audio3").play()
    }
}

//überprüft ob die Schlange kollidiert
function kollisonscheck(){
    //Kollison mit den Rändern
    if(kopf.x < 0 || kopf.x > 24 || kopf.y < 0 || kopf.y > 24){
        alert("Game Over")
        if(zähler>highscore){
            highscore = zähler
        }
        spielstart()
        return true
    }
    //Kollison mit dem Körper
    for(let i=0;i<zähler;i++){
        if(kopf.x == körper[i].x && kopf.y == körper[i].y){
            alert("Game Over")
            if(zähler>highscore){
                highscore = zähler
            }
            spielstart()
            return true
        }
    }
    return false
}

//setzt alle Functionen zusammen
function update() {
    if(kopf.x == essen.x && kopf.y == essen.y){
        neueEssenPosition()
        körperhinzufügen()
        document.getElementById("score").innerHTML = "Score: "+zähler
    }
    updateSchlangenPosition()
    if(kollisonscheck()){
        return false
    }
    try{
        schlangeUndEssenMalen()
    }catch(err){}
    bewegt=false
    return true
}

 //sleep function aus dem Internet (https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep)
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

//hauptschleife (Wird in html aufgerufen und beginnt das Spiel)
async function spielstart(){
    document.getElementById("Spieltitel").innerHTML = "Snake"
    document.getElementById("score").innerHTML = "Score: 0"
    document.getElementById("highscore").innerHTML = "Highscore: "+highscore
    reset()
    kopf = {x:5,y:5}
    körper = []
    zähler = 0
    essen = {x:20,y:20}
    bewegung = {x:0,y:0}
    while(update()){ //endlosschleife (im Abstand von 100ms wird update() aufgerufen)
        await sleep(100)
    }
}
