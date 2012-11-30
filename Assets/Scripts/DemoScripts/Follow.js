#pragma strict
var target : Transform;

function Start () {

}

function Update () {
    transform.LookAt(target);
}