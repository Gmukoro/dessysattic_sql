import CollectionForm from "@/components/admincomponents/collections/CollectionForm";
import MainLayout from "@/components/admincomponents/MainLayout";

const CreateCollection = () => {
  return (
    <MainLayout>
      <CollectionForm />
    </MainLayout>
  );
};

export const dynamic = "force-dynamic";

export default CreateCollection;
