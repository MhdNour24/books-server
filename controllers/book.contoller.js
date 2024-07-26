const Book=require("../models/Books")
const fs = require('fs');
const path = require('path');

const getAllBooks=async (req,res,next)=>{
    try {
        const categoy =req.query.category
        const filter={}
        if(categoy){
            filter.category=categoy
        }
        const books=await Book.find(filter)
        res.json(books)
    } catch (error) {
        res.status(500).json({error:"an error occurred while fetching books"})
    }
}

const getSpecificBook=async(req,res,next)=>{
    try {
        const slugParam=req.params.slug;
        const book=await Book.findOne({slug:slugParam})
        if(!book){
            throw new Error("error")
        }
        res.json(book)
    } catch (error) {
        res.status(400).json({status:"failed",error:"the book was not found"})
    }
}

const addBook=async(req,res,next)=>{
    try {
        const bodyParams=req.body;
        const newBook =new Book({
            title:bodyParams.title,
            slug:bodyParams.slug,
            stars:bodyParams.stars,
            description:bodyParams.description,
            category:bodyParams.category,
            thumbnail:req.file.filename
        })
        await Book.create(newBook)
        res.json("Data Submitted")
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching books." });
    }
}

const updateBook = async (req, res, next) => {
    try {
      const bodyParams = req.body;
      const bookId = bodyParams.bookId;
      const updatedBook = {
        title: bodyParams.title,
        slug: bodyParams.slug,
        stars: bodyParams.stars,
        description: bodyParams.description,
        category: bodyParams.category,
      };
  
      if (req.file) {
        // العثور على الكتاب الحالي
        const book = await Book.findById(bookId);
        if (book && book.thumbnail) {
          // مسار الصورة الحالية
          const imagePath = path.join(__dirname, '..', 'uploads', book.thumbnail);
          // حذف الصورة الحالية
          fs.unlink(imagePath, (err) => {
            if (err) {
              console.error('Failed to delete old image', err);
            }
          });
        }
        // تحديث الصورة الجديدة
        updatedBook.thumbnail = req.file.filename;
      }
  
      await Book.findByIdAndUpdate(bookId, updatedBook);
      res.json("Data Submitted");
    } catch (error) {
      res.status(500).json({ error: "An error occurred while updating the book." });
    }
  };

const deleteBook=async(req,res,next)=>{
    const bookId=req.params.id
    try {
        const book = await Book.findById(bookId);
        const imagePath = path.join(__dirname, '..', 'uploads', book.thumbnail);
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error('Failed to delete image', err);
          }
        });
      }
      catch(error){
        console.error("we did not found the image")
      }
    try {
        await Book.deleteOne({_id:bookId})
        res.json("the book was successfully deleted ")
    } catch (error) {
        res.json(error)
    }    

}




module.exports ={
    getAllBooks,
    getSpecificBook,
    addBook,
    updateBook,
    deleteBook
}

