/*
 This camera smoothes out rotation around the y-axis and height.
 Horizontal Distance to the target is always fixed.

 There are many different ways to smooth the rotation but doing it this way gives you a lot of control over how the camera behaves.

 For every of those smoothed values we calculate the wanted value and the current value.
 Then we smooth it using the Lerp function.
 Then we apply the smoothed values to the transform's position.
*/

// Place the script in the Camera-Control group in the component menu
@script AddComponentMenu("Camera-Control/Smooth Follow")

// The target we are following
var targets   : Transform[] ;
var aimTarget : Transform   ;
var crossHair : Texture     ;

private var cameraIndex : int   = 0 ;
private var cameraRotX  : float = 0 ;
private var cursorBool  : boolean = true;

// mouse look
var cameraPitchMax  : float = 30  ;
var horizontalSpeed : float = 2.0 ;
var verticalSpeed   : float = 2.0 ;

// follow
var followSpeed : float = 30  ;
var distance    : float = 0.0 ; // The distance in the x-z plane to the target
var height      : float = 0.0 ; // the height we want the camera to be above the target

function Start(){
    // Screen.showCursor = cursorBool;
    // Screen.lockCursor= cursorBool;
}

function Update(){
}

function LateUpdate(){
  // Early out if we don't have a target
  if(Input.GetKeyDown(KeyCode.Tab)){
    cameraIndex = (cameraIndex+1)%targets.length;
    cursorBool = !cursorBool;
    // Screen.showCursor = cursorBool;
    Screen.lockCursor= cursorBool;
  } 
  if (targets[cameraIndex]){
    // var camPosition = targets[cameraIndex].position + Vector3(0, height, distance);
    // transform.position = Vector3.Lerp(transform.position, camPosition, Time.deltaTime * followSpeed) ;
    transform.position = Vector3.Lerp(transform.position, targets[cameraIndex].position, Time.deltaTime * followSpeed) ;
    transform.rotation = targets[cameraIndex].rotation; 
    // transform.rotation = targets[cameraIndex].rotation + Quaternion.Euler(height, 0, 0);                                                               ;

		// Quaternion camYRotation = Quaternion.Euler(0, angleH, 0);
    cameraRotX -= Input.GetAxis("Mouse Y")                                           ;
    cameraRotX = Mathf.Clamp(cameraRotX, -cameraPitchMax, cameraPitchMax*0.25)       ;
    // transform.forward = transform.forward + Vector3(0, height, distance) ;
    // transform.Rotate(cameraRotX, 0, 0)                                   ;
    // transform.LookAt(targets[cameraIndex]);
  }
}

function OnGUI(){
  var h_Offset = Screen.width*0.5-crossHair.width*0.5                                         ;
  var v_Offset = Screen.height*0.5-crossHair.height*0.5                                       ;
  GUI.DrawTexture(new Rect(h_Offset, v_Offset, crossHair.width, crossHair.height), crossHair) ;
}


