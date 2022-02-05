const express = require("express");
const expressRouter = express.Router();
const modelsArticle = require("./../models/article");

expressRouter.get("/new", (req, res) => {res.render("articles/new", {article: new modelsArticle()})});

expressRouter.get("/edit/:id", async (req, res) => {
  const editArticle = await modelsArticle.findById(req.params.id);
  res.render("articles/edit", {article: editArticle});
});

expressRouter.get("/:slug", async (req, res) => {
  const slugArticle = await modelsArticle.findOne({slug: req.params.slug});
  if (slugArticle == null) res.redirect("/");
  res.render("articles/show", {article: slugArticle});
});

expressRouter.post("/", async (req, res, next) => {
  req.article = new modelsArticle();
  next();
}, redirectSaveArticle("new"));

expressRouter.put("/:id", async (req, res, next) => {
  req.article = await modelsArticle.findById(req.params.id);
  next();
}, redirectSaveArticle("edit"));

expressRouter.delete("/:id", async (req, res) => {
  await modelsArticle.findByIdAndDelete(req.params.id);
  res.redirect("/");
})

function redirectSaveArticle(path) {
  return async (req, res) => {
    let article = req.article;
    article.title = req.body.title;
    article.description = req.body.description;
    article.markdown = req.body.markdown;
    try {
      article = await article.save();
      res.redirect(`/articles/${article.slug}`);
    }
    catch (e) {res.render(`articles/${path}`, {article: article})}
  }
};
module.exports = expressRouter;
