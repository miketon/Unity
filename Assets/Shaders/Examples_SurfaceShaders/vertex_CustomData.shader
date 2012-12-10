Shader "Example/Custom Vertex Data" {
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
          float3 viewDir;
          float3 customColor;
      };
      float Amount;
      void vert (inout appdata_full v, out Input o) {
          o.customColor = (v.normal *0.5 +0.5);
          //o.customColor = 1.0 - saturate(dot (normalize(o.viewDir), v.normal));
          //v.vertex.xyz += v.normal * Amount;
      }
      sampler2D MainTex;
      void surf (Input IN, inout SurfaceOutput o) {
          //o.Albedo = tex2D (MainTex, IN.uvMainTex).rgb;
          o.Albedo = IN.customColor;
      }
      ENDCG
    } 
    Fallback "Diffuse"
}
