import db from '../models/index';
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const cloudinary = require('cloudinary').v2;


let getAllMenu = (categoryInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let menus = [];
            if (categoryInput == 'ALL') {
                menus = await db.Menu.findAll({
                    // attributes: {
                    //     exclude: ['image']
                    // },
                    include: [
                        { model: db.Allcode, as: 'categoryData' }
                    ],
                    order: [
                        ['category', 'DESC'],
                        ['name', 'ASC']
                    ],
                    raw: true,
                    nest: true
                });
                // menus = ['all']
            }
            if (categoryInput && categoryInput !== 'ALL') {
                menus = await db.Menu.findAll({
                    // attributes: {
                    //     exclude: ['image']
                    // },
                    include: [
                        { model: db.Allcode, as: 'categoryData' }
                    ],
                    order: [
                        ['name', 'ASC']
                    ],
                    where: { category: categoryInput },
                    raw: true,
                    nest: true
                });
                // menus = ['1', '2']
            }
            resolve(menus);
        } catch (error) {
            reject(error);
        }
    })
}


let getMenuByName = (inputSearch) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (inputSearch) {
                let result = await db.Menu.findAll({
                    where: {
                        name: { [Op.iLike]: `%${inputSearch}%` },
                    },
                });

                resolve({
                    errCode: 0,
                    errMessage: 'OK',
                    dataMenu: result
                })
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing inputs parameter !',
                    dataMenu: []
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let getMenuById = (idDish) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (idDish) {
                let result = await db.Menu.findAll({
                    where: {
                        id: idDish
                    },
                });

                resolve({
                    errCode: 0,
                    errMessage: 'OK',
                    dataMenu: result
                })
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing inputs parameter !',
                    dataMenu: {}
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}
let getMenuWithPagination = (categoryInput, page, limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let offset = (page - 1) * limit;
            let countdataMenu = 0;
            let dataMenu = {};
            if (categoryInput === 'ALL') {
                let { count, rows } = await db.Menu.findAndCountAll({
                    // attributes: {
                    //     exclude: ['image']
                    // },
                    include: [
                        { model: db.Allcode, as: 'categoryData' }
                    ],
                    order: [
                        ['category', 'DESC'],
                        ['name', 'ASC']
                    ],
                    offset: offset,
                    limit: limit,
                    raw: true,
                    nest: true
                })
                countdataMenu = count;
                dataMenu = rows;
            }
            if (categoryInput && categoryInput !== 'ALL') {
                let { count, rows } = await db.Menu.findAndCountAll({
                    // attributes: {
                    //     exclude: ['image']
                    // },
                    include: [
                        { model: db.Allcode, as: 'categoryData' }
                    ],
                    order: [
                        ['name', 'ASC']
                    ],
                    where: { category: categoryInput },
                    offset: offset,
                    limit: limit,
                    raw: true,
                    nest: true
                })
                countdataMenu = count;
                dataMenu = rows;
            }

            let totalPages = Math.ceil(countdataMenu / limit);
            let data = {
                totalRows: countdataMenu,
                totalPages: totalPages,
                dataMenu: dataMenu,
                currentPage: page
            }
            resolve(data);
        } catch (error) {
            reject(error);
        }
    })
}

let checkNameDish = (name) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dish = await db.Menu.findOne({
                where: { name: name }
            });
            if (dish) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (error) {
            reject(error);
        }
    })
}

let checkNameDish_2 = (category, name, id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dish = await db.Menu.findOne({
                where: {
                    name: name,
                    category: category,
                    id: {
                        [Op.ne]: id
                    }
                    // cùng tên nhưng khác id
                }
            });
            if (dish) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (error) {
            reject(error);
        }
    })
}

let createNewDish = (dataDish) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!dataDish.name.trim() || !dataDish.category
                // || typeof dataDish.many_sizes !== 'boolean'
                // || !dataDish.price_L
                || !dataDish.description.trim()
                || !dataDish.file
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing inputs parameter !'
                });
            } else {
                //check name dish
                let check = await checkNameDish(dataDish.name);
                if (check === true) {
                    resolve({
                        errCode: 2,
                        errMessage: 'This dish name is exist !'
                    })
                } else {
                    let createDish = await db.Menu.create({
                        name: dataDish.name,
                        many_sizes: false,
                        price_S: null,
                        price_M: null,
                        price_L: 10000,
                        category: dataDish.category,
                        // category cần kiểm tra chính xác nó có tồn tại trong bảng allcodes hay không 
                        // để đảm bảo tính nhất quán của dữ liệu
                        description: dataDish.description,
                        image: dataDish.file,
                    });

                    if (createDish) {
                        resolve({
                            errCode: 0,
                            errMessage: 'Create a new dish success'
                        });
                    } else {
                        resolve({
                            errCode: 3,
                            errMessage: 'Create a new dish failed'
                        });
                    }
                }
            }
        } catch (error) {
            reject(error);
        }
    })
}

let editDish = (dataDish) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!dataDish.id
                || !dataDish.name.trim()
                || !dataDish.category
                || !dataDish.description.trim()
                // || !dataDish.file
                // || typeof dataDish.many_sizes !== 'boolean' 
                // || !dataDish.price_L
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing inputs parameter !'
                })
            } else {
                let dish = await db.Menu.findByPk(dataDish.id, { raw: false });
                if (!dish) {
                    resolve({
                        errCode: 2,
                        errMessage: `Dish not found`
                    });
                } else {
                    let check = await checkNameDish_2(dataDish.category, dataDish.name, dataDish.id);
                    if (check === true) {
                        resolve({
                            errCode: 3,
                            errMessage: 'This dish name is exist!'
                        })
                    } else {
                        dish.name = dataDish.name;
                        dish.many_sizes = false;
                        dish.price_S = null;
                        dish.price_M = null;
                        dish.price_L = 10000;
                        dish.category = dataDish.category;
                        dish.description = dataDish.description;

                        await dish.save();

                        if (dataDish.file) {
                            dish.image = dataDish.file;
                            await dish.save();
                        }
                        resolve({
                            errCode: 0,
                            errMessage: 'Save success',
                            dish
                        });
                    }
                }
            }
        } catch (error) {
            reject(error);
        }
    })
}

let deleteDish = (idDish) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!idDish) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing inputs parameter !'
                })
            } else {
                let dish = await db.Menu.findOne({
                    where: { id: idDish }
                })

                if (!dish) {
                    resolve({
                        errCode: 2,
                        errMessage: `The dish isn't exit!`
                    })
                } else {
                    await db.Menu.destroy({
                        where: {
                            id: idDish
                        }
                    });
                    resolve({
                        errCode: 0,
                        errMessage: `Delete the dish success`,
                        dish
                    })
                }
            }
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    getAllMenu, getMenuWithPagination, createNewDish, editDish, deleteDish, getMenuByName, getMenuById
}