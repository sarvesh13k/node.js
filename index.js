const app = require('./src/app');
const cluster = require('./cluster');

const PORT = process.env.PORT || 5010;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
