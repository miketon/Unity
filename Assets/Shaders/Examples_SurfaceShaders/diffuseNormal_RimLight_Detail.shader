  Shader "Example/Rim_Detail" {
    Properties {
      MainTex ("Texture", 2D) = "white" {}
      BumpMap ("Bumpmap", 2D) = "bump" {}
      Detail ("Detail", 2D) = "gray" {}
      RimColor ("Rim Color", Color) = (0.26,0.19,0.16,0.0)
      RimPower ("Rim Power", Range(0.5,8.0)) = 3.0
    }
    SubShader {
      Tags { "RenderType" = "Opaque" }
      CGPROGRAM
      #pragma surface surf Lambert
      struct Input {
          float2 uvMainTex;
          float2 uvBumpMap;
          float3 viewDir;
          float2 uvDetail;
      };
      sampler2D MainTex;
      sampler2D BumpMap;
      sampler2D Detail;
      float4 RimColor;
      float RimPower;
      void surf (Input IN, inout SurfaceOutput o) {
          o.Albedo = tex2D (MainTex, IN.uvMainTex).rgb;
          o.Normal = UnpackNormal (tex2D (BumpMap, IN.uvBumpMap));
          half rim = pow(1.0 - saturate(dot (normalize(IN.viewDir), o.Normal)), RimPower);
          o.Emission = RimColor.rgb * rim;
          o.Albedo *= (tex2D (Detail, IN.uvDetail).rgb + rim) * 1.0;
      }
      ENDCG
    } 
    Fallback "Diffuse"
  }