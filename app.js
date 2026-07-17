// ================================
// HABIT TRACKER
// ================================

let habits = JSON.parse(localStorage.getItem("habits")) || [];

const habitContainer = document.getElementById("habitContainer");
const habitInput = document.getElementById("habitInput");

const addHabitBtn = document.getElementById("addHabit");

const pointsLabel = document.getElementById("points");
const progressLabel = document.getElementById("overallProgress");
const habitCount = document.getElementById("habitCount");

const themeButton = document.getElementById("toggleTheme");

// ----------------------------

function save() {
    localStorage.setItem("habits", JSON.stringify(habits));
}

// ----------------------------

function createHabit(name) {

    habits.push({

        id: Date.now(),

        name,

        days: Array(30).fill(false)

    });

    save();

    render();

}

// ----------------------------

function deleteHabit(id){

    habits = habits.filter(h=>h.id!==id);

    save();

    render();

}

// ----------------------------

function toggleDay(id, day){

    const habit = habits.find(h=>h.id===id);

    habit.days[day]=!habit.days[day];

    save();

    render();

}

// ----------------------------

function totalPoints(){

    let points=0;

    habits.forEach(h=>{

        h.days.forEach(d=>{

            if(d) points+=10;

        });

    });

    return points;

}

// ----------------------------

function overallProgress(){

    let completed=0;

    let total=habits.length*30;

    habits.forEach(h=>{

        completed+=h.days.filter(Boolean).length;

    });

    if(total===0) return 0;

    return Math.round(completed/total*100);

}

// ----------------------------

function render(){

    habitContainer.innerHTML="";

    habitCount.textContent=habits.length;

    pointsLabel.textContent=totalPoints()+" ⭐";

    progressLabel.textContent=overallProgress()+"%";

    habits.forEach(habit=>{

        const completed=habit.days.filter(Boolean).length;

        const percent=Math.round(completed/30*100);

        const card=document.createElement("div");

        card.className="habit";

        card.innerHTML=`

            <div class="habitHeader">

                <div class="habitTitle">

                    ${habit.name}

                </div>

                <button class="deleteHabit">

                    Delete

                </button>

            </div>

            <div class="progress">

                <div class="progressBar">

                    <div
                    class="progressFill"
                    style="width:${percent}%">
                    </div>

                </div>

                <div class="progressText">

                    ${completed}/30 (${percent}%)

                </div>

            </div>

            <div class="days"></div>

        `;

        // delete button

        card
        .querySelector(".deleteHabit")
        .onclick=()=>deleteHabit(habit.id);

        const daysDiv=card.querySelector(".days");

        habit.days.forEach((checked,index)=>{

            const day=document.createElement("div");

            day.className="day";

            day.innerHTML=`

                <label>${index+1}</label>

                <input
                    type="checkbox"
                    ${checked?"checked":""}
                >

            `;

            day.querySelector("input")
            .addEventListener("change",()=>{

                toggleDay(habit.id,index);

            });

            daysDiv.appendChild(day);

        });

        habitContainer.appendChild(card);

    });

}

// ----------------------------

addHabitBtn.onclick=()=>{

    const name=habitInput.value.trim();

    if(name==="") return;

    createHabit(name);

    habitInput.value="";

};

// enter key

habitInput.addEventListener("keypress",(e)=>{

    if(e.key==="Enter")

        addHabitBtn.click();

});

// ----------------------------

// Dark Mode

const savedTheme=localStorage.getItem("theme");

if(savedTheme==="dark")

    document.body.classList.add("dark");

themeButton.onclick=()=>{

    document.body.classList.toggle("dark");

    localStorage.setItem(

        "theme",

        document.body.classList.contains("dark")

        ? "dark"

        : "light"

    );

};

// ----------------------------

render();