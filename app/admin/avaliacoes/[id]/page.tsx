import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import SiteReviewForm from "@/components/admin/SiteReviewForm";

export default async function EditarAvaliacaoPage(
  props: PageProps<"/admin/avaliacoes/[id]">,
) {
  const { id } = await props.params;
  const supabase = await createClient();
  const { data: review } = await supabase
    .from("site_reviews")
    .select("*")
    .eq("id", id)
    .single();

  if (!review) {
    notFound();
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-tinta">
        Editar avaliação de {review.reviewer_name}
      </h1>
      <div className="mt-6">
        <SiteReviewForm review={review} />
      </div>
    </div>
  );
}
