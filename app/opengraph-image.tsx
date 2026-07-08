import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #fdf6f2 0%, #f4c6d7 50%, #cdbdec 100%)",
        }}
      >
        <div style={{ fontSize: 160, display: "flex" }}>⛺️</div>
        <div
          style={{
            marginTop: 16,
            fontSize: 88,
            fontWeight: 700,
            color: "#a6417a",
            display: "flex",
          }}
        >
          Lá Na Cabaninha
        </div>
        <div style={{ marginTop: 12, fontSize: 32, color: "#6b5271", display: "flex" }}>
          Organização de festas, financeiro e atendimento em um só lugar
        </div>
      </div>
    ),
    { ...size }
  );
}
