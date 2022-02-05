// http://localhost:5000/

const express = require("express");
const methodOverride = require("method-override");
const modelsArticle = require("./models/article");
const routesArticles = require("./routes/articles");
const mongoose = require("mongoose");
const expressApp = express();
const PORT = process.env.PORT || 3001;

mongoose.connect("mongodb://localhost/blog", {useNewUrlParser: true, useUnifiedTopology: true});
expressApp.set("view engine", "ejs");
expressApp.use(express.urlencoded({extended: false}));
expressApp.use(methodOverride("_method"));

expressApp.get("/", async (req, res) => {
  const articles = await modelsArticle.find().sort({createdAt: "desc"});
  res.render("articles/index", {articles: articles});
});
expressApp.use("/articles", routesArticles);
// expressApp.listen(5000);

expressApp.listen(PORT, () =>
    console.info(`Example app listening at http://localhost:${PORT} 🚀`)
);