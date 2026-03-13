const EMPLOYEES = [
  {
    id: 101,
    name: "Rahul Sharma",
    dept: "Sales",
    role: "Manager",
    email: "r.sharma@corp.in",
    phone: "+91 98200 11234",
    location: "Mumbai",
    joined: "2019-03-15",
    status: "active",
    clients: [
      "Infosys Ltd",
      "Wipro Tech",
      "HCL Systems",
      "Tata Consulting",
      "Reliance Digital",
    ],
    perf: 88,
    av: "RS",
    avc: "av-a",
  },
  {
    id: 102,
    name: "Ananya Gupta",
    dept: "Marketing",
    role: "Executive",
    email: "a.gupta@corp.in",
    phone: "+91 99001 55678",
    location: "Delhi",
    joined: "2021-07-01",
    status: "active",
    clients: ["Nykaa India", "Mamaearth", "Boat Lifestyle"],
    perf: 74,
    av: "AG",
    avc: "av-b",
  },
  {
    id: 103,
    name: "Karan Mehta",
    dept: "Engineering",
    role: "Senior Developer",
    email: "k.mehta@corp.in",
    phone: "+91 70452 33901",
    location: "Bangalore",
    joined: "2020-11-10",
    status: "active",
    clients: ["Zomato", "Swiggy"],
    perf: 92,
    av: "KM",
    avc: "av-c",
  },
  {
    id: 104,
    name: "Priya Nair",
    dept: "HR",
    role: "HR Lead",
    email: "p.nair@corp.in",
    phone: "+91 88001 77654",
    location: "Chennai",
    joined: "2018-06-20",
    status: "active",
    clients: ["OYO Rooms", "MakeMyTrip", "Cleartrip", "Yatra Online"],
    perf: 81,
    av: "PN",
    avc: "av-d",
  },
  {
    id: 105,
    name: "Arjun Patel",
    dept: "Finance",
    role: "Analyst",
    email: "a.patel@corp.in",
    phone: "+91 91523 88421",
    location: "Ahmedabad",
    joined: "2022-02-14",
    status: "inactive",
    clients: ["HDFC Mutual Fund"],
    perf: 58,
    av: "AP",
    avc: "av-e",
  },
  {
    id: 106,
    name: "Sneha Rao",
    dept: "Sales",
    role: "Executive",
    email: "s.rao@corp.in",
    phone: "+91 97334 22100",
    location: "Hyderabad",
    joined: "2023-01-09",
    status: "active",
    clients: ["Flipkart", "Meesho", "Snapdeal"],
    perf: 67,
    av: "SR",
    avc: "av-f",
  },
];

const QUIZ = [
  {
    id: 1,
    q: "What does CRM stand for?",
    opts: [
      "Customer Resource Manager",
      "Customer Relationship Management",
      "Client Response Management",
      "Corporate Record Management",
    ],
    ans: 1,
  },
  {
    id: 2,
    q: "Which is a primary goal of a CRM system?",
    opts: [
      "Replace all employees with automation",
      "Manage warehouse inventory",
      "Improve customer relationships and retention",
      "Calculate employee salaries",
    ],
    ans: 2,
  },
  {
    id: 3,
    q: "What is the purpose of a sales pipeline in CRM?",
    opts: [
      "Track oil and gas infrastructure",
      "Monitor stages of the sales process",
      "Store payroll data",
      "Manage IT infrastructure tickets",
    ],
    ans: 1,
  },
  {
    id: 4,
    q: "Which HTML5 element groups navigation links?",
    opts: ["section", "aside", "nav", "footer"],
    ans: 2,
  },
  {
    id: 5,
    q: "Which JavaScript method stores data in the browser?",
    opts: [
      "sessionStorage.save()",
      "localStorage.setItem()",
      "document.store()",
      "window.cache()",
    ],
    ans: 1,
  },
  {
    id: 6,
    q: "Which Bootstrap class creates a responsive column layout?",
    opts: [".grid-12", ".container-grid", ".col", ".row + .col-*"],
    ans: 3,
  },
  {
    id: 7,
    q: "Which jQuery method attaches a click handler?",
    opts: [
      ".on('click')",
      ".bind('press')",
      ".trigger('tap')",
      ".listen('click')",
    ],
    ans: 0,
  },
  {
    id: 8,
    q: "What does async/await do in JavaScript?",
    opts: [
      "Creates synchronous blocking code",
      "Handles async operations in a readable way",
      "Declares class constructors",
      "Compiles TypeScript",
    ],
    ans: 1,
  },
];

const Store = {
  get(k) {
    try {
      const v = localStorage.getItem(k);
      return v ? JSON.parse(v) : null;
    } catch {
      return null;
    }
  },
  set(k, v) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch {}
  },
  del(k) {
    localStorage.removeItem(k);
  },
};

function calculatePercentage(score, total) {
  return total === 0 ? 0 : Math.round((score / total) * 100);
}
function calculateGrade(pct) {
  if (pct >= 90) return "A+";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B";
  if (pct >= 60) return "C";
  if (pct >= 50) return "D";
  return "F";
}

function isPassed(pct) {
  return pct >= 50;
}

function getPerformanceFeedback(pct) {
  switch (true) {
    case pct >= 90:
      return { msg: "Outstanding — exceptional knowledge.", type: "pass" };
    case pct >= 80:
      return {
        msg: "Excellent — performing above expectations.",
        type: "pass",
      };
    case pct >= 70:
      return { msg: "Good — solid performance, keep it up.", type: "pass" };
    case pct >= 60:
      return {
        msg: "Satisfactory — a bit more effort will help.",
        type: "pass",
      };
    case pct >= 50:
      return { msg: "Passed, but significant room to improve.", type: "pass" };
    default:
      return {
        msg: "Did not pass. Review the material and retry.",
        type: "fail",
      };
  }
}

const loadEmployees = (ms = 800) =>
  new Promise((r) => setTimeout(() => r(EMPLOYEES), ms));
const loadQuiz = (ms = 600) =>
  new Promise((r) => setTimeout(() => r(QUIZ), ms));

function hideLoader() {
  const el = document.getElementById("loader");
  if (el) el.classList.add("hidden");
}

function setActiveNav() {
  const page = location.pathname.split("/").pop() || "Dashboard.html";
  document.querySelectorAll(".crm-navbar .nav-link").forEach((a) => {
    if (a.getAttribute("href") === page) a.classList.add("active");
  });
}

function fmtDate(s) {
  return new Date(s).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function toast(msg) {
  const t = document.createElement("div");
  t.className = "crm-toast";
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2600);
}

function animCount(el, target, suffix = "") {
  let n = 0,
    step = Math.ceil(target / 28);
  const iv = setInterval(() => {
    n = Math.min(n + step, target);
    el.textContent = n + suffix;
    if (n >= target) clearInterval(iv);
  }, 28);
}

if (typeof module !== "undefined" && module.exports)
  module.exports = {
    calculatePercentage,
    calculateGrade,
    isPassed,
    getPerformanceFeedback,
  };
