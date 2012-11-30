#pragma strict
var newObject : Transform;

function Start () {

}

function Update () {
	if (Input.GetButtonDown("Fire1")) {
   		Instantiate(newObject, transform.position, transform.rotation);
   		Debug.Log("Cube created");
	}
}