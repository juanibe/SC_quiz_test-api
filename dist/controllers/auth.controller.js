"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const bcrypt_1 = require("bcrypt");
const user_model_1 = __importDefault(require("../models/user.model"));
const jsonwebtoken_1 = require("jsonwebtoken");
class AuthController {
    constructor() { }
    register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { body } = req;
                if (!body || !body.email || !body.password) {
                    const error = new Error();
                    error.message = 'Email and Passoword are required';
                    error.status = 400;
                    throw error;
                }
                const userExist = user_model_1.default.findOne({ email: body.email });
                if (userExist) {
                    const error = new Error();
                    error.message = 'User already exists';
                    error.status = 400;
                    throw error;
                }
                ;
                const hashedPass = this.hashPass(body.passoword);
                body.role = 0;
                body.password = hashedPass;
                const user = yield user_model_1.default.create(body);
                if (!user) {
                    const error = new Error();
                    error.message = 'There was a problem trying to create the user';
                    error.status = 500;
                    throw error;
                }
                ;
                const jwt = this.generateJwt(user);
                res.status(200).json({ user: user, jwt: jwt });
            }
            catch (e) {
                next(e);
            }
        });
    }
    ;
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const userExist = yield user_model_1.default.findOne({ email: email });
                if (!userExist) {
                    const error = new Error();
                    error.message = 'Invalid credentials';
                    error.status = 400;
                    throw error;
                }
                ;
                const isValidPassword = userExist.comparePasswords(password);
                if (!isValidPassword) {
                    const error = new Error();
                    error.message = 'Incorrect password';
                    error.status = 400;
                    throw error;
                }
                const jwt = this.generateJwt(userExist);
                res.status(200).json({ jwt: jwt });
            }
            catch (e) {
                next(e);
            }
        });
    }
    hashPass(password) {
        const salt = bcrypt_1.genSalt(10);
        return bcrypt_1.hashSync(password, salt);
    }
    ;
    generateJwt(user) {
        return jsonwebtoken_1.sign({ id: user._id, role: user.role, email: user.email }, 'Secret-Key');
    }
}
;
exports.authController = new AuthController();
