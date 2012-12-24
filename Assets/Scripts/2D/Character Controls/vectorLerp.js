private var spawnPos;
private var offSetPos;
private var posTarget = Vector3.zero;
// private var velocity = Vector3.zero;

function Start(){
  spawnPos = transform.position; 
  offSetPos = spawnPos + Vector3(3.0, 0.0, 0.0);
}

function LateUpdate(){
  var velocity = Vector3.zero;
  if(Input.GetKey(KeyCode.O)){
    // transform.position = spawnPos;
    // transform.position = Vector3.SmoothDamp(transform.position, spawnPos, velocity, 0.3);
    posTarget = spawnPos; 
  }
  else if(Input.GetKey(KeyCode.P)){
    // transform.position = offSetPos;
    posTarget = offSetPos;
  }
  transform.position = Vector3.SmoothDamp(transform.position, posTarget, velocity, 0.1);
}
