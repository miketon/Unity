// Show list of all assets the assets listed in roots depend on.
// on the selected GameObject
// import UnityEditor;

class EditorUtilityCollectDeepHierarchy extends EditorWindow {

  var obj : GameObject = null;

  @MenuItem("AIE/Select Dependencies")
  static function Init() {
      var window = GetWindow(EditorUtilityCollectDeepHierarchy);
      window.position = Rect(100, 100, 250, 80);
      window.Show();
  }

  function OnInspectorUpdate() {
    Repaint();
  }

  function OnGUI() {
    obj = EditorGUI.ObjectField(Rect(3,3,position.width - 6, 20),
        "Find Dependency",
        obj,
        GameObject);

    if(obj)    {
      if(GUI.Button(Rect(3,25,position.width - 6, 20), "Check Dependencies"))
        Selection.objects = EditorUtility.CollectDeepHierarchy([obj]);
    } else {
      EditorGUI.LabelField(Rect(3,25,position.width - 6,20),
          "Missing:",
          "Select an object first");
    }
  }
}
