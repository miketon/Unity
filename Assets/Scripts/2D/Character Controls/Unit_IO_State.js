class UnitCamera_2D{
  var offSet : Vector3 = Vector3(0.0, 0.5, -10.0) ;
}

class Unit_UI{
  var energy : float = 0.0;
}

class Unit_IO_State extends Unit{

  static var initMe   : boolean = true ; //static == class variable?
  static var pCamera  : GameObject     ;
  static var pCurrent : GameObject     ;

  var camera2D  : UnitCamera_2D ;
  var playerUI  : Unit_UI       ;
  var animState : animEnum      ; //To be accessed by subclasses ; !protected/private

  protected var hFlip       : float = 1.0    ; //which side is character facing
  protected var hAxis       : float = 0.0    ; //controller horizontal axis
  protected var boolControl : boolean = true ; //Will obj accept controller input?
  protected var nextFire    : float   = 0    ;

  var bullet   : GameObject  ;
  var fireRate : float = 0.5 ;

  var flipSpeed  : float = 50.0 ;
  var doubleJump : int   = 1    ;
  var jumpCnt    : int   = 0    ;
  var kTime      : float = 0.5  ; //Time to hold before eligible for instance swap out.Prevent jutter.

  function Awake(){
    if(initMe){
      pCamera            = LoadGameObject_mt("MainCamera")                 ;
      transform.position = LoadGameObject_mt("Respawn").transform.position ;
      transform.rotation = Quaternion.LookRotation(Vector3.right)          ; //start facing forward
      initMe             = false                                           ;
    }
  }

  function Start(){
    super.Start()                                               ;
  }

  function Update(){
    doUpdate()     ;
    super.Update() ;
  }

  function doUpdate(){
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
            animation.Play("duck");
            // print("down");
          }
        }
        animState = animEnum.idle ;
      }
      else if(control.velocity.y < -vy*3){
        animation.CrossFadeQueued("fall", 0.1);
      }
      if(Input.GetButton("Jump")){
        if(jumpCnt < doubleJump && vy>-0.1){
          jump      = true          ;
          jumpCnt   = jumpCnt +1    ;
          animation.Play("jump");
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
    }
  }

  // update UI + stats
  function updateUI(){
    if(Input.GetKey("down")){
      playerUI.energy += 0.05;
    }
    else if(Input.GetKeyUp("down")){
      playerUI.energy = 0.0;
    }
    GUI.Box(Rect(10, 10, 220, 40), "Energy")                                ;
    GUI.HorizontalSlider(Rect(20, 30, 200, 300), playerUI.energy, 0.0, 1.0) ;
  }

  function OnGUI(){
    updateUI();
  }

  // update camera 
  function LateUpdate () {
    hFlip                      = Mathf.Round(this.transform.rotation.y)                                       ;
    var velocityCam            = Vector3(0.0, 0.0, 3.0)                                                       ;
    var offSetCam              = camera2D.offSet                                                              ;
    offSetCam.x               *= hFlip                                                                        ;
    offSetCam.z               += -Mathf.Clamp01(control.velocity.y) * 2.0                                     ;
    var camPoint               = transform.position+offSetCam                                                 ;
    pCamera.transform.position = Vector3.SmoothDamp(pCamera.transform.position, camPoint, velocityCam, 0.075) ;
  }

  function LockControls(animClip){
    animation.Play(animClip)                                                 ;
    boolControl  = false                                                     ;
    var duration = animation[animClip].length/animation[animClip].speed      ;
  	yield WaitForSeconds (duration)                                          ;
  	boolControl = true                                                       ;
  	// Debug.Log("Do "+duration+" seconds later" + animation[animClip].clip) ;
  }

  function deltaToZero(value, k){
    if(value>0.0 && (value - k)<0.0){return 0.0;};
    if(value<0.0 && (value + k)>0.0){return 0.0;};
    return value;
  }
}
