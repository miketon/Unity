private var target:GameObject;
private var state = "ATTACK";
private var direction:Vector3;
private var spawnPos:Vector3;
private var magnitude:float = 0.0;

var distAttack  = 15 ;
var distRetreat = 3  ;

function Start(){
  spawnPos = transform.position; 
}

function Update(){
  target = GameObject.FindWithTag("Player");
  direction = target.transform.position - transform.position; 
  magnitude =  direction.magnitude;
  if(direction.magnitude > distAttack){
    state = "ATTACK";
    transform.LookAt(target.transform.position);
  }
  else if(direction.magnitude < distRetreat){
    state = "RETREAT";
    transform.LookAt(spawnPos);
  }
  transform.Translate(Vector3.forward*0.1);
}
