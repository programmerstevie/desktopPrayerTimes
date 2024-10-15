function getToday() {
  const today = new Date();

  const g = today.toISOString();

  const year = g.slice(0, 4);
  const month = g.slice(5, 7);
  const day = g.slice(8, 10);

  return day + "-" + month + "-" + year;
}

module.exports = {
  getToday,
};
