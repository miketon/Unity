// #pragma strict
private var explosionDirection : Quaternion ;
private var explosionLocation  : Vector3    ;
private var explosionActivated = false      ;
var detonatorPrefab : GameObject            ;
var explosionLife   : float=5.0             ;
var detailLevel     : float=1.0             ;
var timeSet         : float=0.0             ;

function OnCollisionEnter(collision:Collision) {
  if(collision.gameObject.tag!="Player"){
    rigidbody.isKinematic = true                                                                             ;
    Destroy(this.collider)                                                                                   ;
    var contact        = collision.contacts[0]                                                               ;
    explosionDirection = Quaternion.FromToRotation(Vector3.up, contact.normal)                               ;
    var offSize        = detonatorPrefab.GetComponent("Detonator").size/3                                    ;
    explosionLocation  = contact.point; // + (Vector3.Scale(contact.normal, Vector3(offSize, offSize, offSize))) ;
    // Destroy(collision.gameObject, 1)                                                                      ; //Remove object detonator touches
    Explode()                                                                                                ;
    Destroy(this.gameObject)                                                                                 ;
  }
}

function Explode() {
  var exp:GameObject                   = Instantiate(detonatorPrefab, explosionLocation, explosionDirection) ;
  exp.GetComponent("Detonator").detail = detailLevel                                                         ;
  Destroy(exp, explosionLife)                                                                                ;
}
