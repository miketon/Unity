  Shader "Example/Diffuse Bump" {
    Properties {
      MainTex ("Texture", 2D) = "white" {}
      BumpMap ("Bumpmap", 2D) = "bump" {}
    }
    SubShader {
      Tags { "RenderType" = "Opaque" }
      CGPROGRAM
      #pragma surface surf Lambert
      struct Input {
        float2 uvMainTex;
        float2 uvBumpMap;
      };
      sampler2D MainTex;
      sampler2D BumpMap;
      void surf (Input IN, inout SurfaceOutput o) {
        o.Albedo = tex2D (MainTex, IN.uvMainTex).rgb;
        o.Normal = UnpackNormal (tex2D (BumpMap, IN.uvBumpMap));
      }
      ENDCG
    } 
    Fallback "Diffuse"
  }