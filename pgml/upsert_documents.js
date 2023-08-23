const pgml = require("pgml-test");
var fs = require("fs");

pgml.js_init_logger();

require("dotenv").config();

const walk = (dir) => {
  let files = fs.readdirSync(dir);
  return files
    .map((file) => {
      file_path = dir + "/" + file;
      let stat = fs.statSync(file_path);
      if (stat.isDirectory()) {
        return walk(file_path);
      } else {
        return { text: fs.readFileSync(file_path).toString(), id: file_path };
      }
    })
    .flat();
};

const upsertDocuments = async () => {
  let collection = pgml.newCollection(process.env.COLLECTION);

  let dir = __dirname + "/../" + process.env.DOCUMENTS_DIR;
  let files = walk(dir);
  await collection.upsert_documents(files);
};

const addPipeline = async () => {
  let collection = pgml.newCollection(process.env.COLLECTION);

  let model = pgml.newModel(
    process.env.MODEL,
    "pgml",
    JSON.parse(process.env.MODEL_PARAMS),
  );
  let splitter = pgml.newSplitter(
    process.env.SPLITTER,
    JSON.parse(process.env.SPLITTER_PARAMS),
  );
  let pipeline = pgml.newPipeline(process.env.PIPELINE, model, splitter);

  await collection.add_pipeline(pipeline);
};

const main = async () => {
  await addPipeline();
  await upsertDocuments();
}

main().then(() => console.log("Documents upserted successfully!"));
