#pragma strict

private var xform    : Transform   ;
private var nextFire : float = 0   ;
var bullet           : GameObject  ;
var speed            : float = 5   ;
var fireRate         : float = 0.5 ;

function Awake(){
  xform = transform; //caching component lookup: transform == GetComponent(transform)
}

function Start(){
}

function Update(){
  if(Input.GetButton("Fire1") && Time.time > nextFire){
    nextFire                 = Time.time + fireRate                                ;
    var clone:GameObject     = Instantiate(bullet, xform.position, xform.rotation) ;
    clone.rigidbody.velocity = transform.TransformDirection(Vector3(0,speed,0))    ;
    // Physics.IgnoreCollision(clone.collider, collider)                           ;
  }
}


