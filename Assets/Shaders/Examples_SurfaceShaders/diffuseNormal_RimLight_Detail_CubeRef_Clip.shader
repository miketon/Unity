  Shader "Example/Rim_Detail_Reflection_Clip" {
    Properties {
      MainTex ("Texture", 2D) = "white" {}
      BumpMap ("Bumpmap", 2D) = "bump" {}
      CubeMap ("Cubemap", CUBE) = "" {}
      Detail ("Detail", 2D) = "gray" {}
      RimColor ("Rim Color", Color) = (0.26,0.19,0.16,0.0)
      RimPower ("Rim Power", Range(0.5,8.0)) = 3.0
    }
    SubShader {
      Tags { "RenderType" = "Opaque" }
      Cull Off
      CGPROGRAM
      #pragma surface surf Lambert
      struct Input {
      	  //vector from environment/runtime
          float3 viewDir;  
          float3 worldRefl;
          float3 worldPos;
          
          //uv Macros so each map can have it's own scale
          float2 uvMainTex; 
          //float2 uvBumpMap;
          float2 uvDetail;
          INTERNAL_DATA    
      };
      
      samplerCUBE CubeMap;
      sampler2D MainTex;
      sampler2D BumpMap;
      //sampler2D Detail;
      
      float4 RimColor;
      float RimPower;
      
      void surf (Input IN, inout SurfaceOutput o) {
      	  clip (frac((IN.worldPos.y+IN.worldPos.z*0.01) * 3) - 0.5); //  "slices" the object by discarding pixels in nearly horizontal rings. It does that by using clip() Cg/HLSL function based on world position of a pixel
          //float detail = tex2D (Detail, IN.uvDetail).g;
          o.Albedo = tex2D (MainTex, IN.uvMainTex).rgb;
          o.Normal = UnpackNormal (tex2D (BumpMap, IN.uvMainTex));
          //half rim = pow(1.0 - saturate(dot (normalize(IN.viewDir), o.Normal)), RimPower);
          //o.Emission = texCUBE (CubeMap, IN.worldRefl).rgb; //vertex reflection
          //o.Emission = texCUBE (CubeMap, WorldReflectionVector (IN, o.Normal)).rgb; // * detail; //pixel reflection
          //o.Emission *= RimColor.rgb * rim;
          //o.Albedo *= (tex2D (Detail, IN.uvDetail).rgb + rim) * 1.0;
      }
      ENDCG
    } 
    Fallback "Diffuse"
  }