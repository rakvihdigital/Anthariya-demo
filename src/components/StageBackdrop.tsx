/**
 * Theatre-stage backdrop for page headers (Shop, About, Contact): a red stage with soft
 * cloud swirls, a slow spotlight, and tied-back curtains that draw open as the page loads.
 * Purely decorative.
 */
export function StageBackdrop() {
  return (
    <div className="stage" aria-hidden="true">
      <div className="stage__bg" />
      <div className="stage__light" />
      <div className="stage__curtain stage__curtain--l" />
      <div className="stage__curtain stage__curtain--r" />
    </div>
  );
}
