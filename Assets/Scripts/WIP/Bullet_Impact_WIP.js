#pragma strict

function Start(){
  Destroy(gameObject, 20);
}

function Update(){
}

function OnCollisionEnter(hit:Collision){
  print("Destroy:"+hit.transform.name);
  Destroy(gameObject, 1);
}
