Shader "Example/Diffuse Simple" {
    SubShader {
      Tags { "RenderType" = "Opaque" }
      CGPROGRAM
      #pragma surface surf Lambert
      struct Input {
          float4 color : COLOR;
      };
      void surf (Input IN, inout SurfaceOutput o) {
          o.Albedo = float4(1.0, 1.0, 0.0, 1.0);
      }
      ENDCG
    }
    Fallback "Diffuse"
}