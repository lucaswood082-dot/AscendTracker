const container = document.getElementById("workouts");
const userId = localStorage.getItem("userId");

fetch(`/api/workouts?userId=${userId}`)
  .then(res => res.json())
  .then(workouts => {
    workouts.forEach(w => {
      const d = document.createElement("details");
      d.innerHTML = `
        <summary>${w.name}</summary>
        ${w.exercises
          .map(
            ex => `
            <p><strong>${ex.name}</strong></p>
            ${ex.sets
              .map(s => `<p>${s.reps} reps @ ${s.weight}</p>`)
              .join("")}
          `
          )
          .join("")}
      `;
      container.appendChild(d);
    });
  });
