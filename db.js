import Database from "better-sqlite3";
import bcrypt from "bcrypt";
import { makeid } from "./static/shortner.js";

export const initDb = () => {
  const db = new Database("sqlite.db");
  db.pragma("journal_mode = WAL");

  db.prepare(
    `CREATE TABLE IF NOT EXISTS users (
            login TEXT PRIMARY KEY NOT NULL,
            password TEXT NOT NULL
        )`
  ).run();
  db.prepare(
    `CREATE TABLE IF NOT EXISTS Url (
            login TEXT NOT NULL,
            largeUrl TEXT NOT NULL,
            smallUrl TEXT NOT NULL
        )`
  ).run();

  const searchUrl = (path) => {
    const smallUrl = 'http://localhost:3000'+path;
    const existingUrl = db
      .prepare(`SELECT * FROM Url WHERE smallUrl = ?`)
      .get(smallUrl);
    if (!existingUrl) {
      throw new Error("Url don't exist");
    }
    return existingUrl.largeUrl;
  }

  const createUser = (login, password) => {
    const existingUser = db
      .prepare(`SELECT * FROM users WHERE login = ?`)
      .get(login);
    if (existingUser) {
      throw new Error("User already exists");
    }
    db.prepare(`INSERT INTO users (login, password) VALUES (?, ?)`).run(
      login,
      bcrypt.hashSync(password, 10)
    );
  };

  const createUrl = (login, url, host) => {
    const existingLargeUrl = db
    .prepare(`SELECT * FROM Url WHERE login = ? AND LargeUrl = ?`)
      .get(login, url);
    if (existingLargeUrl) {
      throw new Error("Url already exists");
    }
    let smUrl =host+ makeid(Math.floor(Math.random() * (10 - 1 + 1) + 1));;
    const smUrlCheck = (elem)=> {
      const existingSmallUrl = db
        .prepare(`SELECT * FROM Url WHERE login = ? AND smallUrl = ?`)
        .get(login, elem);
      if (existingSmallUrl) {
        smUrl =host + makeid(Math.floor(Math.random() * (10 - 1 + 1) + 1));
        smUrlCheck(smUrl);
      }
  }
  smUrlCheck(smUrl);
    db.prepare(`INSERT INTO Url (login, largeUrl, smallUrl) VALUES (?, ?, ?)`).run(
      login,
      url,
      smUrl
    );
    return smUrl;
  };

  const getTableData = (login) => {
   const data = db
    .prepare(`SELECT * FROM Url WHERE login = ?`)
    .all(login);
    return data;
  }

  const auth = (login, password) => {
    const user = db.prepare(`SELECT * FROM users WHERE login = ?`).get(login);
    if (user) {
      if (bcrypt.compareSync(password, user.password)) {
        return user;
      } else {
        throw new Error("Password is incorrect");
      }
    } else {
      throw new Error("User not found");
    }
  };

  return { db, createUser, auth, createUrl, getTableData,searchUrl };
};
