// Menu item to apply Collider to objects in scene
// 1) By looping recursively through the children of selection
// 2) If child doesn't have a collider and is renderable : Assign MeshCollider

class Editor_ApplyCollider extends ScriptableObject{
  @MenuItem("AIE/ApplyCollider") // static functions only, turns them into menu commands
  static function ApplyCollider(){
    var selection : Transform[] = Selection.GetTransforms(SelectionMode.Deep| SelectionMode.Editable) ;
    var sCollider : Collider                                                                          ;
    var mRender   : MeshRenderer                                                                      ;

    for(var t:Transform in selection){
      sCollider = t.GetComponent(Collider);
      if(!sCollider){ //if selected object doesn't have an existing collider
        Debug.Log("This " + t.name + " has no Collider :"+ t.GetComponent(Collider));
        mRender = t.GetComponent(MeshRenderer);
        if(mRender){ // and has a mesh renderer, attach a mesh collider component
          Debug.Log("This " + t.name + " has a MeshRenderer:"+ t.GetComponent(MeshRenderer));
          t.gameObject.AddComponent(MeshCollider);
        }
      }
    }
  }
  @MenuItem("AIE/ApplyCollider", true) //validating menu only if true
  static function ValidatedApplyCollider(){
    return Selection.activeTransform != null; //if nothing selected, grey out function in menu
  }
}
