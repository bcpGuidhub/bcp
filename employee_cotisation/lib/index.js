import fs from "fs";
import publicodes from "publicodes";
const { formatValue, default: Engine } = publicodes;
import Rules from "../cache/index.js";
const ttl = 60 * 60 * 3; // cache for 3 Hour
const cache = new Rules(ttl);

async function cotisation(situation, evaluation) {
  const rules = await cache.get("rules", retrieveRules);
  const engine = new Engine(rules);
  const net = engine.setSituation(situation).evaluate(evaluation);
  const computeValue = parseInt(net.nodeValue, 10);
  const value = computeValue === null ? 0 : computeValue;
  return value;
}

function readRulesDir() {
  return new Promise((resolve, reject) => {
    fs.readdir("./rules", function (err, filenames) {
      if (err) {
        reject(err);
      }
      resolve(filenames);
    });
  });
}
function readYamlRule(dirname, filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(dirname + filename, "utf-8", function (err, content) {
      if (err) {
        reject(err);
      }
      resolve(content);
    });
  });
}
function retrieveRules() {
  return new Promise((resolve, reject) => {
    readRulesDir()
      .then((files) => files.map((filename) => filename))
      .then((file_paths) =>
        file_paths.map((path) => readYamlRule("./rules/", path))
      )
      .then((file_promises) => Promise.all(file_promises))
      .then((data) => {
        let c = data.reduce((acc, d) => {
          acc += d;
          return acc;
        }, "");
        resolve(c);
      })
      .catch((err) => reject(err));
  });
}

export default cotisation;
