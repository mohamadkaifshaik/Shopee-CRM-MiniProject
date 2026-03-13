const StorageKeys = {
  SEL_EMP: "selEmp",
  RESULTS: "assessResults",
  STATUS_OV: "statusOv",
  SCORE: "empScore",
  GRADE: "lastGrade",
};

function clearAll() {
  Object.values(StorageKeys).forEach((k) => Store.del(k));
}
