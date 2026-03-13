$(async function () {
  setActiveNav();
  const emps = await loadEmployees(650);
  hideLoader();

  EMPLOYEES.forEach((e) =>
    $("#empPicker").append(`<option value="${e.id}">${e.name}</option>`),
  );
  const saved = Store.get("selEmp") || emps[0].id;
  $("#empPicker").val(saved);
  renderProfile(+saved, emps);

  $("#empPicker").on("change", function () {
    Store.set("selEmp", +this.value);
    renderProfile(+this.value, emps);
  });
});

function renderProfile(id, emps) {
  const e = emps.find((x) => x.id === id);
  if (!e) return;
  const ov = Store.get("statusOv") || {};
  const st = ov[e.id] || e.status;
  const results = (Store.get("assessResults") || []).filter(
    (r) => r.empId === e.id,
  );
  const best = results.length ? Math.max(...results.map((r) => r.pct)) : null;

  $("#bcName").text(e.name);

  const perfColor = e.perf >= 80 ? "green" : e.perf < 60 ? "red" : "";

  const clientHtml = e.clients
    .map(
      (c, i) => `
    <div class="client-row">
      <span class="client-idx">${i + 1}</span>
      <span>${c}</span>
      <span class="tag active ms-auto">Active</span>
    </div>`,
    )
    .join("");

  const assessHtml = results.length
    ? results
        .slice()
        .reverse()
        .map((r) => {
          const d = new Date(r.ts).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
          return `
          <div style="display:flex;align-items:center;justify-content:space-between;padding:.65rem 0;border-bottom:1px solid var(--line-2);">
            <div>
              <span style="font-size:.84rem;font-weight:500;">Skill Assessment</span>
              <span class="txt-mono txt-dim" style="font-size:.65rem;margin-left:.5rem;">${d}</span>
            </div>
            <div style="display:flex;align-items:center;gap:.5rem;">
              <span class="txt-mono txt-muted" style="font-size:.72rem;">${r.score}/${r.total}</span>
              <span class="tag ${r.passed ? "active" : "inactive"}">${r.pct}% · ${r.grade}</span>
            </div>
          </div>`;
        })
        .join("")
    : `<p class="txt-dim" style="font-size:.82rem;margin:0;">No assessments yet. <a href="Assessment.html">Take one →</a></p>`;

  $("#profileContent").html(`

    <div class="profile-strip fu">
      <span class="av xl ${e.avc}">${e.av}</span>
      <div style="flex:1;">
        <div class="profile-name">${e.name}</div>
        <div class="profile-role">${e.role} · ${e.dept} · ${e.location}</div>
        <div style="display:flex;flex-wrap:wrap;gap:.35rem;margin-top:.65rem;">
          <span class="tag ${st === "active" ? "active" : "inactive"}">${st}</span>
          <span class="tag neutral">#${e.id}</span>
          <span class="tag blue">${e.dept}</span>
        </div>
      </div>
      <div style="text-align:right;">
        <div class="sec-title" style="justify-content:flex-end;margin-bottom:.2rem;">Performance</div>
        <div style="font-family:'Instrument Serif',serif;font-size:2.8rem;line-height:1;color:var(--ink);">${e.perf}%</div>
        <a href="Assessment.html" class="btn-ink btn-sm" style="margin-top:.5rem;display:inline-block;">Take Quiz →</a>
      </div>
    </div>

    <div class="row g-3">

      <div class="col-lg-4 fu d1">
        <div class="card-box h-100">
          <div class="card-box-head"><h5>Contact</h5></div>
          <div class="card-box-body">
            <div class="info-grid">
              ${iRow("Email", e.email)}
              ${iRow("Phone", e.phone)}
              ${iRow("Location", e.location)}
              ${iRow("Joined", fmtDate(e.joined))}
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-4 fu d2">
        <div class="card-box h-100">
          <div class="card-box-head"><h5>Performance</h5></div>
          <div class="card-box-body">
            ${pBar("Overall", e.perf, perfColor)}
            ${best !== null ? pBar("Best Assessment", best, "green") : ""}
            ${pBar("Client Load", Math.round((e.clients.length / 6) * 100), "blue")}
            <div style="display:flex;flex-wrap:wrap;gap:.35rem;margin-top:1rem;">
              <span class="tag neutral">${e.clients.length} clients</span>
              <span class="tag ${results.length ? "blue" : "neutral"}">${results.length} attempt${results.length !== 1 ? "s" : ""}</span>
              ${best !== null ? `<span class="tag ${isPassed(best) ? "active" : "inactive"}">Best: ${calculateGrade(best)}</span>` : ""}
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-4 fu d3">
        <div class="card-box h-100">
          <div class="card-box-head">
            <h5>Assigned Clients</h5>
            <span class="tag neutral">${e.clients.length}</span>
          </div>
          <div class="card-box-body">
            <ol style="list-style:none;padding:0;margin:0;">${clientHtml}</ol>
          </div>
        </div>
      </div>

      <div class="col-12 fu d4">
        <div class="card-box">
          <div class="card-box-head">
            <h5>Assessment History</h5>
            <a href="Assessment.html" class="btn-ink btn-sm">New →</a>
          </div>
          <div class="card-box-body">${assessHtml}</div>
        </div>
      </div>

    </div>
  `);
}

function iRow(lbl, val) {
  return `<div><div class="info-lbl">${lbl}</div><div class="info-val">${val}</div></div>`;
}

function pBar(lbl, val, col = "") {
  return `
    <div style="margin-bottom:.9rem;">
      <div style="display:flex;justify-content:space-between;font-size:.78rem;margin-bottom:.35rem;">
        <span class="txt-muted">${lbl}</span>
        <span class="txt-mono" style="font-size:.7rem;">${val}%</span>
      </div>
      <div class="bar-wrap"><div class="bar-fill ${col}" style="width:${val}%"></div></div>
    </div>`;
}
