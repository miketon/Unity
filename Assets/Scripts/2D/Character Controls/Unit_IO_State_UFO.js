class Unit_IO_State_UFO extends Unit_IO_State{

  function Awake(){
    if(initMe){
      pCamera            = LoadGameObject_mt("MainCamera")                      ;
      transform.position = LoadGameObject_mt("Respawn_Duck").transform.position ;
      transform.rotation = Quaternion.LookRotation(Vector3.right)               ; //start facing forward
      initMe             = false                                                ;
    }
  }

  function doUpdate(){
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

      if(!control.isGrounded){
        control.velocity.y = 0;
        gravity.y = 0 ;
        vy = 0;  
        if(Input.GetButton("Jump")){
          gravity.y = 0.5;
        }
        else if(Input.GetKey("down")){
          animState = animEnum.idle;
        }
      }
      else{
        if(Input.GetButton("Jump")){
          // jump = true;
          animState = animEnum.jump;
        }
      }

    if(Input.GetButton("Fire1") && Time.time > nextFire){
      nextFire                    = Time.time + fireRate                                        ;
      var clone:GameObject        = Instantiate(bullet, transform.position, transform.rotation) ;
        clone.transform.localScale *= (Random.value + 0.3)                                        ;
        clone.rigidbody.velocity    = transform.TransformDirection(Vector3(0,0,20))               ;
      } 
      dash = Input.GetButton("Fire2");
    }
  }
}
