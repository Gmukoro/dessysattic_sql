import ProductForm from "@/components/products/ProductForm";
import MainLayout from "@/components/MainLayout";

const CreateProduct = () => {
  return (
    <MainLayout>
      <ProductForm />
    </MainLayout>
  );
};

export const dynamic = "force-dynamic";
export default CreateProduct;
