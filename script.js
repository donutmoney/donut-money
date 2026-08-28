/* =========================================
   DONUTMONEY V3 DATABASE
========================================= */


const defaultItems = [

    {
        name: "Diamond Block",
        buy: 12000,
        sell: 18000
    },

    {
        name: "Emerald Block",
        buy: 15000,
        sell: 22000
    },

    {
        name: "Gold Block",
        buy: 8000,
        sell: 12000
    },

    {
        name: "Iron Block",
        buy: 4000,
        sell: 6500
    },

    {
        name: "Obsidian",
        buy: 2500,
        sell: 4200
    },

    {
        name: "Kelp",
        buy: 20,
        sell: 35
    },

    {
        name: "Bamboo",
        buy: 25,
        sell: 42
    },

    {
        name: "Netherite Scrap",
        buy: 85000,
        sell: 115000
    },

    {
        name: "Ancient Debris",
        buy: 65000,
        sell: 90000
    },

    {
        name: "Ender Pearl",
        buy: 1500,
        sell: 2500
    }

];



/* =========================================
   LOAD DATABASE
========================================= */


let items =
    JSON.parse(
        localStorage.getItem(
            "donutMoneyItems"
        )
    ) || defaultItems;



function saveDatabase() {

    localStorage.setItem(
        "donutMoneyItems",
        JSON.stringify(items)
    );

}



/* =========================================
   FORMATTING
========================================= */


function money(number) {

    return "$" +
        Number(number).toLocaleString(
            "en-US",
            {
                maximumFractionDigits: 2
            }
        );

}


function profit(item) {

    return item.sell - item.buy;

}


function roi(item) {

    if (item.buy <= 0) {
        return 0;
    }

    return (
        profit(item) /
        item.buy
    ) * 100;

}



/* =========================================
   DATABASE DISPLAY
========================================= */


function renderItems() {

    const table =
        document.getElementById(
            "itemTable"
        );


    const search =
        document
            .getElementById(
                "searchInput"
            )
            .value
            .toLowerCase();


    const sort =
        document
            .getElementById(
                "sortSelect"
            )
            .value;


    let filtered =
        items.filter(
            item =>
                item.name
                    .toLowerCase()
                    .includes(search)
        );


    filtered.sort(
        (a, b) => {

            if (sort === "profit") {

                return (
                    profit(b) -
                    profit(a)
                );

            }


            if (sort === "roi") {

                return (
                    roi(b) -
                    roi(a)
                );

            }


            if (sort === "buy") {

                return (
                    a.buy -
                    b.buy
                );

            }


            if (sort === "sell") {

                return (
                    b.sell -
                    a.sell
                );

            }


            if (sort === "name") {

                return a.name
                    .localeCompare(
                        b.name
                    );

            }

        }
    );


    table.innerHTML = "";


    filtered.forEach(
        (item, index) => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    🍩 ${item.name}
                </td>

                <td class="price">
                    ${money(item.buy)}
                </td>

                <td class="price">
                    ${money(item.sell)}
                </td>

                <td class="profit-positive">
                    +${money(profit(item))}
                </td>

                <td class="roi-value">
                    ${roi(item).toFixed(1)}%
                </td>

                <td>

                    <button
                        class="view-button"
                        onclick="showItem(${items.indexOf(item)})"
                    >
                        View
                    </button>

                </td>

            `;


            table.appendChild(row);

        }
    );


    updateStats();

}



/* =========================================
   STATS
========================================= */


function updateStats() {

    document.getElementById(
        "itemCount"
    ).textContent =
        items.length;


    document.getElementById(
        "marketItems"
    ).textContent =
        items.length;


    if (items.length > 0) {

        const best =
            Math.max(
                ...items.map(
                    item =>
                        profit(item)
                )
            );


        document.getElementById(
            "bestProfit"
        ).textContent =
            money(best);

    } else {

        document.getElementById(
            "bestProfit"
        ).textContent =
            "$0";

    }

}



/* =========================================
   SEARCH + SORT
========================================= */


document
    .getElementById(
        "searchInput"
    )
    .addEventListener(
        "input",
        renderItems
    );


document
    .getElementById(
        "sortSelect"
    )
    .addEventListener(
        "change",
        renderItems
    );



/* =========================================
   PROFIT CALCULATOR
========================================= */


function calculateProfit() {

    const buy =
        Number(
            document.getElementById(
                "buy"
            ).value
        ) || 0;


    const sell =
        Number(
            document.getElementById(
                "sell"
            ).value
        ) || 0;


    const amount =
        Number(
            document.getElementById(
                "amount"
            ).value
        ) || 0;


    const cost =
        buy * amount;


    const revenue =
        sell * amount;


    const totalProfit =
        revenue - cost;


    let totalROI = 0;


    if (cost > 0) {

        totalROI =
            (
                totalProfit /
                cost
            ) * 100;

    }


    document.getElementById(
        "profit"
    ).textContent =
        money(totalProfit);


    document.getElementById(
        "roi"
    ).textContent =
        totalROI.toFixed(1) +
        "% ROI";

}


[
    "buy",
    "sell",
    "amount"
].forEach(
    id => {

        document
            .getElementById(id)
            .addEventListener(
                "input",
                calculateProfit
            );

    }
);



/* =========================================
   ADD ITEM
========================================= */


function addItem() {

    const name =
        document
            .getElementById(
                "newName"
            )
            .value
            .trim();


    const buy =
        Number(
            document.getElementById(
                "newBuy"
            ).value
        );


    const sell =
        Number(
            document.getElementById(
                "newSell"
            ).value
        );


    if (
        !name ||
        isNaN(buy) ||
        isNaN(sell)
    ) {

        alert(
            "Please enter an item name, buy price and sell price."
        );

        return;

    }


    items.push({

        name: name,

        buy: buy,

        sell: sell

    });


    saveDatabase();

    renderItems();

    renderAdmin();


    document.getElementById(
        "newName"
    ).value = "";


    document.getElementById(
        "newBuy"
    ).value = "";


    document.getElementById(
        "newSell"
    ).value = "";

}



/* =========================================
   ADMIN PANEL
========================================= */


function renderAdmin() {

    const list =
        document.getElementById(
            "adminList"
        );


    list.innerHTML = "";


    items.forEach(
        (item, index) => {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "admin-row";


            row.innerHTML = `

                <input
                    value="${item.name}"
                    onchange="editItem(${index}, 'name', this.value)"
                >

                <input
                    type="number"
                    value="${item.buy}"
                    onchange="editItem(${index}, 'buy', this.value)"
                >

                <input
                    type="number"
                    value="${item.sell}"
                    onchange="editItem(${index}, 'sell', this.value)"
                >

                <button
                    class="delete-button"
                    onclick="deleteItem(${index})"
                >
                    Delete
                </button>

            `;


            list.appendChild(row);

        }
    );

}



function editItem(
    index,
    property,
    value
) {

    if (
        property === "name"
    ) {

        items[index].name =
            value;

    } else {

        items[index][property] =
            Number(value);

    }


    saveDatabase();

    renderItems();

}



function deleteItem(index) {

    if (
        !confirm(
            "Delete this item?"
        )
    ) {

        return;

    }


    items.splice(
        index,
        1
    );


    saveDatabase();

    renderItems();

    renderAdmin();

}



/* =========================================
   RESET DATABASE
========================================= */


function resetDatabase() {

    if (
        !confirm(
            "Reset the entire database?"
        )
    ) {

        return;

    }


    items =
        JSON.parse(
            JSON.stringify(
                defaultItems
            )
        );


    saveDatabase();

    renderItems();

    renderAdmin();

}



/* =========================================
   ITEM MODAL
========================================= */


const modal =
    document.getElementById(
        "itemModal"
    );


const modalName =
    document.getElementById(
        "modalName"
    );


const modalStats =
    document.getElementById(
        "modalStats"
    );


function showItem(index) {

    const item =
        items[index];


    modalName.textContent =
        item.name;


    modalStats.innerHTML = `

        <div class="modal-stat">

            <span>
                Buy Price
            </span>

            <strong>
                ${money(item.buy)}
            </strong>

        </div>


        <div class="modal-stat">

            <span>
                Sell Price
            </span>

            <strong>
                ${money(item.sell)}
            </strong>

        </div>


        <div class="modal-stat">

            <span>
                Profit Per Item
            </span>

            <strong>
                +${money(profit(item))}
            </strong>

        </div>


        <div class="modal-stat">

            <span>
                ROI
            </span>

            <strong>
                ${roi(item).toFixed(1)}%
            </strong>

        </div>

    `;


    modal.classList.add(
        "show"
    );

}



document
    .getElementById(
        "closeModal"
    )
    .addEventListener(
        "click",
        () => {

            modal.classList.remove(
                "show"
            );

        }
    );


document
    .querySelector(
        ".modal-background"
    )
    .addEventListener(
        "click",
        () => {

            modal.classList.remove(
                "show"
            );

        }
    );


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            modal.classList.remove(
                "show"
            );

        }

    }
);



/* =========================================
   START WEBSITE
========================================= */


renderItems();

renderAdmin();