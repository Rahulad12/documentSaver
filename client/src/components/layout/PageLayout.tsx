import React from "react";
interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
}
const PageLayout = ({ children, title, description }: PageLayoutProps) => {
  return (
    <div className="min-h-fit flex justify-center">
      <div className="w-full max-w-full p-3">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">{title}</h1>
          <p className="text-secondary">{description}</p>
        </div>
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
