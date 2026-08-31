import { AliceRewriteCard } from "@your-job-search-genius/odyssey-ui";

const REWRITE_TEXT = (
  <>
    Result-driven UI Engineer with <del>proven</del> <ins>senior</ins> expertise
    in React.js and modern front-end development.
  </>
);

export default function AliceRewrite() {
  return (
    <div style={{ width: "22rem" }}>
      <AliceRewriteCard
        title="Contributions Rewrite"
        count={{ current: 1, total: 8 }}
        secondaryAction="dismiss"
        nextPreview={REWRITE_TEXT}
        onAcceptAll={() => {}}
      >
        {REWRITE_TEXT}
      </AliceRewriteCard>
    </div>
  );
}
