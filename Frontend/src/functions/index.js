const addZeroIf = num => {
  return num < 10 ? `0${num}` : num.toString();
};

export default() => {
  const d = new Date();
  return `${d.getFullYear()}-${addZeroIf(
    d.getMonth()
  )}-${addZeroIf(d.getDate())} ${addZeroIf(d.getHours())}:${addZeroIf(
    d.getMinutes()
  )}:${addZeroIf(d.getSeconds())}`;
};