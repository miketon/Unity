@script RequireComponent(CharacterController);

protected var control : CharacterController    ;
protected var move    : Vector3 = Vector3.zero ;
protected var gravity : Vector3 = Vector3.zero ;
protected var jump    : boolean = false        ;
protected var dash    : boolean = false        ;
protected var vy      : float   = 0.0          ;
protected var ay      : float   = 0.0015       ;

var moveSpeed : float = 3.0  ;
var weightMul : float = 1.0  ;
var jumpSpeed : float = 5    ;
var dashSpeed : float = 10   ;

function Start(){
  control = GetComponent(CharacterController);
  if(!control){
    Debug.LogError("Unit.Start() "+name+" has no CharacterController.") ;
    enabled=false                                                       ;
  }
}

function Update(){
  if(!control.isGrounded){
    gravity   += Physics.gravity * weightMul * Time.deltaTime ;
    gravity.y -= vy                                           ;
    vy += ay                                                  ;
  }
  else{
    gravity = Vector3.zero ;
    vy      = 0            ;
    if(jump){
      gravity.y = jumpSpeed ;
      jump      = false     ;
    }
  }
  if(dash){
    move.z *=dashSpeed;
  }
  move += gravity   ;
  move *= moveSpeed ;

  control.Move(move * Time.deltaTime);
}
