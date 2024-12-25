import db from '../models/index';
require('dotenv').config();
import nodemailer from 'nodemailer'

let handleSendMailAuth = async (data) => {
    try {
        let transporter = nodemailer.createTransport({ // config mail server
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_APP,
                pass: process.env.EMAIL_APP_PASSWORD,
            },
        });
        let content = '';
        let userId = data.dataUser.id;
        content += `
        <div style="padding: 10px; background-color: #003375">
            <div style="padding: 10px; background-color: white;">
                <h4 style="color: #0085ff">Xin chào ${data.dataUser.fullName}</h4>
                <p>Bạn nhận được mail này vì đã được đăng ký tài khoản tại tại FuFu' Space thành công!</p>
                <p>Hãy click vào nút "Xác nhận" bên dưới để kích hoạt tài khoản của bạn</p>
                <a href="${data.redirectLink}" target="_blank" >xác nhận<a/>

                <p>Xin chân thành cảm ơn!</p>
            </div>
        </div>
    `;
        let info = await transporter.sendMail({
            // from: {
            //     name: process.env.NAME_APP,
            //     address: process.env.EMAIL_APP
            // },
            from: process.env.NAME_APP + '<' + process.env.EMAIL_APP + '>',
            to: data.dataUser.email,
            subject: 'Xác thực tài khoản người dùng',
            html: content,
        })
        // transporter.sendMail(mainOptions, function (err, info) {
        //     if (err) {
        //         console.log(err);
        //         // req.flash('mess', 'Lỗi gửi mail: ' + err); 
        //         //Gửi thông báo đến người dùng
        //     } else {
        //         console.log('Message sent: ' + info.response);
        //         // req.flash('mess', 'Một email đã được gửi đến tài khoản của bạn'); 
        //         //Gửi thông báo đến người dùng
        //     }
        // });
    } catch (error) {
        console.log(error)
    }
}

const handleSendMailSystemTicket = async (data) => {
    // Khai báo CSS inline cho các phần tử HTML
    let headerStyle = "color: #0085ff; text-align: center;";

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    let content = `
        <div style="padding: 10px; background-color: #003375; font-size: 16px">
            <div style="padding: 10px; background-color: white;">
                <h3 style="${headerStyle}">Xin chào quản lý của hệ thống Fufu's Space</h3>
                <p>Bạn có 1 vé cần xác nhận:</p>
                <p>- Ngày đặt: ${data.formattedDate}</p>
                <p>- Khung giờ: ${data.timeType}</p>
                <p>- Tên khách hàng: ${data.nameCustomer}</p>
                <p>- SDT: ${data.phoneCustomer}</p>
                <p>- Email: ${data.emailCustomer}</p>
    `;

    if (data.numberAdultBest > 0) {
        content += `<p>- Số lượng người lớn: ${data.numberAdultBest}</p>`;
    }

    if (data.numberKidBest > 0) {
        content += `<p>- Số lượng trẻ em: ${data.numberKidBest}</p>`;
    }

    content += `
                <p>- Tổng hóa đơn: ${(data.bill * 1).toLocaleString('vi', { style: 'currency', currency: 'VND' })}</p>
                <p style="text-align: right">FuFu Ticket System!</p>
            </div>
        </div>
    `;

    let usersAdmin = await db.User.findAll({
        where: {
            roleId: {
                [db.Sequelize.Op.in]: ['R1', 'R0']
            }
        },
        attributes: ['email']
    });
    let emails = usersAdmin.map(user => user.email);

    let info = await transporter.sendMail({
        from: 'FuFu Ticket System' + '<' + process.env.EMAIL_APP + '>',
        to: emails.join(', '),
        subject: 'Bạn có 1 lịch đặt tại hệ thống',
        html: content
    });
}



const handleMailResponses = async (data) => {
    try {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_APP,
                pass: process.env.EMAIL_APP_PASSWORD,
            },
        });

        let content = `
    <div style="padding: 10px; background-color: #003375; font-size: 16px">
        <div style="padding: 5px; background-color: white;">
            <img style="height: 95px" src="${process.env.URL_REACT_USER}/static/media/logo_fufu.89fef136.jpg" alt="ticketImage"/>
            <p>Chào ${data.nameCustomer}</p>
            <p>Chúng tôi xin gửi lời cảm ơn đặc biệt đến bạn đã lựa chọn Fufu's Space để thưởng thức ẩm thực. Đơn đặt chỗ của bạn đã được xác nhận <b style="color: #43CD80; font-size: 18px">Thành Công!</b></p>
            <b>Thông tin đặt: </b>
            <p><b>- Ngày đặt:</b> ${data.date}</p>
            <p><b>- Khung giờ:</b> ${data.timeType}</p>
            <p><b>- Tên khách hàng:</b> ${data.nameCustomer}</p>
            <p><b>- SDT:</b> ${data.phoneCustomer}</p>
            <p><b>- Email:</b> ${data.emailCustomer}</p>
            `;

        if (data.numberAdultBest > 0) {
            content += `<p><b>- Số lượng người lớn:</b> ${data.numberAdultBest}</p>`;
        }

        if (data.numberKidBest > 0) {
            content += `<p><b>- Số lượng trẻ em:</b> ${data.numberKidBest}</p>`;
        }

        content += `
            <p><b>- Tổng hóa đơn:<b> ${(data.bill * 1).toLocaleString('vi', { style: 'currency', currency: 'VND' })}</p>
            <p>Đơn đặt chỗ của bạn đã được xác nhận. Hãy mang theo email này khi đến quán để được nhận vé vật lý tại cổng nha. Quý khách hãy có mặt trước 5 phút trước giờ đặt để nhận vé một cách thuận lợi.</p>
            <p><b>Vé điện tử (E-Ticket):</b> [Đính kèm bên dưới]</p>
            <p>Nếu bạn có bất kỳ thắc mắc hoặc cần hỗ trợ thêm, đừng ngần ngại liên hệ với chúng tôi qua số điện thoại 0349601619/0901673037 hoặc email này.</p>
            <p>Chúng tôi mong sớm được chào đón bạn tại <b>Fufu's Space</b> để cùng nhau thưởng thức một bữa ăn đầy hạnh phúc.</p>
            <p>Trân trọng, <b>Fufu's Space</b></p>
        </div>
    </div>
`;


        let attachments = [];


        const path = require('path');

        // Đường dẫn thư mục gốc của ứng dụng trên Heroku
        const rootPath = process.cwd();

        // Đường dẫn thư mục lưu trữ ảnh
        const imageTicketDir = path.join(rootPath, 'imageTicket');

        if (data.numberPeople <= 9) {
            for (let i = 1; i <= data.numberPeople; i++) {
                if (i <= 9) {
                    let fileName = `ticketImage_${i}.jpg`;

                    // Tạo đường dẫn tệp
                    const filePath = path.join(imageTicketDir, fileName);

                    let attachment = {
                        filename: `ticketImage_${i}.jpg`,
                        path: filePath
                    };
                    attachments.push(attachment);
                }
            }
        } else {
            let fileName = `ticketImage_5.jpg`;

            // Tạo đường dẫn tệp
            const filePath = path.join(imageTicketDir, fileName);

            let attachment = {
                filename: `ticketImage_5.jpg`,
                path: filePath
            };
            attachments.push(attachment);
        }



        let info = await transporter.sendMail({
            from: 'FuFu Ticket System' + '<' + process.env.EMAIL_APP + '>',
            to: data.emailCustomer,
            subject: "Xác Nhận Đơn Đặt Và Gửi Vé E-Ticket - FuFu's Space",
            html: content,
            attachments: attachments
        });

        console.log("Email sent: " + info.response);
        return true;
    } catch (error) {
        // Nếu có lỗi xảy ra, log lỗi và trả về false
        console.error("Error sending email:", error);
        return false;
    }
}


let handleMailResponsesCancle = async (data) => {
    try {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_APP,
                pass: process.env.EMAIL_APP_PASSWORD,
            },
        });

        let content = `
    <div style="padding: 10px; background-color: #003375; font-size: 16px">
        <div style="padding: 5px; background-color: white;">
            <img style="height: 95px" src="${process.env.URL_REACT_USER}/static/media/logo_fufu.89fef136.jpg" alt="ticketImage"/>
            <p>Chào ${data.nameCustomer}</p>
            <p>Trước tiên, chúng tôi xin gửi lời cảm ơn đặc biệt đến bạn đã chọn Fufu's Space để thưởng thức ẩm thực của chúng tôi.</p>
            <p>Nhưng trạng thái đơn đặt của bạn đã bị <b style="color: #CD5555; font-size: 18px">Hủy</b> vì không hợp lệ</p>
            <p>Lí do: Chưa nhận được thanh toán thành công từ bạn</p>
            <b>Thông tin đặt: </b>
            <p><b>- Ngày đặt:</b> ${data.date}</p>
            <p><b>- Khung giờ:</b> ${data.timeType}</p>
            <p><b>- Tên khách hàng:</b> ${data.nameCustomer}</p>
            <p><b>- SDT:</b> ${data.phoneCustomer}</p>
            <p><b>- Email:</b> ${data.emailCustomer}</p>
            `;

        if (data.numberAdultBest > 0) {
            content += `<p><b>- Số lượng người lớn:</b> ${data.numberAdultBest}</p>`;
        }

        if (data.numberKidBest > 0) {
            content += `<p><b>- Số lượng trẻ em:</b> ${data.numberKidBest}</p>`;
        }

        content += `
            <p><b>- Tổng hóa đơn:<b> ${(data.bill * 1).toLocaleString('vi', { style: 'currency', currency: 'VND' })}</p>
            <p>Nếu bạn muốn đặt lại vé, hãy truy cập đường link sau để đặt lại: <a href="${process.env.URL_REACT_USER}">FuFu'Space</a></p>
            <p>Hoặc bạn có bất kỳ thắc mắc hay cần hỗ trợ thêm, đừng ngần ngại liên hệ với chúng tôi qua số điện thoại 0349601619/0901673037 hoặc email này.</p>
            <p>Trân trọng, <b>Fufu's Space</b></p>
        </div>
    </div>
`;

        let info = await transporter.sendMail({
            from: 'FuFu Ticket System' + '<' + process.env.EMAIL_APP + '>',
            to: data.emailCustomer,
            subject: "Xác Nhận Đơn Đặt Và Gửi Vé E-Ticket - FuFu's Space",
            html: content,
        });

        console.log("Email sent: " + info.response);
        return true;
    } catch (error) {
        // Nếu có lỗi xảy ra, log lỗi và trả về false
        console.error("Error sending email:", error);
        return false;
    }
}


let handleSendThanksMail = async (arrEmail) => {
    try {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_APP,
                pass: process.env.EMAIL_APP_PASSWORD,
            },
        });

        let content = `
        <div style="padding: 10px; font-size: 16px; text-align: justify;">
        <div style="padding: 0 10px; background-color: white;">
            <div style="display: flex; background-color: rgb(0, 236, 182); padding: 30px;">
                <div style="width: 50%;">
                    <b style="font-size: 30px;">fufu space</b>
                    <br>
                    <b style="font-size: 30px;">buffet pizza</b>
                    <p>Chúng tôi xin gửi lời cảm ơn chân thành đến bạn vì đã dành thời gian đến thưởng thức bữa ăn tại Fufu Space Buffet Pizza. Đối với chúng tôi, không chỉ là việc phục vụ pizza mà còn là sự sáng tạo và thịnh vượng với vị giác của quý khách</p>
                </div>
                <div style="width: 50%; display: flex;">
                    <div style="width: 70%; margin: 0 auto">
                        <img style="width: 100%;" src="https://res.cloudinary.com/dtjdfh2ly/image/upload/v1712464584/space_4_s8znpz.jpg" alt="image_thanks">
                        <br><br>
                        <img style="width: 100%;" src="https://res.cloudinary.com/dtjdfh2ly/image/upload/v1712477102/space_5_ytpjyk.jpg" alt="image_thanks">
                    </div>
                </div>
            </div>
            <br>
            <p>
                Chúng tôi cũng muốn chia sẻ một tin vui - mỗi vé bạn đã mua
                không chỉ tạo điều kiện làm thêm việc cho 10 sinh viên tại quán,
                mà còn đóng góp <b>10,000 VNĐ</b> vào quỹ xây dựng "Mái ấm thú cưng",
                nơi cưu mang các bạn chó mèo. Một phần trong số doanh thu
                đã được trích ra và đóng góp vào quỹ <b>Chung tay quyên góp</b> để xây dựng mái ấm này.
                Cùng nhau, chúng ta đang hướng đến một môi trường sống an toàn và yêu thương hơn
                cho những người bạn bốn chân của chúng ta.
            </p>
            <p>
                Nếu bạn quan tâm và muốn đóng góp thêm cho dự án này,
                bạn có thể truy cập vào đường link sau để tham gia:
                <a href="https://momo.vn/cong-dong/gop-xay-dung-mai-am-thu-cung-cuu-mang-cho-meo"> Link quyên góp</a>.
            </p>
            <p>
                Hãy ghé thăm trang web đặt vé của Fufu cho những lần ghé quán tiếp theo tại:
                <a href="${process.env.URL_REACT_USER}"> Fufu Space Booking</a>. Để được giá ưu đãi.
            </p>
            <p>
                Chúng tôi mong rằng bạn đã có một trải nghiệm thú vị và đầy ý nghĩa tại
                <b>Fufu Space Buffet Pizza</b>. Nếu có bất kỳ ý kiến hoặc góp ý nào,
                xin vui lòng chia sẻ với chúng tôi. <b>Phản hồi của bạn</b> rất quan trọng
                và sẽ giúp chúng tôi cải thiện dịch vụ hơn nữa.
            </p>
            <p>
                Một lần nữa, xin chân thành cảm ơn và hy vọng được đón tiếp bạn sớm!
            </p>
            <p>
                Trân trọng, Fufu Team <b>Fufu Space Buffet Pizza</b>
            </p>
            <br>
            <div style="display: flex;">
                <div style="width: 40%; display: flex; padding: 20px; background-color: rgb(0, 236, 182);">
                    <div style="width: 60%;">
                        <img style="width: 100%;" src="https://res.cloudinary.com/dtjdfh2ly/image/upload/v1715830723/logo_fufu_color_bxmepe.png" alt="image_thanks">
                    </div>
                </div>
                <div style="width: 50%; padding-left: 20px">
                    <b style="font-size: 30px;">FUFU XIN CHÀO!</b>
                    <p>
                        Bạn có thể theo dõi nhiều thông tin của Fufu tại:
                        <a href="https://www.facebook.com/fufuspace/"> Facebook</a>
                    </p>
                </div>
            </div>
        </div>
    </div>
    
`;

        let info = await transporter.sendMail({
            from: 'FuFu Ticket System' + '<' + process.env.EMAIL_APP + '>',
            to: arrEmail.join(', '),
            subject: "Cảm ơn bạn đã ghé thưởng thức bữa ăn tại Fufu Space Buffet Pizza!",
            html: content,
        });

        return true;
    } catch (error) {
        // Nếu có lỗi xảy ra, log lỗi và trả về false
        console.error("Error sending email:", error);
        return false;
    }
}

module.exports = {
    handleSendMailAuth, handleSendMailSystemTicket,
    handleMailResponses, handleMailResponsesCancle,
    handleSendThanksMail
}