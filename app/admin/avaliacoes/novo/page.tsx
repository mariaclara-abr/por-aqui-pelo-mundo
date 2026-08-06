import SiteReviewForm from "@/components/admin/SiteReviewForm";

export default function NovaAvaliacaoPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl text-tinta">Nova avaliação</h1>
      <div className="mt-6">
        <SiteReviewForm />
      </div>
    </div>
  );
}
