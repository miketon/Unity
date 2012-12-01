class WIP_UnitPlayer extends WIP_Unit{

  private var xform:Transform;

  function Awake(){
    xform        = transform      ; //caching component lookup: transform =  = GetComponent(transform)
    arrowPrevpos = xform.position ;
  }

  function Start(){
    super.Start();
  }

  protected var accel    : float = 0.025          ;
  protected var move_Vec : Vector3 = Vector3.zero ;

  private var angleH = 0;
  private var angleV = 0;

  var aimSpeedX        = 180 ;
  var aimSpeedY        = 90  ;
  var aimVertMin       = -10 ;
  var aimVertMax       = 40  ;
  var friction : float = 0   ;

  var arrow:Transform        ;
  var arrowHeight:float = 5  ;
  var arrowSmooth:float = 10 ;

  private var floorRotation    : Quaternion ;
  private var curNormal        : Vector3    ;
  private var smoothRotation   : float      ;
  private var distanceToGround : float      ;

  function Update(){
    var offSetVec  = Vector3(xform.position.x, xform.position.y+arrowHeight, xform.position.z) ;
    arrow.position = Vector3.Lerp(arrow.position, offSetVec, Time.deltaTime * arrowSmooth)     ;

    // rotation
		// angleH += wiiXform() * aimSpeedX * Time.deltaTime                                ;
		angleH += Mathf.Clamp(Input.GetAxis("Mouse X"), -1, 1) * aimSpeedX * Time.deltaTime ;
		angleV += Mathf.Clamp(Input.GetAxis("Mouse Y"), -1, 1) * aimSpeedY * Time.deltaTime ;
		angleV = Mathf.Clamp(angleV, aimVertMin, aimVertMax)                                ; // limit vertical angle

    // var aimRotation: Quaternion = Quaternion.Euler(-angleV, angleH, 0);
		var aimRotation: Quaternion = Quaternion.Euler(0, angleH, 0);
    if(Input.GetButton("Jump") && control.isGrounded){
      jump          = true                                                  ;
      curNormal     = Vector3.Lerp(curNormal, Vector3.up, 2*Time.deltaTime) ;
      floorRotation = Quaternion.FromToRotation(Vector3.up, curNormal)      ;
    }
    else{
      var hit:RaycastHit;
      if(Physics.Raycast(xform.position, -Vector3.up, hit)){
        Debug.DrawLine(xform.position, hit.point)                                ;
        distanceToGround = hit.distance                                          ;
        curNormal        = Vector3.Lerp(curNormal, hit.normal, 4*Time.deltaTime) ;
        floorRotation    = Quaternion.FromToRotation(Vector3.up, curNormal)      ;
        arrow.rotation   = floorRotation                                         ;
      }
    }
    xform.rotation = floorRotation * aimRotation ; //Note: With Quaternion, order matters x*y ! = y*x
    dash           = Input.GetButton("Fire2")    ;

    // move
    move = new Vector3(Input.GetAxis("Horizontal"), 0, Input.GetAxis("Vertical")) ;
    move.Normalize()                                                              ; //So diagonal xform are not faster, uses hypotneous
    move = xform.TransformDirection(move)                                         ; //Moves along direction object is facing: local co-ordinate

    super.Update()                                                                ;
    // rayCast();
  }

  function wiiXform(){
    var centerOffset = Screen.width*0.5;
    var mouseNorm = (Input.mousePosition.x-centerOffset)/centerOffset;
    return mouseNorm;
  }

  function OnControllerColliderHit(hit:ControllerColliderHit){
    // Debug.Log("I am hitting :"+hit.transform);
  }

  function rayCast(){
    var hit: RaycastHit;
    if(Physics.Raycast(xform.position, -Vector3.up, hit, 19)){
      print("There is something in front of the object: "+hit.transform);
    }
    else{
      print("Nothing here.");
    }
  }
}

