import type { Database } from "@/types/database";
import SiteReviewSubmitForm from "@/components/SiteReviewSubmitForm";

type SiteReview = Database["public"]["Tables"]["site_reviews"]["Row"];

export default function SiteReviewsSection({
  reviews,
}: {
  reviews: SiteReview[];
}) {
  return (
    <section id="avaliacoes" className="bg-areia px-4 py-20 sm:px-6 sm:py-24 lg:px-10">
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
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

                <blockquote className="flex-1 text-sm leading-relaxed text-tinta">
                  &ldquo;{review.comment}&rdquo;
                </blockquote>

                <figcaption className="font-serif text-base text-tinta">
                  {review.reviewer_name}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
