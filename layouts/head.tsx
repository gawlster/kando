import NextHead from "next/head";

export const Head = () => {
  return (
    <NextHead>
      <title>Kanban</title>
      <meta key="title" content="Kanban" property="og:title" />
      <meta content="Stay organized!" property="og:description" />
      <meta content="Stay organized!" name="description" />
      <meta
        key="viewport"
        content="viewport-fit=cover, width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        name="viewport"
      />
      <link href="/favicon.ico" rel="icon" />
    </NextHead>
  );
};
