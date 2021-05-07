const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const passportConfig = require('./passport');
const musicRouter = require('./routes/music');
const userRouter = require('./routes/user');

const app = express();
passportConfig();
app.set('port', process.env.PORT || 80);
const morganOption = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(morganOption));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: true,
    credentials: true,
    exposedHeaders: ["Set-Cookie"],
}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        sameSite: 'none',
        secure: false,
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/music', musicRouter);
app.use('/api/user', userRouter);

app.use((req, res, next) => {
    res.status(404).send('404 NOT FOUND');
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err.message);
});

app.listen(app.get('port'), () => {
    console.log('server start !');
})