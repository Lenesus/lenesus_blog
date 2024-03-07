import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import { registerValidation, loginValidation, postCreateValidation } from './validations.js';
import checkAuth from './utils/checkAuth.js';

import * as UserController from './controllers/UserController.js';

import * as PostController from './controllers/PostController.js';

 mongoose.connect('mongodb+srv://admin:wwwwww@cluster0.cyuh71l.mongodb.net/blog?retryWrites=true&w=majority')
     .then(() => console.log('DB ok')).catch((err) => console.log('DB error', err));

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },

    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },

});

const upload = multer({ storage });

app.use(express.json());

app.post('/auth/login', loginValidation, UserController.login);

app.post('/auth/register', registerValidation, UserController.register );

app.get('/auth/me', checkAuth, UserController.authMe );

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.files.originalname}`
    });
});

 app.get('/posts', PostController.getAll);
 app.get('/posts/:id', checkAuth, PostController.getOne);
 app.post('/posts', checkAuth, postCreateValidation, PostController.create);
 app.delete('/posts:id', checkAuth, PostController.remove);
 app.patch('/posts/:id', checkAuth, PostController.update);

app.listen(4444, (err) => {
   if (err) {
       return console.log(err);
   }

   console.log("Server Ok");
});