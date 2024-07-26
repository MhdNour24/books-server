const multer= require("multer");
const express=require("express")
const router=express.Router();
const booksController=require("../controllers/book.contoller")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null,uniqueSuffix+"-"+file.originalname)
    }
  })
  
const upload = multer({ storage: storage })

router.get("/",booksController.getAllBooks)
router.get("/:slug", booksController.getSpecificBook)
router.post("/",upload.single("thumbnail"),booksController.addBook)
router.put("/",upload.single("thumbnail"),booksController.updateBook) 
router.delete("/:id",booksController.deleteBook)

module.exports = router;