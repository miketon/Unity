Shader "Example/Normal Extrusion" {
    Properties {
      MainTex ("Texture", 2D) = "white" {}
      Amount ("Extrusion Amount", Range(-1,1)) = 0.5
    }
    SubShader {
      Tags { "RenderType" = "Opaque" }
      CGPROGRAM
      #pragma surface surf Lambert vertex:vert
      struct Input {
          float2 uvMainTex;
      };
      float Amount;
      void vert (inout appdata_full v) {
          v.vertex.xyz += v.normal * Amount;
      }
      sampler2D MainTex;
      void surf (Input IN, inout SurfaceOutput o) {
          o.Albedo = tex2D (MainTex, IN.uvMainTex).rgb;
      }
      ENDCG
    } 
    Fallback "Diffuse"
}