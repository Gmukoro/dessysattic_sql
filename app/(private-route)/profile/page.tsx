"use client";

import { FC, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Loader } from "lucide-react";
import { Button } from "@nextui-org/react";

const Profile: FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const defaultAvatar =
    "https://res.cloudinary.com/dsonuae0l/image/upload/v1730193086/avartar_byu4f1.png";

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin" />
      </div>
    );
  }

  const user = session?.user as {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
    avatar?: string;
    verified?: boolean;
  };

  const { id, name, email, role, avatar, verified = false } = user || {};

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="profile-container flex flex-col items-center bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-heading2-bold text-red-1 mb-4">Profile Details</h1>
        <div className="mb-4">
          <Image
            src={avatar || defaultAvatar}
            alt={`${name || "User"}'s avatar`}
            width={96}
            height={96}
            className="rounded-full"
          />
        </div>
        <h2 className="text-heading3-bold text-amber-800 mb-2 w-full text-left">
          User Information
        </h2>
        <div className="w-full text-left">
          <p>
            <strong className="text-amber-800">ID:</strong> {id || "N/A"}
          </p>
          <p>
            <strong className="text-amber-800">Name:</strong> {name || "N/A"}
          </p>
          <p>
            <strong className="text-amber-800">Email:</strong> {email || "N/A"}
          </p>
          <p>
            <strong className="text-amber-800">Role:</strong>
            {session?.user.role || "No role assigned"}
          </p>
          <p>
            <strong className="text-amber-800">Verified:</strong>
            {verified ? "Yes" : "No"}
          </p>
        </div>
        <div className="flex flex-col gap-4 mt-4 w-full">
          <Link href="/edit-profile" passHref>
            <span className="text-blue-600 underline cursor-pointer">
              Edit Profile
            </span>
          </Link>
          <Button onClick={handleSignOut} className="text-red-600">
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
