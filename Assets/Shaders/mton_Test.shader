Shader "MTON/Diffuse Simple Surface" {
/*
  Properties{
    _MainTex("Texture", 2D) = "white"{}
  }
*/
  SubShader {
    Tags { "RenderType" = "Opaque" }
    CGPROGRAM
    #pragma surface surf Lambert
    struct Input {
      float4 color : COLOR;
      float2 uv_MainTex;
    };
    void surf (Input IN, inout SurfaceOutput o) {
      //o.Albedo = 1;
      o.Albedo = float3(0.0, 1.0, 0.0);
    }
    ENDCG
  }
  Fallback "Diffuse"
}
