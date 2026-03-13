$(async function () {
  setActiveNav();
  const emps = await loadEmployees(750);
  hideLoader();
  render(emps);
  buildDeptCards(emps);

  $("#search").on("input", function () {
    const q = this.value.toLowerCase();
    render(
      emps.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.dept.toLowerCase().includes(q) ||
          e.role.toLowerCase().includes(q),
      ),
    );
  });

  $("#deptFilter").on("change", function () {
    const d = this.value;
    render(d ? emps.filter((e) => e.dept === d) : emps);
  });

  $(document).on("click", ".js-toggle", function () {
    const id = +$(this).data("id"),
      e = emps.find((x) => x.id === id);
    if (!e) return;
    e.status = e.status === "active" ? "inactive" : "active";
    const ov = Store.get("statusOv") || {};
    ov[id] = e.status;
    Store.set("statusOv", ov);
    render(emps);
    toast(`${e.name} marked ${e.status}.`);
  });

  $(document).on("click", ".js-detail", function () {
    openModal(+$(this).data("id"), emps);
  });

  $(document).on("click", ".js-profile", function () {
    Store.set("selEmp", +$(this).data("id"));
    location.href = "Profile.html";
  });
});

function render(emps) {
  const ov = Store.get("statusOv") || {};
  const tbody = $("#tbody");
  tbody.empty();

  if (!emps.length) {
    tbody.append(
      `<tr><td colspan="7" style="padding:2.5rem;text-align:center;color:var(--ink-4);font-family:'DM Mono',monospace;font-size:.75rem;">No employees found.</td></tr>`,
    );
    return;
  }

  emps.forEach((e, i) => {
    const st = ov[e.id] || e.status;
    const perf_color = e.perf >= 80 ? "green" : e.perf >= 60 ? "" : "red";
    tbody.append(`
      <tr class="fu" style="animation-delay:${i * 0.04}s">
        <td><span class="txt-mono txt-dim">${e.id}</span></td>
        <td class="name-cell">
          <div class="name-row">
            <span class="av ${e.avc}">${e.av}</span>
            ${e.name}
          </div>
        </td>
        <td>${e.dept}</td>
        <td class="txt-muted">${e.role}</td>
        <td><span class="tag neutral">${e.clients.length}</span></td>
        <td><span class="tag ${st === "active" ? "active" : "inactive"}">${st}</span></td>
        <td>
          <div style="display:flex;gap:.35rem;flex-wrap:wrap;">
            <button class="btn-ghost btn-sm js-detail"  data-id="${e.id}">Details</button>
            <button class="btn-ghost btn-sm js-toggle"  data-id="${e.id}">${st === "active" ? "Deactivate" : "Activate"}</button>
            <button class="btn-ghost btn-sm js-profile" data-id="${e.id}">Profile →</button>
          </div>
        </td>
      </tr>`);
  });
  $("#empCount").text(emps.length);
}

function buildDeptCards(emps) {
  const map = {};
  emps.forEach((e) => {
    if (!map[e.dept]) map[e.dept] = { count: 0, clients: 0, perfs: [] };
    map[e.dept].count++;
    map[e.dept].clients += e.clients.length;
    map[e.dept].perfs.push(e.perf);
  });
  const html = Object.entries(map)
    .map(([d, v]) => {
      const avg = Math.round(
        v.perfs.reduce((a, b) => a + b, 0) / v.perfs.length,
      );
      return `
      <div class="col-sm-6 col-lg-4 fu">
        <div class="card-box" style="padding:1.25rem;">
          <div class="sec-title">${d}</div>
          <div style="display:flex;gap:1.5rem;margin-bottom:.85rem;">
            <div><div style="font-family:'Instrument Serif',serif;font-size:1.6rem;">${v.count}</div><div class="txt-dim" style="font-size:.72rem;">members</div></div>
            <div><div style="font-family:'Instrument Serif',serif;font-size:1.6rem;">${v.clients}</div><div class="txt-dim" style="font-size:.72rem;">clients</div></div>
            <div><div style="font-family:'Instrument Serif',serif;font-size:1.6rem;">${avg}%</div><div class="txt-dim" style="font-size:.72rem;">avg perf</div></div>
          </div>
          <div class="bar-wrap"><div class="bar-fill" style="width:${avg}%"></div></div>
        </div>
      </div>`;
    })
    .join("");
  $("#deptCards").html(html);
}

function openModal(id, emps) {
  const e = emps.find((x) => x.id === id);
  if (!e) return;
  const ov = Store.get("statusOv") || {},
    st = ov[e.id] || e.status;
  const results = (Store.get("assessResults") || []).filter(
    (r) => r.empId === e.id,
  );
  const scoreHtml = results.length
    ? results
        .map(
          (r) =>
            `<span class="tag ${r.passed ? "active" : "inactive"}" style="margin:.15rem;">${r.pct}% · ${r.grade}</span>`,
        )
        .join("")
    : `<span class="txt-dim" style="font-size:.82rem;">No assessments yet.</span>`;

  $("#modalTitle").text(e.name);
  $("#modalBody").html(`
    <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem;">
      <span class="av lg ${e.avc}">${e.av}</span>
      <div>
        <div style="font-family:'Instrument Serif',serif;font-size:1.15rem;">${e.name}</div>
        <div class="txt-muted" style="font-size:.82rem;">${e.role} · ${e.dept}</div>
        <span class="tag ${st === "active" ? "active" : "inactive"}" style="margin-top:.4rem;">${st}</span>
      </div>
    </div>
    <div class="info-grid" style="margin-bottom:1.25rem;">
      ${infoCell("Email", e.email)}
      ${infoCell("Phone", e.phone)}
      ${infoCell("Location", e.location)}
      ${infoCell("Joined", fmtDate(e.joined))}
    </div>
    <div style="margin-bottom:1.25rem;">
      <div class="sec-title">Performance</div>
      <div style="display:flex;align-items:center;gap:.75rem;">
        <div class="bar-wrap" style="flex:1;"><div class="bar-fill ${e.perf >= 80 ? "green" : e.perf < 60 ? "red" : ""}" style="width:${e.perf}%"></div></div>
        <span class="txt-mono" style="font-size:.8rem;font-weight:500;">${e.perf}%</span>
      </div>
    </div>
    <div style="margin-bottom:1.25rem;">
      <div class="sec-title">Assigned Clients (${e.clients.length})</div>
      <ol style="padding-left:1.2rem;margin:0;">${e.clients.map((c) => `<li style="padding:.2rem 0;font-size:.84rem;color:var(--ink-2);">${c}</li>`).join("")}</ol>
    </div>
    <div>
      <div class="sec-title">Assessment Results</div>
      ${scoreHtml}
    </div>
  `);
  new bootstrap.Modal(document.getElementById("empModal")).show();
}

function infoCell(lbl, val) {
  return `<div><div class="info-lbl">${lbl}</div><div class="info-val">${val}</div></div>`;
}
