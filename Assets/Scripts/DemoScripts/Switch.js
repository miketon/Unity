#pragma strict
var switchToTarget : Transform;

function Start () {

}

function Update () {
	if (Input.GetButtonDown("Jump"))
		GetComponent(Follow).target = switchToTarget;
}