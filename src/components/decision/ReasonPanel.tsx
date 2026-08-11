import type { DecisionReason } from "@/types";

export function ReasonPanel({ reasons }: { reasons: DecisionReason[] }) {
  return (
    <section className="panel panel-pad">
      <h2 className="panel-title">Kenapa direkomendasikan</h2>
      <div className="panel-sub">Alasan yang dapat ditelusuri ke data operasional.</div>
      <div className="reason-list">
        {reasons.map((reason) => (
          <div className="reason" key={reason.id}>
            <div className="reason-num">{reason.id}</div>
            <div>
              <div className="reason-title">{reason.title}</div>
              <div className="reason-copy">{reason.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
