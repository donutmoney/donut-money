const items = [

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
    }

];


function money(number) {

    return "$" +
        Number(number).toLocaleString();

}


function displayItems() {

    const container =
        document.getElementById(
            "itemsList"
        );


    const search =
        document.getElementById(
            "search"
        ).value.toLowerCase();


    const filtered =
        items.filter(item =>
            item.name
                .toLowerCase()
                .includes(search)
        );


    container.innerHTML = "";


    filtered.forEach(item => {

        const profit =
            item.sell - item.buy;


        const card =
            document.createElement(
                "div"
            );


        card.className = "item";


        card.innerHTML = `

            <h3>
                🍩 ${item.name}
            </h3>

            <p>
                Buy:
                <strong>
                    ${money(item.buy)}
                </strong>
            </p>

            <p>
                Sell:
                <strong>
                    ${money(item.sell)}
                </strong>
            </p>

            <div class="profit">

                Profit:
                +${money(profit)}

            </div>

        `;


        container.appendChild(card);

    });

}


function calculate() {

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


    const result =
        (sell - buy) * amount;


    document.getElementById(
        "profit"
    ).textContent =
        money(result);

}


displayItems();
calculate();
