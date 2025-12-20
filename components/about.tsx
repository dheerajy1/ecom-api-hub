import React from "react";

type AboutProps = {
  title: string;
  heading: string;
  description: string;
};

export function About({
  title,
  heading,
  description,
}: AboutProps): React.ReactElement {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <link rel="stylesheet" href="/style.css" />
      </head>

      <body>
        <div className="container about">
          <h1 className="about-title">{heading}</h1>
          <p className="about-text">{description}</p>
        </div>
      </body>
    </html>
  );
}
