import express from 'express';
import config from 'config';
import path from 'path';
import mysql from 'mysql2';
import bcrypt from "bcrypt";
import {check, validationResult} from "express-validator";
import multer from "multer";
import cors from "cors";
import { v4 as uuidv4 } from 'uuid';

const app = express();

const options = {
    extended: true
}

app.use(express.json(options));
app.use(cors({
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
}))

const pool = mysql.createPool({
    host: 'db4free.net',
    user: 'kursovaya_andrew',
    password: 'hamqog-4gotka-hoxVip',
    database: 'kursovaya_andrew'
}).promise();

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'build')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'build', 'index.html'))
    });
}

const PORT = config.get('port') || 3000;

app.post('/api/auth/login',
    [
        check('email', 'Некорректный email').normalizeEmail().isEmail(),
        check('password', 'Пароль должен содержать минимум 6 символов').isLength({min: 6}).exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные!'
                });
            }

            const { email, password } = req.body;

            const [userList] = await pool.query(`SELECT * FROM users WHERE email = '${email}';`);

            if (!userList.length) {
                return res.status(404).json({message: 'Пользователь не найден!'});
            }

            const user = userList[0];

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({message: 'Неверный пароль!'});
            }

            return res.status(200).json({
                userInfo: {
                    id: user.id,
                    name: user.name,
                    surname: user.surname,
                    email: user.email,
                    isAdmin: !!user.isAdmin
                }
            });
        } catch (e) {
            return res.status(500);
        }
});

app.post(
    '/api/auth/register',
    [
        check('email', 'Некорректный email').normalizeEmail().isEmail(),
        check('password', 'Пароль должен содержать минимум 6 символов').isLength({min: 6}).exists()
    ],
    async (req, res) => {
        try {

            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные!'
                });
            }

            const { email, password, name, surname, isAdmin, password2 } = req.body;

            if (password !== password2) {
                return res.status(404).json({message: 'Введенные пароли не совпадают!'});
            }

            const [userList] = await pool.query(`SELECT * FROM users WHERE email = '${email}';`);

            if (userList.length) {
                return res.status(404).json({message: 'Данный email уже используется!'});
            }

            const hashedPassword = await bcrypt.hash(password, 12);

            await pool.query(`INSERT into users (email, password, name, surname, isAdmin, watchLater) values ('${email}', '${hashedPassword}', '${name}', '${surname}', ${isAdmin ? 1 : 0}, '[]');`)

            return res.status(201).json({
                userInfo: {
                    name,
                    surname,
                    email,
                    isAdmin: !!isAdmin
                }
            });
        } catch (e) {
            return res.status(500);
        }
    });

const uploadPhoto = multer({ storage: multer.memoryStorage() })

app.post('/api/movies', uploadPhoto.single('pic'), async (req, res) => {
    try {
        const image = req.file.buffer.toString('base64');
        const { name, country, producer, description, actors, trailer, age, money, budget, screenwriter, operator, genre, date, englishName, duration, director } = req.body;

        await pool.query(
            `INSERT into movies (director, producer, country, name, description, actors, trailer, age, money, budget, screenwriter, operator, genre, date, englishName, rating, ratingCount, duration, pic, reviews) values
                ('${director}', '${producer}', '${country}', '${name}', '${description}', '${actors}', '${trailer}', ${age}, ${money}, ${budget}, '${screenwriter}', '${operator}', '${genre}', '${date}', '${englishName || ''}', 0, 0, ${duration}, '${image}', '[]');`
        );

        return res.redirect('http://localhost:3000');
    } catch (e) {
        return res.status(500);
    }
});

app.get('/api/movies', async (req, res) => {
    try {
        let query = `SELECT * FROM movies`;
        const { search, year, genre, country, page, sort } = req.query;
        const queryObject = { name: search, year, genre, country, page: (+page - 1) * 10 };
        const queryKeys = Object.keys(queryObject).filter(key => queryObject[key]);
        if (queryKeys.length)
            queryKeys.forEach((key, index, array) => {
                if (!index) query += ' where ';
                if (key === 'page') query += '';
                else if (key === 'year') query += `DATE(date) > "${year}-01-01" and DATE(date) < "${Number(year) + 1}-01-01"`
                else query += `${key} LIKE lower('%${queryObject[key].toLowerCase()}%')`;
                if (index !== array.length - 1) query += ' and ';
            });

        query += ` ORDER BY rating ${+sort === 1 ? 'DESC' : 'ASC'} LIMIT ${queryObject.page},10`;

        const [movieList] = await pool.query(`${query};`);

        movieList.forEach(item => {
            item.ratingCount = JSON.parse(item.ratingCount).length
        });

        const [count] = await pool.query('SELECT COUNT(*) FROM movies;');

        return res.status(200).json({ response: movieList, count: count[0]['COUNT(*)'] });
    } catch (e) {
        return res.status(500);
    }
});


app.patch('/api/movies', async (req, res) => {
    try {
        const { id } = req.query;
        const { rating, userId, review, reviewId } = req.body;

        const [movieList] = await pool.query(`SELECT rating, ratingCount, reviews FROM movies where id = ${id};`);

        const movie = movieList[0];

        if (rating) {
            movie.ratingCount = JSON.parse(movie.ratingCount)
            if (!movie.ratingCount.find(item => item === userId)) {
                movie.ratingCount.push(userId)

                await pool.query(`UPDATE movies SET rating = ${+movie.rating + +rating}, ratingCount = '${JSON.stringify(movie.ratingCount)}' where id = ${id};`)

                return res.status(200).json({status: true});
            } else res.status(400).json({message: 'Уже оценен!'});

        }

        if (review) {
            movie.reviews = JSON.parse(movie.reviews)
            const newReview = {
                text: review.text,
                date: new Date(),
                id: uuidv4(),
                author: review.author
            }
            movie.reviews.unshift(newReview)

            await pool.query(`UPDATE movies SET reviews = '${ JSON.stringify(movie.reviews) }' where id = ${id};`)

            return res.status(200).json({ response: movie.reviews });
        }

        if (reviewId) {
            movie.reviews = JSON.parse(movie.reviews).filter(item => item.id !== reviewId);

            await pool.query(`UPDATE movies SET reviews = '${ JSON.stringify(movie.reviews) }' where id = ${id};`)

            return res.status(200).json({ response: movie.reviews });
        }
    } catch (e) {
        return res.status(500);
    }
});

app.patch('/api/movies/favorite', async (req, res) => {
    try {
        const { userId, movieId } = req.body;

        const [userList] = await pool.query(`SELECT watchLater FROM users where id = ${userId};`);

        const parsedArray = JSON.parse(userList[0].watchLater)
        if (!parsedArray.find(item => item === movieId)) parsedArray.push(movieId)
        else return res.status(400).json({ message: 'Уже добавлен!' });

        await pool.query(`UPDATE users set watchLater = '${JSON.stringify(parsedArray)}' where id = ${userId}`);

        return res.status(200).json({ result: true });
    } catch (e) {
        return res.status(500);
    }
})

app.delete('/api/movies/favorite', async (req, res) => {
    try {
        const { userId, movieId } = req.body;

        const [userList] = await pool.query(`SELECT watchLater FROM users where id = ${userId};`);

        let parsedArray = JSON.parse(userList[0].watchLater)
        parsedArray = parsedArray.filter(item => item !== movieId);

        await pool.query(`UPDATE users set watchLater = '${JSON.stringify(parsedArray)}' where id = ${userId}`);

        return res.status(204).json({ result: true });
    } catch (e) {
        return res.status(500);
    }
})

app.get('/api/movies/favorite', async (req, res) => {
    try {
        const { id } = req.query;

        const [userList] = await pool.query(`SELECT watchLater FROM users where id = ${id};`);
        const parsedArray = JSON.parse(userList[0].watchLater)
        if (parsedArray.length) {
            let query = `SELECT id, name, pic FROM movies where `

            parsedArray.forEach((item, index, array) => {
                query += `id = ${item}`;
                if (index !== array.length - 1) query += ' OR ';
                else query += ';';
            });

            const [movieList] = await pool.query(query);

            return res.status(200).json({ response: movieList });
        } else {
            return res.status(200).json({ response: [] })
        }
    } catch (e) {
        return res.status(500);
    }
})

const start = async () => {
    try {
        app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`));
    } catch (e) {
        console.log('Server Error');
        process.exit(1);
    }
};

start();
