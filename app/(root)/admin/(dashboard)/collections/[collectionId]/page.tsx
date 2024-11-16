"use client";

import { useEffect, useState, useCallback } from "react";
import { getCollectionDetails } from "@/utils/dataFetchers";
import Loader from "@/components/admincomponents/custom ui/Loader";
import CollectionForm from "@/components/admincomponents/collections/CollectionForm";
import MainLayout from "@/components/admincomponents/MainLayout";

const CollectionDetails = ({
  params,
}: {
  params: { collectionId: string };
}) => {
  const [loading, setLoading] = useState(true);
  const [collectionDetails, setCollectionDetails] =
    useState<CollectionType | null>(null);

  const fetchCollectionDetails = useCallback(async () => {
    const data = await getCollectionDetails(params.collectionId);
    setCollectionDetails(data);
    setLoading(false);
  }, [params.collectionId]);

  useEffect(() => {
    fetchCollectionDetails();
  }, [fetchCollectionDetails]);

  return loading ? (
    <Loader />
  ) : (
    <MainLayout>
      <CollectionForm initialData={collectionDetails} />
    </MainLayout>
  );
};

export const dynamic = "force-dynamic";

export default CollectionDetails;
