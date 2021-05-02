const userRepository = require('../repository/userRepository');
const cryptoService = require('./cryptoService');
const passport = require('passport');

const userService = {
    signup: async function ({ id, password, name }) {        
        const findedUser = await userRepository.findById(id);
        if (findedUser) {
            return {
                isSuccess: false,
                message: "이미 사용중인 id 입니다"
            };
        }
        
        const { hashPassword, salt } = await cryptoService.passwordEncrypt({ plain: password });
        const user = {
            id,
            password: hashPassword,
            passwordSalt: salt,
            name,
        }

        let json = {};
        const result = await userRepository.save(user);

        json.isSuccess = result.affectedRows === 1;
        json.message = result.affectedRows === 1 ? "회원 가입 성공" : "회원 가입 중 서버 에러 발생";

        return json;
    },
    getUserInfoBy: async function (id) {
        const user = await userRepository.findById(id);
        let userDto;
        if (user) {
            userDto = {
                userId: user.userId,
                userName: user.userName,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        }
        return userDto;
    },
    authenticate: async function ({ id, password }) {
        let json = {};
        const user = await userRepository.findById(id);
        if (!user) {
            return {
                isValid: false,
                message: "존재하지 않은 ID정보 입니다"
            };
        }

        const isValid = await cryptoService.passwordVerify({
            givenPw: password,
            targetPw: user.userPassword,
            targetPwSalt: user.passwordSalt
        });

        json.isValid = isValid;
        json.message = isValid ? "로그인에 성공하였습니다" : "비밀번호를 확인하여 주세요";

        return json;
    },

    login: async function ({ req, res, next }) {
        return new Promise((resolve, reject) => {
            passport.authenticate('local', (authError, userId, info) => {
                if (authError) {
                    console.log(authError);
                    return resolve(next(authError));
                }
                if (!userId) {
                    return resolve(info);
                }
                
                return req.login(userId, (loginError) => {
                    if (loginError) {
                        console.log(loginError);
                        return resolve(next(loginError));
                    }
                    return resolve(info);
                })
            })(req, res, next);
        });
    },
    logout: async function ({ req, res }) {
        req.logout();
        req.session.destroy();
    },

    updateUserPassword: async function ({id, newPassword}) {
        const { hashPassword, salt } = await cryptoService.passwordEncrypt({plain: newPassword});
        
        const result = await userRepository.updatePassword({
            targetId: id, 
            newPassword: hashPassword,
            newPasswordSalt: salt
        });
        let json;
        if(result.rows.changedRows === 1) {
            json = {
                isSuccess: true,
                message: "비밀번호 수정이 완료되었습니다",
            }
        } else {
            json = {
                isSuccess: false,
                message: "관리자에게 문의하세요",
            }
        }
        return json;
    }
    
};

module.exports = userService;