document.addEventListener("DOMContentLoaded", function () {
  const coinTableBody = document.getElementById("coinTableBody");
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const pageIndicator = document.getElementById("pageIndicator");

  let currentPage = 1;
  const coinsPerPage = 5;
  let allCoins = [];

  function fetchCoins() {
    fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
    )
      .then((res) => res.json())
      .then((data) => {
        allCoins = data;
        renderTable();
      })
      .catch((err) => console.error("Error fetching coins:", err));
  }

  function renderTable(filteredCoins = null) {
    const coins = filteredCoins || allCoins;
    const start = (currentPage - 1) * coinsPerPage;
    const end = start + coinsPerPage;
    const pageCoins = coins.slice(start, end);

    coinTableBody.innerHTML = "";

    pageCoins.forEach((coin) => {
      const change24h = coin.price_change_percentage_24h;
      const changeColor = change24h >= 0 ? "#10B981" : "#EF4444";
      const changeSymbol = change24h >= 0 ? "+" : "";

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>
          <img src="${coin.image}" alt="${coin.name}">
          ${coin.name}
        </td>
        <td>${coin.symbol.toUpperCase()}</td>
        <td>$${coin.current_price.toLocaleString()}</td>
        <td style="color: ${changeColor}">
          ${changeSymbol}${change24h.toFixed(2)}%
        </td>
      `;
      coinTableBody.appendChild(row);
    });

    pageIndicator.textContent = currentPage;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = end >= coins.length;
  }

  searchButton.addEventListener("click", () => {
    const keyword = searchInput.value.toLowerCase();
    const filtered = allCoins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(keyword) ||
        coin.symbol.toLowerCase().includes(keyword)
    );
    currentPage = 1;
    renderTable(filtered);
  });

  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderTable();
    }
  });

  nextBtn.addEventListener("click", () => {
    const totalPages = Math.ceil(allCoins.length / coinsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderTable();
    }
  });

  // Initial fetch
  fetchCoins();
});
