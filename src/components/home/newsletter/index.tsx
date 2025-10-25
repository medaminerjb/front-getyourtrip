import React, { useState } from "react";

interface NewsletterFormProps {
  actionUrl: string;
}

const NewsletterBanner: React.FC<NewsletterFormProps> = ({ actionUrl }) => {
  const [email, setEmail] = useState("");
  const [captcha, setCaptcha] = useState(""); // if you have captcha input value
  const [errors, setErrors] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // You can submit via fetch or axios
    fetch(actionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // If using CSRF, pass token in headers
      },
      body: JSON.stringify({ email, captcha }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Submitted:", data);
      })
      .catch((err) => setErrors("Error submitting form"));
  };

  return (
    <div className="banner3-section">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="banner3-content">
              <h6 className="joinnewsh6">Join The Newsletter</h6>
              <p>To receive our best monthly deals</p>

              <form onSubmit={handleSubmit}>
                <div className="from-inner">
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-label="Email address"
                    placeholder="Enter Your email..."
                    className="form-control" // Replace with your styling
                    required
                  />

                  <button
                    type="submit"
                    className="from-arrow"
                    aria-label="Submit email"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="17"
                      viewBox="0 0 18 17"
                    >
                      <path
                        d="M7 1L16 8.5M16 8.5L7 16M16 8.5H0.5"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        fill="none"
                      />
                    </svg>
                  </button>
                </div>

                {/* Example captcha */}
                <div className="captchastyle">
                  <input
                    type="text"
                    value={captcha}
                    onChange={(e) => setCaptcha(e.target.value)}
                    readOnly
                    placeholder="Enter captcha"
                  />
                </div>
                {errors && <p className="error">{errors}</p>}
              </form>

              <img
                loading="lazy"
                src="/img/home1/banner3-vector1.png"
                alt="image 1 banner for newsletter forms"
                className="vector1"
              />
              <img
                loading="lazy"
                src="/img/home1/banner3-vector2.png"
                alt="image 2 banner for newsletter forms"
                className="vector2"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterBanner;
