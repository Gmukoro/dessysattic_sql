import { FC, FormHTMLAttributes, ReactNode } from "react";
import AuthSubmitButton from "@/components/AuthSubmitButton";
import Link from "next/link";

interface Props {
  action?: FormHTMLAttributes<HTMLFormElement>["action"];
  error?: string;
  btnLabel: string;
  title?: string;
  message?: string;
  children: ReactNode;
  footerItems?: { label: string; linkText: string; link: string }[];
  className?: string;
  redirectTo?: string; // Add redirectTo as a prop
}

const AuthForm: FC<Props> = ({
  title,
  btnLabel,
  error,
  children,
  footerItems,
  action,
  message,
  className,
  redirectTo,
}) => {
  return (
    <div className={`space-y-6 max-w-96 mx-auto pt-20 sm:p-0 p-4 ${className}`}>
      <form action={action} className="space-y-4">
        {/* Render title, message, and error conditionally */}
        {title && <h1 className="text-4xl">{title}</h1>}
        {message && <p className="text-green-500">{message}</p>}
        {error && <p className="text-red-500">{error}</p>}

        {children}

        {/* Hidden redirectTo input */}
        {redirectTo && (
          <input type="hidden" name="redirectTo" value={redirectTo} />
        )}

        <AuthSubmitButton label={btnLabel} />
      </form>
      <div className="relative h-3 bg-white">
        <span className="w-6 h-8 flex items-center justify-center text-xs absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full text-black">
          or
        </span>
      </div>
      <div className="space-y-2">
        {footerItems?.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <span className="font-semibold">{item.label}:</span>
            <Link className="hover:underline" href={item.link}>
              {item.linkText}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuthForm;
