function addMinutes(time, minutesToAdd) {
  const [hours, minutes] = time.split(":").map(Number);

  // Convert to total minutes
  let total = hours * 60 + minutes + minutesToAdd;

  // Convert back to HH:MM
  const newHours = Math.floor(total / 60);
  const newMinutes = total % 60;

  return `${newHours}:${newMinutes.toString().padStart(2, "0")}`;
}

function compareTimes(t1, t2) {
  const [h1, m1] = t1.split(":").map(Number);
  const [h2, m2] = t2.split(":").map(Number);

  const total1 = h1 * 60 + m1;
  const total2 = h2 * 60 + m2;

  if (total1 < total2) return -1;
  if (total1 > total2) return 1;
//   console.log(compareTimes("09:00", "10:00")); // -1
// console.log(compareTimes("10:00", "09:00")); // 1
// console.log(compareTimes("09:00", "09:00")); // 0
  return 0;
}

function timeToMinutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function isBetween(scheduleTime, slotStart, slotEnd) {
  const s = timeToMinutes(scheduleTime);
  const start = timeToMinutes(slotStart);
  const end = timeToMinutes(slotEnd);

  return s > start && s < end; 
}



module.exports = {
    addMinutes,
    compareTimes,
    isBetween
}