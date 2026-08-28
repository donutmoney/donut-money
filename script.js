let items = [];


/* LOAD ITEM DATABASE */

async function loadDatabase() {

    try {

        const response = await fetch("data.json");

        const data = await response.json();

        items = data.items;

        renderItems();

        renderAdmin();

        updateStats();

    } catch (error) {

        console.error(
            "Could not load database:",
            error
        );

    }

}


/* MONEY FORMAT */

function money(number) {

    return "$" +
        Number(number).toLocaleString(
            "en-US",
            {
                maximumFractionDigits: 2
            }
        );

}


/* PROFIT */

function profit(item) {

    return item.sell - item.buy;

}


/* ROI */

function roi(item) {

    if (item.buy <= 0) {

        return 0;

    }

    return (
        profit(item) /
        item.buy
    ) * 100;

}


/* DISPLAY ITEMS */

function renderItems() {

    const table =
        document.getElementById(
            "itemTable"
        );

    if (!table) return;


    const search =
        document.getElementById(
            "searchInput"
        ).value.toLowerCase();


    const sort =
        document.getElementById(
            "sortSelect"
        ).value;


    let filtered =
        items.filter(
            item =>
                item.name
                    .toLowerCase()
                    .includes(search)
        );


    filtered.sort((a, b) => {

        if (sort === "profit") {

            return profit(b) - profit(a);

        }

        if (sort === "roi") {

            return roi(b) - roi(a);

        }

        if (sort === "buy") {

            return a.buy - b.buy;

        }

        if (sort === "sell") {

            return b.sell - a.sell;

        }

        if (sort === "name") {

            return a.name.localeCompare(
                b.name
            );

        }

        return 0;

    });


    table.innerHTML = "";


    filtered.forEach(item => {

        const row =
            document.createElement("tr");


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

    });

}


/* STATS */

function updateStats() {

    const count =
        document.getElementById(
            "itemCount"
        );

    const marketItems =
        document.getElementById(
            "marketItems"
        );

    const bestProfit =
        document.getElementById(
            "bestProfit"
        );


    if (count) {

        count.textContent =
            items.length;

    }


    if (marketItems) {

        marketItems.textContent =
            items.length;

    }


    if (
        bestProfit &&
        items.length > 0
    ) {

        const best =
            Math.max(
                ...items.map(
                    item =>
                        profit(item)
                )
            );


        bestProfit.textContent =
            money(best);

    }

}


/* SEARCH */

document
    .getElementById("searchInput")
    ?.addEventListener(
        "input",
        renderItems
    );


/* SORT */

document
    .getElementById("sortSelect")
    ?.addEventListener(
        "change",
        renderItems
    );


/* CALCULATOR */

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
            (totalProfit / cost) * 100;

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
].forEach(id => {

    document
        .getElementById(id)
        ?.addEventListener(
            "input",
            calculateProfit
        );

});


/* ADMIN DISPLAY */

function renderAdmin() {

    const list =
        document.getElementById(
            "adminList"
        );

    if (!list) return;


    list.innerHTML = "";


    items.forEach((item, index) => {

        const row =
            document.createElement("div");


        row.className =
            "admin-row";


        row.innerHTML = `

            <input
                value="${item.name}"
                readonly
            >

            <input
                type="number"
                value="${item.buy}"
                readonly
            >

            <input
                type="number"
                value="${item.sell}"
                readonly
            >

            <button
                class="delete-button"
                onclick="alert('Online editing will be added in the next step.')"
            >
                Edit
            </button>

        `;


        list.appendChild(row);

    });

}


/* ITEM MODAL */

const modal =
    document.getElementById(
        "itemModal"
    );


function showItem(index) {

    const item =
        items[index];

    if (!item || !modal) return;


    document.getElementById(
        "modalName"
    ).textContent =
        item.name;


    document.getElementById(
        "modalStats"
    ).innerHTML = `

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


    modal.classList.add("show");

}


/* CLOSE MODAL */

document
    .getElementById("closeModal")
    ?.addEventListener(
        "click",
        () => {

            modal.classList.remove(
                "show"
            );

        }
    );


document
    .querySelector(".modal-background")
    ?.addEventListener(
        "click",
        () => {

            modal.classList.remove(
                "show"
            );

        }
    );


/* START */

loadDatabase();
