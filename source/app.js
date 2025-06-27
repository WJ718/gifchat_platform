const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const {sequelize} = require('./models');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');
const passport = require('passport');
const http = require('http');

dotenv.config();

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const roomRouter = require('./routes/room');

const app = express();
const server = http.createServer(app);

app.set('port', process.env.PORT || 8005);
app.set('view engine', 'html');
nunjucks.configure('views', {
    express : app, 
    watch : true,
});

const passportConfig = require('./passport');
passportConfig();

const sessionMiddleware = session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
});

sequelize.sync({force: false})
    .then(() => console.log('DB연결 성공'))
    .catch((err) => console.error(err));

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/gif', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());

// 이 코드를 통해 모든 html 템플릿에서 user 객체에 접근 가능
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/room', roomRouter);

app.use((req,res,next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

const socket = require('./socket');
socket(server);

server.listen(app.get('port'), () => {
    console.log(`${app.get('port')} 번에서 대기 중...`);
});