require("dotenv").config();
const cors=require("cors");
const express=require("express");
const connectDB=require("./connectDB")
const app= express();
const PORT=process.env.PORT || 8000;

// middlewares
connectDB()
app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use("/uploads",express.static("uploads"))


// routers
const booksRouter=require("./routes/book.route")
app.use("/api/books",booksRouter)

app.all("*", (req, res, next) => {
    res
      .status(404)
      .json({
        status: "error",
        message: "this resource is not available ",
      });
  });

app.listen(PORT, ()=>{
    console.log("listening on port  "+PORT);
})