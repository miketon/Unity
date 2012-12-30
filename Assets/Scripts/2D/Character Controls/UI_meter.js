#pragma strict
var shotStrength:float = 0;

function OnGUI () {
	GUI.Box(Rect(10,10,220, 40), "Force");
	shotStrength = Slider(Rect(20,30,200,30), shotStrength);
}

function Slider (screenRect:Rect, strength:float):float {
	strength = GUI.HorizontalSlider(screenRect, strength, 0.0, 1.0);
	return strength;
}