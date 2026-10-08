require('dotenv').config();
const keys = Object.keys(process.env).filter(k => /url|database|direct/i.test(k));
for (const k of keys) {
  const v = process.env[k];
  const masked = v.replace(/:[^:@/]+@/, ':***@');
  console.log(k, '=', masked);
}

