private var cObject     : GameObject ; //Current object
private var timeInit    : float      ;
private var timeDelta   : float      ;
private var kTimeD      : float      ; //State lock of current instance

// Anim prefabs
var pFall : GameObject ; //Be sure to tag each uniquely
var pIdle : GameObject ; //And check that pill collider encompass bottom of mesh
var pDash : GameObject ; //Else collision floor error
var pDuck : GameObject ;
var pJump : GameObject ;

var animState = {
  // cState : animEnum,
  // pState : animEnum
};

var cState : animEnum;
var pState : animEnum;

function Awake(){
  cObject  = newGameObject = Instantiate(Resources.Load(pIdle.tag)) ; 
  timeInit = resetTime()                                            ;
  kTimeD   = 0.5                                                    ;
}

function LateUpdate () {                                       //Switching out animation as necessary
  timeDelta = deltaTime(timeInit); 
  if(timeDelta>kTimeD){                                        //Delaying state changes per Prefab 
    cState  = cObject.GetComponent(Unit_IO_State).animState ; //returns prefab animEnum 
    if(cState==animEnum.jump && pState!=animEnum.jump){
      cObject  = cObjectUpdate(pJump.tag) ;                    //must be tags, unable to determine instance name
    }
    else if(cState==animEnum.idle && pState!=animEnum.idle){
      cObject  = cObjectUpdate(pIdle.tag) ;
    }
    else if(cState==animEnum.duck && pState!=animEnum.duck){
      cObject = cObjectUpdate(pDuck.tag) ;
    }
    else if(cState==animEnum.fall && pState!=animEnum.fall){
      cObject = cObjectUpdate(pFall.tag) ;
    }
    else if(cState==animEnum.duck && pState!=animEnum.duck){
      cObject = cObjectUpdate(pDuck.tag) ;
    }
  }
}

function cObjectUpdate(oTag){ //Watch out spaghetti side effects : cObject, Unit_IO_State and timeInit
  cObject.active = false                                                                           ;
  Destroy(cObject)                                                                                 ;
  var xformTemp        = cObject.transform                                                         ;
  xformTemp.position.z = -1.0                                                                      ;
  var gravityTemp      = cObject.GetComponent(Unit_IO_State).gravity                               ;
  cObject              = Instantiate(Resources.Load(oTag), xformTemp.position, xformTemp.rotation) ;
  var unit             = cObject.GetComponent(Unit_IO_State)                                       ;
  unit.gravity         = gravityTemp                                                               ;
  kTimeD               = unit.kTime                                                                ;
  timeInit             = resetTime()                                                               ;
  pState               = cState                                                                    ;
  return cObject                                                                                   ;
}

function resetTime(){
  return Time.time;
}

function deltaTime(lastTimeQuery){
  return Time.time-lastTimeQuery;
}

// We'll draw a gizmo in the scene view, so it can be found....
function OnDrawGizmos() {
  Gizmos.DrawIcon(transform.position, "Player Icon.tif");
}

class AnimPFab{
  var offSet : Vector3 = Vector3(0.0, 0.5, -10.0) ;
  var zDepth : float   = -10.0                    ;
  var zSpeed : float   = 10.0                     ;
}

