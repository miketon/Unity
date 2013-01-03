#pragma strict

var playerPos  : Transform  ;
var radarBlips : GameObject ;
var orbspot    : Texture    ;
var mapScale   : float=1.0  ;

var radarTag = ""    ;
private var radarSpotX:float ;
private var radarSpotY:float ;
var radarWidth  = 100        ;
var radarHeight = 100        ;

function Start(){
  radarTag = radarBlips.tag;
}

function OnGUI(){
	GUI.BeginGroup(Rect(10,Screen.height-radarHeight-10, radarWidth, radarHeight)) ;
	GUI.Box(Rect(0,0, radarWidth, radarHeight), "Radar")                           ;
	DrawSpotsForOrbs()                                                             ;
	GUI.EndGroup()                                                                 ;
}

function DrawRadarBlip(go:GameObject, spotTexture:Texture) {
	var gameObjPos = go.transform.position                            ;
	var dist       = Vector3.Distance(playerPos.position, gameObjPos) ;
	var dx         = playerPos.position.x - gameObjPos.x              ;
	var dz         = playerPos.position.z - gameObjPos.z              ;
	//determine the angle of rotation between the direction player is facing, and location of the obj
	var deltay = Mathf.Atan2(dx, dz)*Mathf.Rad2Deg-270-playerPos.eulerAngles.y;
	//orient object on radar according to direction the player if facing
	radarSpotX = dist*Mathf.Cos(deltay * Mathf.Deg2Rad)*mapScale ;
	radarSpotY = dist*Mathf.Sin(deltay * Mathf.Deg2Rad)*mapScale ;
	//draw a spot on the radar
	GUI.DrawTexture(Rect(radarWidth/2.0+radarSpotX, radarHeight/2.0+radarSpotY,2,2), spotTexture);

}

function DrawSpotsForOrbs() {
	var gos:GameObject[];
	//look for all objects with tag of orb
	gos          = GameObject.FindGameObjectsWithTag(radarTag) ;
	var distance = Mathf.Infinity                              ;
	var position = transform.position                          ;
	for(var go:GameObject in gos){
		DrawRadarBlip(go, orbspot);
	}

}
