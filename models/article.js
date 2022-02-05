const markedArticle = require("marked");
const slugifyArticle = require("slugify");
const domPurifyArticle = require("dompurify");
const {JSDOM} = require("jsdom");
const mongoose = require("mongoose");
const dompurifyJSDOM = domPurifyArticle(new JSDOM().window);

const schemaArticle = new mongoose.Schema({
  title: {required: true, type: String},
  description: {type: String},
  markdown: {required: true, type: String},
  createdAt: {default: Date.now, type: Date},
  slug: {unique: true,required: true,type: String},
  sanitizedHtml: {required: true, type: String}
});

schemaArticle.pre("validate", function(next) {
  if (this.title) {this.slug = slugifyArticle(this.title, {lower: true, strict: true})}
  if (this.markdown) {this.sanitizedHtml = dompurifyJSDOM.sanitize(markedArticle.parse(this.markdown))}
  next();
});
module.exports = mongoose.model('Article', schemaArticle);