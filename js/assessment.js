let answers = {},
  questions = [];

$(async function () {
  setActiveNav();
  questions = await loadQuiz(600);
  hideLoader();
  renderQuiz(questions);

  EMPLOYEES.forEach((e) => {
    $("#empPicker").append(`<option value="${e.id}">${e.name}</option>`);
  });
  const saved = Store.get("selEmp");
  if (saved) $("#empPicker").val(saved);
  $("#empPicker").on("change", function () {
    Store.set("selEmp", +this.value);
  });

  $(document).on("click", ".q-opt", function () {
    const qid = +$(this).data("qid"),
      opt = +$(this).data("opt");
    answers[qid] = opt;
    $(`.q-opt[data-qid="${qid}"]`)
      .removeClass("selected")
      .find("input")
      .prop("checked", false);
    $(this).addClass("selected").find("input").prop("checked", true);
    updateBar();
  });

  $("#submitBtn").on("click", function () {
    const done = Object.keys(answers).length;
    if (
      done < questions.length &&
      !confirm(`${done}/${questions.length} answered — submit anyway?`)
    )
      return;
    doSubmit();
  });

  $(document).on("click", "#retryBtn", function () {
    answers = {};
    renderQuiz(questions);
    updateBar();
    $("#result").addClass("d-none");
    $("#quizSection").removeClass("d-none");
    $("#submitBtn").removeClass("d-none");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  renderHistory();
  $("#clearBtn").on("click", function () {
    if (!confirm("Clear all history?")) return;
    Store.del("assessResults");
    Store.del("empScore");
    Store.del("lastGrade");
    renderHistory();
  });
});

function renderQuiz(qs) {
  const c = $("#questions");
  c.empty();
  qs.forEach((q, i) => {
    const opts = q.opts
      .map(
        (o, idx) => `
      <label class="q-opt" data-qid="${q.id}" data-opt="${idx}">
        <input type="radio" name="q${q.id}" value="${idx}">
        <span>${String.fromCharCode(65 + idx)}. ${o}</span>
      </label>`,
      )
      .join("");
    c.append(`
      <div class="q-card fu" style="animation-delay:${i * 0.06}s">
        <div class="q-num">Question ${i + 1} / ${qs.length}</div>
        <div class="q-text">${q.q}</div>
        ${opts}
      </div>`);
  });
}

function updateBar() {
  const pct = questions.length
    ? Math.round((Object.keys(answers).length / questions.length) * 100)
    : 0;
  $("#qBar").css("width", pct + "%");
  $("#qLabel").text(`${Object.keys(answers).length} / ${questions.length}`);
}

function doSubmit() {
  let score = 0;
  questions.forEach((q) => {
    const sel = answers[q.id],
      correct = q.ans;
    $(`.q-opt[data-qid="${q.id}"]`).each(function () {
      const idx = +$(this).data("opt");
      if (idx === correct) $(this).addClass("correct");
      if (idx === sel && sel !== correct) $(this).addClass("wrong");
    });
    if (sel === correct) score++;
  });

  const pct = calculatePercentage(score, questions.length);
  const grade = calculateGrade(pct);
  const passed = isPassed(pct);
  const fb = getPerformanceFeedback(pct);

  const all = Store.get("assessResults") || [];
  all.push({
    empId: Store.get("selEmp"),
    score,
    total: questions.length,
    pct,
    grade,
    passed,
    ts: new Date().toISOString(),
  });
  Store.set("assessResults", all);
  Store.set("empScore", pct);
  Store.set("lastGrade", grade);

  $("#result")
    .html(
      `
    <div class="result-box fu">
      <div class="sec-title" style="justify-content:center;">${passed ? "Assessment Passed" : "Assessment Failed"}</div>
      <div class="result-big ${passed ? "pass" : "fail"}">${pct}%</div>
      <div style="font-family:'DM Mono',monospace;font-size:.8rem;color:var(--ink-3);margin:.6rem 0 .25rem;">
        Grade <strong style="color:var(--ink);">${grade}</strong> &nbsp;·&nbsp; ${score}/${questions.length} correct
      </div>
      <p style="color:var(--ink-3);font-size:.875rem;max-width:380px;margin:.85rem auto 1.5rem;">${fb.msg}</p>
      <div style="display:flex;gap:.6rem;justify-content:center;flex-wrap:wrap;">
        <button id="retryBtn" class="btn-ghost">Retry Quiz</button>
        <a href="Profile.html" class="btn-ink">View Profile →</a>
      </div>
    </div>`,
    )
    .removeClass("d-none");

  $("#quizSection").addClass("d-none");
  $("#submitBtn").addClass("d-none");
  renderHistory();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderHistory() {
  const all = Store.get("assessResults") || [];
  if (!all.length) {
    $("#history").html(
      `<p class="txt-dim" style="font-size:.82rem;">No history yet.</p>`,
    );
    return;
  }
  const rows = all
    .slice()
    .reverse()
    .map((r) => {
      const emp = EMPLOYEES.find((e) => e.id === r.empId);
      const name = emp ? emp.name : "—";
      const date = new Date(r.ts).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      return `
      <div style="display:flex;align-items:center;justify-content:space-between;padding:.65rem 0;border-bottom:1px solid var(--line-2);">
        <div>
          <span style="font-weight:500;font-size:.84rem;">${name}</span>
          <span class="txt-dim txt-mono" style="font-size:.65rem;margin-left:.5rem;">${date}</span>
        </div>
        <div style="display:flex;align-items:center;gap:.6rem;">
          <span class="txt-mono txt-muted" style="font-size:.72rem;">${r.score}/${r.total}</span>
          <span class="tag ${r.passed ? "active" : "inactive"}">${r.pct}% · ${r.grade}</span>
        </div>
      </div>`;
    })
    .join("");
  $("#history").html(rows);
}
