import HeroPhotoStack from "@/components/HeroPhotoStack";

const photo = (fill: string) =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='100%25' height='100%25' fill='%23${fill}'/%3E%3C/svg%3E`;

export function ThreePhotos() {
  return (
    <div className="w-[520px] bg-branco p-6">
      <HeroPhotoStack
        photos={[
          { url: photo("C1653A"), alt: "Rua de Lisboa" },
          { url: photo("4A5D43"), alt: "Praia do Algarve" },
          { url: photo("2B2620"), alt: "Serra da Estrela" },
        ]}
      />
    </div>
  );
}

export function NoPhotos() {
  return (
    <div className="w-[520px] bg-branco p-6">
      <HeroPhotoStack photos={[]} />
    </div>
  );
}
