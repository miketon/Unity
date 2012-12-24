enum animEnum{ //enumerates the possible state of player.  Outside of Class
  fall,
  idle,
  dash,
  duck,
  attk,
  scrt,
  jump
}

class Unit_IO_State extends Unit{

  static var initMe   : boolean = true ; //static == class variable?
  static var pCamera  : GameObject     ;
  static var pCurrent : GameObject     ;
  var jumpCnt  : int   = 0      ;

  protected var accel   : float = 0.025 ;
  protected var decel   : float = 0.025 ;

  private var boolControl : boolean = true ; //Will obj accept controller input?
  private var nextFire    : float   = 0    ;

  var bullet   : GameObject  ;
  var soundFX  : AudioClip   ;
  var fireRate : float = 0.5 ;

  var flipSpeed  : float = 50.0 ;
  var hAxis :float = 0.0 ; //controller horizontal axis
  var hFlip :float = 1.0 ; 
  var doubleJump : int   = 1    ;

  var camera2D  : UnitCamera_2D ;
  var animState : animEnum      ; //To be accessed by subclasses ; !protected/private
  var kTime     : float = 0.5   ; //Time to hold before eligible for instance swap out.Prevent jutter.  

  function Awake(){
    if(initMe){
      pCamera            = LoadGameObject_mt("MainCamera")                 ;
      transform.position = LoadGameObject_mt("Respawn").transform.position ;
      initMe             = false                                           ;
    }
  }

  function Start(){
    super.Start()                                               ;
    transform.rotation = Quaternion.LookRotation(Vector3.right) ; //start facing forward
    if(animState == animEnum.idle){   //Check if object on ground
      animation["walk"].speed = 1.15 ; //Modify animation speeds on startup
      animation["duck"].speed = 0.5 ; //Modify animation speeds on startup
      animation["jump"].speed = 2.5 ; //Modify animation speeds on startup
    }
  }
  
  function LockControls(animClip){
    animation.Play(animClip)                                                 ;
    boolControl  = false                                                     ;
    var duration = animation[animClip].length/animation[animClip].speed      ;
  	yield WaitForSeconds (duration)                                          ;
  	boolControl = true                                                       ;
  	// Debug.Log("Do "+duration+" seconds later" + animation[animClip].clip) ;
  }

  function Update(){
    //Check for up keys first...possible to miss in nest
    if(Input.GetKeyUp("down")){ 
      // LockControls("duckpopup") ; 
      // print("up");
    }
    //Are there animations that need to finish? Not accepting controller input
    if(boolControl == true){
      hAxis = Input.GetAxis("Horizontal");
      if(hAxis > 0){
        hFlip = 1;
      }
      else if(hAxis < 0){
        hFlip = -1;
      }

      move = Vector3(hAxis, 0, 0) ;
      if(move.sqrMagnitude > 0.01){
        move.Normalize()                                                                                                     ; //So diagonal xforms are not faster, uses hypotneous
        transform.rotation = Quaternion.Slerp(transform.rotation, Quaternion.LookRotation(move), Time.deltaTime * flipSpeed) ;
      }

      if(control.isGrounded){
        jumpCnt   = 0             ;
        if(animState == animEnum.idle){   //Check if object on ground
          animation.CrossFade("idle", 0.08); //Base is idle, then stack anything else on top
          if(move.sqrMagnitude > 0.1){
            animation.CrossFade("walk", 0.1);
          }
          else if(Input.GetKey("down")){
            animation.CrossFade("duck", 0.1);
            // print("down");
          }
        }
        animState = animEnum.idle ;
      }
      else if(control.velocity.y < -vy*3){
        // animState = animEnum.fall;
        animation.CrossFade("fall", 0.1);
      }
      if(Input.GetButton("Jump")){
        if(jumpCnt < doubleJump && vy>-0.1){
          jump      = true          ;
          jumpCnt   = jumpCnt +1    ;
          // animState = animEnum.jump ;
          animation.CrossFade("jump", 0.1);
        }
      }
      if(Input.GetButton("Fire1") && Time.time > nextFire){
        nextFire                    = Time.time + fireRate                                        ;
        var clone:GameObject        = Instantiate(bullet, transform.position, transform.rotation) ;
        clone.transform.localScale *= (Random.value + 0.3)                                        ;
        clone.rigidbody.velocity    = transform.TransformDirection(Vector3(0,0,20))               ;
      } 
      dash = Input.GetButton("Fire2");
      if(dash){
        animState = animEnum.scrt;
      }
      super.Update() ;
    }
  }

  function LateUpdate () {
    // var velocityCam         = Vector3.zero                                                                 ;
    var velocityCam            = Vector3(0.0, 0.0, 3.0)                                                       ;
    var offSetCam              = camera2D.offSet                                                              ;
    offSetCam.x               *= hFlip                                                                        ;
    offSetCam.z               += -Mathf.Clamp01(control.velocity.y) * 2.0                                     ;
    var camPoint               = transform.position+offSetCam                                                 ;
    pCamera.transform.position = Vector3.SmoothDamp(pCamera.transform.position, camPoint, velocityCam, 0.075) ;
  }

  class UnitCamera_2D{
    var offSet : Vector3 = Vector3(0.0, 0.5, -10.0) ;
    // var zDepth : float   = -10.0                    ;
    // var zSpeed : float   = 10.0                     ;
  }

  function deltaToZero(value, k){
    if(value>0.0 && (value - k)<0.0){return 0.0;};
    if(value<0.0 && (value + k)>0.0){return 0.0;};
    return value;
  }
}
