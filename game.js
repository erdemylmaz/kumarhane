const slotMachines = document.querySelectorAll(".slot-machine");

const roundArea = document.querySelector(".game-text");
const moneyArea = document.querySelector(".money");

const iconCounts = [15, 20, 25];
const iconHeight = 400;
const iconMargin = 24;

const combination = [];

let round = 0;
let money = 10000;
let bet = 100;

if (localStorage.getItem("money")) {
    money = parseInt(localStorage.getItem("money"));
    moneyArea.innerHTML = money;
}

if (localStorage.getItem("round")) {
    round = parseInt(localStorage.getItem("round"));
    roundArea.innerHTML = "Round: " + round;
}

slotMachines.forEach((slotMachine, index) => {
    for (let x = 0; x < iconCounts[index]; x++) {
        const icon = document.createElement("div");
        icon.classList.add("icon");
        icon.classList.add(index + "-icon");
        icon.style.marginTop = `${-1 * x * (iconHeight + iconMargin)}px`;
        icon.style.zIndex = x + 100;

        const randomIcon = Math.ceil(Math.random() * 12);

        icon.innerHTML = `
            <img class="icon-image" src="./images/${randomIcon}.png"></img>
        `;

        if (x == 0) {
            icon.style.marginTop = "24px";
        }
        slotMachine.appendChild(icon);

        if (x == iconCounts[index] - 1) {
            combination.push({ number: randomIcon });
        }
    }
});

let isAllSame = true;
let sameNumber = combination[0].number;

for (let i = 1; i < combination.length; i++) {
    if (combination[i].number != sameNumber) {
        isAllSame = false;
        break;
    }
}

function clearGame() {
    slotMachines.forEach((slotMachine, index) => {
        const icons = slotMachine.querySelectorAll(".icon");
        icons.forEach((icon, index) => {
            icon.style.marginTop = `${
                -1 * index * (iconHeight + iconMargin)
            }px`;
        });
    });
}

const spinButton = document.querySelector(".spin-button");

spinButton.addEventListener("click", () => {
    if (money < bet) {
        alert("You don't have enough money!");
        return;
    }

    money -= bet;
    round += 1;

    roundArea.innerHTML = "Round: " + round;
    moneyArea.innerHTML = money;

    localStorage.setItem("money", money);
    localStorage.setItem("round", round);

    for (let i = 0; i < slotMachines.length; i++) {
        const icons = slotMachines[i].querySelectorAll(".icon");
        icons.forEach((icon, index) => {
            let marginTopValue = parseInt(
                window
                    .getComputedStyle(icon)
                    .getPropertyValue("margin-top")
                    .split("px")[0]
            );

            marginTopValue +=
                -1 *
                [
                    parseInt(
                        window
                            .getComputedStyle(icons[icons.length - 1])
                            .getPropertyValue("margin-top")
                            .split("px")[0]
                    ),
                ];
            icon.style.marginTop = `${marginTopValue + 24}px`;
            console.log(marginTopValue, icon);
        });
    }

    setTimeout(() => {
        if (isAllSame) {
            alert("You won!");
        } else {
            alert("You lost!");
        }

        location.reload();
    }, 5500);
});
