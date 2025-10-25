import React from "react";

interface BreadCrumbSectionProps {
  backgroundUrl?: string;
  title?: string;
  children?: React.ReactNode;
}

const BreadCrumbSection: React.FC<BreadCrumbSectionProps> = ({
  backgroundUrl = "",
  title = "",
  children,
}) => {
  return (
    <div
      className="breadcrumb-section"
      style={{
        paddingTop: "8%",
        paddingBottom: "7%",
        backgroundImage: `linear-gradient(270deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3) 101.02%), url(${backgroundUrl})`,
      }}
    >
      <div className="container">
        <div className="row">
          <div className="col-lg-12 d-flex justify-content-center">
            <div className="banner-content">
              <h1>{title}</h1>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreadCrumbSection;
