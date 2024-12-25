const { WebhookClient } = require('dialogflow-fulfillment');
// import { result } from 'lodash';
import scheduleServices from '../services/scheduleServices';
import tableServices from '../services/tableServices';
import ticketServices from '../services/ticketServices';
import userServices from '../services/userServices';
import menuService from '../services/menuServices';
let userSessions = {};

async function contextMiddleware(agent, requiredContext, text) {
    const activeContext = agent.context.get(requiredContext);

    if (activeContext) {
        const { result, full, fitdata } = await check_Exit_Param(agent, activeContext.parameters);
        return `cậu vẫn chưa hoàn thành ${text}. ${result}. 
        \nCậu có muốn hủy quá trình đặt vé hay không!`;
    }
    return '';
}

async function handleWelcome(agent) {
    const sessionId = agent.session;
    if (!userSessions[sessionId]) {
        userSessions[sessionId] = {};
    }

    const idUser = agent.session.split('/')[4].split('-')[1];
    const infoUser = await userServices.getAllUsers(idUser);
    userSessions[sessionId] = {
        ...userSessions[sessionId],
        ...{
            nameCustomer: infoUser?.dataUser?.fullName || 'DangBot',
            email: infoUser?.dataUser?.email || 'bot@gmail.com',
            phoneCustomer: infoUser?.dataUser?.phone || '09050949389'
        }
    };

    const text = await contextMiddleware(agent, 'ticket_booking', 'việc đặt vé');
    if (text) {
        agent.add(text);
        return;
    }
    const responses = [
        "Chào cậu. Hôm nay cậu muốn tớ giúp gì nào?",
        "Chào cậu. Tớ có thể giúp gì cho cậu?",
    ];

    const randomIndex = Math.floor(Math.random() * responses.length);
    agent.add(responses[randomIndex]);
}

async function handleFallback(agent) {
    const text = await contextMiddleware(agent, 'ticket_booking', 'việc đặt vé');
    if (text) {
        agent.add('Tớ chưa hiểu nhưng ' + text);
        return;
    }
    const responses = [
        "Tớ chưa hiểu. Cậu có thể nói lại không?",
        "Xin lỗi, cậu có thể nói lại không?",
        "Xin lỗi, cậu có thể nhắc lại được không?",
        "Xin lỗi, tớ vẫn chưa hiểu.",
        "Tớ không chắc mình hiểu. Cậu có thể giải thích lại không?"
    ];

    const randomIndex = Math.floor(Math.random() * responses.length);
    agent.add(responses[randomIndex]);
}

async function handleOpening_Hours(agent) {
    const text = await contextMiddleware(agent, 'ticket_booking', 'việc đặt vé');
    const responses = [
        "Nhà hàng chúng tớ mở cửa từ 7am đến 10pm từ thứ 2 đến chủ nhật hàng tuần",
        "Nhà hàng chúng tớ mở cửa từ 7h đến 22h tất cả các ngày trong tuần",
    ];

    const randomIndex = Math.floor(Math.random() * responses.length);
    agent.add(`${responses[randomIndex]}
        \n${text}`);
}

async function handle_Concept_Buffet(agent) {
    const text = await contextMiddleware(agent, 'ticket_booking', 'việc đặt vé');
    const responses = [
        'Buffet là hình thức ăn uống tự chọn, khách hàng có thể thưởng thức không giới hạn các món ăn đã chuẩn bị sẵn. Buffet mang đến trải nghiệm thưởng thức đa dạng món ăn với mức giá cố định tùy theo loại vé mà cậu mua.',
        'Buffet là bữa ăn mà thực khách có thể tự lấy đồ ăn thoải mái từ quầy buffet của nhà hàng. Buffet mang đến trải nghiệm thưởng thức đa dạng món ăn với mức giá cố định tùy theo loại vé mà cậu mua.'
    ]

    const randomIndex = Math.floor(Math.random() * responses.length);
    agent.add(`${responses[randomIndex]}
        \n${text} `);
}

async function handle_Concept_Chicken(agent) {
    const text = await contextMiddleware(agent, 'ticket_booking', 'việc đặt vé');
    const responses = 'Nhà hàng buffet chúng tớ có các món gà như gà rán giòn, gà sốt mật ong và gà nướng BBQ. Được chế biến thơm ngon, đậm vị và luôn nóng hổi.';

    agent.add(`${responses}
        \n${text} `);
}

async function handle_Special_Occasions(agent) {
    const text = await contextMiddleware(agent, 'ticket_booking', 'việc đặt vé');
    const responses = 'Nhà hàng chúng tớ nhận tổ chức các buổi tiệc sinh nhật, họp mặt và sự kiện lớn với nhiều ưu đãi hấp dẫn. Cậu có thể đặt tiệc sinh nhật hoặc sự kiện qua hotline: 1404  hoặc đến trực tiếp nhà hàng để thảo luận chi tiết.';

    agent.add(`${responses}
        \n${text} `);
}

async function handle_list_food(agent) {
    const text = await contextMiddleware(agent, 'ticket_booking', 'việc đặt vé');
    let arrMenu = await menuService.getAllMenu('ALL');
    let dishM1 = 'Đối với các món salat, chúng tớ có sốt khác nhau rất phong phú: ';
    let dishM3 = 'Còn gà thì có các cách chế biến khác nhau: ';
    let dishM6 = 'Quầy Tokbokki: ';
    let dishM8 = 'Quầy Gimbap: ';
    let dishM12 = 'Còn phong phú các món tráng miệng như: ';
    arrMenu.forEach(element => {
        switch (element.category) {
            case 'M1':
                dishM1 += `${element.name}, `
                break;
            case 'M3':
                dishM3 += `${element.name}, `
                break;
            case 'M6':
                dishM6 += `${element.name}, `
                break;
            case 'M8':
                dishM8 += `${element.name}, `
                break;
            case 'M12':
                dishM12 += `${element.name}, `
                break;
            default:
                break;
        }
    });
    const responses = `Quầy thức ăn của chúng tớ có rất nhiều món ăn đa dạng được phân loại vào các quầy line khác nhau:
    \n ${dishM1}
    \n ${dishM3}
    \n ${dishM6}
    \n ${dishM8}
    \n ${dishM12}`;

    agent.add(`${responses}
        \n${text} `);
}

async function hanlde_Location(agent) {
    const text = await contextMiddleware(agent, 'ticket_booking', 'việc đặt vé');
    responses = [
        'Địa chỉ của chúng tớ: 123 đường CMT8, Hòa Xuân, quận Cẩm Lệ. Hân hạnh đón tiếp cậu.',
        'Nhà hàng tọa lạc tại trung tâm thành phố, địa chỉ cụ thể là 123 đường CMT8, Hòa Xuân, quận Cẩm Lệ. Hân hạnh đón tiếp cậu'
    ]

    const randomIndex = Math.floor(Math.random() * responses.length);
    agent.add(`${responses[randomIndex]}
        \n${text} `);
}


async function hanldeActive_day(agent) {
    const text = await contextMiddleware(agent, 'ticket_booking', 'việc đặt vé');
    let day_active = await scheduleServices.getDayActive();
    let day_Active_string = '';
    day_active.forEach(element => {
        day_Active_string += `\n\n${formatDate(element.date)} - có ${element.count} khung giờ`
    });
    if (day_active.length > 0) {
        agent.add(`Nhà hàng chúng tớ hiện đang mở bán vé ${day_active.length > 1 ? 'các ngày sau' : 'ngày'}: ${day_Active_string}
            \n${text}`);
    } else {
        agent.add('Nhà hàng chúng tớ hiện chưa có mở lịch bán vé nào, mong cậu thông cảm và quay lại sau!');
    }
}


async function hanldeThanks(agent) {
    const text = await contextMiddleware(agent, 'ticket_booking', 'việc đặt vé');
    agent.add(`Không có gì, được giúp cậu là niềm vinh hạnh của tớ! 
        \n${text}`);
}


let convertDate = (value) => {
    let result = null;
    const today = new Date();
    switch (value) {
        case 'today':
            result = today;
            break;
        case 'tomorrow':
            result = new Date(today);
            result.setDate(today.getDate() + 1);
            break;
        case 'day_after_tomorrow':
            result = new Date(today);
            result.setDate(today.getDate() + 2);
            break;

        default:
            break;
    }

    return result ? result.toISOString() : null;
}

let setTimeTypeContext = async (agent, timeType) => {
    userSessions[agent.session] = {
        ...userSessions[agent.session],
        timeType: timeType
    };
    const ticketContext = agent.context.get('ticket_booking');
    agent.context.set({
        name: 'ticket_booking',
        lifespan: 5,
        parameters: {
            ...ticketContext.parameters,
            timeType: timeType
        }
    });
}

let check_Exit_Param = async (agent, dataBooking) => {
    let result = "Tớ cần cậu cung cấp thêm thông tin về: ";
    let full = true;
    let fitdata = false;
    dataBooking = dataBooking || {};
    if ((!dataBooking.hasOwnProperty('date') || !dataBooking.date) &&
        (!dataBooking.hasOwnProperty('date_custom') || !dataBooking.date_custom)) {
        result += 'thời gian,';
        full = false;
    }
    if (!dataBooking.hasOwnProperty('time') || !dataBooking.time) {
        result += ' khung giờ,';
        full = false;
    }

    if (!dataBooking.hasOwnProperty('adults') && !dataBooking.hasOwnProperty('kid')
        || (!dataBooking.adults && !dataBooking.kid)
    ) {
        result += ' số lượng người lớn và trẻ em';
        full = false;
    }

    if (full) {
        const { resultFit, fit } = await check_Fit_Param(agent, dataBooking);
        result = resultFit;
        fitdata = fit;
    }
    const ticketContext = agent.context.get('ticket_booking');
    userSessions[agent.session] = {
        ...userSessions[agent.session],
        fitdata: fitdata
    };
    agent.context.set({
        name: 'ticket_booking',
        lifespan: 5,
        parameters: {
            ...ticketContext.parameters,
            fitdata: fitdata
        }
    });
    return { result, full, fitdata };
}

let check_Fit_Param = async (agent, dataBooking) => {
    // kiểm tra số lượng bàn còn trống trong khung giờ đó
    let resultFit = '';
    let fit = false;

    const date = new Date(dataBooking.date);
    const time = new Date(dataBooking.time);
    if (new Date(dataBooking.date).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0)) {
        let dataSchedule = await scheduleServices.getSchedule2({ date: date.getTime() });
        if (dataSchedule.length > 0) {
            let list_timeTypeString = '';
            let timeType;
            let chooseTimeType = false;
            dataSchedule.forEach(element => {
                list_timeTypeString += `\n\n ${element.allCodeData.valueVi}`;
            });

            await dataSchedule.forEach(async (element) => {
                if (formatTime(time) === element.allCodeData.valueVi.substring(0, 5)) {
                    await setTimeTypeContext(agent, element.timeType);
                    chooseTimeType = true;
                    timeType = element;
                }
            });

            if (chooseTimeType) {
                let list_table = '';
                let arraytable_string = '';
                let count_seat = 0;
                let array_TableFail = '';
                let arrIdTable = [];
                let tableEmpty = await tableServices.getTableEmptyBySchedule({
                    date: date.getTime(),
                    timeType: timeType.timeType
                });
                tableEmpty.forEach(element => {
                    if (element.isEmpty) {
                        list_table += `B${element.tableNumber}  `;
                        arrIdTable.push(element.id);
                    }
                });
                if (dataBooking.hasOwnProperty('arrTable') && dataBooking.arrTable.length > 0) {
                    (dataBooking.arrTable).forEach(element => {
                        if (arrIdTable.includes(element)) {
                            arraytable_string += `B${element}, `;
                            count_seat += 2;
                        } else {
                            array_TableFail += `B${element}, `
                        }
                    });
                    if (array_TableFail) {
                        resultFit = `Bàn ${array_TableFail} hiện đang không hoạt động hoặc đã được đặt bởi người khác, cậu hãy chọn lại nha!
                        \n${list_table}`;
                    } else {
                        if (((dataBooking.adults || 0) + (dataBooking.kid || 0) - count_seat) < -1) {
                            resultFit = `Số lượng ghế bạn chọn đã vượt số lượng ${(dataBooking.adults || 0) + (dataBooking.kid || 0)} người, hãy chọn lại giúp tớ nha!
                            \n${list_table}
                            \nLưu ý: mỗi bàn tương đương với 2 ghế (2 người)`;
                        } else if (((dataBooking.adults || 0) + (dataBooking.kid || 0) - count_seat) >= 1) {
                            resultFit = `Số lượng ghế bạn chọn hiện vẫn chưa đủ cho ${(dataBooking.adults || 0) + (dataBooking.kid || 0)} người, hãy chọn lại giúp tớ nha!
                            \n${list_table}
                            \nLưu ý: mỗi bàn tương đương với 2 ghế (2 người)`;
                        } else {
                            resultFit = `Cậu hãy kiểm tra lại thông tin và nhấn vào nút "Xác nhận" bên dưới để tiến hành ${dataBooking['action.original'] || 'đặt vé'} nhé
                            \n - Thời gian: ${formatDate(dataBooking.date)}
                            \n - Khung giờ: ${timeType.allCodeData.valueVi}
                            \n - Số lượng: ${dataBooking.adults ? dataBooking.adults + ' người lớn' : ''}${(dataBooking.adults && dataBooking.kid) ? ', ' : ''}${dataBooking.kid ? dataBooking.kid + ' trẻ em' : ''} 
                            \n - Bàn đã chọn: ${arraytable_string}`
                            fit = true;
                        }
                    }
                } else {
                    resultFit = `Hiện tại nhà hàng còn các bàn trống sau, mỗi bàn tương ứng với 2 người ngồi, cậu muốn chọn bàn nào: 
                \n${list_table}`;
                }
            } else {
                resultFit = `Hiện tại ngày ${formatDate(date)} nhà hàng chúng tớ chỉ có các khung giờ sau: ${list_timeTypeString}
                \nHãy chọn đúng với khung giờ phù hợp với bên trên`;
            }
            // const time1 = time.getHours() * 60 + time.getMinutes();
            // const time2 = new Date().getHours() * 60 + new Date().getMinutes();

            // if (time1 > time2) {
            //     console.log("Hợp: ", formatDate(new Date()), " và ", new Date().toLocaleTimeString());
            //     console.log("Hợp: ", formatDate(date), " và ", new Date(time).toLocaleTimeString());
            //     resultFit = `Cậu hãy kiểm tra lại thông tin và nhấn vào nút "Xác nhận" bên dưới để tiến hành ${dataBooking['action.original'] || 'đặt vé'}
            //     \n - Thời gian: ${formatDate(dataBooking.date)}
            //     \n - Khung giờ: ${new Date(dataBooking.time).toLocaleTimeString()}
            //     \n - Số lượng: ${dataBooking.adults ? dataBooking.adults + ' người lớn' : ''}${(dataBooking.adults && dataBooking.kid) ? ', ' : ''}${dataBooking.kid ? dataBooking.kid + ' trẻ em' : ''} `
            // } else {
            //     resultFit = `Ngày ${formatDate(date)} nhà hàng chúng tớ chỉ có các khung giờ sau: ${list_timeTypeString}`;
            // }

        } else {
            resultFit = `Hiện tại ngày ${formatDate(date)} nhà hàng chúng tớ vẫn chưa mở/hết khung giờ bán vé, mong cậu thông cảm, cậu có muốn đổi sang ngày khác không?`;
        }
    } else {
        resultFit = `Thời gian cậu chọn đã qua ngày hôm nay. Hãy chọn lại thời gian khác`;
    }


    return { resultFit, fit };
}

function getDataBooking(agent) {
    const context = agent.context.get('ticket_booking');
    return context && context.parameters ? context.parameters : {};
}


async function setDataBooking(agent) {
    const filteredParams = Object.fromEntries(
        Object.entries(getDataBooking(agent)).filter(([key, value]) => value !== null && value !== undefined && value !== '')
    );
    const sessionId = agent.session;
    userSessions[sessionId] = {
        ...userSessions[sessionId],
        ...filteredParams
    };
    agent.context.set({
        name: 'ticket_booking',
        lifespan: 5,
        parameters: userSessions[sessionId]
    });

}

async function handleUpdatePeople(agent, adults, kid, typeUpdate) {
    const sessionId = agent.session;
    let newAdults = (userSessions[sessionId]?.adults || 0);
    let newKid = (userSessions[sessionId]?.kid || 0);
    typeUpdate.forEach(element => {
        if (element === 'add') {
            newAdults = adults ? newAdults + adults : newAdults;
            newKid = kid ? newKid + kid : newKid;
        } else if (element === 'remove') {
            newAdults = adults ? newAdults - adults : newAdults;
            newKid = kid ? newKid - kid : newKid;
        }
    });
    userSessions[sessionId] = {
        ...userSessions[sessionId],
        ...{
            adults: newAdults > 0 ? newAdults : 0,
            'adults.original': newAdults > 0 ? `${newAdults}` : '0',
            kid: newKid > 0 ? newKid : 0,
            'adults.kid': newKid > 0 ? `${newKid}` : '0',
        }
    }

    agent.context.set({
        name: 'ticket_booking',
        lifespan: 5,
        parameters: userSessions[sessionId]
    });
}


function formatTime(time) {
    return `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;
}

function formatDate(date) {
    const options = {
        timeZone: 'Asia/Ho_Chi_Minh',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        // hour: '2-digit',
        // minute: '2-digit',
        // second: '2-digit',
        // hour12: false
    };
    return new Date(date).toLocaleDateString('vi-VN', options);
}

async function handle_Start_Booking(agent) {
    const ticketParams = agent.context.get('ticket_booking')?.parameters;
    if (ticketParams?.date_custom) {
        ticketParams.date = convertDate(ticketParams.date_custom);
        ticketParams['date.original'] = ticketParams['date_custom.original'];
    }
    setDataBooking(agent);
    const dataBooking = getDataBooking(agent);
    const { full, result } = await check_Exit_Param(agent, dataBooking);

    if (!full) {
        agent.add(`${result} để có thể giúp cậu ${dataBooking['action.original'] || 'đặt vé'} `);
    } else {
        agent.add(result);
    }
}


async function handle_Provide_date(agent) {
    let date = agent.parameters.date;
    const ticketParams = agent.context.get('ticket_booking')?.parameters;
    if (!date && ticketParams?.date_custom) {
        date = convertDate(ticketParams.date_custom);

        ticketParams.date = convertDate(ticketParams.date_custom);
        ticketParams['date.original'] = ticketParams['date_custom.original'];
    }
    await setDataBooking(agent);
    const dataBooking = getDataBooking(agent);
    const { full, result } = await check_Exit_Param(agent, dataBooking);

    if (date) {
        agent.add(result)
    } else {
        agent.add('Xin lỗi, tớ vẫn chưa thấy thời gian cậu bạn muốn đặt. Hãy cung cấp lại cho tớ!');
    }
}

async function handle_Provide_time(agent) {
    const time = agent.parameters.time;
    await setDataBooking(agent);
    const dataBooking = getDataBooking(agent);
    const { full, result } = await check_Exit_Param(agent, dataBooking);

    if (time) {
        const hasDate = dataBooking.hasOwnProperty('date') && dataBooking.date;

        if (hasDate) {
            agent.add(result);
        } else {
            agent.add(`Hãy cho tớ thời gian (ngày) để có thể giúp cậu kiểm tra khung giờ này.`);
        }
    } else {
        agent.add('Xin lỗi, tớ vẫn chưa thấy khung giờ cậu muốn đặt. Hãy cung cấp lại cho tớ!');
    }
}

async function handle_Provide_number_people(agent) {
    const { adults, kid, updatePeople } = agent.parameters;

    if (updatePeople.length > 0) {
        handleUpdatePeople(agent, adults, kid, updatePeople);
    } else {
        setDataBooking(agent);
    }
    const dataBooking = getDataBooking(agent);
    const { full, result } = await check_Exit_Param(agent, dataBooking);

    let text = "";
    if (adults) text += `${adults} người lớn`;
    if (adults && kid) text += " và ";
    if (kid) text += `${kid} trẻ em`;

    if (adults || kid) {
        agent.add(result);
    } else {
        agent.add('Tớ chưa thấy số lượng người cậu muốn đặt. Hãy cung cấp lại cho tớ!')
    }
}

async function handle_Provide_table(agent) {
    const arrTable = agent.parameters.arrTable;
    await setDataBooking(agent);
    const dataBooking = getDataBooking(agent);
    const { full, result } = await check_Exit_Param(agent, dataBooking);

    if (arrTable && arrTable.length > 0) {
        agent.add(result)
    } else {
        agent.add('Xin lỗi, tớ vẫn chưa thấy bàn cậu muốn chọn!');
    }
}

async function handle_Confirm_booking(agent) {
    const dataBooking = getDataBooking(agent);
    const { full, result, fitdata } = await check_Exit_Param(agent, dataBooking);

    if (full && fitdata) {
        // Đặt vé tại đây
        const dataTicket = {
            timeType: dataBooking.timeType,
            date: dataBooking.date,
            phoneCustomer: userSessions[agent.session].phoneCustomer || dataBooking.phoneCustomer,
            nameCustomer: userSessions[agent.session].nameCustomer || dataBooking.nameCustomer,
            email: userSessions[agent.session].email || dataBooking.email,
            numberTicketType: {
                numberAdultBest: dataBooking.adults || 0,
                numberKidBest: dataBooking.kid || 0
            },
            arrIdTable: dataBooking.arrTable,
        };
        const resultBooking = await ticketServices.createTicketByCustomer(dataTicket);
        if (resultBooking.errCode === 0) {
            await agent.add(`${dataBooking['action.original'] || 'Đặt vé'} thành công! Hãy kiểm tra lại vé của bạn trên hệ thống. Khi đến nhà hàng cậu hãy nhớ mang theo E-Ticket này nha.
                \nCảm ơn cậu đã tin tưởng và lựa chọn dịch vụ của chúng tớ. Hẹn gặp lại cậu! 😘😘😘`);
            agent.context.set({
                name: 'ticket_booking',
                lifespan: 0,
            });
            Object.keys(userSessions[agent.session]).forEach(key => {
                if (!['nameCustomer', 'email', 'phoneCustomer'].includes(key)) {
                    delete userSessions[agent.session][key];
                }
            });
        } else {
            userSessions[agent.session] = {
                ...userSessions[agent.session],
                ...{ fitdata: false }
            };
            await agent.context.set({
                name: 'ticket_booking',
                lifespan: 5,
                parameters: {
                    ...dataBooking,
                    ...{ fitdata: false }
                }
            });
            // if (resultBooking.errCode === 4) {

            // }
            agent.add(resultBooking.errMessage);
        }
    } else {
        agent.add('Chưa thể xác nhận. ' + result);
    }
}

async function handle_Cancle_booking(agent) {
    agent.context.set({
        name: 'ticket_booking',
        lifespan: 0,
    });
    Object.keys(userSessions[agent.session]).forEach(key => {
        if (!['nameCustomer', 'email', 'phoneCustomer'].includes(key)) {
            delete userSessions[agent.session][key];
        }
    });
    agent.add('Tớ đã hủy quá trình đặt vé. Thật tiếc quá hẹn gặp lại cậu lần sau!');
}

let handleWebHookChatBot = async (req, res) => {
    let agent = new WebhookClient({ request: req, response: res })
    // const sessionId = agent.session;
    // console.log(req?.rawHeaders);
    // if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    //     console.log("của dialog: ", req.headers.authorization.split(' ')[1]);
    // }
    // if (!userSessions[sessionId]) {
    //     userSessions[sessionId] = {
    //         ...req?.user
    //     };
    // }
    // console.log(req?.user || null);
    // console.log(userSessions[sessionId]);
    let intentMap = new Map();
    // Cần 1 bước middleware để kiểm tra mức độ ưu tiên của intent
    // Để đảm bảo rằng context của intent đó cần được hoàn thành trước khi qua intent khác
    intentMap.set('Default Welcome Intent', handleWelcome);
    intentMap.set('Default Fallback Intent', handleFallback);
    intentMap.set('Opening_Hours', handleOpening_Hours);
    intentMap.set('Concept_Buffet', handle_Concept_Buffet);
    intentMap.set('Concept_Chicken', handle_Concept_Chicken);
    intentMap.set('Special_Occasions', handle_Special_Occasions);
    intentMap.set('list_food', handle_list_food);
    intentMap.set('Location', hanlde_Location);
    intentMap.set('Thanks', hanldeThanks);

    intentMap.set('Start_ticket_booking', handle_Start_Booking);
    intentMap.set('Provide_date', handle_Provide_date);
    intentMap.set('Active_day', hanldeActive_day);
    intentMap.set('Provide_time', handle_Provide_time);
    intentMap.set('Provide_number_people', handle_Provide_number_people);
    intentMap.set('Provide_table', handle_Provide_table);
    intentMap.set('Confirm_booking', handle_Confirm_booking);
    intentMap.set('Cancle_booking', handle_Cancle_booking);


    agent.handleRequest(intentMap);
}

module.exports = {
    handleWebHookChatBot
}