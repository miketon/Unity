Shader "MTON/CG Zbrush" {

  Properties {
    _Color("Main Color", Color) = (1.0, 1.0, 0.0, 0.5)
    _ColorMap("Texture", 2D)    = "white"{}
    _LookUpMap("Texture", 2D)    = "white"{}
  }
  SubShader{
    Pass{

      CGPROGRAM
#pragma vertex vert
#pragma fragment frag

#include "UnityCG.cginc"

        float4    _Color    ;
        sampler2D _ColorMap ;
        sampler2D _LookUpMap;

        struct v2f{
          float4 pos      : SV_POSITION ;
          float2 uv       : TEXCOORD0   ;
          float4 vLight   : TEXCOORD1   ; //.x=diffuse .y=specular .z=rim
          float4 tcLookUp : TEXCOORD2   ; //mul(ViewXf, float4(normalize(-IN.normal), 0.0))
          float3 color    : COLOR0      ;
        };

        float4 _ColorMap_ST  ; //WTF???
        float4 _LookUpMap_ST ; //WTF???

      v2f vert(appdata_base v){
        v2f o;
        o.pos = mul(UNITY_MATRIX_MVP, v.vertex);
        o.uv = TRANSFORM_TEX(v.texcoord, _ColorMap); //TRANSFORM_TEX macro from UnityCG.cginc for scale and offset
        /*o.uv = v.texcoord;*/
        /*o.color = v.normal * 0.5 + 0.5;*/
        o.color = _Color.rgb;

        o.vLight.x = dot(v.normal, float3(-1.0, 0.0, -1.0)); //diffuse

        o.tcLookUp = mul(UNITY_MATRIX_MV, float4(v.normal, 0.0)) *0.5 + 0.5;

        return o;
      }

      half4 frag(v2f in_VTX):COLOR{
        /*return half4(in_VTX.color, 1.0);*/
        half4 texcol = tex2D(_ColorMap, in_VTX.uv);
        half4 col_Zbrush = tex2D(_LookUpMap, in_VTX.tcLookUp.xy);
        /*return texcol * _Color * in_VTX.vLight.x;*/
        return col_Zbrush;
      }

      ENDCG
    }
  }
  Fallback "VertexLit"
}
