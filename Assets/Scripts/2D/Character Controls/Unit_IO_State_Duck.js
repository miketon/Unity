class Unit_IO_State_Duck extends Unit_IO_State{

  function Awake(){
    if(initMe){
      pCamera            = LoadGameObject_mt("MainCamera")                      ;
      transform.position = LoadGameObject_mt("Respawn_Duck").transform.position ;
      transform.rotation = Quaternion.LookRotation(Vector3.right)               ; //start facing forward
      initMe             = false                                                ;
    }
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
        if(Input.GetKey("down")){
          animState = animEnum.duck;
        }
        else{
          animState = animEnum.idle ;
        }
      }
      else if(control.velocity.y < -vy*3){
        animState = animEnum.fall;
      }
      if(Input.GetButton("Jump")){
        if(jumpCnt < doubleJump && vy>-0.1){
          jump      = true          ;
          jumpCnt   = jumpCnt +1    ;
          animState = animEnum.jump ;
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
}
