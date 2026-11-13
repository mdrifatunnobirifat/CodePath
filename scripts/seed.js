const fs = require('fs');
const path = require('path');

const SEED_FILE = path.join(__dirname, '..', 'data', 'seed.json');
const DB_FILE = path.join(__dirname, '..', 'data', 'database.json');

function seedDatabase() {
  if (!fs.existsSync(SEED_FILE)) {
    console.error('Seed file not found at:', SEED_FILE);
    process.exit(1);
  }

  const rawSeed = fs.readFileSync(SEED_FILE, 'utf8');
  const seedData = JSON.parse(rawSeed);

  // Initial user runtime state containers
  const dbData = {
    ...seedData,
    submissions: [],
    drafts: {},
    progress: {},
    revisionQueue: {},
    plans: {},
    savedJobs: ["Junior React Developer", "Python Backend Developer"]
  };

  fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2), 'utf8');
  console.log('Database successfully seeded at:', DB_FILE);
  console.log(`- Users: ${dbData.users.length}`);
  console.log(`- Tracks: ${dbData.tracks.length}`);
  console.log(`- Problems: ${dbData.problems.length}`);
  console.log(`- Lessons: ${dbData.lessons.length}`);
  console.log(`- Quizzes: ${dbData.quizzes.length}`);
  console.log(`- Interview Q&A: ${dbData.interviewQuestions.length}`);
  console.log(`- Mini-Projects: ${dbData.projects.length}`);
  console.log(`- Job Listings: ${dbData.jobs.length}`);
}

seedDatabase();
