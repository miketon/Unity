private var clothObj:InteractiveCloth;
var externalAccelX = 15;

function Start(){
  clothObj = this.GetComponent("InteractiveCloth");
}

function Update(){
  // print("clothState:"+this.GetComponent("InteractiveCloth").externalAcceleration);
  var flipDirection = -Mathf.Round(this.transform.rotation.y);
  clothObj.externalAcceleration.x = flipDirection * externalAccelX;
}
