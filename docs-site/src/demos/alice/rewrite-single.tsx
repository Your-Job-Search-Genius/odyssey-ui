import { AliceRewriteCard } from "@your-job-search-genius/odyssey-ui";

const REWRITE_TEXT = (
  <>
    Result-driven UI Engineer with <del>proven</del> <ins>senior</ins> expertise
    in React.js and modern front-end development.
  </>
);

export default function AliceRewriteSingle() {
  return (
    <div style={{ width: "22rem" }}>
      <AliceRewriteCard>{REWRITE_TEXT}</AliceRewriteCard>
    </div>
  );
}
