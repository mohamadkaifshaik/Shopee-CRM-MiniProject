$(async function () {
  setActiveNav();
  const emps = await loadEmployees(900);
  hideLoader();

  const ov = Store.get("statusOv") || {};
  const active = emps.filter((e) => (ov[e.id] || e.status) === "active");
  const totalCl = emps.reduce((s, e) => s + e.clients.length, 0);
  const avgPerf = Math.round(
    emps.reduce((s, e) => s + e.perf, 0) / emps.length,
  );

  animCount(document.getElementById("sTotal"), emps.length);
  animCount(document.getElementById("sActive"), active.length);
  animCount(document.getElementById("sClients"), totalCl);
  animCount(document.getElementById("sPerf"), avgPerf, "%");
  $("#sActivePct").text(
    `${Math.round((active.length / emps.length) * 100)}% active rate`,
  );

  const perfHtml = emps
    .map((e) => {
      const col = e.perf >= 80 ? "green" : e.perf < 60 ? "red" : "";
      return `
      <div style="margin-bottom:.85rem;">
        <div style="display:flex;justify-content:space-between;font-size:.8rem;margin-bottom:.35rem;">
          <span style="display:flex;align-items:center;gap:.5rem;">
            <span class="av ${e.avc}" style="width:22px;height:22px;font-size:.55rem;">${e.av}</span>
            <span class="txt-muted">${e.name.split(" ")[0]}</span>
          </span>
          <span class="txt-mono" style="font-size:.72rem;">${e.perf}%</span>
        </div>
        <div class="bar-wrap"><div class="bar-fill ${col}" data-w="${e.perf}" style="width:0%"></div></div>
      </div>`;
    })
    .join("");
  $("#perfList").html(perfHtml);

  const clHtml = emps
    .map(
      (e) => `
    <div style="display:flex;align-items:center;gap:.65rem;padding:.55rem 0;border-bottom:1px solid var(--line-2);">
      <span class="av ${e.avc}" style="width:26px;height:26px;font-size:.58rem;">${e.av}</span>
      <span style="flex:1;font-size:.84rem;color:var(--ink-2);">${e.name}</span>
      <span class="tag neutral">${e.clients.length}</span>
    </div>`,
    )
    .join("");
  $("#clientList").html(clHtml);

  const depts = {};
  emps.forEach((e) => {
    depts[e.dept] = (depts[e.dept] || 0) + 1;
  });
  const deptHtml = Object.entries(depts)
    .map(([d, n]) => {
      const pct = Math.round((n / emps.length) * 100);
      return `
      <div style="margin-bottom:.9rem;">
        <div style="display:flex;justify-content:space-between;font-size:.8rem;margin-bottom:.35rem;">
          <span class="txt-muted">${d}</span>
          <span class="txt-mono txt-dim" style="font-size:.7rem;">${n} · ${pct}%</span>
        </div>
        <div class="bar-wrap"><div class="bar-fill" data-w="${pct}" style="width:0%"></div></div>
      </div>`;
    })
    .join("");
  $("#deptList").html(deptHtml);

  setTimeout(() => {
    $(".bar-fill[data-w]").each(function () {
      $(this).css("width", $(this).data("w") + "%");
    });
  }, 250);

  const acts = [
    {
      pip: "red",
      text: "<strong>Rahul Sharma</strong> closed a deal with <strong>Infosys Ltd</strong>.",
      time: "2 min ago",
    },
    {
      pip: "green",
      text: "<strong>Karan Mehta</strong> completed the assessment with <strong>92%</strong>.",
      time: "18 min ago",
    },
    {
      pip: "blue",
      text: "<strong>Ananya Gupta</strong> was assigned a new client: <strong>Nykaa India</strong>.",
      time: "45 min ago",
    },
    {
      pip: "",
      text: "<strong>Arjun Patel</strong> status changed to <strong>Inactive</strong>.",
      time: "1 hr ago",
    },
    {
      pip: "green",
      text: "<strong>Sneha Rao</strong> joined the Sales department.",
      time: "3 hrs ago",
    },
    {
      pip: "",
      text: "<strong>Priya Nair</strong> updated the HR policy document.",
      time: "Yesterday",
    },
  ];
  const actHtml = acts
    .map(
      (a) => `
    <div class="act-item">
      <div class="act-pip ${a.pip}"></div>
      <div>
        <div class="act-text">${a.text}</div>
        <div class="act-time">${a.time}</div>
      </div>
    </div>`,
    )
    .join("");
  $("#activityList").html(actHtml);
});
