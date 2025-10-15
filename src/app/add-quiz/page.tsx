import AddQuizForm from "@/components/forms/AddQuizForm";

export default function AddQuiz() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Add a new quiz</h1>
      <AddQuizForm />
    </div>
  );
}
