// Track counts in JS memory for chart updates
let statPositive = 0,
  statNeutral = 0,
  statNegative = 0;

// Chart.js setup
const ctx = document.getElementById('sentimentChart').getContext('2d');
const sentimentChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        label: 'Sentiment Count',
        data: [statPositive, statNeutral, statNegative],
        backgroundColor: [
          '#38a169', // Positive: green
          '#314366', // Neutral: blue-gray
          '#F7511EFF', // Negative: orange
        ],
        borderRadius: 6,
        borderWidth: 0,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: '#314366',
          font: { weight: 'bold' },
        },
      },
      x: {
        ticks: {
          font: { weight: 'bold' },
          color: ['#38a169', '#314366', '#F7511EFF'],
        },
      },
    },
  },
});

function updateChart() {
  sentimentChart.data.datasets[0].data = [
    statPositive,
    statNeutral,
    statNegative,
  ];
  sentimentChart.update();
  updateSummary();
}

function updateSummary() {
  const total = statPositive + statNeutral + statNegative;
  const summary = document.getElementById('dashboardSummary');
  if (total === 0) {
    summary.textContent =
      'Welcome! Enter feedback to test out our sentiment AI. Your feedback powers smarter analytics for product teams.';
  } else {
    let msg = `Total feedback analyzed: ${total}. `;
    if (statPositive > statNeutral && statPositive > statNegative)
      msg += 'Overall sentiment is mostly positive 🚀.';
    else if (statNegative > statNeutral && statNegative > statPositive)
      msg += 'Overall sentiment trend is negative 🛑.';
    else msg += 'Sentiment is mostly neutral.';
    summary.textContent = msg;
  }
}

async function analyze() {
  const input = document.getElementById('feedbackInput').value.trim();
  const resultDiv = document.getElementById('result');
  if (!input) {
    resultDiv.textContent = 'Please enter feedback before submitting.';
    resultDiv.style.color = '#F7511EFF';
    return;
  }
  resultDiv.textContent = 'Analyzing sentiment...';
  resultDiv.style.color = '#314366';
  try {
    const response = await fetch(
      'https://o4kcv85fql.execute-api.us-east-1.amazonaws.com/Production/predict',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback: input }),
      }
    );
    const data = await response.json();
    const sentiment = data.sentiment || 'Unknown';
    resultDiv.textContent = `Predicted Sentiment: ${sentiment}`;
    if (sentiment === 'positive') {
      resultDiv.style.color = '#38a169';
      statPositive++;
    } else if (sentiment === 'negative') {
      resultDiv.style.color = '#F7511EFF';
      statNegative++;
    } else if (sentiment === 'neutral') {
      resultDiv.style.color = '#314366';
      statNeutral++;
    } else {
      resultDiv.style.color = '#b22222';
    }
    document.getElementById('feedbackInput').value = '';
    updateChart();
  } catch (err) {
    resultDiv.textContent = 'Error analyzing sentiment. Try again.';
    resultDiv.style.color = '#F7511EFF';
  }
}

// On load, draw empty chart and summary
updateChart();
