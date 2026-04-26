import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "BraidedByMae — African Hair Braiding";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const taglines: Record<string, string> = {
  fr: "L'art des tresses africaines",
  en: "The art of African braiding",
  de: "Die Kunst des afrikanischen Flechtens",
};

export default async function OGImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tagline = taglines[locale] || taglines.fr;

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
          background: "linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div style={{ fontSize: "24px", color: "#D4AF37", letterSpacing: "0.15em" }}>
            {tagline}
          </div>
          <div style={{ fontSize: "72px", fontWeight: 700, color: "#F5F0F2" }}>
            BraidedByMae
          </div>
          <div
            style={{
              width: "80px",
              height: "4px",
              background: "#E8A0BF",
              borderRadius: "2px",
              marginTop: "8px",
            }}
          />
          <div style={{ fontSize: "20px", color: "#A0A0A0", marginTop: "8px" }}>
            Nuremberg &bull; Fürth &bull; Erlangen &bull; Bamberg
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
