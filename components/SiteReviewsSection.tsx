import Link from "next/link";
import Image from "next/image";
import type { SiteReviewWithProfile } from "@/lib/queries";
import SiteReviewSubmitForm from "@/components/SiteReviewSubmitForm";
import { linkify } from "@/components/Linkify";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function ReviewerLink({
  review,
  className,
  children,
}: {
  review: SiteReviewWithProfile;
  className?: string;
  children: React.ReactNode;
}) {
  if (!review.reviewerUsername) return <span className={className}>{children}</span>;
  return (
    <Link href={`/perfil/${review.reviewerUsername}`} className={className}>
      {children}
    </Link>
  );
}

function ReviewerAvatar({ review }: { review: SiteReviewWithProfile }) {
  return (
    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-oliva text-xs font-medium text-white">
      {review.reviewerAvatarUrl ? (
        <Image
          src={review.reviewerAvatarUrl}
          alt=""
          fill
          unoptimized
          sizes="36px"
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          {review.reviewerName.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
}

export default function SiteReviewsSection({
  reviews,
}: {
  reviews: SiteReviewWithProfile[];
}) {
  return (
    <section id="avaliacoes" className="bg-areia px-4 py-14 sm:px-6 sm:py-24 lg:px-10">
      <div className="mx-auto max-w-[1440px]">
        <h2 className="text-center font-serif text-3xl text-tinta sm:text-4xl">
          Quem usou, aprova
        </h2>
        <p className="mt-2 text-center text-oliva">
          Opiniões de pessoas que já planejaram a viagem por aqui.
        </p>

        <div className="mt-8">
          <SiteReviewSubmitForm />
        </div>

        {reviews.length > 0 && (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {reviews.map((review) => (
              <figure
                key={review.id}
                className="flex flex-col gap-3 rounded-xl bg-branco p-6 shadow-sm"
              >
                <div className="flex gap-0.5" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <svg
                      key={index}
                      viewBox="0 0 20 20"
                      className={`h-4 w-4 ${
                        index < review.rating ? "fill-terracota" : "fill-tinta/15"
                      }`}
                    >
                      <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6z" />
                    </svg>
                  ))}
                </div>
                <span className="sr-only">{`Avaliação: ${review.rating} de 5 estrelas`}</span>

                <blockquote className="flex-1 whitespace-pre-line text-sm leading-relaxed text-tinta">
                  &ldquo;{linkify(review.comment)}&rdquo;
                </blockquote>

                <figcaption className="flex items-center gap-3">
                  <ReviewerLink review={review}>
                    <ReviewerAvatar review={review} />
                  </ReviewerLink>
                  <div className="min-w-0">
                    <ReviewerLink
                      review={review}
                      className="block truncate font-serif text-base text-tinta hover:text-terracota hover:underline"
                    >
                      {review.reviewerName}
                    </ReviewerLink>
                    <p className="text-xs text-oliva">{formatDate(review.createdAt)}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
