import { getCollections } from "@/lib/actions/actions";
import { CollectionType } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

const Collections = async () => {
  const collections = await getCollections();

  return (
    <div className="flex flex-col items-center gap-10 py-8 px-5">
      <p className="text-heading2-bold text-4xl font-bold relative bg-gradient-to-r text-neutral-600 px-20">
        Collections
      </p>
      {!collections || collections.length === 0 ? (
        <p className="text-body-bold">No collections found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-center justify-center">
          {collections.map((collection: CollectionType) => (
            <Link href={`/collections/${collection._id}`} key={collection._id}>
              <Image
                key={collection._id}
                src={collection.image}
                alt={collection.title}
                width={350}
                height={200}
                className="rounded-lg cursor-pointer transition-transform transform hover:scale-105"
              />
              <p className="text-center text-lg font-semibold mt-2">
                {collection.title}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Collections;
