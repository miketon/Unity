Shader "MTON/CG SampleFromDirLight" {

CGINCLUDE

#include "UnityCG.cginc"
#include "AutoLight.cginc"
#include "Lighting.cginc"

uniform sampler2D _MainTex;

ENDCG

  Properties {
    _Color("Main Color", Color) = (1.0, 1.0, 0.0, 0.5)
    _ColorMap("Texture", 2D)    = "white"{}
    _LookUpMap("Texture", 2D)    = "white"{}
  }
  SubShader{
    Pass{
Tags { "RenderType"="Opaque" }
    LOD 200
    
       Lighting On

       Tags {"LightMode" = "ForwardBase"}

       CGPROGRAM

       #pragma vertex vert
       #pragma fragment frag
       #pragma multi_compile_fwdbase

       struct VSOut
       {
         float4 pos     : SV_POSITION;
         float2 uv       : TEXCOORD1;
         LIGHTING_COORDS(3,4)
       };

       VSOut vert(appdata_tan v)
       {
         VSOut o;
         o.pos = mul(UNITY_MATRIX_MVP, v.vertex);
         o.uv = v.texcoord.xy;

         TRANSFER_VERTEX_TO_FRAGMENT(o);

         return o;
       }

       float4 frag(VSOut i) : COLOR
       {
         float3 lightColor = _LightColor0.rgb;
       /*
         float3 lightDir = _WorldSpaceLightPos0;
         float4 colorTex = tex2D(_MainTex, i.uv.xy * float2(25.0f));
         float  atten = LIGHT_ATTENUATION(i);
         float3 N = float3(0.0f, 1.0f, 0.0f);
         float  NL = saturate(dot(N, lightDir));

         float3 color = colorTex.rgb * lightColor * NL * atten;
         return float4(color, colorTex.a);
       */
         return float4(lightColor, 1.0);
       }

       ENDCG
    }
  }
  Fallback "VertexLit"
}