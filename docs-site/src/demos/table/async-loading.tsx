import { useEffect, useRef, useState } from "react";
import { Collection } from "react-aria-components";
import {
  Cell,
  Column,
  Row,
  Spinner,
  Table,
  TableBody,
  TableContainer,
  TableHeader,
  TableLoadMoreItem,
} from "@your-job-search-genius/odyssey-ui";

interface Candidate {
  id: string;
  name: string;
  role: string;
  stage: string;
}

function makeCandidates(page: number): Candidate[] {
  const roles = ["Frontend Engineer", "Product Designer", "Backend Engineer", "Data Analyst", "QA Engineer", "DevOps Engineer"];
  const stages = ["Applied", "Screening", "Interview", "Offer"];
  return Array.from({ length: 10 }, (_, i) => {
    const n = page * 10 + i + 1;
    return {
      id: `c${n}`,
      name: `Candidate ${n}`,
      role: roles[n % roles.length]!,
      stage: stages[n % stages.length]!,
    };
  });
}

export default function TableAsyncLoading() {
  const [items, setItems] = useState<Candidate[]>([]);
  const [loadingState, setLoadingState] = useState<"loading" | "loadingMore" | "idle">("loading");
  const pageRef = useRef(0);
  const pendingRef = useRef(false);

  const load = () => {
    if (pendingRef.current || pageRef.current >= 4) return; // pretend the data set has 4 pages
    pendingRef.current = true;
    setLoadingState(pageRef.current === 0 ? "loading" : "loadingMore");
    setTimeout(() => {
      setItems((prev) => [...prev, ...makeCandidates(pageRef.current)]);
      pageRef.current += 1;
      pendingRef.current = false;
      setLoadingState("idle");
    }, 700);
  };

  // initial page — the sentinel only fires once there are rows to scroll past
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => load(), []);

  return (
    <TableContainer maxHeight="18rem">
      <Table aria-label="Candidates">
        <TableHeader>
          <Column id="name" isRowHeader>
            Name
          </Column>
          <Column id="role">Role</Column>
          <Column id="stage">Stage</Column>
        </TableHeader>
        <TableBody
          renderEmptyState={() => (
            <span style={{ display: "flex", justifyContent: "center", padding: "var(--wsu-space-8)" }}>
              <Spinner label="Loading candidates" />
            </span>
          )}
        >
          <Collection items={items}>
            {(item) => (
              <Row>
                <Cell>{item.name}</Cell>
                <Cell>{item.role}</Cell>
                <Cell>{item.stage}</Cell>
              </Row>
            )}
          </Collection>
          {/* Sentinel row: fires onLoadMore as it scrolls into view. */}
          <TableLoadMoreItem onLoadMore={load} isLoading={loadingState === "loadingMore"} />
        </TableBody>
      </Table>
    </TableContainer>
  );
}
