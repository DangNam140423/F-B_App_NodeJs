require('dotenv').config();
import db from '../models/index';
import bcrypt from 'bcryptjs';
const { Op } = require('sequelize');
import sendMailServices from './sendMailServices';
import { v4 as uuidv4 } from 'uuid';
import { getGroupWithRoles } from './jwtServices'
import { createJWT } from '../middleware/jwtAction'
import { includes } from 'lodash';

const salt = bcrypt.genSaltSync(10);

let handleUserLogin = (email, password, tokenDevice) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExit = await checkUserEmail(email);
            if (isExit) {
                let user = await db.User.findOne({
                    where: {
                        email: email,
                        status: true
                    },
                    // just take email, roleId and password
                    attributes: ['id', 'email', 'roleId', 'password', 'fullName', 'phone', 'status', 'image',],
                    raw: true
                });
                if (user) {
                    if (user.status === true) {
                        // compare password
                        let check = bcrypt.compareSync(password, user.password);
                        if (check) {
                            userData.errCode = 0;
                            userData.errMessage = `OKK`;
                            // delete password, just take email and roleId
                            delete user.password;
                            userData.user = await user;

                            // create jwt from user
                            let jwtData = await createJWT({
                                id: user.id,
                                email: user.email,
                                fullName: user.fullName,
                                roleId: user.roleId,
                                status: user.status,
                                phone: user.phone,
                                image: user.image,
                                tokenDevice: tokenDevice
                            });

                            userData.jwtData = jwtData;

                            await db.Device.findOrCreate({
                                where: {
                                    idUser: user.id,
                                    tokenDevice: tokenDevice
                                }
                            });

                        } else {
                            userData.errCode = 3;
                            userData.errMessage = 'Wrong password'
                        }
                    } else {
                        userData.errCode = 4;
                        userData.errMessage = 'Account has not been activated'
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = `User's not found `
                }
            } else {
                userData.errCode = 1;
                userData.errMessage = `Your's Email isn't exits in your system. Please try orther email `
            }
            resolve(userData)
        } catch (error) {
            reject(error);
        }
    })
}

let handleUserLogout = (idUser, tokenDevice) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.Device.destroy({
                where: {
                    tokenDevice: tokenDevice,
                    idUser: idUser
                },
            });
            resolve({
                errCode: 0,
                errMessage: "Logout success!"
            })
        } catch (error) {
            reject(error);
        }
    })
}


let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail }
            });
            if (user) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (error) {
            reject(error);
        }
    })
}

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = [];
            if (userId == 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    },
                    where: {
                        roleId: {
                            [Op.or]: ['R1', 'R2']
                        },
                        status: true
                    },
                    // order: [
                    //     ['id', 'DESC'],
                    // ]
                })
            }
            if (userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: {
                        id: +userId,
                        // roleId: {
                        //     [Op.or]: ['R1', 'R2']
                        // },
                        status: true
                    }, //dấu + để convert từ kiểu string sang nố nguyên
                    attributes: {
                        exclude: ['password'],
                    }
                })
            }
            resolve({ dataUser: users });
        } catch (error) {
            reject(error);
        }
    });
}

let getAllUserByRole = (arrRoleId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let arrUsers = await db.User.findAll({
                attributes: ['id'],
                where: {
                    roleId: { [Op.or]: arrRoleId },
                    status: true
                },
            })
            const arrIdUser = [];
            await arrUsers.forEach(element => {
                arrIdUser.push(element.id);
            });
            resolve(arrIdUser);
        } catch (error) {
            reject(error);
        }
    })
}


let getUserWithPagination = (userId, page, limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let offset = (page - 1) * limit;
            let countdataUser = 0;
            let dataUser = {};

            if (userId == 'ALL') {
                let { count, rows } = await db.User.findAndCountAll({
                    where: {
                        roleId: {
                            [Op.or]: ['R1', 'R2']
                        },
                        status: true
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    offset: offset,
                    limit: limit,
                })
                countdataUser = count;
                dataUser = rows;
            }
            if (userId && userId !== 'ALL') {
                let { count, rows } = await db.User.findAndCountAll({
                    where: {
                        id: +userId,  //dấu + để convert từ kiểu string sang nố nguyên
                        roleId: {
                            [Op.or]: ['R1', 'R2']
                        },
                        status: true
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    offset: offset,
                    limit: limit,
                })
                countdataUser = count;
                dataUser = rows;
            }

            let totalPages = Math.ceil(countdataUser / limit);
            let data = {
                totalRows: countdataUser,
                totalPages: totalPages,
                dataUser: dataUser
            }
            resolve(data);
        } catch (error) {
            reject(error);
        }
    })
}


let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            var hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (error) {
            reject(error);
        }
    });
}

let buildUrlEmail = (userData, token) => {
    let result = `${process.env.URL_REACT}/verify-user?token=${token}&userId=${userData.id}`;

    return result
}

let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email.trim() || !data.password.trim() ||
                !data.fullname.trim() || !data.roleid
                || !data.phonenumber
                // || !data.address.trim()
                // || !data.gender
                // || !data.avatar
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing inputs parameter'
                });
            } else {
                // check email is exit ?
                let check = await checkUserEmail(data.email);
                if (check === true) {
                    resolve({
                        errCode: 2,
                        errMessage: 'This email is already in use !'
                    })
                } else {
                    let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                    let createUser = await db.User.create({
                        fullName: data.fullname,
                        email: data.email,
                        password: hashPasswordFromBcrypt,
                        roleId: data.roleid,
                        status: true,
                        image: data.avatar ? data.avatar : null,
                        phone: data.phonenumber,
                        // address: data.address,
                        // gender: data.gender,
                    });

                    if (createUser) {
                        // let users = await db.User.findOne({
                        //     where: { email: data.email }
                        // })

                        // let token = uuidv4();

                        // await sendMailServices.handleSendMailAuth({
                        //     dataUser: users,
                        //     redirectLink: buildUrlEmail(users, token),
                        // });

                        // createUser.set({
                        //     token: token
                        // });
                        // await createUser.save();

                        resolve({
                            errCode: 0,
                            errMessage: 'Create a new user success'
                        });
                    } else {
                        resolve({
                            errCode: 3,
                            errMessage: 'New user creation failed'
                        });
                    }
                }
            }

        } catch (error) {
            reject(error);
        }
    });
}

let veriFyUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.userId || !data.token) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing inputs parameter'
                })
            } else {
                let user = await db.User.findOne({
                    where: {
                        id: data.userId,
                        token: data.token,
                        status: false
                    }
                })

                if (user) {
                    await db.User.update({
                        status: true
                    }, {
                        where: { id: user.id }
                    });
                    resolve({
                        errCode: 0,
                        errMessage: `Update the user succeeds`
                    });
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: `The account has been activated or does not exist`
                    });
                }
            }
        } catch (error) {
            reject(error);
        }
    })
}


let deleteUser = (idUser) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!idUser) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing inputs parameter !'
                })
            } else {
                let user = await db.User.findOne({
                    where: { id: idUser }
                })

                if (!user) {
                    resolve({
                        errCode: 2,
                        errMessage: `The user isn't exit!`
                    })
                } else {
                    // await db.User.destroy({
                    //     where: {
                    //         id: idUser
                    //     }
                    // });
                    await db.User.update({
                        status: false
                    }, {
                        where: { id: idUser }
                    });
                    resolve({
                        errCode: 0,
                        errMessage: `The user is delete`
                    })
                }
            }

        } catch (error) {
            reject(error);
        }
    })
}

let editUser = (dataUser) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!dataUser.id || 
                !dataUser.fullname.trim() ||
                !dataUser.phonenumber
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing inputs parameter !'
                })
            } else {
                let user = await db.User.findByPk(dataUser.id, { raw: false });

                if (user) {
                    user.fullName = dataUser.fullname;
                    user.phone = dataUser.phonenumber;

                    await user.save();

                    if (dataUser.avatar) {
                        user.image = dataUser.avatar;
                        await user.save();
                    }
                    resolve({
                        errCode: 0,
                        errMessage: `Update the user succeeds`
                    });
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: `User not found`
                    });

                }
            }

        } catch (error) {
            reject(error);
        }
    })
}


module.exports = {
    handleUserLogin, handleUserLogout, getAllUsers, getUserWithPagination, createNewUser, deleteUser, editUser, veriFyUser, getAllUserByRole
}