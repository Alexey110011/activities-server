require('dotenv').config()
const Pool = require('pg').Pool

const pool = new Pool({
    connectionString:process.env.DATABASE_URL,
  ssl:{
    rejectUnauthorized:false
  }
})

const getAllBooks = ()=>{
    return new Promise(function(resolve, reject){
        pool.query(
            `SELECT * FROM book ORDER BY authors ASC`, (error, results)=>{
                if(error) {reject(error)};
                resolve(results.rows)
            })
    });
}

//----------------------------------------------------------------------------------------------------------------------
const addReviewToBook = (req) =>{
    const  bookid = req.params.bookId
    let author="1"
    const {rating, reviewtext/*, createdOn*/} = req.body
    return new Promise (function(resolve, reject){
    pool.query('INSERT INTO reviews (bookid, author, rating, reviewtext) VALUES ($1, $2, $3, $4) RETURNING *', [bookid, author, rating, reviewtext], (error, results) => {
        if (error) {
            reject(error)
          }
          resolve(results.rows)
        })
      })
    }

    const createBook = (body)=>{
        const {authors, title, description, year, category, pictureUrl, price} = body
        return new Promise (function(resolve, reject){
            pool.query('INSERT INTO book (authors, title, description,year, category, pictureUrl, price) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [authors, title, description,year, category, pictureUrl,price], (error, results) => {
                if (error) {
                    reject(error)
                  }
                  resolve(results)
                })
              })
            }  

    
    function addReviewToDb(req/*, res*/){
        let author;
        if(req.payload&&req.payload.name){
        author = req.payload.name
        } else {console.log("No name presented")
        }
        const bookid = req.params.bookId
        const {rating, reviewtext/*, createdOn*/} = req.body
        console.log(100000,req.body)//,
        //newReview.createdOn = req.body.createdOn
        return new Promise (function(resolve, reject){
            pool.query('INSERT INTO reviews (bookid, author, rating, reviewtext) VALUES ($1, $2, $3, $4) RETURNING *', [bookid, author, rating, reviewtext/*, createdOn*/], (error, results) => {
                if (error) {
                    reject(error)
                    console.log("tyu")
                  }
                  resolve(results.rows)
                })
              })
              
            }
    
//************************************************************************************************************************ */
    const updateRating = (req)=>{
        const bookid = req.params.bookId
        const newRating = req.body.rating
        console.log(150, req.body)
        return new Promise(function(resolve, reject){
            pool.query('UPDATE book SET rating = $2 WHERE _id = $1',[bookid, newRating], (error, results)=>{
            if(error){
                reject (error)
                console.log(body.body)
            }
            resolve(results.rows)
            console.log('Success', results.rows)
        })
    })
}

    const getReviewsForBooks = ()=>{
        return new Promise(function(resolve, reject){
            pool.query(
                `SELECT * FROM reviews ORDER BY _id ASC`, (error, results)=>{
                    if(error) {reject(error)};
                    resolve(results.rows)
                })
        })
    }
 

module.exports = {getAllBooks,
                  //getBook,
                  createBook, 
                  //createUser,
                  addReviewToDb,
                addReviewToBook,
                updateRating,
            getReviewsForBooks,
        }