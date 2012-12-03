enum animEnum{ //enumerates the possible state of player.  Outside of Class
  fall,
  idle,
  dash,
  jump
}

class Unit_IO_State extends Unit{

  static var initMe   : boolean = true ; //static == class variable?
  static var pCamera  : GameObject     ;
  static var pCurrent : GameObject     ;
  var jumpCnt  : int   = 0      ;

  protected var accel   : float = 0.025 ;
  protected var decel   : float = 0.025 ;

  private var nextFire : float = 0   ;

  var bullet   : GameObject  ;
  var soundFX  : AudioClip   ;
  var fireRate : float = 0.5 ;

  var flipSpeed  : float = 50.0 ;
  var doubleJump : int   = 1    ;

  var camera2D  : UnitCamera_2D ;
  var animState : animEnum      ; //To be accessed by subclasses ; !protected/private
  var kTime     : float = 0.5   ;

  function Awake(){
    if(initMe){
      pCamera            = LoadGameObject_mt("MainCamera")                 ;
      transform.position = LoadGameObject_mt("Respawn").transform.position ;
      initMe             = false                                           ;
    }
  }

  function Start(){
    super.Start();
  }

  function Update(){
    move = new Vector3(Input.GetAxis("Horizontal"), 0, 0) ;
    if(move.sqrMagnitude > 0.01){
      move.Normalize()                                                                                                     ; //So diagonal xforms are not faster, uses hypotneous
      transform.rotation = Quaternion.Slerp(transform.rotation, Quaternion.LookRotation(move), Time.deltaTime * flipSpeed) ;
    }

    if(control.isGrounded){
      jumpCnt   = 0             ;
      animState = animEnum.idle ;
    }
    else if(control.velocity.y < -vy*3){
      // Debug.Log('Falling'+vy);
      animState = animEnum.fall;
    }
    if(Input.GetButton("Jump")){
      if(jumpCnt < doubleJump && vy>-0.1){
        jump      = true          ;
        jumpCnt   = jumpCnt +1    ;
        animState = animEnum.jump ;
      }
    }
    dash = Input.GetButton("Fire2");

    if(Input.GetButton("Fire1") && Time.time > nextFire){
      nextFire                 = Time.time + fireRate                                        ;
      var clone:GameObject     = Instantiate(bullet, transform.position, transform.rotation) ;
      clone.transform.localScale *= (Random.value + 0.3);
      clone.rigidbody.velocity = transform.TransformDirection(Vector3(0,0,20))               ;
    } 

    super.Update() ;
  }

  function LateUpdate () {
    pCamera.transform.position = transform.position+camera2D.offSet;
//     if(control.velocity.sqrMagnitude<0.05){ //apply gravity when in air
//       pCamera.position.z= Mathf.Lerp(camera2D.zDepth, -20, Time.deltaTime);
//     }
//     else{
//       pCamera.position.z= Mathf.Lerp(-25, camera2D.zDepth, camera2D.zSpeed*Time.deltaTime);
//     }
    // pCamera.position.z=camera2D.zDepth; //+camera2D.zDepth*control.velocity.z; 
    pCamera.transform.LookAt(control.transform.position);
  }

  class UnitCamera_2D{
    var offSet : Vector3 = Vector3(0.0, 0.5, -10.0) ;
    var zDepth : float   = -10.0                    ;
    var zSpeed : float   = 10.0                     ;
  }

  function deltaToZero(value, k){
    if(value>0.0 && (value - k)<0.0){return 0.0;};
    if(value<0.0 && (value + k)>0.0){return 0.0;};
    return value;
  }

}
