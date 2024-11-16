import ProductForm from "@/components/admincomponents/products/ProductForm";
import MainLayout from "@/components/admincomponents/MainLayout";

const CreateProduct = () => {
  return (
    <MainLayout>
      <ProductForm />
    </MainLayout>
  );
};

export const dynamic = "force-dynamic";
export default CreateProduct;
