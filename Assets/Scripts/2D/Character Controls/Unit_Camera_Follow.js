@script RequireComponent(CharacterController);
protected var control : CharacterController    ;
protected var move    : Vector3 = Vector3.zero ;
protected var acclVec : Vector3 = Vector3.zero ;

protected var dash : boolean = false ;
protected var vy   : float   = 0.0   ;

var soundFX : AudioClip              ;
var gravity : Vector3 = Vector3.zero ;
var jump    : boolean = false        ;

var moveSpeed : float = 8.0    ;
var dashSpeed : float = 3      ;
var jumpSpeed : float = 3.5    ;
var weightMul : float = 1.0    ;
var accelY    : float = 0.015  ;

function Start(){
  control = GetComponent(CharacterController);
  if(!control){
    Debug.LogError("Unit.Start() "+name+" has no CharacterController.") ;
    enabled=false                                                       ;
  }
}

function Update(){
  if(!control.isGrounded){        //apply gravity when in air
    gravity   += Physics.gravity * weightMul * Time.deltaTime ;
    gravity.y -= vy                                           ;
    if(control.velocity.y < 0.0){ //apply velocity after apex
      vy += accelY;
    }
  }
  else{                           //reset gravity when on ground
    gravity.y = 0 ;
    if(dash){
      move *=dashSpeed;
    }
  }
  if(jump){
    gravity.y = jumpSpeed ;
    vy        = 0         ;
    jump      = false     ;
  }

  move += gravity   ;
  move *= moveSpeed ;

  control.Move(move * Time.deltaTime);
}

function onHit(){
  print("I am hit: "+ this.name);
}

function LoadGameObject_mt(objName){                              //MUST: ObjName == TagName
  // var newGameObject:GameObject = GameObject.FindWithTag(objName); //Check to see if in scene
  var newGameObject:GameObject = GameObject.Find(objName); //Check to see if in scene
  if(!newGameObject){                                             //Else check in Resources folder
    newGameObject= Instantiate(Resources.Load(objName));              
  }
  return newGameObject;
}

