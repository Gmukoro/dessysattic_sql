import CollectionForm from "@/components/collections/CollectionForm";
import MainLayout from "@/components/MainLayout";

const CreateCollection = () => {
  return (
    <MainLayout>
      <CollectionForm />
    </MainLayout>
  );
};

export const dynamic = "force-dynamic";

export default CreateCollection;
