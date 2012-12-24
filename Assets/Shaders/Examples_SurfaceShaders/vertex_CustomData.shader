Shader "Example/Custom Vertex Data" {
    Properties {
      MainTex ("Texture", 2D) = "white" {}
      MatCap ("MatCap", 2D) = "white" {}
      MatCapBlend ("MatCap Amount", Range(0,1)) = 0.25
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
          float2 tcLookUp;
      };
      float Amount;
      float MatCapBlend;
      void vert (inout appdata_full v, out Input o) {
          //o.customColor = (v.normal *0.5 +0.5);
          //v.vertex.xyz += v.normal * Amount;
          float3 viewDir = WorldSpaceViewDir(v.vertex);
          o.customColor = 1.0 - saturate(dot (normalize(viewDir), v.normal));
          o.tcLookUp = (mul(UNITY_MATRIX_MV, float4(v.normal, 0.0)) *0.5 + 0.5).xy;
      }
      sampler2D MainTex;
      sampler2D MatCap;
      void surf (Input IN, inout SurfaceOutput o) {
          //o.Albedo = tex2D (MainTex, IN.uvMainTex).rgb;
          o.Albedo = (tex2D(MainTex, IN.uvMainTex).rgb * (1.0-IN.customColor)) + (tex2D (MatCap, IN.tcLookUp).rgb * MatCapBlend * IN.customColor);
          //o.Albedo = tex2D (MatCap, IN.tcLookUp).rgb;
          //o.Albedo = IN.customColor;
      }
      ENDCG
    } 
    Fallback "Diffuse"
}
