  Shader "Example/Diffuse Texture" {
    Properties {
      MainTex ("Texture", 2D) = "white" {}
    }
    SubShader {
      Tags { "RenderType" = "Opaque" }
      CGPROGRAM
      #pragma surface surf Lambert
      struct Input {
          float2 uvMainTex;
      };
      sampler2D MainTex;
      void surf (Input IN, inout SurfaceOutput o) {
          o.Albedo = tex2D (MainTex, IN.uvMainTex).rgb;
      }
      ENDCG
    } 
    Fallback "Diffuse"
  }