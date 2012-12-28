  Shader "Example/BackFaceOn" {
    Properties {
      _Color("Main Color", Color)=(1,1,1,0)
      _SpecColor("Spec Color", Color)=(1,1,1,1)
      _Emission("Emissive Color", Color)=(0,0,0,0)
      _Shininess("_Shininess", Range(0.01, 1.0))=0.7
      _MainTex ("Base (RGB)", 2D) = "white" {}
    }
    SubShader {
      Material{
        Diffuse[_Color]
        Ambient[_Color]
        Specular[_SpecColor]
        Shininess[_Shininess]
        Emission[_Emission]
      }
	  Lighting On
	  SeparateSpecular On
	  Blend SrcAlpha OneMinusSrcAlpha
	  Pass{
	  	Cull Front
	  	SetTexture [_MainTex] {
	  		Combine Primary * Texture
	  	}
	  }
	  Pass{
	  	Cull Back
	  	SetTexture [_MainTex] {
	  		Combine Primary * Texture
	  	}
	  }
    } 
    Fallback "Diffuse"
  }