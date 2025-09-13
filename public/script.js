const input = document.getElementById('searchInput');
const resultsList = document.getElementById('results');

input.addEventListener('input', async (e) => {
  const query = e.target.value;
  const res = await fetch(`/autocomplete?q=${encodeURIComponent(query)}`);
  const suggestions = await res.json();

  resultsList.innerHTML = '';
  suggestions.forEach(s => {
    const li = document.createElement('li');
    li.textContent = s;
    resultsList.appendChild(li);
  });
});

input.addEventListener('change', async (e) => {
  const query = e.target.value;
  const res = await fetch(`/search?q=${encodeURIComponent(query)}`);
  const results = await res.json();

  resultsList.innerHTML = '';
  results.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.name}: ${item.description}`;
    resultsList.appendChild(li);
  });
});
