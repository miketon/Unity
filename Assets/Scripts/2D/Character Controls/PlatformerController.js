private var controller : CharacterController          ;
var spawnPoint         : Transform                    ; // The character will spawn at spawnPoint's position when needed.  This could be changed via a script at runtime to implement, e.g. waypoints/savepoints.
var movement           : PlatformerControllerMovement ;
var jump               : PlatformerControllerJumping  ;
var zDepth = 0.5;

// Moving platform support.
private var activePlatform            : Transform ;
private var activeLocalPlatformPoint  : Vector3   ;
private var activeGlobalPlatformPoint : Vector3   ;
private var lastPlatformVelocity      : Vector3   ;
private var areEmittersOn = false                 ; // This is used to keep track of special effects in UpdateEffects () ;

class PlatformerControllerMovement {
	var walkSpeed = 3.0  ;
	var runSpeed  = 10.0 ;

	var speedSmoothing    = 5.0  ; // How fast does the character change speeds?  Higher is faster.
  var rotationSmoothing = 10.0 ; // This controls how fast the graphics of the character "turn around" when the player turns around using the controls.

	// The gravity for the character
	var gravity      = 60.0;
	var maxFallSpeed = 20.0;
	var inAirControlAcceleration = 1.0;

	// The current move direction in x-y.  This will always been (1,0,0) or (-1,0,0)
	internal var direction     = Vector3.zero    ;
  internal var verticalSpeed = 0.0             ;
	internal var speed         = 0.0             ; // The current movement speed.  This gets smoothed by speedSmoothing.
	internal var isMoving      = false           ; // Is the user pressing the left or right movement keys?
	internal var collisionFlags : CollisionFlags ; // The last collision flags returned from controller.Move
	internal var velocity       : Vector3        ; // We will keep track of an approximation of the character's current velocity, so that we return it from GetVelocity () for our camera to use for prediction.
	internal var inAirVelocity = Vector3.zero    ; // This keeps track of our current velocity while we're not grounded?
	internal var hangTime      = 0.0             ; // This will keep track of how long we have we been in the air (not grounded)
}


// We will contain all the jumping related variables in one helper class for clarity.
class PlatformerControllerJumping {
	var enabled     = true  ; // Can the character jump?
	var height      = 1.0   ; // How high do we jump when pressing jump and letting go immediately
	var extraHeight = 4.1   ; // We add extraHeight units (meters) on top when holding the button down longer while jumping
	var repeatTime  = 0.05  ; // This prevents inordinarily too quick jumping
	var timeout     = 0.15  ;

	internal var jumping         = false ; // Are we jumping? (Initiated with jump button and not grounded yet)
	internal var reachedApex     = false ;
	internal var lastButtonTime  = -10.0 ; // Last time the jump button was clicked down
	internal var lastTime        = -1.0  ; // Last time we performed a jump
	internal var lastStartHeight = 0.0   ; // the height we jumped from (Used to determine for how long to apply extra jump power after jumping.)
}


function Awake () {
	movement.direction = transform.TransformDirection (Vector3.forward) ;
	controller         = GetComponent (CharacterController)             ;
	Spawn ()                                                            ;
}

function UpdateSmoothedMovementDirection () {	
	var h = Input.GetAxisRaw ("Horizontal");
	
	movement.isMoving = Mathf.Abs (h) > 0.1;
		
	if (movement.isMoving)
		movement.direction = Vector3 (h, 0, 0);
	
	// Grounded controls
	if (controller.isGrounded) {
		// Smooth the speed based on the current target direction
		var curSmooth = movement.speedSmoothing * Time.deltaTime;
		
		// Choose target speed
		var targetSpeed = Mathf.Min (Mathf.Abs(h), 1.0);
	
		// Pick speed modifier
		if (Input.GetButton ("Fire2"))
			targetSpeed *= movement.runSpeed;
		else
			targetSpeed *= movement.walkSpeed;
		
		movement.speed = Mathf.Lerp (movement.speed, targetSpeed, curSmooth);
		
		movement.hangTime = 0.0;
	}
	else {
		// In air controls
		movement.hangTime += Time.deltaTime;
		if (movement.isMoving)
			movement.inAirVelocity += Vector3 (Mathf.Sign(h), 0, 0) * Time.deltaTime * movement.inAirControlAcceleration;
	}
}

function FixedUpdate () {
	// Make sure we are absolutely always in the 2D plane.
	transform.position.z = zDepth;
}

function ApplyJumping () {
	// Prevent jumping too fast after each other
	if (jump.lastTime + jump.repeatTime > Time.time)
		return;

	if (controller.isGrounded) {
		// Jump
		// - Only when pressing the button down
		// - With a timeout so you can press the button slightly before landing		
		if (jump.enabled && Time.time < jump.lastButtonTime + jump.timeout) {
			movement.verticalSpeed = CalculateJumpVerticalSpeed (jump.height);
			movement.inAirVelocity = lastPlatformVelocity;
			SendMessage ("DidJump", SendMessageOptions.DontRequireReceiver);
		}
	}
}

function ApplyGravity () {
	// Apply gravity
	var jumpButton = Input.GetButton ("Jump");
	
	// When we reach the apex of the jump we send out a message
	if (jump.jumping && !jump.reachedApex && movement.verticalSpeed <= 0.0) {
		jump.reachedApex = true;
		SendMessage ("DidJumpReachApex", SendMessageOptions.DontRequireReceiver);
	}
	
	// * When jumping up we don't apply gravity for some time when the user is holding the jump button
	//   This gives more control over jump height by pressing the button longer
	var extraPowerJump =  jump.jumping && movement.verticalSpeed > 0.0 && jumpButton && transform.position.y < jump.lastStartHeight + jump.extraHeight && !IsTouchingCeiling ();
	
	if (extraPowerJump)
		return;
	else if (controller.isGrounded)
		movement.verticalSpeed = -movement.gravity * Time.deltaTime;
	else
		movement.verticalSpeed -= movement.gravity * Time.deltaTime;
		
	// Make sure we don't fall any faster than maxFallSpeed.  This gives our character a terminal velocity.
	movement.verticalSpeed = Mathf.Max (movement.verticalSpeed, -movement.maxFallSpeed);
}

function CalculateJumpVerticalSpeed (targetJumpHeight : float) {
	// From the jump height and gravity we deduce the upwards speed 
	// for the character to reach at the apex.
	return Mathf.Sqrt (2 * targetJumpHeight * movement.gravity);
}

function DidJump () {
	jump.jumping = true;
	jump.reachedApex = false;
	jump.lastTime = Time.time;
	jump.lastStartHeight = transform.position.y;
	jump.lastButtonTime = -10;
}

function UpdateEffects () {
	wereEmittersOn = areEmittersOn;
	areEmittersOn = jump.jumping && movement.verticalSpeed > 0.0;
	
	// By comparing the previous value of areEmittersOn to the new one, we will only update the particle emitters when needed
	if (wereEmittersOn != areEmittersOn) {
		for (var emitter in GetComponentsInChildren (ParticleEmitter)) {
			emitter.emit = areEmittersOn;
		}
	}
}

function Update () {
	if (Input.GetButtonDown ("Jump")) {
		jump.lastButtonTime = Time.time;
	}

	UpdateSmoothedMovementDirection();
	
	// Apply gravity
	// - extra power jump modifies gravity
	ApplyGravity ();

	// Apply jumping logic
	ApplyJumping ();
	
	// Moving platform support
	if (activePlatform != null) {
		var newGlobalPlatformPoint = activePlatform.TransformPoint(activeLocalPlatformPoint);
		var moveDistance = (newGlobalPlatformPoint - activeGlobalPlatformPoint);
		transform.position = transform.position + moveDistance;
		lastPlatformVelocity = (newGlobalPlatformPoint - activeGlobalPlatformPoint) / Time.deltaTime;
	} else {
		lastPlatformVelocity = Vector3.zero;	
	}
	
	activePlatform = null;
	
	// Save lastPosition for velocity calculation.
	lastPosition = transform.position;
	
	// Calculate actual motion
	var currentMovementOffset = movement.direction * movement.speed + Vector3 (0, movement.verticalSpeed, 0) + movement.inAirVelocity;
	
	// We always want the movement to be framerate independent.  Multiplying by Time.deltaTime does this.
	currentMovementOffset *= Time.deltaTime;
	
   	// Move our character!
	// movement.collisionFlags = controller.Move (Vector3(currentMovementOffset.x, currentMovementOffset.y, zDepth));
	movement.collisionFlags = controller.Move (currentMovementOffset);
	
	// Calculate the velocity based on the current and previous position.  
	// This means our velocity will only be the amount the character actually moved as a result of collisions.
	movement.velocity = (transform.position - lastPosition) / Time.deltaTime;
	
	// Moving platforms support
	if (activePlatform != null) {
		activeGlobalPlatformPoint = transform.position;
		activeLocalPlatformPoint = activePlatform.InverseTransformPoint (transform.position);
	}
	
	// Set rotation to the move direction	
	if (movement.direction.sqrMagnitude > 0.01)
		transform.rotation = Quaternion.Slerp (transform.rotation, Quaternion.LookRotation (movement.direction), Time.deltaTime * movement.rotationSmoothing);
	
	// We are in jump mode but just became grounded
	if (controller.isGrounded) {
		movement.inAirVelocity = Vector3.zero;
		if (jump.jumping) {
			jump.jumping = false;
			SendMessage ("DidLand", SendMessageOptions.DontRequireReceiver);

			var jumpMoveDirection = movement.direction * movement.speed + movement.inAirVelocity;
			if (jumpMoveDirection.sqrMagnitude > 0.01)
				movement.direction = jumpMoveDirection.normalized;
		}
	}	

	// Update special effects like rocket pack particle effects
	UpdateEffects ();
}

function OnControllerColliderHit (hit : ControllerColliderHit)
{
	if (hit.moveDirection.y > 0.01) 
		return;
	
	// Make sure we are really standing on a straight platform
	// Not on the underside of one and not falling down from it either!
	if (hit.moveDirection.y < -0.9 && hit.normal.y > 0.9) {
		activePlatform = hit.collider.transform;	
	}
}

function OnDeath () {
	Spawn ();
}

function Spawn () {
	// reset the character's speed
	movement.verticalSpeed = 0.0;
	movement.speed         = 0.0;
	
	// reset the character's position to the spawnPoint
	transform.position = spawnPoint.position;
}

// Various helper functions below:
function GetSpeed () {
	return movement.speed;
}
function GetVelocity () {
	return movement.velocity;
}
function IsMoving () {
	return movement.isMoving;
}
function IsJumping () {
	return jump.jumping;
}
function IsTouchingCeiling () {
	return (movement.collisionFlags & CollisionFlags.CollidedAbove) != 0;
}
function GetDirection () {
	return movement.direction;
}
function GetHangTime() {
	return movement.hangTime;
}
function Reset () {
	gameObject.tag = "Player";
}

// Require a character controller to be attached to the same game object
@script RequireComponent (CharacterController)
@script AddComponentMenu ("2D Platformer/Platformer Controller")
